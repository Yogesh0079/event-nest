import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Layout from './layouts/Layout.jsx';
import HomePage from './pages/Home.jsx';
import EventsPage from './pages/Events.jsx';
import EventDetailPage from './pages/EventDetail.jsx';
import NewsPage from './pages/News.jsx';
import FaqPage from './pages/Faq.jsx';
import AboutPage from './pages/About.jsx';
import ContactPage from './pages/Contact.jsx';
import LoginPage from './pages/Login.jsx';
import DashboardPage from './pages/Dashboard.jsx';
import AdminDashboardPage from './pages/AdminDashboard.jsx';
import CreateEventPage from './pages/CreateEvent.jsx';
import ManageEventsPage from './pages/ManageEvents.jsx';
import ManageAttendancePage from './pages/ManageAttendance.jsx';
import ManageUsersPage from './pages/ManageUsers.jsx';
import MyTicketsPage from './pages/MyTickets.jsx';
import QRVerificationPage from './pages/QRVerification.jsx';
import CertificateVerifyPage from './pages/CertificateVerify.jsx';
import NotFoundPage from './pages/NotFound.jsx';
import { useAuthStore } from './store/authStore.js';

function ProtectedRoute({ allowedRoles }) {
  const { isLoggedIn, user } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

export default function Root() {
  const { token, fetchUser } = useAuthStore();
  React.useEffect(() => { if (token) fetchUser(); }, [token, fetchUser]);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="news" element={<NewsPage />} />
          <Route path="faq" element={<FaqPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="verify/:id" element={<CertificateVerifyPage />} />

          <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ORGANIZER', 'ADMIN']} />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="dashboard/tickets" element={<MyTicketsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']} />}>
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/events" element={<ManageEventsPage />} />
            <Route path="admin/events/new" element={<CreateEventPage />} />
            <Route path="admin/events/:id/edit" element={<CreateEventPage isEditMode={true} />} />
            <Route path="admin/events/:id/attendance" element={<ManageAttendancePage />} />
            <Route path="admin/events/:id/qr-verification" element={<QRVerificationPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="admin/users" element={<ManageUsersPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
