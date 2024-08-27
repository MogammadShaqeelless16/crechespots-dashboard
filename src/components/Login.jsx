// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseOperations/supabaseClient'; // Ensure the path is correct
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Perform login using Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Check if user is authenticated
      if (data.user) {
        const { user } = data;

        // Insert or update the user in the custom `users` table
        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            id: user.id, // UUID from Supabase
            email: user.email,
            updated_at: new Date().toISOString(), // Update timestamp
            // Include other fields if necessary
          });

        if (dbError) throw dbError;

        console.log('Redirecting to dashboard');
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        setError('Login failed: User data not found.');
      }
    } catch (err) {
      console.error('Login error:', err); // Log the error for debugging
      setError(err.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignup = () => {
    navigate('/signup');
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
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
              I accept the <a href="https://crechespots.org.za/privacy-policy/" target="_blank">privacy policy</a>
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
