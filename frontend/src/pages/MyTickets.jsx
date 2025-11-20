import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Download, Calendar, MapPin, QrCode } from 'lucide-react';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function MyTickets() {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get('/users/me/registrations');
      setRegistrations(response.data || []);
    } catch (error) {
      showToast('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = (registration) => {
    if (!registration.qr_code) {
      showToast('QR code not available');
      return;
    }

    const link = document.createElement('a');
    link.href = registration.qr_code;
    link.download = `ticket-${registration.event.title.replace(/\s+/g, '-')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('QR code downloaded!');
  };

  const printTicket = (registration) => {
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Event Ticket - ${registration.event.title}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          .ticket { border: 2px solid #10b981; border-radius: 10px; padding: 30px; max-width: 600px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { color: #10b981; font-size: 28px; font-weight: bold; margin: 0; }
          .details { margin: 20px 0; }
          .detail-row { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: bold; color: #059669; }
          .qr-section { text-align: center; margin-top: 30px; }
          .qr-section img { border: 3px solid #10b981; border-radius: 8px; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <h1 class="title">🎟️ Event Ticket</h1>
          </div>
          <div class="details">
            <div class="detail-row">
              <span class="label">Event:</span> ${registration.event.title}
            </div>
            <div class="detail-row">
              <span class="label">Date:</span> ${new Date(registration.event.date).toLocaleString()}
            </div>
            <div class="detail-row">
              <span class="label">Location:</span> ${registration.event.location}
            </div>
            <div class="detail-row">
              <span class="label">Ticket Code:</span> ${registration.ticket_code}
            </div>
            <div class="detail-row">
              <span class="label">Status:</span> ${registration.attended ? 'Checked In ✓' : 'Registered'}
            </div>
          </div>
          <div class="qr-section">
            <p style="margin-bottom: 10px;"><strong>Check-in QR Code:</strong></p>
            <img src="${registration.qr_code}" alt="QR Code" width="250" />
            <p style="margin-top: 10px; font-size: 14px; color: #6b7280;">
              Show this QR code at the event entrance
            </p>
          </div>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-400">Loading your tickets...</p>
      </div>
    );
  }

  return (
    <section id="page-tickets">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-4">My Tickets</h2>
        <p className="text-gray-400">View and manage your event tickets with QR codes</p>
      </div>

      {registrations.length === 0 ? (
        <div className="text-center py-16 panel-glass">
          <Ticket className="w-20 h-20 mx-auto mb-4 text-gray-500" />
          <h3 className="text-2xl font-semibold mb-2">No Tickets Yet</h3>
          <p className="text-gray-400 mb-6">You haven't registered for any events yet.</p>
          <Link to="/events" className="btn btn-primary">Browse Events</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {registrations.map((reg) => (
            <div key={reg.id} className="panel-glass p-6 hover:shadow-xl transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{reg.event.title}</h3>
                  <div className="space-y-1 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(reg.event.date).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {reg.event.location}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  reg.attended 
                    ? 'bg-emerald-500/20 text-emerald-400' 
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {reg.attended ? 'Checked In ✓' : 'Registered'}
                </span>
              </div>

              {reg.qr_code && (
                <div className="bg-white p-4 rounded-lg mb-4">
                  <img 
                    src={reg.qr_code} 
                    alt="QR Code" 
                    className="w-full max-w-[200px] mx-auto"
                  />
                  <p className="text-center text-xs text-gray-600 mt-2">
                    Ticket Code: <span className="font-mono font-semibold">{reg.ticket_code}</span>
                  </p>
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => downloadQRCode(reg)}
                  className="btn btn-sm btn-secondary flex items-center gap-2 flex-1"
                  disabled={!reg.qr_code}
                >
                  <Download className="w-4 h-4" />
                  Download QR
                </button>
                <button 
                  onClick={() => printTicket(reg)}
                  className="btn btn-sm btn-secondary flex items-center gap-2 flex-1"
                >
                  <QrCode className="w-4 h-4" />
                  Print Ticket
                </button>
              </div>

              <Link 
                to={`/events/${reg.event_id}`}
                className="btn btn-primary w-full mt-2"
              >
                View Event Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
