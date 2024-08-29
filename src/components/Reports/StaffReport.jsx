import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { supabase } from '../supabaseOperations/supabaseClient'; // Adjust the path as needed
import './style/staffReport.css'; // Import the CSS file for styling

const StaffReport = () => {
    const [staff, setStaff] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const { data, error } = await supabase
                    .from('staff')
                    .select('*');

                if (error) {
                    throw error;
                }

                setStaff(data);
            } catch (err) {
                setError('Failed to fetch staff details');
                console.error('Error fetching staff details:', err);
            }
        };

        fetchStaff();
    }, []);

    return (
        <div className="staff-report-container">
            <h1>Staff Report</h1>
            {error && <p className="error">{error}</p>}
            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Staff Details</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Contact Number</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {staff.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell>{member.name}</TableCell>
                                        <TableCell>{member.position}</TableCell>
                                        <TableCell>{member.contact_number}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </div>
    );
};

export default StaffReport;
