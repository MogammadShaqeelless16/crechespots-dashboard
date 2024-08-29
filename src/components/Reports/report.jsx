import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './style/report.css'; // Import the CSS file for styling

const Report = () => {
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleCreateInvoice = () => {
        navigate('/invoice-generator'); // Navigate to the InvoiceGenerator page
    };

    const handleViewReport = (reportType) => {
        // Navigate to different report pages based on the reportType
        navigate(`/reports/${reportType}`);
    };

    return (
        <div className="report-container">
            <h1>Reports</h1>

            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Attendance Report</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Generate and view attendance reports for the creche. Track attendance over different periods and analyze trends.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        className="report-button"
                        onClick={() => handleViewReport('attendance')}
                    >
                        View Report
                    </Button>
                </CardContent>
            </Card>

            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Financial Report</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Generate and view financial reports including expenses, income, and balance sheets. Get insights into the financial health of the creche.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        className="report-button"
                        onClick={() => handleViewReport('financial')}
                    >
                        View Report
                    </Button>
                </CardContent>
            </Card>

            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Enrollment Report</Typography>
                    <Typography variant="body2" color="textSecondary">
                        View reports on the number of enrolled children, their age groups, and other relevant details.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        className="report-button"
                        onClick={() => handleViewReport('enrollment')}
                    >
                        View Report
                    </Button>
                </CardContent>
            </Card>

            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Staff Report</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Generate reports on staff attendance, performance, and other relevant metrics.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        className="report-button"
                        onClick={() => handleViewReport('staff-attendance')}
                    >
                        View Report
                    </Button>
                </CardContent>
            </Card>

            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Incident Report</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Access reports detailing any incidents or accidents that have occurred, along with follow-up actions.
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        className="report-button"
                        onClick={() => handleViewReport('incident')}
                    >
                        View Report
                    </Button>
                </CardContent>
            </Card>

            <Card className="report-section">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Invoice Maker</Typography>
                    <Typography variant="body2" color="textSecondary">
                        Create and manage invoices for your creche. Customize and generate PDF invoices with your creche's branding.
                    </Typography>
                    <Button
                        variant="contained"
                        color="success"
                        className="report-button"
                        onClick={handleCreateInvoice}
                    >
                        Create Invoice
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default Report;
