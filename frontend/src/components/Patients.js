import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { fetchPatients } from '../api';
import {
    Card,
    Typography,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Brightness4, Brightness7 } from '@mui/icons-material';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSex, setFilterSex] = useState('');
    const [theme, setTheme] = useState('light');
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [sortModel, setSortModel] = useState([{ field: 'familyName', sort: 'asc' }]);

    useEffect(() => {
        const getPatients = async () => {
            try {
                const data = await fetchPatients();
                const uniquePatients = data.map((patient) => ({
                    id: patient.id,
                    familyName: patient.familyName,
                    givenName: patient.givenName,
                    sex: patient.sex,
                    birthDate: patient.birthDate
                        ? moment(patient.birthDate).format('DD/MM/YYYY')
                        : 'Unknown',
                    parametersCount: patient.parameters?.length || 0,
                    alarm: patient.parameters?.some((param) => param.alarm) || false,
                }));

                setPatients(uniquePatients);
            } catch (error) {
                console.error('[ERROR] Error fetching patients:', error);
            }
        };

        getPatients();
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterSex = (event) => {
        setFilterSex(event.target.value);
    };

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    const filteredPatients = patients.filter((patient) => {
        return (
            (searchTerm === '' ||
                `${patient.familyName} ${patient.givenName}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) &&
            (filterSex === '' || patient.sex === filterSex)
        );
    });

    const columns = [
        {
            field: 'familyName',
            headerName: (
                <Tooltip title="Click to sort by Family Name">
                    <span>Family Name</span>
                </Tooltip>
            ),
            flex: 1,
            sortable: true,
        },
        {
            field: 'givenName',
            headerName: (
                <Tooltip title="Click to sort by Given Name">
                    <span>Given Name</span>
                </Tooltip>
            ),
            flex: 1,
            sortable: true,
        },
        {
            field: 'sex',
            headerName: (
                <Tooltip title="Click to sort by Sex">
                    <span>Sex</span>
                </Tooltip>
            ),
            flex: 0.5,
            sortable: true,
        },
        {
            field: 'birthDate',
            headerName: (
                <Tooltip title="Click to sort by Birth Date">
                    <span>Birth Date</span>
                </Tooltip>
            ),
            flex: 1,
            sortable: true,
        },
        {
            field: 'parametersCount',
            headerName: (
                <Tooltip title="Click to sort by Parameters">
                    <span>Parameters</span>
                </Tooltip>
            ),
            flex: 1,
            sortable: true,
        },
        {
            field: 'alarm',
            headerName: 'Alarm',
            flex: 0.5,
            sortable: false,
            renderCell: (params) =>
                params.value ? <span style={{ color: 'red', fontWeight: 'bold' }}>⚠️ Alarm</span> : '',
        },
    ];

    return (
        <div
            style={{
                height: '100vh',
                padding: '20px',
                backgroundColor: theme === 'light' ? '#f0f4f8' : '#1c1c1c',
                color: theme === 'light' ? '#000' : '#fff',
            }}
        >
            <Card
                style={{
                    padding: '20px',
                    marginBottom: '20px',
                    background: theme === 'light' ? '#ffffff' : '#333333',
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography
                    variant="h4"
                    gutterBottom
                    style={{
                        color: theme === 'light' ? '#007BFF' : '#90CAF9',
                        fontWeight: 'bold',
                    }}
                >
                    Patient Management
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            label="Search by Name"
                            variant="outlined"
                            fullWidth
                            value={searchTerm}
                            onChange={handleSearch}
                            style={{ backgroundColor: theme === 'light' ? '#ffffff' : '#2c2c2c' }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <InputLabel>Filter by Sex</InputLabel>
                            <Select
                                value={filterSex}
                                onChange={handleFilterSex}
                                style={{
                                    backgroundColor: theme === 'light' ? '#ffffff' : '#2c2c2c',
                                    color: theme === 'light' ? '#000' : '#fff',
                                }}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="M">Male</MenuItem>
                                <MenuItem value="F">Female</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} style={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={toggleTheme}>
                            {theme === 'light' ? <Brightness7 /> : <Brightness4 />}
                        </IconButton>
                        <Typography>{theme === 'light' ? 'Light' : 'Dark'} Mode</Typography>
                    </Grid>
                </Grid>
            </Card>
            <div style={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={filteredPatients}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 20, 50]}
                    disableSelectionOnClick
                    getRowClassName={(params) =>
                        params.row.alarm ? 'row-alarm' : params.index % 2 === 0 ? 'row-even' : 'row-odd'
                    }
                    components={{
                        ColumnSortedDescendingIcon: () => <span>⬇️</span>,
                        ColumnSortedAscendingIcon: () => <span>⬆️</span>,
                    }}
                    sortModel={sortModel}
                    onSortModelChange={(model) => setSortModel(model)}
                    sx={{
                        '& .MuiDataGrid-columnHeader': {
                            cursor: 'pointer',
                            fontWeight: 'bold',
                        },
                        '& .MuiDataGrid-columnHeader:hover': {
                            textDecoration: 'underline',
                            backgroundColor: '#f0f4f8',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            display: 'flex',
                            alignItems: 'center',
                        },
                        '& .row-alarm': { backgroundColor: '#ffe0e0' },
                        '& .row-even': { backgroundColor: '#f9f9f9' },
                        '& .row-odd': { backgroundColor: '#ffffff' },
                    }}
                    onRowClick={(params) => setSelectedPatient(params.row)}
                />
            </div>
            {selectedPatient && (
                <Dialog open={true} onClose={() => setSelectedPatient(null)}>
                    <DialogTitle style={{ color: '#007BFF' }}>Patient Details</DialogTitle>
                    <DialogContent>
                        <Typography variant="h6">
                            {selectedPatient.familyName} {selectedPatient.givenName}
                        </Typography>
                        <Typography>Sex: {selectedPatient.sex}</Typography>
                        <Typography>Birth Date: {selectedPatient.birthDate}</Typography>
                        <Typography>Parameters Count: {selectedPatient.parametersCount}</Typography>
                        <Typography>
                            Alarm: {selectedPatient.alarm ? '⚠️ Yes' : 'No'}
                        </Typography>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default Patients;
