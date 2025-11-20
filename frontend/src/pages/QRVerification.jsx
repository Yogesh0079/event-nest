import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { QrCode, CheckCircle, XCircle, UserCheck, Users, TrendingUp, Scan, AlertCircle } from 'lucide-react';
import { apiClient } from '../lib/api.js';
import { showToast } from '../lib/toast.js';

export default function QRVerification() {
  const { id: eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [stats, setStats] = useState(null);
  const [ticketCode, setTicketCode] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [recentCheckins, setRecentCheckins] = useState([]);

  useEffect(() => {
    fetchEventData();
  }, [eventId]);

  const fetchEventData = async () => {
    setLoading(true);
    try {
      const [eventRes, statsRes] = await Promise.all([
        apiClient.get(`/events/${eventId}`),
        apiClient.get(`/events/${eventId}/attendance-stats`)
      ]);
      setEvent(eventRes.data);
      setStats(statsRes.data);
    } catch (error) {
      showToast('Failed to load event data');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyQR = async (e) => {
    e.preventDefault();
    if (!ticketCode.trim()) {
      showToast('Please enter a ticket code');
      return;
    }

    setProcessing(true);
    setVerificationResult(null);

    try {
      // First verify the ticket
      const verifyRes = await apiClient.post(`/events/${eventId}/verify-qr`, {
        ticketCode: ticketCode.trim()
      });

      if (verifyRes.data.valid) {
        setVerificationResult({
          ...verifyRes.data,
          type: 'valid'
        });
      }
    } catch (error) {
      setVerificationResult({
        type: 'invalid',
        message: error.response?.data?.message || 'Invalid ticket code'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckIn = async () => {
    if (!verificationResult || verificationResult.type !== 'valid') return;

    setProcessing(true);
    try {
      const checkInRes = await apiClient.post(`/events/${eventId}/checkin-qr`, {
        ticketCode: ticketCode.trim()
      });

      if (checkInRes.data.success) {
        showToast('✓ Successfully checked in!');
        setRecentCheckins([checkInRes.data.registration, ...recentCheckins.slice(0, 4)]);
        
        // Refresh stats
        const statsRes = await apiClient.get(`/events/${eventId}/attendance-stats`);
        setStats(statsRes.data);
        
        // Clear form
        setTicketCode('');
        setVerificationResult(null);
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to check in';
      showToast(message);
      
      if (error.response?.status === 400) {
        setVerificationResult({
          ...verificationResult,
          alreadyCheckedIn: true,
          message: message
        });
      }
    } finally {
      setProcessing(false);
    }
  };

  const handleScanAnother = () => {
    setTicketCode('');
    setVerificationResult(null);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-400">Loading event data...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h3 className="text-2xl font-semibold mb-2">Event Not Found</h3>
        <p className="text-gray-400">The event you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <section id="page-qr-verification">
      <div className="mb-8">
        <h2 className="text-4xl font-bold mb-2">QR Code Check-in</h2>
        <p className="text-xl text-emerald-400">{event.title}</p>
        <p className="text-gray-400">{new Date(event.date).toLocaleString()}</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="panel-glass p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-blue-400" />
            <p className="text-3xl font-bold">{stats.totalRegistrations}</p>
            <p className="text-sm text-gray-400">Total Registered</p>
          </div>
          <div className="panel-glass p-6 text-center">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
            <p className="text-3xl font-bold">{stats.checkedIn}</p>
            <p className="text-sm text-gray-400">Checked In</p>
          </div>
          <div className="panel-glass p-6 text-center">
            <UserCheck className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-3xl font-bold">{stats.pending}</p>
            <p className="text-sm text-gray-400">Pending</p>
          </div>
          <div className="panel-glass p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-3xl font-bold">{stats.attendanceRate}%</p>
            <p className="text-sm text-gray-400">Attendance Rate</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Scanner Section */}
        <div className="panel-glass p-8">
          <div className="flex items-center gap-3 mb-6">
            <Scan className="w-8 h-8 text-emerald-400" />
            <h3 className="text-2xl font-semibold">Scan Ticket</h3>
          </div>

          <form onSubmit={handleVerifyQR} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Enter Ticket Code or Scan QR
              </label>
              <input
                type="text"
                value={ticketCode}
                onChange={(e) => setTicketCode(e.target.value)}
                placeholder="Enter ticket code..."
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg font-mono"
                autoFocus
                disabled={processing}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full text-lg"
              disabled={processing || !ticketCode.trim()}
            >
              {processing ? 'Verifying...' : 'Verify Ticket'}
            </button>
          </form>

          {/* Verification Result */}
          {verificationResult && (
            <div className={`mt-6 p-6 rounded-lg ${
              verificationResult.type === 'valid' 
                ? 'bg-emerald-500/10 border-2 border-emerald-500' 
                : 'bg-red-500/10 border-2 border-red-500'
            }`}>
              {verificationResult.type === 'valid' ? (
                <>
                  <div className="flex items-start gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-xl font-semibold text-emerald-400 mb-2">Valid Ticket</h4>
                      <div className="space-y-2 text-sm">
                        <p><strong>Name:</strong> {verificationResult.registration.user.name}</p>
                        <p><strong>Email:</strong> {verificationResult.registration.user.email}</p>
                        <p><strong>Registered:</strong> {new Date(verificationResult.registration.registered_at).toLocaleString()}</p>
                        {verificationResult.alreadyCheckedIn && (
                          <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500 rounded">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-5 h-5 text-yellow-400" />
                              <p className="font-semibold text-yellow-400">Already Checked In</p>
                            </div>
                            <p className="text-sm mt-1">
                              Checked in at: {new Date(verificationResult.checkedInAt).toLocaleString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {!verificationResult.alreadyCheckedIn && (
                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={handleCheckIn}
                        className="btn btn-primary flex-1"
                        disabled={processing}
                      >
                        <CheckCircle className="w-5 h-5 inline mr-2" />
                        Check In
                      </button>
                      <button
                        onClick={handleScanAnother}
                        className="btn btn-secondary"
                        disabled={processing}
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {verificationResult.alreadyCheckedIn && (
                    <button
                      onClick={handleScanAnother}
                      className="btn btn-secondary w-full mt-4"
                    >
                      Scan Another
                    </button>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-start gap-3">
                    <XCircle className="w-8 h-8 text-red-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="text-xl font-semibold text-red-400 mb-2">Invalid Ticket</h4>
                      <p className="text-sm">{verificationResult.message}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleScanAnother}
                    className="btn btn-secondary w-full mt-4"
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
            <h4 className="font-semibold text-blue-400 mb-2">💡 Quick Tip</h4>
            <p className="text-sm text-gray-300">
              You can manually type the ticket code or use a barcode scanner to scan QR codes directly.
              The ticket code will be automatically entered.
            </p>
          </div>
        </div>

        {/* Recent Check-ins */}
        <div className="panel-glass p-8">
          <h3 className="text-2xl font-semibold mb-6">Recent Check-ins</h3>
          
          {recentCheckins.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <UserCheck className="w-16 h-16 mx-auto mb-3 text-gray-500" />
              <p>No check-ins yet</p>
              <p className="text-sm mt-1">Recent check-ins will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentCheckins.map((checkin, index) => (
                <div key={checkin.id} className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                    {checkin.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{checkin.user.name}</p>
                    <p className="text-sm text-gray-400">{checkin.user.email}</p>
                  </div>
                  <div className="text-right">
                    <CheckCircle className="w-6 h-6 text-emerald-400 mb-1" />
                    <p className="text-xs text-gray-400">
                      {new Date(checkin.checked_in_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
