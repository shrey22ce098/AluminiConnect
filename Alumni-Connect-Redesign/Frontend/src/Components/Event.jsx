

import React, { useEffect, useState } from 'react';
import { getLoggedIn, getUserData } from '../services/authService';
import NotLoggedIn from './helper/NotLoggedIn';
import { fetchEvents, createEvent } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import { CalendarDaysIcon, MapPinIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

function Event() {
  const loggedIn = getLoggedIn();
  const user = getUserData();
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      fetchEvents()
        .then(res => setEvents(res.data.data.events))
        .catch(() => toast.error('Failed to fetch events'));
    }
  }, [loggedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createEvent(form);
      toast.success('Event created!');
      setForm({ title: '', date: '', location: '', description: '' });
      // Refresh events
      const res = await fetchEvents();
      setEvents(res.data.data.events);
    } catch (err) {
      toast.error('Failed to create event');
    }
    setLoading(false);
  };

  const canCreate = user && (user.role === 'admin' || user.role === 'professor');

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-4">
      <ToastContainer />
      {loggedIn ? (
        <>
          <h1 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">Events</h1>
          {canCreate && (
            <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-lg animate-fade-in">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><PencilSquareIcon className="h-6 w-6 text-indigo-400 mr-2" />Create Event</h2>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <input name="date" value={form.date} onChange={handleChange} type="date" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200 w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Event'}</button>
            </form>
          )}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500">No events found.</div>
            ) : (
              events.map(ev => (
                <div key={ev._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col animate-fade-in">
                  <div className="flex items-center mb-2">
                    <CalendarDaysIcon className="h-5 w-5 text-indigo-400 mr-2" />
                    <span className="font-bold text-lg text-indigo-700">{ev.title}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <MapPinIcon className="h-4 w-4 text-indigo-300 mr-1" />
                    <span className="text-gray-600">{ev.location}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">{ev.date}</div>
                  <div className="text-gray-700 mb-2">{ev.description}</div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <NotLoggedIn text="Event" />
      )}
    </div>
  );
}

export default Event;
