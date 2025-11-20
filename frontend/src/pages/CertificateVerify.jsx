import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CheckCircle, XCircle, Award, Calendar, MapPin, User, Building } from 'lucide-react';
import { apiClient } from '../lib/api.js';

export default function CertificateVerify() {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);

  useEffect(() => {
    verifyCertificate();
  }, [id]);

  const verifyCertificate = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`/certificates/${id}/verify`);
      if (response.data.valid) {
        setValid(true);
        setCertificate(response.data.certificate);
      } else {
        setValid(false);
      }
    } catch (error) {
      setValid(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mb-4"></div>
          <p className="text-xl text-gray-300">Verifying certificate...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
        <div className="max-w-2xl w-full panel-glass p-12 text-center">
          <XCircle className="w-24 h-24 mx-auto mb-6 text-red-500" />
          <h1 className="text-4xl font-bold mb-4 text-white">Invalid Certificate</h1>
          <p className="text-xl text-gray-400 mb-8">
            This certificate could not be verified. It may have been revoked or does not exist.
          </p>
          <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-400">
              Certificate ID: <code className="font-mono">{id}</code>
            </p>
          </div>
          <p className="text-gray-500">
            If you believe this is an error, please contact the event organizer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Verification Badge */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 mx-auto mb-4 text-emerald-500" />
          <h1 className="text-5xl font-bold mb-2 text-white">Certificate Verified</h1>
          <p className="text-xl text-emerald-400">This certificate is authentic and valid</p>
        </div>

        {/* Certificate Details */}
        <div className="panel-glass p-10">
          <div className="text-center mb-8">
            <Award className="w-16 h-16 mx-auto mb-4 text-emerald-500" />
            <h2 className="text-3xl font-bold text-white mb-2">Certificate of Participation</h2>
            <p className="text-gray-400">Official EventNest Certificate</p>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-emerald-500 my-8"></div>

          {/* Recipient Information */}
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
              <User className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Awarded To</p>
                <p className="text-2xl font-bold text-white">{certificate.recipientName}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
              <Award className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Event</p>
                <p className="text-xl font-semibold text-white">{certificate.eventTitle}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
                <Calendar className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Event Date</p>
                  <p className="text-lg font-semibold text-white">
                    {new Date(certificate.eventDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
                <MapPin className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-lg font-semibold text-white">{certificate.eventLocation}</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-lg">
              <Building className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-gray-400 mb-1">Organized By</p>
                <p className="text-lg font-semibold text-white">{certificate.organizer}</p>
              </div>
            </div>

            <div className="p-4 bg-emerald-500/10 border border-emerald-500 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Issued On</p>
                  <p className="text-lg font-semibold text-emerald-400">
                    {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400 mb-1">Certificate ID</p>
                  <p className="text-xs font-mono text-emerald-400">{certificate.id}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Authenticity Notice */}
          <div className="mt-8 p-6 bg-blue-500/10 border border-blue-500 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-400 mb-2">Authenticity Verified</h3>
                <p className="text-sm text-gray-300">
                  This certificate has been verified against EventNest's records and is confirmed to be authentic. 
                  The recipient successfully participated in the stated event and this certificate was officially issued by EventNest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Share Options */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 mb-4">Share this verification:</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Verification link copied to clipboard!');
              }}
              className="btn btn-secondary"
            >
              Copy Link
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 EventNest. All rights reserved.</p>
          <p className="mt-2">This verification page is publicly accessible and can be shared.</p>
        </div>
      </div>
    </div>
  );
}
