import React, { useState } from 'react';

const AddUser = ({ roles, onAddUser, onClose }) => {
  const [newUser, setNewUser] = useState({ username: '', email: '', phone: '' });
  const [newUserRole, setNewUserRole] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    onAddUser(newUser, newUserRole);
  };

  return (
    <div className="overlay add-overlay">
      <div className="overlay-content">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Phone"
            value={newUser.phone}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
          <select
            value={newUserRole}
            onChange={(e) => setNewUserRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.role_name}</option>
            ))}
          </select>
          <button type="submit">Add User</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
