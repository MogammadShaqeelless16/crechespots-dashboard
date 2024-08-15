import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserCrecheFilter = ({ onCrechesLoaded }) => {
  const [creches, setCreches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCreches = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        setError('No authentication token found.');
        return;
      }

      try {
        // Fetch user's profile
        const profileResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userName = profileResponse.data.name;

        // Fetch creches
        const crecheResponse = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/creche', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter creches based on user
        const userCreches = crecheResponse.data
          .filter(creche => creche.assigned_user && creche.assigned_user === userName);

        setCreches(userCreches);
        onCrechesLoaded(userCreches); // Pass filtered creches to parent component
      } catch (err) {
        console.error('Error fetching creches:', err);
        setError(err.response ? err.response.data.message : 'Failed to fetch creches');
      }
    };

    fetchCreches();
  }, [onCrechesLoaded]);

  return (
    <>
      {error && <p className="error-message">{error}</p>}
    </>
  );
};

export default UserCrecheFilter;
