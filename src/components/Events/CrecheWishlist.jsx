import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, Typography } from '@mui/material';
import AddWishItem from './AddWishItem'; // Import the AddWishItem component
import EditWishItem from './EditWishItem'; // Import the EditWishItem component
import './style/CrecheWishlist.css'; // Import the CSS file for styling

const CrecheWishlist = () => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch user ID
  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem('jwtToken');
      try {
        const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching user ID:', error);
      }
    };

    fetchUserId();
  }, []);

  // Fetch posts for the user
  useEffect(() => {
    if (userId) {
      const fetchPosts = async () => {
        try {
          const response = await axios.get('https://shaqeel.wordifysites.com/wp-json/wp/v2/posts', {
            params: {
              author: userId
            }
          });
          setPosts(response.data);
        } catch (error) {
          console.error('Error fetching posts:', error);
        }
      };

      fetchPosts();
    }
  }, [userId]);

  const handleAddClick = () => {
    setShowAdd(true);
  };

  const handleEditClick = (post) => {
    setSelectedPost(post);
    setShowEdit(true);
  };

  const handleClose = () => {
    setShowAdd(false);
    setShowEdit(false);
    setSelectedPost(null);
  };

  return (
    <div className="wishlist-container">
      <h1>Creche Wishlist</h1>
      <Button variant="contained" color="primary" onClick={handleAddClick}>
        Add New Item
      </Button>
      <div className="posts-list">
        {posts.map((post) => (
          <Card key={post.id} className="post-card">
            <CardContent>
              <Typography variant="h5" component="div">
                {post.title.rendered}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {post.content.rendered.replace(/<[^>]+>/g, '')}
              </Typography>
              <Button variant="outlined" color="primary" onClick={() => handleEditClick(post)}>
                Edit
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      {showAdd && <AddWishItem onClose={handleClose} onPostAdded={() => fetchPosts()} />}
      {showEdit && <EditWishItem post={selectedPost} onClose={handleClose} onPostUpdated={() => fetchPosts()} />}
    </div>
  );
};

export default CrecheWishlist;
