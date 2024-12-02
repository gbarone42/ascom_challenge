import axios from 'axios';

export const fetchPatients = async () => {
    try {
        const response = await axios.get('http://localhost:3001/api/patients');
        return response.data;
    } catch (error) {
        console.error('Errore nel fetch dei pazienti:', error);
        return [];
    }
};
