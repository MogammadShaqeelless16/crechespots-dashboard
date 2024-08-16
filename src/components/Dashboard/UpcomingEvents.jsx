import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import ICAL from 'ical.js';

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
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('https://calendar.google.com/calendar/ical/en.sa%23holiday%40group.v.calendar.google.com/public/basic.ics');
        const data = await response.text();
        
        const jcalData = ICAL.parse(data);
        const comp = new ICAL.Component(jcalData);
        const events = comp.getAllProperties('vevent');

        const formattedEvents = events.map(event => {
          const e = new ICAL.Event(event);
          return {
            title: e.summary || 'No Title',
            start: new Date(e.startDate.toJSDate()),
            end: new Date(e.endDate.toJSDate()),
            allDay: e.allDay,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Failed to fetch or parse events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    // Load events from local storage
    const savedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setFormattedEvents(savedEvents);

    // Merge fetched events with locally stored events
    setFormattedEvents(prevEvents => [...prevEvents, ...events]);
  }, [events]);

  useEffect(() => {
    // Save events to local storage
    localStorage.setItem('events', JSON.stringify(formattedEvents));
  }, [formattedEvents]);

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all fields.");
      return;
    }

    const updatedEvents = [...formattedEvents, newEvent];
    setFormattedEvents(updatedEvents);
    setNewEvent({
      title: "",
      start: new Date(), // Reset to current date/time
      end: new Date(),   // Reset to current date/time
    });
    setModalIsOpen(false); // Close modal after adding
    handleSendToGoogleCalendar(newEvent); // Send event to Google Calendar
  };

  const handleSendToGoogleCalendar = (event) => {
    const { title, start, end } = event;
    const startISO = new Date(start).toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";
    const endISO = new Date(end).toISOString().replace(/-|:|\.\d+/g, "").slice(0, 15) + "Z";
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${startISO}/${endISO}&details=&location=&sf=true&output=xml`;

    window.open(googleCalendarUrl, "_blank");
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
