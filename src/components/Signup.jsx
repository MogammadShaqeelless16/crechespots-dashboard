import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseOperations/supabaseClient'; // Ensure the path is correct
import './Signup.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    try {
      // Create user with Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        console.error('Signup error:', authError); // Log detailed error for debugging
        setError(`Signup failed: ${authError.message || 'Unknown error'}`);
        return;
      }

      // Add additional user details to the 'users' table
      const userId = data.user.id;

      const { error: dbError } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            display_name: displayName,
            phone_number: phoneNumber,
            email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (dbError) {
        console.error('Database error:', dbError); // Log detailed error for debugging
        setError(`Failed to save user details: ${dbError.message || 'Unknown error'}`);
        return;
      }

      navigate('/login');
    } catch (err) {
      console.error('Unexpected error:', err); // Log unexpected errors
      setError(`Signup failed: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Display Name"
          required
        />
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
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="Phone Number"
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default Signup;
