import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseOperations/supabaseClient'; // Adjust import path
import { fetchCurrentUserData } from '../../supabaseOperations/userOperations';
import './Style/BroadcastDetails.css'; // Ensure you create or update this CSS file for styling

const BroadcastDetails = ({ onClose }) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [staffEmails, setStaffEmails] = useState([]);
  const [crecheDetails, setCrecheDetails] = useState(null); // New state for creche details
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCrecheIdAndStaffEmails = async () => {
      console.log('Fetching current user data...');
      try {
        // Fetch current user data and creche_id
        const result = await fetchCurrentUserData();
        console.log('fetchCurrentUserData result:', result);
    
        if (!result.success) {
          throw new Error('Failed to fetch user data.');
        }
    
        const { data } = result;
        if (!data.crecheIds.length) {
          throw new Error('No creche associated with the current user.');
        }
    
        const crecheId = data.crecheIds[0]; // Use the first creche_id or adjust as needed
        console.log('Fetched crecheId:', crecheId);
    
        // Fetch creche details
        const { data: crecheData, error: crecheError } = await supabase
          .from('creches')
          .select('name, email, phone_number')
          .eq('id', crecheId)
          .single();
    
        if (crecheError) {
          throw new Error(`Failed to fetch creche details: ${crecheError.message}`);
        }
    
        console.log('Fetched creche details:', crecheData);
        setCrecheDetails(crecheData);
    
        // Fetch staff emails based on creche_id
        const { data: staffData, error: staffError } = await supabase
          .from('staff')
          .select('email')
          .eq('creche_id', crecheId);
    
        if (staffError) {
          throw new Error(`Failed to fetch staff emails: ${staffError.message}`);
        }
    
        console.log('Fetched staff data:', staffData);
        const emails = staffData.map((staff) => staff.email).filter(email => email !== null);
        console.log('Staff emails:', emails);
        setStaffEmails(emails);
      } catch (err) {
        setError(`Failed to fetch staff emails or creche details: ${err.message}`);
        console.error('Error fetching data:', err);
      }
    };
    

    fetchCrecheIdAndStaffEmails();
  }, []);

  const handleSend = async () => {
    setSending(true);
    setError('');
    setSuccess('');

    if (staffEmails.length === 0) {
      setError('No staff emails available.');
      setSending(false);
      return;
    }

    if (!crecheDetails) {
      setError('Creche details are not available.');
      setSending(false);
      return;
    }

    // Create email signature
    const emailSignature = `
      Kind regards,
      ${crecheDetails.name}
      Email: ${crecheDetails.email}
      Phone: ${crecheDetails.phone}
    `;

    const emailData = {
      subject: `${subject} - ${crecheDetails.name}`, // Add creche name to subject
      text: `${message}\n\n${emailSignature}`, // Add signature to the body
      to: staffEmails.join(', '), // Join emails with comma for bulk sending
      from: 'info@crechespots.org.za' // Replace with your email address
    };

    console.log('Sending email data:', emailData);

    try {
      const response = await fetch('http://localhost:3000/send-email', { // Your backend proxy URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });

      if (!response.ok) {
        throw new Error('Failed to send email.');
      }

      setSuccess('Message sent successfully!');
    } catch (err) {
      setError('Failed to send message.');
      console.error('Error sending message:', err);
    }

    setSending(false);
  };

  return (
    <div className="broadcast-overlay">
      <div className="broadcast-form">
        <h2>Broadcast Message</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          Subject:
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </label>
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            placeholder="Enter your message here"
          ></textarea>
        </label>
        <button onClick={handleSend} disabled={sending}>
          {sending ? 'Sending...' : 'Send Message'}
        </button>
        <button onClick={onClose} className="close-button">Close</button>
        <div className="email-list">
          <h3>Staff Emails</h3>
          <ul>
            {staffEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BroadcastDetails;
