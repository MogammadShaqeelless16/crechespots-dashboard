import React, { useState, useEffect } from 'react';

const EditUser = ({ user, roles, onUpdateUser, onClose }) => {
  const [updateFields, setUpdateFields] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [updateRole, setUpdateRole] = useState('');

  useEffect(() => {
    if (user) {
      setUpdateFields({
        username: user.username,
        email: user.email,
        phone: user.phone || '',
      });
      setUpdateRole(user.role_id || '');
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onUpdateUser(user.id, updateFields, updateRole);
    onClose();
  };

  return (
    <div className="overlay edit-overlay">
      <div className="overlay-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={updateFields.username}
            onChange={(e) => setUpdateFields({ ...updateFields, username: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={updateFields.email}
            onChange={(e) => setUpdateFields({ ...updateFields, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={updateFields.phone}
            onChange={(e) => setUpdateFields({ ...updateFields, phone: e.target.value })}
          />
          <select
            value={updateRole}
            onChange={(e) => setUpdateRole(e.target.value)}
          >
            <option value="">Select Role</option>
            {roles.map(role => (
              <option key={role.id} value={role.id}>{role.role_name}</option>
            ))}
          </select>
          <button type="submit">Update</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
