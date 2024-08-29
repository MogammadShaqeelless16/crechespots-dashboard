import React, { useState, useEffect } from 'react';
import supabase from '../../supabaseOperations/supabaseClient'; // Adjust import path
import './welcome.css'; // Ensure this path matches your CSS file location

const Welcome = () => {
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);

      // Fetch user session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        setError('Failed to retrieve user session.');
        setLoading(false);
        return;
      }

      if (!sessionData.session) {
        setError('User is not logged in.');
        setLoading(false);
        return;
      }

      const userId = sessionData.session.user.id;
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('display_name')
        .eq('id', userId)
        .single();

      if (userError) {
        setError('Failed to retrieve user information.');
        setLoading(false);
        return;
      }

      setUserName(user.display_name || 'User');
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <div className="welcome-loading">Loading...</div>;
  if (error) return <div className="welcome-error">Error: {error}</div>;

  return (
    <div className="welcome-container">
      <h1 className="welcome-heading">Welcome, <span className="typewriter-text">{userName}!</span></h1>
    </div>
  );
};

export default Welcome;
