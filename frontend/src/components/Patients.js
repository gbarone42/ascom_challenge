import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../api';
import { DataGrid } from '@mui/x-data-grid';

const Patients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const getPatients = async () => {
            try {
                console.log('Fetching patients...');
                const data = await fetchPatients();
                console.log('API Response:', data); // Log full response from API

                // Process and deduplicate data
                const uniquePatients = data
                    .map((patient) => {
                        console.log(`Mapping patient with ID: ${patient.id}`);
                        return {
                            id: patient.id,
                            familyName: patient.familyName,
                            givenName: patient.givenName,
                            sex: patient.sex,
                            birthDate: patient.birthDate,
                            parametersCount: patient.parameters.length,
                            alarm: patient.parameters.some((param) => param.alarm),
                        };
                    })
                    .filter(
                        (patient, index, self) =>
                            index === self.findIndex((p) => p.id === patient.id)
                    ); // Remove duplicates by ID
                console.log('Processed unique patients:', uniquePatients); // Log unique patients
                setPatients(uniquePatients); // Update state with unique data
            } catch (error) {
                console.error('Error fetching patients:', error);
            }
        };

        getPatients();
    }, []); // Dependency array ensures fetch only runs once

    const columns = [
        { field: 'familyName', headerName: 'Family Name', flex: 1 },
        { field: 'givenName', headerName: 'Given Name', flex: 1 },
        { field: 'sex', headerName: 'Sex', flex: 1 },
        {
            field: 'birthDate',
            headerName: 'Birth Date',
            flex: 1,
            valueGetter: (params) => {
                console.log('Received birthDate in valueGetter:', params.value); // Log the raw value of birthDate
                try {
                    const date = new Date(params.value);
                    console.log('Parsed date:', date); // Log parsed date
                    return date.toLocaleDateString(); // Use locale date formatting
                } catch (error) {
                    console.error('Error parsing birthDate:', error); // Handle any date parsing errors
                    return 'Invalid Date'; // Return fallback value if there's an error
                }
            },
        },
        { field: 'parametersCount', headerName: 'Parameters Count', flex: 1 },
        {
            field: 'alarm',
            headerName: 'Alarm',
            flex: 1,
            renderCell: (params) => {
                console.log('Rendering alarm for patient with ID:', params.id); // Log alarm rendering
                return params.value ? (
                    <span style={{ color: 'red' }}>⚠️ Alarm</span>
                ) : (
                    ''
                );
            },
        },
    ];

    console.log('Patients State:', patients); // Log patients state to verify it's populated

    return (
        <div style={{ height: 600, width: '100%', marginTop: '20px' }}>
            <h2>Patient List</h2>
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
