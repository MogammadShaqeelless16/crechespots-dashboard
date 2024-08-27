import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseOperations/supabaseClient'; // Ensure the path is correct
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email);
      
      if (error) {
        throw error;
      }

      setMessage('Password reset link sent to your email.');
      setTimeout(() => navigate('/login'), 3000); // Redirect to login after a short delay
    } catch (err) {
      setError(err.message || 'Failed to send password reset link');
    }
  };

  return (
    <div className="forgot-password-container">
      <h1>Forgot Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
  