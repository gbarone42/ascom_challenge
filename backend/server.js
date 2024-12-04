require('dotenv').config(); // Load environment variables from .env

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Root route (optional, to avoid "Cannot GET /" error)
app.get('/', (req, res) => {
    res.send('Backend is running');
});

// Endpoint to get patients
app.get('/api/patients', async (req, res) => {
    try {
        const response = await axios.get(process.env.API_URL, {
            auth: {
                username: process.env.API_USERNAME,
                password: process.env.API_PASSWORD,
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il fetch dei dati', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Backend in esecuzione su http://localhost:${PORT}`);
});
