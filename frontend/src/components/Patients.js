import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../api';
import { DataGrid } from '@mui/x-data-grid';

const Patients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const getPatients = async () => {
            try {
                const data = await fetchPatients();
                // Process and deduplicate data
                const uniquePatients = data
                    .map((patient) => ({
                        id: patient.id,
                        familyName: patient.familyName,
                        givenName: patient.givenName,
                        sex: patient.sex,
                        birthDate: patient.birthDate,
                        parametersCount: patient.parameters.length,
                        alarm: patient.parameters.some((param) => param.alarm),
                    }))
                    .filter(
                        (patient, index, self) =>
                            index === self.findIndex((p) => p.id === patient.id)
                    ); // Remove duplicates by ID
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
            valueGetter: (params) => new Date(params.value).toLocaleDateString(),
        },
        { field: 'parametersCount', headerName: 'Parameters Count', flex: 1 },
        {
            field: 'alarm',
            headerName: 'Alarm',
            flex: 1,
            renderCell: (params) =>
                params.value ? (
                    <span style={{ color: 'red' }}>⚠️ Alarm</span>
                ) : (
                    ''
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
            />
        </div>
    );
};

export default Patients;
