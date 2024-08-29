import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import { supabase } from '../../supabaseOperations/supabaseClient'; // Adjust the path as needed
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import './style/attendanceReport.css'; // Import the CSS file for styling

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AttendanceStaffReport = ({ month, year }) => {
    const [attendance, setAttendance] = useState([]);
    const [staff, setStaff] = useState([]);
    const [error, setError] = useState('');
    const [staffFilter, setStaffFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [graphData, setGraphData] = useState({ labels: [], datasets: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAttendance = async () => {
            setLoading(true);
            try {
                // Fetch the current user
                const { data: { user }, error: userError } = await supabase.auth.getUser();
                if (userError) {
                    console.error('Error fetching user:', userError);
                    setError('Failed to fetch user details');
                    setLoading(false);
                    return;
                }

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

                console.log('User Creches:', userCreches); // Log user creches for debugging
                const crecheIds = userCreches.map(item => item.creche_id);

                if (!Array.isArray(crecheIds) || crecheIds.length === 0) {
                    setError('No creche assignments found.');
                    setLoading(false);
                    return;
                }

                // Fetch staff members associated with the creche IDs
                const { data: staffData, error: staffError } = await supabase
                    .from('staff')
                    .select('*')
                    .in('creche_id', crecheIds);

                if (staffError) {
                    console.error('Error fetching staff details:', staffError);
                    setError('Failed to fetch staff details');
                    setLoading(false);
                    return;
                }

                setStaff(staffData);

                if (staffData.length === 0) {
                    setError('No staff members found for the creches.');
                    setLoading(false);
                    return;
                }

                // Fetch attendance data for the staff IDs
                const staffIds = staffData.map(staffMember => staffMember.id);

                let query = supabase
                    .from('attendance_staff')
                    .select('*, staff(name, position)')
                    .gte('date', `${year}-${month}-01`)
                    .lt('date', `${year}-${month + 1}-01`);

                if (staffFilter) {
                    query = query.eq('staff_id', staffFilter);
                }

                if (statusFilter) {
                    query = query.eq('status', statusFilter);
                }

                const { data: attendanceData, error: attendanceError } = await query
                    .in('staff_id', staffIds);

                if (attendanceError) {
                    console.error('Error fetching attendance data:', attendanceError);
                    setError('Failed to fetch staff attendance details');
                    setLoading(false);
                    return;
                }

                if (attendanceData.length === 0) {
                    setError('No attendance data available for the selected period');
                } else {
                    setAttendance(attendanceData);

                    // Prepare data for graph
                    const statusCount = attendanceData.reduce((acc, entry) => {
                        acc[entry.status] = (acc[entry.status] || 0) + 1;
                        return acc;
                    }, {});

                    setGraphData({
                        labels: Object.keys(statusCount),
                        datasets: [{
                            label: 'Leave Type Count',
                            data: Object.values(statusCount),
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }]
                    });
                }
            } catch (err) {
                setError('Failed to fetch staff attendance details');
                console.error('Error fetching staff attendance details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAttendance();
    }, [month, year, staffFilter, statusFilter]);

    const exportToExcel = () => {
        if (attendance.length === 0) {
            alert('No data to export');
            return;
        }

        const ws = XLSX.utils.json_to_sheet(attendance.map(entry => ({
            Name: entry.staff.name || 'N/A',
            Position: entry.staff.position || 'N/A',
            Date: entry.date || 'N/A',
            Status: entry.status || 'N/A',
            Remarks: entry.remarks || 'N/A',
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Attendance Report');

        XLSX.writeFile(wb, 'attendance_report.xlsx');
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="attendance-report-container">
            <h1>Staff Monthly Attendance Report - {month}/{year}</h1>
            {error && <p className="error">{error}</p>}
            <div className="filters">
                <FormControl variant="outlined" className="filter-dropdown">
                    <InputLabel>Staff Member</InputLabel>
                    <Select
                        value={staffFilter}
                        onChange={(e) => setStaffFilter(e.target.value)}
                        label="Staff Member"
                    >
                        <MenuItem value="">All</MenuItem>
                        {staff.map(staffMember => (
                            <MenuItem key={staffMember.id} value={staffMember.id}>
                                {staffMember.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl variant="outlined" className="filter-dropdown">
                    <InputLabel>Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        label="Status"
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="Sick Leave">Sick Leave</MenuItem>
                        <MenuItem value="Annual Leave">Annual Leave</MenuItem>
                        <MenuItem value="Maternity Leave">Maternity Leave</MenuItem>
                        <MenuItem value="Paternity Leave">Paternity Leave</MenuItem>
                        <MenuItem value="Bereavement Leave">Bereavement Leave</MenuItem>
                    </Select>
                </FormControl>
                <Button onClick={exportToExcel} variant="contained" color="primary">Export to Excel</Button>
            </div>
            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Attendance Details</Typography>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Position</TableCell>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Remarks</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attendance.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5}>No attendance data available</TableCell>
                                    </TableRow>
                                ) : (
                                    attendance.map((entry) => (
                                        <TableRow key={entry.id}>
                                            <TableCell>{entry.staff.name}</TableCell>
                                            <TableCell>{entry.staff.position}</TableCell>
                                            <TableCell>{entry.date}</TableCell>
                                            <TableCell>{entry.status}</TableCell>
                                            <TableCell>{entry.remarks}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <div className="graph-section">
                <Typography variant="h5" gutterBottom>Leave Type Distribution</Typography>
                <Bar data={graphData} options={{ responsive: true, plugins: { legend: { position: 'top' }, title: { display: true, text: 'Leave Types for the Month' } } }} />
            </div>
        </div>
    );
};

export default AttendanceStaffReport;
