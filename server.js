const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Bienvenue sur my-music-app!');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});