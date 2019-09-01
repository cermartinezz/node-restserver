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
    urlDB = 'mongodb+srv://admin:J39jijTKKRj5fGX@cluster0-muzaw.mongodb.net/test';
}

process.env.URLDB = urlDB;