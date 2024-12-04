const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Endpoint per ottenere i pazienti
app.get('/api/patients', async (req, res) => {
    try {
        const response = await axios.get('https://mobile.digistat.it/CandidateApi/Patient/GetList', {
            auth: {
                username: 'test',
                password: 'TestMePlease!',
            },
        });
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore durante il fetch dei dati' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend in esecuzione su http://localhost:${PORT}`);
});
