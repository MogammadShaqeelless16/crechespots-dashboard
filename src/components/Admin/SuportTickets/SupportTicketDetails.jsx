// src/components/SupportTicketDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import supabase from '../../../supabaseOperations/supabaseClient'; // Adjust path if necessary
import './SupportTicketDetails.css'; // Ensure this CSS file is created for styles

const SupportTicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [user, setUser] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketDetails();
    fetchComments();
  }, [id]);

  const fetchTicketDetails = async () => {
    try {
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_requests')
        .select('*')
        .eq('id', id)
        .single();

      if (ticketError) throw ticketError;

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('display_name, first_name, last_name, email')
        .eq('id', ticketData.user_id)
        .single();

      if (userError) throw userError;

      setTicket(ticketData);
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('ticket_comments')
        .select('*')
        .eq('ticket_id', id);

      if (error) throw error;

      setComments(data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const { error } = await supabase
        .from('ticket_comments')
        .insert([{ ticket_id: id, comment }]);

      if (error) throw error;

      setComment('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="ticket-details">
      {ticket && user && (
        <>
          <h1>{ticket.title}</h1>
          <p><strong>Category:</strong> {ticket.category}</p>
          <p><strong>Message:</strong> {ticket.message}</p>
          <p><strong>Status:</strong> {ticket.status}</p>
          <h2>User Information</h2>
          <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
          <p><strong>Email:</strong> {user.email}</p>

          <h2>Comments</h2>
          <div>
            {comments.map((comment) => (
              <div key={comment.id} className="comment">
                <p>{comment.comment}</p>
              </div>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment"
          />
          <button onClick={handleCommentSubmit}>Submit Comment</button>
        </>
      )}
    </div>
  );
};

export default SupportTicketDetails;
