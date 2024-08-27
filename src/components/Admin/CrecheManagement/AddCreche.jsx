// AddCreche.js
import React, { useState } from 'react';

const AddCreche = ({ onAddCreche, onClose }) => {
  const [newCreche, setNewCreche] = useState({
    name: '',
    description: '',
    address: '',
    phone_number: '',
    email: '',
    price: '',
    website: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCreche({ ...newCreche, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddCreche(newCreche);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h2>Add New Creche</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={newCreche.name}
            onChange={handleInputChange}
            placeholder="Creche Name"
            required
          />
          <textarea
            name="description"
            value={newCreche.description}
            onChange={handleInputChange}
            placeholder="Description"
          />
          <input
            type="text"
            name="address"
            value={newCreche.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="phone_number"
            value={newCreche.phone_number}
            onChange={handleInputChange}
            placeholder="Phone Number"
          />
          <input
            type="email"
            name="email"
            value={newCreche.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <input
            type="text"
            name="price"
            value={newCreche.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
          <input
            type="text"
            name="website"
            value={newCreche.website_url}
            onChange={handleInputChange}
            placeholder="Website"
          />
          <button type="submit">Add Creche</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddCreche;
