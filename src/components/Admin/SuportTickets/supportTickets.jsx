// src/components/SupportTicket.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import supabase from '../../../supabaseOperations/supabaseClient'; // Adjust path if necessary
import './SupportTicket.css'; // Ensure this CSS file is created for styles

const SupportTicket = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_requests')
        .select('*');

      if (error) throw error;

      console.log('Fetched tickets:', data); // Log fetched tickets
      setTickets(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setLoading(false);
    }
  };

  const handleDragEnd = async (result) => {
    const { source, destination } = result;

    if (!destination) {
      console.log('Dropped outside the list.'); // Log if dropped outside
      return;
    }

    const updatedTickets = Array.from(tickets);
    const [movedTicket] = updatedTickets.splice(source.index, 1);
    movedTicket.status = destination.droppableId; // Update status based on column id
    updatedTickets.splice(destination.index, 0, movedTicket);

    console.log('Drag result:', result); // Log drag result
    console.log('Updated tickets:', updatedTickets); // Log updated tickets

    try {
      const { error } = await supabase
        .from('support_requests')
        .update({ status: movedTicket.status })
        .eq('id', movedTicket.id);

      if (error) throw error;

      setTickets(updatedTickets);
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleDelete = async (ticketId) => {
    try {
      const { error } = await supabase
        .from('support_requests')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;

      setTickets(tickets.filter(ticket => ticket.id !== ticketId));
    } catch (error) {
      console.error('Error deleting ticket:', error);
    }
  };

  const columns = {
    'Open': 'Open',
    'Pending': 'Pending',
    'In Progress': 'In Progress',
    'Testing': 'Testing',
    'Closed': 'Closed'
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {Object.keys(columns).map((columnId) => (
        <Droppable key={columnId} droppableId={columnId}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="column"
            >
              <h2>{columns[columnId]}</h2>
              {console.log(`Tickets in column ${columnId}:`, tickets.filter(ticket => ticket.status === columnId))}
              {tickets
                .filter(ticket => ticket.status === columnId)
                .map((ticket, index) => (
                  <Draggable key={ticket.id.toString()} draggableId={ticket.id.toString()} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="ticket"
                        style={{ ...provided.draggableProps.style }}
                      >
                        <h3>{ticket.title}</h3>
                        <p>Status: {ticket.status}</p>
                        <Link to={`/support-ticket-details/${ticket.id}`}>
                          <button>View Details</button>
                        </Link>
                        {ticket.status === 'Closed' && (
                          <button onClick={() => handleDelete(ticket.id)}>Delete</button>
                        )}
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      ))}
    </DragDropContext>
  );
};

export default SupportTicket;
