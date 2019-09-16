const jwt = require('jsonwebtoken')

let verificaToken = (req, res, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (error, decoded) => {

        if (error) {
            return res.status(401).json({
                ok: false,
                error
            })
        }

        req.usuario = decoded.usuario

        next();

    })



}


let verificaAdminRole = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            error: "Usuario logueado no es administrador"
        })
    }

    next();

}



module.exports = {
    verificaToken,
    verificaAdminRole
}