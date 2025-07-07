// config/db.js
const { Sequelize } = require('sequelize');

// Création de l'instance Sequelize pour se connecter à MySQL
const sequelize = new Sequelize('bookzone_db', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false, // Pour désactiver les logs SQL dans la console
});

// Vérification de la connexion
sequelize.authenticate()
    .then(() => {
        console.log('✅ Connexion à la base de données MySQL établie avec Sequelize.');
    })
    .catch(err => {
        console.error('❌ Erreur de connexion à la base de données MySQL :', err);
    });

module.exports = sequelize;
