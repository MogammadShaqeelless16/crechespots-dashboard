import React, { useState } from 'react';
import { Modal, Box, TextField, Button } from '@mui/material';
import axios from 'axios';
import './style/EditWishItem.css'; // Import CSS for styling

const EditWishItem = ({ post, onClose, onPostUpdated }) => {
  const [updatedPost, setUpdatedPost] = useState({
    title: post.title.rendered,
    description: post.content.rendered.replace(/<[^>]+>/g, '') // Strip HTML tags from content
  });

  const token = localStorage.getItem('jwtToken'); // Retrieve the token from localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedPost({ ...updatedPost, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(`https://shaqeel.wordifysites.com/wp-json/wp/v2/posts/${post.id}`, {
        title: updatedPost.title,
        content: updatedPost.description, // Map description to content
        status: 'publish' // Ensure the post remains published
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
      });
      onPostUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Modal open={true} onClose={onClose}>
      <Box className="modal-box">
        <h2>Edit Wishlist Item</h2>
        <TextField
          label="Title"
          name="title"
          value={updatedPost.title}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={updatedPost.description}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Update Post
        </Button>
      </Box>
    </Modal>
  );
};

export default EditWishItem;
