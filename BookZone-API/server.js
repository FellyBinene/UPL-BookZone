const express = require('express');
const app = express();
const cors = require('cors');
const usersRoutes = require('./routes/users');

app.use(cors());
app.use(express.json());

app.use('/api/users', usersRoutes);

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
