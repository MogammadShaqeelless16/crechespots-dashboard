import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile';
import Staff from './components/Staff/Staff';
import CrecheDetails from './components/CrecheDetails';
import About from './components/About';
import Students from './components/Student/Students';
import Applications from './components/Application/Application';
import Layout from './components/Layout';
import CrecheWishlist from './components/Events/CrecheWishlist';
import Report from './components/Reports/report';
import Help from './components/help/help';
import InvoiceGenerator from './components/Reports/InvoiceGenerator';
import { DataProvider } from './Context/DataContext'; // Import the DataProvider

function App() {
  // Helper function to protect routes
  const ProtectedRoute = ({ element }) => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      // Optionally validate token here if necessary
      return element;
    }
    return <Navigate to="/" />;
  };

  return (
    <DataProvider> {/* Wrap your app in DataProvider */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
            <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
            <Route path="/staff" element={<ProtectedRoute element={<Staff />} />} />
            <Route path="/creche/:id" element={<ProtectedRoute element={<CrecheDetails />} />} />
            <Route path="/students" element={<ProtectedRoute element={<Students />} />} />
            <Route path="/applications" element={<ProtectedRoute element={<Applications />} />} />
            <Route path="/reports" element={<ProtectedRoute element={<Report />} />} />
            <Route path="/invoice-generator" element={<InvoiceGenerator />} />
            <Route path="/crecheWishlist" element={<ProtectedRoute element={<CrecheWishlist />} />} />
            <Route path="/help" element={<ProtectedRoute element={<Help />} />} />
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
