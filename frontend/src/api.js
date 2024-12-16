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

export const updatePatient = async (patientData) => {
    try {
        const response = await axios.post('http://localhost:3001/api/patients/update', patientData);
        return response.data;
    } catch (error) {
        console.error('Error updating patient:', error);
        throw error;
    }
};
