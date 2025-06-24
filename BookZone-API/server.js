const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usersRoutes = require('./routes/users');
const authRoutes = require('./routes/auth'); // ✅ importer le nouveau routeur
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/users', usersRoutes);
app.use('/auth', authRoutes); // ✅ utiliser la route d'authentification

// Lancement du serveur
app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`);
});
