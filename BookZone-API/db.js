const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ton mot de passe MySQL
    database: 'bookzone_db'
});

connection.connect(error => {
    if (error) throw error;
    console.log('Connecté à la base de données MySQL');
});

module.exports = connection;