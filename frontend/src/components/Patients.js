import React, { useEffect, useState } from 'react';
import { fetchPatients } from '../api';

const Patients = () => {
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const getPatients = async () => {
            const data = await fetchPatients();
            setPatients(data);
        };

        getPatients();
    }, []);

    return (
        <div>
            <h2>Lista Pazienti</h2>
            <table border="1" cellPadding="10">
                <thead>
                    <tr>
                        <th>Family Name</th>
                        <th>Given Name</th>
                        <th>Sex</th>
                        <th>Birth Date</th>
                        <th>Parameters Count</th>
                    </tr>
                </thead>
                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.familyName}</td>
                            <td>{patient.givenName}</td>
                            <td>{patient.sex}</td>
                            <td>{new Date(patient.birthDate).toLocaleDateString()}</td>
                            <td>{patient.parameters.length}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Patients;
