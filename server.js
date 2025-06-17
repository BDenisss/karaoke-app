require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.AUDD_API_KEY;

app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.send('Hello from My Music App (Audd.io)');
});

// Endpoint pour récupérer les paroles synchronisées avec timestamps
app.post('/api/lyrics', async (req, res) => {
  try {
    const { audioUrl } = req.body;
    if (!audioUrl) {
      return res.status(400).json({ error: 'Veuillez fournir un audioUrl valide.' });
    }

    // Appel à l'API Audd.io
    const response = await axios.get('https://api.audd.io/', {
      params: {
        api_token: API_KEY,
        url: audioUrl,
        return: 'timecode'
      }
    });

    const result = response.data.result;
    if (!result || !result.timecode) {
      return res.status(404).json({ error: 'Paroles synchronisées non trouvées.' });
    }

    // Formattage de la réponse pour le front-end
    const lines = result.timecode.map(item => ({
      time: item.time,       // en secondes
      text: item.words       // texte de la ligne
    }));

    res.json({ lines });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: 'Erreur lors de la récupération des paroles.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
