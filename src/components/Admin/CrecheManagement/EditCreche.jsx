// EditCreche.js
import React, { useState, useEffect } from 'react';

const EditCreche = ({ creche, onUpdateCreche, onClose }) => {
  const [updatedCreche, setUpdatedCreche] = useState(creche || {});

  useEffect(() => {
    setUpdatedCreche(creche);
  }, [creche]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCreche({ ...updatedCreche, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateCreche(updatedCreche);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Edit Creche</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={updatedCreche.name || ''}
            onChange={handleInputChange}
            placeholder="Creche Name"
            required
          />
          <textarea
            name="description"
            value={updatedCreche.description || ''}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="text"
            name="address"
            value={updatedCreche.address || ''}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="phone_number"
            value={updatedCreche.phone_number || ''}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <input
            type="email"
            name="email"
            value={updatedCreche.email || ''}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="price"
            value={updatedCreche.price || ''}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="website"
            value={updatedCreche.website || ''}
            onChange={handleInputChange}
            placeholder="Website"
          />
          <button type="submit">Update Creche</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditCreche;
