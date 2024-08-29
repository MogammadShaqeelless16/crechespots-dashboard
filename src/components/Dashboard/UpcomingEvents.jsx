import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import Modal from 'react-modal';
import supabase from '../../supabaseOperations/supabaseClient'; // Ensure correct path
import { VerifyOperation } from '../../supabaseOperations/verifyOperation'; // Adjust import path
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


const localizer = momentLocalizer(moment);

// Priority color map
const priorityColorMap = {
  low: '#28a745',    // Green
  medium: '#007bff', // Blue
  high: '#fd7e14',   // Orange
  critical: '#dc3545' // Red
};

// Static list of South African public holidays (example dates)
const southAfricanHolidays = [
  { title: "New Year's Day", start: new Date('2024-01-01'), end: new Date('2024-01-01'), allDay: true, color_code: '#6c757d' },
  { title: "Human Rights Day", start: new Date('2024-03-21'), end: new Date('2024-03-21'), allDay: true, color_code: '#6c757d' },
  { title: "Good Friday", start: new Date('2024-03-29'), end: new Date('2024-03-29'), allDay: true, color_code: '#6c757d' },
  { title: "Easter Monday", start: new Date('2024-04-01'), end: new Date('2024-04-01'), allDay: true, color_code: '#6c757d' },
  { title: "Freedom Day", start: new Date('2024-04-27'), end: new Date('2024-04-27'), allDay: true, color_code: '#6c757d' },
  { title: "Workers' Day", start: new Date('2024-05-01'), end: new Date('2024-05-01'), allDay: true, color_code: '#6c757d' },
  { title: "Youth Day", start: new Date('2024-06-16'), end: new Date('2024-06-16'), allDay: true, color_code: '#6c757d' },
  { title: "Women’s Day", start: new Date('2024-08-09'), end: new Date('2024-08-09'), allDay: true, color_code: '#6c757d' },
  { title: "Heritage Day", start: new Date('2024-09-24'), end: new Date('2024-09-24'), allDay: true, color_code: '#6c757d' },
  { title: "Day of Reconciliation", start: new Date('2024-12-16'), end: new Date('2024-12-16'), allDay: true, color_code: '#6c757d' },
  { title: "Christmas Day", start: new Date('2024-12-25'), end: new Date('2024-12-25'), allDay: true, color_code: '#6c757d' },
  { title: "Day of Goodwill", start: new Date('2024-12-26'), end: new Date('2024-12-26'), allDay: true, color_code: '#6c757d' }
];

// Function to convert HTML to PDF
const handleDownloadPDF = async () => {
  const doc = new jsPDF();
  
  // Capture the calendar as an image
  const element = document.querySelector('.rbc-calendar'); // Adjust the selector as needed
  
  if (element) {
    html2canvas(element).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210; // A4 size width in mm
      const pageHeight = 295; // A4 size height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;
      doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        doc.addPage();
        doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      doc.save('day-schedule.pdf');
    });
  } else {
    alert('No calendar element found.');
  }
};  

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
  const [editMode, setEditMode] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [newEvent, setNewEvent] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
    allDay: false,
    priority: "medium",
    color_code: priorityColorMap["medium"],
    description: "",
    location: "",
    meeting_link: ""
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const { userId } = await VerifyOperation();

        // Fetch user events from Supabase
        const { data: userEvents, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('user_id', userId);

        if (eventsError) {
          throw new Error('Failed to retrieve events.');
        }

        // Combine user events with public holidays
        const allEvents = [...userEvents, ...southAfricanHolidays];

        const formatted = allEvents.map(event => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end_time || event.end), // Fallback for end_time
          style: { backgroundColor: event.color_code || priorityColorMap.medium } // Use priority color
        }));

        setEvents(userEvents);
        setFormattedEvents(formatted);
      } catch (err) {
        console.error('Failed to load events:', err);
        setError('Failed to load events');
      }
    };

    loadEvents();
  }, []);

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert("Please fill in all required fields.");
      return;
    }
  
    try {
      const { userId } = await VerifyOperation();
  
      const eventPayload = {
        title: newEvent.title,
        start: newEvent.start.toISOString(),
        end_time: newEvent.end.toISOString(),
        all_day: newEvent.allDay,
        user_id: userId,
        priority: newEvent.priority,
        color_code: newEvent.color_code,
        description: newEvent.description,
        location: newEvent.location,
        meeting_link: newEvent.meeting_link
      };
  
      if (editMode && selectedEvent) {
        // Update event in Supabase
        const { error } = await supabase
          .from('events')
          .update(eventPayload)
          .eq('id', selectedEvent.id);
  
        if (error) {
          console.error('Failed to update event in Supabase:', error);
          throw new Error('Failed to update event.');
        }
  
        // Update local state
        const updatedEvents = formattedEvents.map(event =>
          event.id === selectedEvent.id ? { ...eventPayload, start: new Date(eventPayload.start), end: new Date(eventPayload.end_time), style: { backgroundColor: eventPayload.color_code } } : event
        );
        setFormattedEvents(updatedEvents);
      } else {
        // Add new event to Supabase
        const { error } = await supabase
          .from('events')
          .insert([eventPayload]);
  
        if (error) {
          console.error('Failed to add event to Supabase:', error);
          throw new Error('Failed to add event.');
        }
  
        // Add new event to local state
        const newEventFormatted = { ...eventPayload, start: new Date(eventPayload.start), end: new Date(eventPayload.end_time), style: { backgroundColor: eventPayload.color_code } };
        setFormattedEvents([...formattedEvents, newEventFormatted]);
      }
  
      // Reset form
      setNewEvent({
        title: "",
        start: new Date(),
        end: new Date(),
        allDay: false,
        priority: "medium",
        color_code: priorityColorMap["medium"],
        description: "",
        location: "",
        meeting_link: ""
      });
      setEditMode(false);
      setModalIsOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      console.error('Failed to add/update event:', err);
      setError('Failed to add/update event');
    }
  };
  

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setNewEvent({
      title: event.title,
      start: event.start,
      end: event.end,
      allDay: event.all_day,
      priority: event.priority,
      color_code: event.color_code,
      description: event.description,
      location: event.location,
      meeting_link: event.meeting_link
    });
    setEditMode(true);
    setModalIsOpen(true);
  };

  const handleSelectSlot = ({ start, end }) => {
    setNewEvent(prev => ({
      ...prev,
      start,
      end
    }));
    setEditMode(false);
    setModalIsOpen(true);
  };

  const handlePriorityChange = (priority) => {
    setNewEvent(prev => ({
      ...prev,
      priority,
      color_code: priorityColorMap[priority]
    }));
  };

  return (
    <div className="upcoming-events">
      <h2>Upcoming Events</h2>

      <Calendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={handleEventClick}
        onSelectSlot={handleSelectSlot}
        selectable
        defaultView={Views.DAY}
        eventPropGetter={event => ({
          style: {
            backgroundColor: event.style.backgroundColor,
          }
        })}
      />
      <button type="button" onClick={handleDownloadPDF}>Download Day Schedule as PDF</button> 
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel={editMode ? "Edit Event" : "Add Event"}
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{editMode ? "Edit Event" : "Add New Event"}</h2>
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
          <div>
            <label>Priority</label>
            <select
              value={newEvent.priority}
              onChange={e => handlePriorityChange(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea
              value={newEvent.description}
              onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>
          <div>
            <label>Location</label>
            <input
              type="text"
              value={newEvent.location}
              onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
            />
          </div>
          <div>
            <label>Meeting Link</label>
            <input
              type="url"
              value={newEvent.meeting_link}
              onChange={e => setNewEvent({ ...newEvent, meeting_link: e.target.value })}
            />
          </div>
          <button type="button" onClick={handleAddEvent}>
            {editMode ? "Update Event" : "Add Event"}
          </button>
          <button type="button" onClick={() => setModalIsOpen(false)}>Cancel</button>
        </form>
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
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </Modal>
    </div>
  );
};

export default UpcomingEvents;
