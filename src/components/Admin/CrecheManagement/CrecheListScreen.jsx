// CrecheManagementScreen.js
import React, { useEffect, useState } from 'react';
import { fetchCrecheList, addCreche, deleteCreche, updateCreche } from '../../../supabaseOperations/crecheOperations';
import AddCreche from './AddCreche';
import EditCreche from './EditCreche';
import './CrecheManagementScreen.css';

const CrecheManagementScreen = () => {
  const [creches, setCreches] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [selectedCreche, setSelectedCreche] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const loadCreches = async () => {
    try {
      const result = await fetchCrecheList();
      if (result.success) {
        setCreches(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const handleAddCreche = async (newCreche) => {
    try {
      const result = await addCreche(newCreche);
      if (result.success) {
        setIsOverlayOpen(false);
        await loadCreches();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const handleUpdateCreche = async (updatedCreche) => {
    try {
      const result = await updateCreche(updatedCreche.id, updatedCreche);
      if (result.success) {
        setIsOverlayOpen(false);
        setIsEditing(false);
        await loadCreches();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  const handleDeleteCreche = async (crecheId) => {
    try {
      const result = await deleteCreche(crecheId);
      if (result.success) {
        await loadCreches();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred.');
    }
  };

  useEffect(() => {
    loadCreches();
  }, []);

  return (
    <div className="creche-management-screen">
      <h1>Creche Management</h1>
      <button onClick={() => { setIsOverlayOpen(true); setIsEditing(false); }} className="add-creche-button">
        Add New Creche
      </button>
      {syncMessage && <div className="sync-message">{syncMessage}</div>}
      <div className="creche-list">
        {creches.map(creche => (
          <div key={creche.id} className="creche-box">
            <h3>{creche.name}</h3>
            <p>{creche.description}</p>
            <p>Address: {creche.address}</p>
            <p>Phone: {creche.phone_number}</p>
            <p>Email: {creche.email}</p>
            <p>Price: {creche.price}</p>
            <p>Website: <a href={creche.website} target="_blank" rel="noopener noreferrer">{creche.website}</a></p>
            <button onClick={() => {
              setSelectedCreche(creche);
              setIsOverlayOpen(true);
              setIsEditing(true);
            }}>Edit</button>
            <button onClick={() => handleDeleteCreche(creche.id)}>Delete</button>
          </div>
        ))}
      </div>

      {/* Overlay Form */}
      {isOverlayOpen && (
        isEditing ? (
          <EditCreche
            creche={selectedCreche}
            onUpdateCreche={handleUpdateCreche}
            onClose={() => setIsOverlayOpen(false)}
          />
        ) : (
          <AddCreche
            onAddCreche={handleAddCreche}
            onClose={() => setIsOverlayOpen(false)}
          />
        )
      )}
    </div>
  );
};

export default CrecheManagementScreen;
