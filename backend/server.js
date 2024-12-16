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

app.post('/api/patients/update', async (req, res) => {
    const { id, familyName, givenName, sex } = req.body;

    console.log('Received payload:', req.body); // Log payload for debugging

    if (!id || !familyName || !givenName || !sex) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const response = await axios.post(
            `${process.env.API_URL.replace('/GetList', '/Update')}`,
            { id, familyName, givenName, sex },
            {
                auth: {
                    username: process.env.API_USERNAME,
                    password: process.env.API_PASSWORD,
                },
            }
        );

        res.json({ message: 'Patient updated successfully', data: response.data });
    } catch (error) {
        console.error('Error updating patient:', error);
        res.status(500).json({ message: 'Error updating patient', error: error.message });
    }
});



app.listen(PORT, () => {
    console.log(`Backend in esecuzione su http://localhost:${PORT}`);
});
