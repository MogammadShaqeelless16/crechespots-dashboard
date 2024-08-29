import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseOperations/supabaseClient';

const EditUser = ({ user, roles, onUpdateUser, onClose }) => {
  const [updateFields, setUpdateFields] = useState({
    username: '',
    email: '',
    phone_number: '',
  });
  const [updateRole, setUpdateRole] = useState('');
  const [creches, setCreches] = useState([]); 
  const [selectedCreches, setSelectedCreches] = useState([]); 

  useEffect(() => {
    // Fetch creches from the Supabase database
    const fetchCreches = async () => {
      try {
        const { data, error } = await supabase
          .from('creches')
          .select('*'); 

        if (error) throw error;
        setCreches(data);
      } catch (error) {
        console.error('Error fetching creches:', error.message);
      }
    };

    fetchCreches();
  }, []);

  useEffect(() => {
    const fetchUserCreches = async () => {
      if (user) {
        try {
          // Fetch the user's assigned creches from the user_creche table
          const { data: userCreches, error } = await supabase
            .from('user_creche')
            .select('creche_id')
            .eq('user_id', user.id);

          if (error) throw error;

          const crecheIds = userCreches.map(item => item.creche_id);
          setSelectedCreches(crecheIds);

          setUpdateFields({
            display_name: user.display_name,
            email: user.email,
            phone_number: user.phone_number || '',
          });
          setUpdateRole(user.role_id || '');
        } catch (error) {
          console.error('Error fetching user creches:', error.message);
        }
      }
    };

    fetchUserCreches();
  }, [user]);

  const handleCrecheChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedCreches(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Update the user's basic information
      const { error: userError } = await supabase
        .from('users')
        .update({
          username: updateFields.username,
          email: updateFields.email,
          phone_number: updateFields.phone_number,
          role_id: updateRole,
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Clear existing creche associations
      const { error: deleteError } = await supabase
        .from('user_creche')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      // Insert new creche associations
      const { error: insertError } = await supabase
        .from('user_creche')
        .insert(selectedCreches.map(creche_id => ({
          user_id: user.id,
          creche_id,
        })));

      if (insertError) throw insertError;

      // Call the onUpdateUser callback to update the user in the parent component
      await onUpdateUser(user.id, updateFields, updateRole, selectedCreches);
      
      // Close the edit overlay
      onClose();
    } catch (error) {
      console.error('Error updating user:', error.message);
    }
  };

  return (
    <div className="overlay edit-overlay">
      <div className="overlay-content">
        <h2>Edit User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Display Name"
            value={updateFields.display_name}
            onChange={(e) => setUpdateFields({ ...updateFields, display_name: e.target.value })}
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
            value={updateFields.phone_number}
            onChange={(e) => setUpdateFields({ ...updateFields, phone_number: e.target.value })}
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
          <select
            multiple
            value={selectedCreches}
            onChange={handleCrecheChange}
          >
            {creches.map(creche => (
              <option key={creche.id} value={creche.id}>{creche.name}</option>
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
