import React, { useState } from 'react';
import axios from 'axios';
import './Style/BroadcastDetails.css'; // Create a CSS file for styling

const BroadcastDetails = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSend = async () => {
    setSending(true);
    setError('');
    setSuccess('');
    
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No authentication token found.');
      setSending(false);
      return;
    }

    try {
      await axios.post('https://shaqeel.wordifysites.com/wp-json/wp/v2/broadcast', 
        { message }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Message sent successfully!');
    } catch (err) {
      setError('Failed to send message.');
    }
    
    setSending(false);
  };

  return (
    <div className="broadcast-overlay">
      <div className="broadcast-form">
        <h2>Broadcast Message</h2>
        <textarea 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="5"
          placeholder="Enter your message here"
        ></textarea>
        <button onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <button onClick={onClose} className="close-button">Close</button>
      </div>
    </div>
  );
};

export default BroadcastDetails;
