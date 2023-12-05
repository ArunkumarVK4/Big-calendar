
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import DatePicker from 'react-datepicker';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-datepicker/dist/react-datepicker.css';
import { useState, useEffect } from 'react';
import events from './sample-data.json';
import EventItem from './Eventtem';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

function App() {
  const [newEvent, setNewEvent] = useState({ title: '', startTime: '', endTime: '', id:"" });
  const [allEvents, setAllEvents] = useState(events);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const storedEvents = JSON.parse(localStorage.getItem('events')) || events;
    setAllEvents(storedEvents);

    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('events', JSON.stringify(allEvents));
    }
  }, [allEvents, isMounted]);

  function handleAddEvent() {
    const newEventData = {
      ...newEvent,
      id: allEvents.length + 1,
    };
  
    setAllEvents([...allEvents, newEventData]);
  
    setNewEvent({ title: '', startTime: '', endTime: '', id: null });
  }
  

  function handleEditEvent(updatedEvent) {
    console.log(updatedEvent)
    if (!selectedEvent) {
      console.error('No event selected for editing');
      return;
    }

    const updatedEvents = allEvents.map((event) =>
      event.id === selectedEvent.id ? { ...event, ...updatedEvent } : event
    );

    setAllEvents(updatedEvents);
    setSelectedEvent(null);
  }

  function handleDeleteEvent(deletedEvent) {
    const updatedEvents = allEvents.filter((event) => event.id !== deletedEvent.id);
    setAllEvents(updatedEvents);
    setSelectedEvent(null);
  }

  function handleEditClick(event) {
    setEditingEvent(event);
  }

  return (
    <div className="App">
      <h1>Calendar</h1>
      <h2>Add New Event</h2>
      <div>
        <input
          type="text"
          placeholder="Add Title"
          style={{ width: '20%', marginRight: '10px' }}
          value={newEvent.title}
          onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
        />
        <DatePicker
          placeholderText="Start Date"
          style={{ marginRight: '10px' }}
          selected={newEvent.startTime}
          onChange={(startTime) => setNewEvent({ ...newEvent, startTime })}
        />
        <DatePicker
          placeholderText="End Date"
          selected={newEvent.endTime}
          onChange={(endTime) => setNewEvent({ ...newEvent, endTime })}
        />
        <button style={{ marginTop: '10px' }} onClick={handleAddEvent}>
          Add Event
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={allEvents.map((event) => ({
          ...event,
          start: new Date(event.startTime),
          end: new Date(event.endTime),
        }))}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '50px' }}
        onSelectEvent={(event) => {
          setSelectedEvent(event);
          setEditingEvent(null);
        }}
        eventPropGetter={(event, start, end, isSelected) => {
          const style = {
            backgroundColor: isSelected ? '#3174ad' : '#3174ad',
            color: 'white',
            borderRadius: '0px',
            border: 'none',
            display: 'block',
            padding: '10px',
            position: 'relative',
          };

          return {
            style,
          };
        }}
        components={{
          event: ({ event }) => (
            <EventItem
              event={event}
              onEdit={(event) => handleEditEvent(event)}
              onDelete={(event) => handleDeleteEvent(event)}
              onEditClick={(event) => handleEditClick(event)}
            />
          ),
        }}
      />
    </div>
  );
}
export default App