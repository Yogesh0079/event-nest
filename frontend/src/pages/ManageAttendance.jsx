import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, Award, QrCode } from 'lucide-react';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function ManageAttendancePage() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generatingCerts, setGeneratingCerts] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [eventRes, regsRes] = await Promise.all([
        apiClient.get(`/events/${id}`),
        apiClient.get(`/events/${id}/registrations`)
      ]);
      setEvent(eventRes.data);
      setRegistrations(regsRes.data || []);
    } catch (error) {
      showToast('Could not load attendance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleMarkAttended = async (registrationId) => {
    try {
      await apiClient.post(`/registrations/${registrationId}/attend`);
      showToast('Attendance marked!');
      setRegistrations((prev) => prev.map((reg) => reg.id === registrationId ? { ...reg, attended: true } : reg));
    } catch (error) {
      showToast('Failed to mark attendance.');
    }
  };

  const handleGenerateCertificates = async () => {
    setGeneratingCerts(true);
    try {
      const { data } = await apiClient.post(`/events/${id}/generate-certificates`);
      showToast(data.message);
    } catch (error) {
      showToast(error.response?.data?.message || 'Failed to generate certificates.');
    } finally {
      setGeneratingCerts(false);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading attendance...</p>;

  const attendedCount = registrations.filter(r => r.attended).length;

  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold mb-4">Manage Attendance</h2>
          <p className="text-xl text-gray-300 mb-2">For: <span className="text-white">{event?.title}</span></p>
          <p className="text-sm text-gray-400 mb-8">
            {attendedCount} of {registrations.length} attendees marked as present
          </p>
        </div>
        <Link 
          to={`/admin/events/${id}/qr-verification`}
          className="btn btn-primary flex items-center gap-2"
        >
          <QrCode className="w-5 h-5" />
          QR Check-in
        </Link>
      </div>

      <div className="space-y-4">
        {registrations.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No one has registered for this event yet.</p>
        ) : (
          registrations.map((reg) => (
            <div key={reg.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-700/50 p-4 rounded-lg gap-3">
              <div>
                <h4 className="font-semibold text-lg">{reg.user.name}</h4>
                <p className="text-sm text-gray-400">{reg.user.email}</p>
              </div>
              <button onClick={() => handleMarkAttended(reg.id)} className={`btn btn-sm ${reg.attended ? 'btn-secondary' : 'btn-primary'}`} disabled={reg.attended}>
                {reg.attended ? (<><Check className="w-4 h-4 mr-1"/> Attended</>) : 'Mark Attended'}
              </button>
            </div>
          ))
        )}
      </div>
      
      {registrations.length > 0 && attendedCount > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-700">
          <button 
            className="btn btn-primary w-full sm:w-auto" 
            onClick={handleGenerateCertificates}
            disabled={generatingCerts}
          >
            <Award className="w-5 h-5 mr-2" />
            {generatingCerts ? 'Generating...' : 'Generate Certificates for Attended'}
          </button>
          <p className="text-sm text-gray-400 mt-2">
            This will create certificates for all attendees who have been marked as attended.
          </p>
        </div>
      )}
    </section>
  );
}
