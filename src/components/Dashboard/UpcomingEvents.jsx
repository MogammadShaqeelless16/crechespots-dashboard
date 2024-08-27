import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import ICAL from 'ical.js';
import supabase from '../../supabaseOperations/supabaseClient'; // Ensure correct path

const localizer = momentLocalizer(moment);

const formatDateForInput = (date) => {
  if (!date || isNaN(date.getTime())) {
    return ""; // Return empty string for invalid dates
  }
  return date.toISOString().slice(0, 16); // Format for datetime-local
};

const UpcomingEvents = () => {
  const [events, setEvents] = useState([]);
  const [formattedEvents, setFormattedEvents] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(), // Default to current date/time
    end: new Date(),   // Default to current date/time
    allDay: false
  });
  const [error, setError] = useState('');


  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      // Get user session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || !session.user) {
        throw new Error("User not authenticated.");
      }

      // Retrieve user profile to get the integer ID (assuming you have a `users` table with integer IDs)
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', session.user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Failed to retrieve user profile.');
      }

      // Prepare the payload
      const eventPayload = {
        title: newEvent.title,
        start: newEvent.start.toISOString(), // Ensure correct ISO format
        end_time: newEvent.end.toISOString(), // Ensure correct ISO format
        all_day: newEvent.allDay,
        user_id: profile.id // Use the integer ID from the `users` table
      };

      // Send the event to Supabase
      const { data, error } = await supabase
        .from('events')
        .insert([eventPayload]);

      if (error) {
        console.error('Supabase Error:', error.message);
        throw error;
      }

      // Update local state
      const updatedEvents = [...formattedEvents, newEvent];
      setFormattedEvents(updatedEvents);
      setNewEvent({
        title: "",
        start: new Date(),
        end: new Date(),
        allDay: false
      });
      setModalIsOpen(false);
    } catch (err) {
      console.error('Failed to add event:', err);
      setError('Failed to add event');
    }
  };

  return (
    <div className="upcoming-events">
      <h2>Upcoming Events</h2>

      <button onClick={() => setModalIsOpen(true)}>Add Event</button>

      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Add Event"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>Add New Event</h2>
        <form>
          <div>
            <label>Event Title</label>
            <input
              type="text"
              value={newEvent.title}
              onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>
          <div>
            <label>Start Date</label>
            <input
              type="datetime-local"
              value={formatDateForInput(newEvent.start)}
              onChange={e => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
            />
          </div>
          <div>
            <label>End Date</label>
            <input
              type="datetime-local"
              value={formatDateForInput(newEvent.end)}
              onChange={e => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
            />
          </div>
          <div>
            <label>All Day</label>
            <input
              type="checkbox"
              checked={newEvent.allDay}
              onChange={e => setNewEvent({ ...newEvent, allDay: e.target.checked })}
            />
          </div>
          <button type="button" onClick={handleAddEvent}>Add Event</button>
          <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </form>
      </Modal>

      {/* Optional: Styles for Modal */}
      <style jsx>{`
        .modal {
          background: white;
          padding: 20px;
          border-radius: 4px;
          width: 400px;
          margin: auto;
        }
        .overlay {
          background: rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
};

export default UpcomingEvents;
