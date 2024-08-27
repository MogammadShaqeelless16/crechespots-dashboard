import React, { useState, useEffect } from 'react';
import { fetchUsersFromSupabase, addUser, updateUser, deleteUser } from '../../../supabaseOperations/userOperations';
import { fetchRoles } from '../../../supabaseOperations/roleOperations';
import { syncUsers } from '../../../supabaseOperations/syncOperations';
import './UserManagementScreen.css';
import { FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import AddUser from './AddUser';
import EditUser from './EditUser';
import DeleteUser from './DeleteUser';

const UserManagementScreen = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');
  const [syncMessage, setSyncMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddOverlayOpen, setIsAddOverlayOpen] = useState(false);
  const [isEditOverlayOpen, setIsEditOverlayOpen] = useState(false);
  const [isDeleteOverlayOpen, setIsDeleteOverlayOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadUsers = async () => {
      const { success, data } = await fetchUsersFromSupabase();
      if (success) {
        setUsers(data.users);
      } else {
        setError('Failed to fetch users from Supabase.');
      }
    };

    const loadRoles = async () => {
      const { success, data } = await fetchRoles();
      if (success) {
        setRoles(data);
      } else {
        setError('Failed to fetch roles from Supabase.');
      }
    };

    loadUsers();
    loadRoles();
  }, []);

  const handleAddUser = async (newUser, roleId) => {
    const defaultRoleId = roleId || (roles.find(role => role.role_name === 'User')?.id || null);
    const { success, error } = await addUser(newUser, defaultRoleId);
    if (success) {
      setIsAddOverlayOpen(false);
      refreshUsers();
    } else {
      setError(`Failed to add user: ${error}`);
    }
  };

  const handleUpdateUser = async (userId, updateFields, roleId) => {
    const { success, error } = await updateUser(userId, updateFields, roleId);
    if (success) {
      setIsEditOverlayOpen(false);
      refreshUsers();
    } else {
      setError(`Failed to update user: ${error}`);
    }
  };

  const handleDeleteUser = async () => {
    const { success, error } = await deleteUser(userToDelete);
    if (success) {
      setIsDeleteOverlayOpen(false);
      refreshUsers();
    } else {
      setError(`Failed to delete user: ${error}`);
    }
  };

  const handleSyncUsers = async () => {
    setSyncMessage('Syncing users...');
    const { success, error } = await syncUsers();
    if (success) {
      setSyncMessage('Sync successful.');
      refreshUsers();
    } else {
      setSyncMessage(`Sync failed: ${error}`);
    }
  };

  const refreshUsers = async () => {
    const { success, data } = await fetchUsersFromSupabase();
    if (success) {
      setUsers(data.users);
    } else {
      setError('Failed to refresh user list.');
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.display_name || ''} ${user.email || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="user-management-screen">
      <h1>User Management</h1>

      <div className="action-buttons">
        <button onClick={() => setIsAddOverlayOpen(true)} className="add-user-button">
          Add User
        </button>
        <button onClick={handleSyncUsers} className="sync-users-button">
          Sync Users
        </button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FaSearch />
      </div>

      <div className="user-list">
        <h2>User List</h2>
        {error && <p className="error-message">{error}</p>}
        {syncMessage && <p className="sync-message">{syncMessage}</p>}
        <table className="user-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Creches</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.phone || 'No phone'}</td>
                <td>{roles.find(role => role.id === user.role_id)?.role_name || 'No Role'}</td>
                <td>{user.creches?.map(creche => creche.name).join(', ') || 'No Creches'}</td>
                <td>
                  <FaEdit onClick={() => {
                    setSelectedUser(user);
                    setIsEditOverlayOpen(true);
                  }} />
                  <FaTrash onClick={() => {
                    setUserToDelete(user.id);
                    setIsDeleteOverlayOpen(true);
                  }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddOverlayOpen && (
        <AddUser
          roles={roles}
          onAddUser={handleAddUser}
          onClose={() => setIsAddOverlayOpen(false)}
        />
      )}

      {isEditOverlayOpen && (
        <EditUser
          user={selectedUser}
          roles={roles}
          onUpdateUser={handleUpdateUser}
          onClose={() => setIsEditOverlayOpen(false)}
        />
      )}

      {isDeleteOverlayOpen && (
        <DeleteUser
          onDeleteUser={handleDeleteUser}
          onClose={() => setIsDeleteOverlayOpen(false)}
        />
      )}
    </div>
  );
};

export default UserManagementScreen;
