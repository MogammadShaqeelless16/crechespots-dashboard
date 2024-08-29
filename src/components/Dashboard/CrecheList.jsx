import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseOperations/supabaseClient'; // Adjust import path
import './CrecheList.css'; // Ensure this path matches your CSS file location

const CrecheList = () => {
  const [creches, setCreches] = useState([]);
  const [userCreches, setUserCreches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const loadCreches = async () => {
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
        .select('first_name')
        .eq('id', userId)
        .single();

      if (userError) {
        setError('Failed to retrieve user information.');
        setLoading(false);
        return;
      }

      setUserName(user.first_name);

      // Fetch creche IDs linked to the user
      const { data: userCrecheData, error: userCrecheError } = await supabase
        .from('user_creche')
        .select('creche_id')
        .eq('user_id', userId);

      if (userCrecheError) {
        setError('Failed to retrieve user creches.');
        setLoading(false);
        return;
      }

      const crecheIds = userCrecheData.map(uc => uc.creche_id);

      if (crecheIds.length > 0) {
        const { data: crecheData, error: crecheError } = await supabase
          .from('creches') // Ensure this table name is correct
          .select('*')
          .in('id', crecheIds);

        if (crecheError) {
          setError('Failed to retrieve creches.');
          setLoading(false);
          return;
        }

        setUserCreches(crecheData);
      } else {
        setUserCreches([]);
      }

      setLoading(false);
    };

    loadCreches();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="creche-list-container">
      <h1>My Creches</h1>
      <h2>.......</h2>
      {userCreches.length > 0 ? (
        <div className="creche-grid">
          {userCreches.map((creche) => (
            <div key={creche.id} className="creche-box">
              <div className="creche-image-container">
                <img
                  src={creche.header_image || 'default-image-url'}
                  alt={creche.name}
                  className="creche-image"
                />
              </div>
              <h3>{creche.name}</h3>
              <p>Price: {creche.price || 'Not available'}</p>
              <button onClick={() => navigate(`/creche/${creche.id}`)}>Explore</button>
            </div>
          ))}
        </div>
      ) : (
        <p>No creche assigned.</p>
      )}
    </div>
  );
};

export default CrecheList;
