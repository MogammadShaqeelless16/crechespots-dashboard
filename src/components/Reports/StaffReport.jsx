import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { supabase } from '../supabaseOperations/supabaseClient'; // Adjust the path as needed
import './style/staffReport.css'; // Import the CSS file for styling

const StaffReport = () => {
    const [staff, setStaff] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStaff = async () => {
            setLoading(true);
            try {
                // Fetch the current user
                const user = supabase.auth.user();
                console.log('Current User:', user); // Log the current user
                if (!user) {
                    setError('User is not authenticated');
                    setLoading(false);
                    return;
                }

                // Fetch creche IDs associated with the current user
                const { data: userCreches, error: userCrechesError } = await supabase
                    .from('user_creche')
                    .select('creche_id')
                    .eq('user_id', user.id);

                if (userCrechesError) {
                    console.error('Error fetching user creches:', userCrechesError);
                    setError('Failed to fetch creche IDs');
                    setLoading(false);
                    return;
                }

                console.log('User Creches:', userCreches); // Log the fetched creche IDs
                const crecheIds = userCreches.map(item => item.creche_id);

                if (!Array.isArray(crecheIds) || crecheIds.length === 0) {
                    console.log('No creche IDs found for the user.');
                    setError('No creche assignments found.');
                    setLoading(false);
                    return;
                }

                // Fetch staff data for the creche IDs
                const { data: staffData, error: staffError } = await supabase
                    .from('staff')
                    .select('*')
                    .in('creche_id', crecheIds);

                if (staffError) {
                    console.error('Error fetching staff data:', staffError);
                    setError('Failed to fetch staff details');
                    setLoading(false);
                    return;
                }

                console.log('Staff Data:', staffData); // Log the fetched staff data
                setStaff(staffData);
            } catch (err) {
                console.error('Error in fetchStaff:', err);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchStaff();
    }, []);

    if (loading) return <p>Loading...</p>;

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
