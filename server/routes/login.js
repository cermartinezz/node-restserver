const express = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')


const {
    OAuth2Client
} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express()


app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({
        email: body.email
    }, (error, usuarioDB) => {

        if (error) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            })
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            })
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, {
            expiresIn: process.env.CADUCIDAD_TOKEN
        })

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    })

})


// CONFIGURACIONES DE GOOGLE.

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    const userid = payload['sub'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google_login', async(req, res) => {

    let token = req.body.idtoken;

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        })
    })


    Usuario.findOne({
        email: googleUser.email
    }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error
            })
        }

        //Ya existe un usuario de BD
        if (usuarioDB) {
            //Verificar si no creo con google
            if (!usuarioDB.google) {
                return res.status(400).json({
                    ok: false,
                    error: {
                        message: 'debe de usar su autentifacion normal con usuario y contraseña'
                    }
                })
            } else {
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, {
                    expiresIn: process.env.CADUCIDAD_TOKEN
                })


                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                })
            }
        }


        //Si el usuario es nuevo

        let usuario = new Usuario()

        usuario.nombre = googleUser.nombre;
        usuario.email = googleUser.email;
        usuario.img = googleUser.img;
        usuario.google = true;
        usuario.password = ':)';


        usuario.save((error, usuarioDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    error
                })
            }

            let token = jwt.sign({
                usuario: usuarioDB
            }, process.env.SEED, {
                expiresIn: process.env.CADUCIDAD_TOKEN
            })

            return res.json({
                ok: true,
                usuario: usuarioDB,
                token
            })


        })
    })



})

module.exports = {
    app
}