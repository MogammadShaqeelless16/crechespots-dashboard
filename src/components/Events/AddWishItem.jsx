import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import './style/AddWishItem.css'; // Import CSS for styling

const AddWishItem = ({ onClose, onPostAdded }) => {
  const [newPost, setNewPost] = useState({ title: '', description: '' });
  const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post('https://shaqeel.wordifysites.com/wp-json/wp/v2/posts', {
        title: newPost.title,
        content: newPost.description, // Map description to content
        status: 'publish' // Ensure the post is published
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
      });
      onPostAdded();
      onClose();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box className="modal-box">
        <h2>Add New Wishlist Item</h2>
        <TextField
          label="Title"
          name="title"
          value={newPost.title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={newPost.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add Post
        </Button>
      </Box>
    </Modal>
  );
};

export default AddWishItem;
