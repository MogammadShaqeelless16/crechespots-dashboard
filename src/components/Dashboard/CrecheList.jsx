import React, { useState, useEffect } from 'react';
import { fetchUserCreches } from '../../supabaseOperations/syncCrecheOperations'; // Adjust import path

const CrecheList = ({ userId }) => { // Assuming userId is passed as a prop or retrieved from context
  const [creches, setCreches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCreches = async () => {
      if (!userId) {
        setError('User ID is required.');
        setLoading(false);
        return;
      }

      setLoading(true);
      const result = await fetchUserCreches(userId);
      if (result.success) {
        setCreches(result.data);
      } else {
        setError(result.error);
      }
      setLoading(false);
    };

    loadCreches();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="creche-list">
      <h2>My Centre</h2>
      {creches.length > 0 ? (
        creches.map((creche) => (
          <div key={creche.id} className="creche-box">
            <img src={creche.header_image || 'default-image-url'} alt={creche.name} className="creche-image" />
            <h3>{creche.name}</h3>
            <p>Price: {creche.price || 'Not available'}</p>
            <button onClick={() => window.location.href = `/creche/${creche.id}`}>Explore</button>
          </div>
        ))
      ) : (
        <p>No creche assigned.</p>
      )}
    </div>
  );
};

export default CrecheList;
