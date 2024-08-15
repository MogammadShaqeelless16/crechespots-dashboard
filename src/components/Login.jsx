import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure this CSS file includes styles for layout

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://shaqeel.wordifysites.com/wp-json/jwt-auth/v1/token', {
        username,
        password
      });
      // Store token in localStorage
      localStorage.setItem('jwtToken', response.data.data.token); // Adjust based on actual API response
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login failed');
    }
  };

  return (
    <div className="login-container">

      <div className="welcome-section">      
        <div className="logo-container">
        <img src="/logo.gif" alt="Logo" className="logo-image" />
        </div>
        <h1>Welcome to Creche Spots</h1>
        <p>
          Creche Spots connects you with the best childcare facilities. Explore our range of services
          and find the perfect spot for your child's care needs. We provide detailed information and
          reviews to help you make the right choice.
        </p>
      </div>
      <div className="login-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
