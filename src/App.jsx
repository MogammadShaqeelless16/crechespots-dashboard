import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard/Dashboard';
import Profile from './components/Profile';
import Staff from './components/Staff/Staff';
import CrecheDetails from './components/CrecheDetails';
import About from './components/About';
import Students from './components/Student/Students'; // Import the Students component
import Layout from './components/Layout';

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
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/about" element={<About />} />
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/staff" element={<ProtectedRoute element={<Staff />} />} />
          <Route path="/creche/:id" element={<ProtectedRoute element={<CrecheDetails />} />} />
          <Route path="/students" element={<ProtectedRoute element={<Students />} />} /> {/* Add Students route */}
          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
