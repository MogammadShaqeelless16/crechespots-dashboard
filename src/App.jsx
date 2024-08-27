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
import Signup from './components/Signup';
import CrecheWishlist from './components/Events/CrecheWishlist';
import Report from './components/Reports/report';
import Help from './components/help/help';
import CrecheListScreen from './components/Admin/CrecheManagement/CrecheListScreen';
import UserManagementScreen from './components/Admin/UserManagement/UserManagementScreen';
import InvoiceGenerator from './components/Reports/InvoiceGenerator';
import { DataProvider } from './Context/DataContext'; // Import the DataProvider
import supabase  from './supabaseOperations/supabaseClient'; // Import Supabase client

// Helper function to protect routes
const ProtectedRoute = ({ element }) => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    fetchSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Or any other loading indicator
  }

  if (user) {
    return element;
  }
  
  return <Navigate to="/" />;
};

function App() {
  return (
    <DataProvider> {/* Wrap your app in DataProvider */}
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/signup" element={<Signup />} />
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
            <Route path="/userManagement" element={<ProtectedRoute element={<UserManagementScreen />} />} />
            <Route path="/crecheManagement" element={<ProtectedRoute element={<CrecheListScreen />} />} />
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </DataProvider>
  );
}

export default App;
