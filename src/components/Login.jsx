import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Ensure this CSS file includes styles for layout

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('https://shaqeel.wordifysites.com/wp-json/jwt-auth/v1/token', {
        username,
        password,
      });
      // Store token in localStorage
      localStorage.setItem('jwtToken', response.data.data.token); // Adjust based on actual API response
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password'); // Navigate to the forgot password page
  };

  const handleSignup = () => {
    navigate('/signup'); // Navigate to the signup page
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
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
              />
              I accept the <a href="https://crechespots.org.za/terms-and-conditions/" target="_blank">terms and conditions</a>
            </label>
          </div>
          <div className="checkbox-container">
            <label>
              <input
                type="checkbox"
                checked={acceptPrivacy}
                onChange={(e) => setAcceptPrivacy(e.target.checked)}
              />
              I accept the <a href="https://crechespots.org.za/privacy-policy/" target="_blank" >privacy policy</a>
            </label>
          </div>
          <button type="submit" disabled={!acceptTerms || !acceptPrivacy}>
            Login
          </button>
        </form>
        <button className="forgot-password-button" onClick={handleForgotPassword}>
          <i className="fas fa-key"></i> Forgot your password?
        </button>
        <button className="signup-button" onClick={handleSignup}>
          <i className="fas fa-user-plus"></i> Don't have an account?
        </button>
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
