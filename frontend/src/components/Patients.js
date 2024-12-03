import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../api';
import { DataGrid } from '@mui/x-data-grid';

const Patients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const getPatients = async () => {
            try {
                const data = await fetchPatients();
                const processedData = data.map((patient) => ({
                    id: patient.id,
                    familyName: patient.familyName,
                    givenName: patient.givenName,
                    sex: patient.sex,
                    birthDate: patient.birthDate,
                    parametersCount: patient.parameters.length,
                    alarm: patient.parameters.some((param) => param.alarm),
                }));
                setPatients(processedData);
            } catch (error) {
                console.error('Errore durante il fetch dei pazienti:', error);
            }
        };

        getPatients();
    }, []);

    const columns = [
        { field: 'familyName', headerName: 'Family Name', flex: 1 },
        { field: 'givenName', headerName: 'Given Name', flex: 1 },
        { field: 'sex', headerName: 'Sex', flex: 1 },
        { 
            field: 'birthDate', 
            headerName: 'Birth Date', 
            flex: 1, 
            valueGetter: (params) => new Date(params.value).toLocaleDateString() 
        },
        { field: 'parametersCount', headerName: 'Parameters Count', flex: 1 },
        { 
            field: 'alarm', 
            headerName: 'Alarm', 
            flex: 1, 
            renderCell: (params) => (
                params.value ? <span style={{ color: 'red' }}>⚠️ Alarm</span> : ''
            ) 
        },
    ];

    return (
        <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
            <h2>Lista Pazienti</h2>
            <DataGrid 
                rows={patients} 
                columns={columns} 
                pageSize={10} 
                rowsPerPageOptions={[10, 20, 50]} 
                disableSelectionOnClick
            />
        </div>
    );
};

export default Patients;
