import React, { useEffect, useState } from 'react';
import moment from 'moment'; // Import moment.js
import { fetchPatients } from '../api';
import { DataGrid } from '@mui/x-data-grid';

const Patients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const getPatients = async () => {
            try {
                console.log('[DEBUG] Fetching patients...');
                const data = await fetchPatients();
                console.log('[DEBUG] API Response:', data);

                // Process API patients
                const uniquePatients = data.map((patient) => ({
                    id: patient.id,
                    familyName: patient.familyName,
                    givenName: patient.givenName,
                    sex: patient.sex,
                    birthDate: patient.birthDate
                        ? moment(patient.birthDate).format('DD/MM/YYYY') // Format birthDate
                        : 'Unknown',
                    parametersCount: patient.parameters?.length || 0,
                    alarm: patient.parameters?.some((param) => param.alarm) || false,
                }));

                console.log('[DEBUG] Processed unique patients:', uniquePatients);

                // Add mock data patients
                const mockData = [
                    {
                        id: 1000,
                        familyName: 'Smith',
                        givenName: 'Anna',
                        birthDate: moment('1998-07-13T00:00:00').format('DD/MM/YYYY'),
                        sex: 'F',
                        parametersCount: 0,
                        alarm: false,
                    },
                    {
                        id: 1001,
                        familyName: 'Paul',
                        givenName: 'John',
                        birthDate: moment('1973-09-07T00:00:00').format('DD/MM/YYYY'),
                        sex: 'M',
                        parametersCount: 0,
                        alarm: false,
                    },
                ];
                console.log('[DEBUG] Mock data:', mockData);

                // Combine API and mock data
                const allPatients = [...uniquePatients, ...mockData];
                console.log('[DEBUG] Combined patients:', allPatients);

                setPatients(allPatients); // Update state with combined data
            } catch (error) {
                console.error('[ERROR] Error fetching patients:', error);
            }
        };

        getPatients();
    }, []);

    const columns = [
        { field: 'familyName', headerName: 'Family Name', flex: 1 },
        { field: 'givenName', headerName: 'Given Name', flex: 1 },
        { field: 'sex', headerName: 'Sex', flex: 1 },
        { field: 'birthDate', headerName: 'Birth Date', flex: 1 },
        { field: 'parametersCount', headerName: 'Parameters Count', flex: 1 },
        {
            field: 'alarm',
            headerName: 'Alarm',
            flex: 1,
            renderCell: (params) => (
                params.value ? <span style={{ color: 'red' }}>⚠️ Alarm</span> : ''
            ),
        },
    ];

    return (
        <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
            <h2>Patient List</h2>
            <DataGrid
                rows={patients}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 20, 50]}
                disableSelectionOnClick
                getRowId={(row) => row.id} // Ensure unique IDs
            />
        </div>
    );
};

export default Patients;
