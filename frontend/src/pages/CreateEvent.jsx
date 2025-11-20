import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function CreateEventPage({ isEditMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', date: '', location: '', category: 'tech', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [fetchingEvent, setFetchingEvent] = useState(false);

  useEffect(() => {
    if (isEditMode && id) {
      const fetchEvent = async () => {
        setFetchingEvent(true);
        try {
          const { data } = await apiClient.get(`/events/${id}`);
          // Convert date to datetime-local format (YYYY-MM-DDTHH:mm)
          const dateObj = new Date(data.date);
          const localDate = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000);
          const formattedDate = localDate.toISOString().slice(0, 16);
          
          setFormData({
            title: data.title,
            description: data.description,
            date: formattedDate,
            location: data.location,
            category: data.category,
            image_url: data.image_url || '',
          });
        } catch (error) {
          showToast('Failed to load event details.');
          navigate('/admin/events');
        } finally {
          setFetchingEvent(false);
        }
      };
      fetchEvent();
    }
  }, [isEditMode, id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, date: new Date(formData.date).toISOString() };
      
      if (isEditMode && id) {
        await apiClient.put(`/events/${id}`, payload);
        showToast('Event updated successfully!');
      } else {
        await apiClient.post('/events', payload);
        showToast('Event created successfully!');
      }
      
      navigate('/admin/events');
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

  if (fetchingEvent) {
    return <p className="text-center text-lg">Loading event...</p>;
  }

  return (
    <section className="max-w-3xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <h2 className="text-3xl font-bold mb-8">{isEditMode ? 'Edit Event' : 'Create New Event'}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="form-label">Event Title</label>
          <input type="text" name="title" className="form-input" value={formData.title} onChange={handleChange} required />
        </div>
        <div>
          <label className="form-label">Description</label>
          <textarea name="description" rows="5" className="form-input" value={formData.description} onChange={handleChange} required></textarea>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Date and Time</label>
            <input type="datetime-local" name="date" className="form-input" value={formData.date} onChange={handleChange} required />
          </div>
          <div>
            <label className="form-label">Location</label>
            <input type="text" name="location" className="form-input" value={formData.location} onChange={handleChange} required />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="form-label">Category</label>
            <select name="category" className="form-input" value={formData.category} onChange={handleChange}>
              <option value="tech">Tech</option>
              <option value="cultural">Cultural</option>
              <option value="sports">Sports</option>
              <option value="academic">Academic</option>
            </select>
          </div>
          <div>
            <label className="form-label">Image URL</label>
            <input type="text" name="image_url" placeholder="https://..." className="form-input" value={formData.image_url} onChange={handleChange} />
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-6">
          <button type="button" onClick={() => navigate(-1)} className="btn btn-secondary">Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Event')}</button>
        </div>
      </form>
    </section>
  );
}
