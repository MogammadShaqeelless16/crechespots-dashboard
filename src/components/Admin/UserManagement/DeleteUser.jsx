import React from 'react';

const DeleteUser = ({ onDeleteUser, onClose }) => {
  return (
    <div className="overlay delete-overlay">
      <div className="overlay-content">
        <h2>Confirm Delete</h2>
        <p>Are you sure you want to delete this user?</p>
        <button onClick={onDeleteUser}>Delete</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteUser; // This ensures the component is exported as default
