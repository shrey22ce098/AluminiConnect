

import React, { useState, useEffect } from 'react';
import { getLoggedIn, getUserData } from "../services/authService";
import { fetchMeetings, createMeeting } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import NotLoggedIn from './helper/NotLoggedIn';
import { VideoCameraIcon, CalendarDaysIcon, LinkIcon, PencilSquareIcon } from '@heroicons/react/24/solid';

const Meeting = () => {
  const loggedIn = getLoggedIn();
  const user = getUserData();
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', meetingLink: '', date: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      fetchMeetings()
        .then(res => setMeetings(res.data.meetings || res.data.data?.meetings || []))
        .catch(() => toast.error('Failed to fetch meetings'));
    }
  }, [loggedIn]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createMeeting(form);
      toast.success('Meeting created!');
      setForm({ title: '', description: '', meetingLink: '', date: '' });
      // Refresh meetings
      const res = await fetchMeetings();
      setMeetings(res.data.meetings || res.data.data?.meetings || []);
    } catch (err) {
      toast.error('Failed to create meeting');
    }
    setLoading(false);
  };

  const canCreate = user && user.role === 'alumni';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-4">
      <ToastContainer />
      {loggedIn ? (
        <>
          <h2 className="text-4xl font-extrabold mb-6 text-center text-indigo-700">Meetings</h2>
          {canCreate && (
            <form onSubmit={handleCreate} className="mb-8 bg-white p-6 rounded-xl shadow-lg w-full max-w-lg animate-fade-in">
              <h3 className="text-xl font-semibold mb-4 flex items-center"><PencilSquareIcon className="h-6 w-6 text-indigo-400 mr-2" />Create Meeting</h3>
              <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <input name="date" value={form.date} onChange={handleChange} type="datetime-local" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <input name="meetingLink" value={form.meetingLink} onChange={handleChange} placeholder="Meeting Link (e.g. Zoom/Meet)" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="block w-full mb-3 p-2 border rounded focus:ring-2 focus:ring-indigo-300" />
              <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors duration-200 w-full" disabled={loading}>{loading ? 'Creating...' : 'Create Meeting'}</button>
            </form>
          )}
          <div className="w-full max-w-2xl grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.length === 0 ? (
              <div className="col-span-2 text-center text-gray-500">No meetings found.</div>
            ) : (
              meetings.map(m => (
                <div key={m._id} className="bg-white rounded-xl shadow-md p-5 flex flex-col animate-fade-in">
                  <div className="flex items-center mb-2">
                    <VideoCameraIcon className="h-5 w-5 text-indigo-400 mr-2" />
                    <span className="font-bold text-lg text-indigo-700">{m.title}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <CalendarDaysIcon className="h-4 w-4 text-indigo-300 mr-1" />
                    <span className="text-gray-600">{m.date}</span>
                  </div>
                  <div className="flex items-center mb-1">
                    <LinkIcon className="h-4 w-4 text-indigo-300 mr-1" />
                    <a href={m.meetingLink} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline break-all">{m.meetingLink}</a>
                  </div>
                  <div className="text-gray-700 mb-2">{m.description}</div>
                </div>
              ))
            )}
          </div>
        </>
      ) : (
        <NotLoggedIn text="Meeting" />
      )}
    </div>
  );
};

export default Meeting;
