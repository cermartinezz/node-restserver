// ===================
//  puerto
// ===================
process.env.PORT = process.env.PORT || 3000


// ===================
//  ENTORNO
// ===================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// ===================
//  ENTORNO
// ===================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe-node-app';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;



// ===================
//  VENCIMIENTO DEL TOKEN
// ===================
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;



// ===================
//  SEED
// ===================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo'


// ===================
//  google client
// ===================
process.env.CLIENT_ID = process.env.CLIENT_ID || '1094087357108-jpe32iughq4jrcr59l1g2co3apvio7r1.apps.googleusercontent.com'