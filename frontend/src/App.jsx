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
import ManageAttendancePage from './pages/ManageAttendance.jsx';
import ManageUsersPage from './pages/ManageUsers.jsx';
import NotFoundPage from './pages/NotFound.jsx';
import { useAuthStore } from './store/authStore.js';

function App() {
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

          <Route element={<ProtectedRoute allowedRoles={['STUDENT', 'ORGANIZER', 'ADMIN']} />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['ORGANIZER', 'ADMIN']} />}>
            <Route path="admin" element={<AdminDashboardPage />} />
            <Route path="admin/events/new" element={<CreateEventPage />} />
            <Route path="admin/events/:id/edit" element={<CreateEventPage isEditMode={true} />} />
            <Route path="admin/events/:id/attendance" element={<ManageAttendancePage />} />
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
export default App;

function ProtectedRoute({ allowedRoles }) {
  const { isLoggedIn, user } = useAuthStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/**
 * Toast Notification Component
 * This is a simple global toast system.
 */
function Toast() {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Listen for a global custom event 'show-toast'
    const handleShowToast = (e) => {
      setMessage(e.detail);
      setIsVisible(true);
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    };

    window.addEventListener('show-toast', handleShowToast);
    return () => window.removeEventListener('show-toast', handleShowToast);
  }, []);

  return (
    <div
      className={`fixed bottom-10 right-10 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-2xl transition-all duration-300 ${isVisible ? 'translate-x-0' : 'translate-x-[120%]'
        }`}
      role="alert"
    >
      <span>{message}</span>
    </div>
  );
}

// Global function to trigger the toast
function showToast(message) {
  window.dispatchEvent(new CustomEvent('show-toast', { detail: message }));
}

/**
 * Reusable Event Card
 */
function EventCard({ event }) {
  return (
    <div className="event-card">
      <img
        src={event.image_url || `https://placehold.co/400x250/1f2937/a3a3a3?text=${event.title.split(' ').join('+')}`}
        alt={event.title}
        className="w-full h-48 object-cover rounded-t-2xl"
        onError={(e) => { e.target.src = 'https://placehold.co/400x250/1f2937/a3a3a3?text=Image+Not+Found'; }}
      />
      <div className="p-6">
        <span className="text-sm font-medium text-emerald-400">
          {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <h3 className="text-xl font-semibold my-2 truncate">{event.title}</h3>
        <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden text-ellipsis">
          {event.description.substring(0, 100)}...
        </p>
        <Link to={`/events/${event.id}`} className="font-medium text-amber-400 hover:text-amber-300">
          View Details <ArrowLeft className="inline-block w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Reusable Page Hero Component
 */
function PageHero({ title, imageUrl, fallbackText }) {
  const placeholder = `https://placehold.co/1200x400/1f2937/a3a3a3?text=${fallbackText.split(' ').join('+')}`;
  return (
    <div className="page-hero">
      <img
        src={imageUrl || placeholder}
        alt={title}
        className="page-hero-img"
        onError={(e) => { e.target.src = placeholder; }}
      />
      <div className="page-hero-overlay">
        <h1 className="text-5xl md:text-6xl font-extrabold">{title}</h1>
      </div>
    </div>
  );
}

/**
 * FAQ Item Component
 */
function FaqItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="faq-item panel-glass rounded-xl overflow-hidden">
      <button
        className="faq-question w-full flex justify-between items-center text-left p-6"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-xl font-semibold">{question}</span>
        <ChevronDown className={`w-6 h-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`faq-answer p-6 pt-0 text-gray-300 ${isOpen ? 'block' : 'hidden'}`}>
        <p>{answer}</p>
      </div>
    </div>
  );
}


// --- Page Components ---

/**
 * Home Page
 */
function HomePage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);

  useEffect(() => {
    // Fetch featured events (e.g., first 3 upcoming)
    const fetchEvents = async () => {
      try {
        // In a real app, you might have a specific /events/featured endpoint
        const { data } = await apiClient.get('/events?limit=3');
        setFeaturedEvents(data.slice(0, 3));
      } catch (error) {
        console.error("Failed to fetch featured events", error);
      }
    };
    fetchEvents();
  }, []);

  return (
    <section id="page-home">
      <div className="flex flex-col md:flex-row items-center justify-between gap-12 min-h-[70vh]">
        <div className="md:w-1/2 text-center md:text-left z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Experience <span className="text-emerald-400">Campus Life</span>
            <br />Like Never Before with <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-amber-400">EventNest</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-lg mx-auto md:mx-0">
            Discover, join, and manage all your college events in one place. From tech fests to cultural nights, don't miss a single moment.
          </p>
          <div className="flex justify-center md:justify-start gap-4">
            <Link to="/events" className="btn btn-primary text-lg">
              <Search className="inline-block mr-2 w-5 h-5" />
              Discover Events
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 relative h-80 md:h-[500px] flex items-center justify-center -mr-6 md:mr-0">
          <div className="abstract-graphic">
            <div className="graphic-element"></div>
            <div className="graphic-element"></div>
            <div className="graphic-element"></div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <h2 className="text-3xl font-bold text-center mb-12">Featured Events</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredEvents.length > 0 ? (
            featuredEvents.map(event => <EventCard key={event.id} event={event} />)
          ) : (
            <p className="text-center col-span-3 text-gray-400">No featured events right now. Check back soon!</p>
          )}
        </div>
      </div>
      {/* Testimonials and CTA sections from original HTML can be added here */}
    </section>
  );
}

/**
 * Events Page (Browse/Search)
 */
function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = {};
      if (category !== 'all') params.category = category;
      if (searchTerm) params.search = searchTerm;

      const { data } = await apiClient.get('/events', { params });
      setEvents(data);
    } catch (error) {
      console.error("Failed to fetch events", error);
      showToast('Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []); // Initial fetch

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  return (
    <section id="page-events">
      <PageHero
        title="All Events"
        imageUrl="https://images.unsplash.com/photo-1519452575417-564c1401ecc0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="All Events"
      />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">Browse all the exciting events happening on campus.</p>
      
      <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center panel-glass p-6 rounded-2xl">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search events..."
            className="form-input pl-12"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        </div>
        <select
          className="form-input w-full md:w-auto"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="tech">Tech</option>
          <option value="cultural">Cultural</option>
          <option value="sports">Sports</option>
          <option value="academic">Academic</option>
        </select>
        <button type="submit" className="btn btn-primary w-full md:w-auto">
          Search
        </button>
      </form>

      {loading ? (
        <p className="text-center text-lg">Loading events...</p>
      ) : (
        <>
          {events.length === 0 ? (
            <div className="text-center text-gray-400 text-lg py-12">
              <TicketX className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-2xl font-semibold mb-2">No Events Found</h3>
              <p>Try adjusting your search terms or category.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map(event => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </>
      )}
    </section>
  );
}

/**
 * Event Detail Page
 */
function EventDetailPage() {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        const { data } = await apiClient.get(`/events/${id}`);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event", error);
        showToast('Event not found.');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id, navigate]);

  const handleRegister = async () => {
    if (!isLoggedIn) {
      showToast('Please log in to register for events.');
      navigate('/login', { state: { from: `/events/${id}` } }); // Redirect to login
      return;
    }

    try {
      await apiClient.post(`/events/${id}/register`);
      showToast(`Successfully registered for ${event.title}!`);
    } catch (error) {
      console.error("Registration failed", error);
      showToast(error.response?.data?.message || 'Registration failed.');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading event details...</p>;
  if (!event) return null; // Should be redirected, but just in case

  const placeholder = `https://placehold.co/600x300/374151/f3f4f6?text=${event.title.split(' ').join('+')}`;
  
  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <img
        src={event.image_url || placeholder}
        alt={event.title}
        className="w-full h-64 md:h-96 object-cover rounded-lg mb-8"
        onError={(e) => { e.target.src = placeholder; }}
      />
      
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{event.title}</h1>
      
      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 text-lg">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-400" />
          <span>{new Date(event.date).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-emerald-400" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-emerald-400" />
          <span className="capitalize">{event.category}</span>
        </div>
      </div>

      <h3 className="text-2xl font-semibold mb-4">About this event</h3>
      <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
        {event.description}
      </p>

      <h3 className="text-2xl font-semibold mb-4">Event Host</h3>
      <div className="flex items-center gap-4 mb-8">
        <img
          src={`https://placehold.co/50x50/10b981/ffffff?text=${event.organizer.name.substring(0, 1)}`}
          alt={event.organizer.name}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <h4 className="text-lg font-semibold">{event.organizer.name}</h4>
          <p className="text-gray-400">Event Organizer</p>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6 border-t border-gray-700">
        <Link to="/events" className="btn btn-secondary">Back to Events</Link>
        {user?.role === 'STUDENT' && (
          <button onClick={handleRegister} className="btn btn-primary text-lg">
            <Ticket className="inline-block mr-2 w-5 h-5" />
            Register for this Event
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Login/Signup Page
 */
function LoginPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginView) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      showToast(isLoginView ? 'Login successful!' : 'Account created!');
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      showToast(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <section id="page-login">
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="panel-glass max-w-4xl w-full grid md:grid-cols-2 rounded-2xl overflow-hidden">
          <div className="hidden md:flex flex-col items-center justify-center text-center p-12 bg-gray-900/50">
            <div className="relative w-48 h-48 mb-6">
              <div className="abstract-graphic h-48">
                <div className="graphic-element"></div>
                <div className="graphic-element"></div>
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-4">Join the Nest</h2>
            <p className="text-gray-300">
              Sign up to unlock your campus experience. Register for events, get updates, and connect.
            </p>
          </div>
          <div className="p-8 md:p-12">
            <div className="flex mb-8 border-b border-gray-600">
              <button
                onClick={() => setIsLoginView(true)}
                className={`flex-1 py-3 text-lg font-semibold border-b-2 ${isLoginView ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400'}`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLoginView(false)}
                className={`flex-1 py-3 text-lg font-semibold border-b-2 ${!isLoginView ? 'border-emerald-500 text-white' : 'border-transparent text-gray-400'}`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <h2 className="text-3xl font-bold text-white mb-8">
                {isLoginView ? 'Welcome Back!' : 'Create Account'}
              </h2>
              {error && <p className="text-red-400 mb-4">{error}</p>}
              <div className="space-y-6">
                {!isLoginView && (
                  <div>
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Your Name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                )}
                <div>
                  <label className="form-label">College Email</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="you@college.edu"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary w-full !mt-8 py-3 text-lg" disabled={loading}>
                  {loading ? 'Processing...' : (
                    isLoginView ? (
                      <><LogIn className="inline-block mr-2 w-5 h-5" /> Login</>
                    ) : (
                      <><UserPlus className="inline-block mr-2 w-5 h-5" /> Create Account</>
                    )
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * User Dashboard Page
 */
function DashboardPage() {
  const { user } = useAuthStore();
  const [registrations, setRegistrations] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [regsRes, certsRes] = await Promise.all([
          apiClient.get('/users/me/registrations'),
          apiClient.get('/users/me/certificates')
        ]);
        setRegistrations(regsRes.data);
        setCertificates(certsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
        showToast('Could not load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  if (loading) return <p className="text-center text-lg">Loading dashboard...</p>;
  
  return (
    <section id="page-dashboard">
      <h2 className="text-4xl font-bold mb-12">My Dashboard</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 panel-glass p-8 text-center h-fit">
          <img
            src={`https://placehold.co/150x150/10b981/ffffff?text=${user?.name.substring(0, 1)}`}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-6 border-4 border-emerald-500"
          />
          <h3 className="text-2xl font-semibold">{user?.name}</h3>
          <p className="text-emerald-400 mb-4">{user?.email}</p>
          <button className="btn btn-secondary w-full" onClick={() => showToast('Edit Profile: Feature coming soon!')}>
            Edit Profile
          </button>
        </div>
        
        <div className="md:col-span-2 space-y-8">
          {/* Registered Events */}
          <div className="panel-glass p-8">
            <h3 className="text-2xl font-semibold mb-6">My Registered Events</h3>
            {registrations.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <TicketX className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h4 className="text-xl font-semibold mb-2">No Events Yet</h4>
                <p className="mb-6">You haven't registered for any events.</p>
                <Link to="/events" className="btn btn-primary">Find Events</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map(reg => (
                  <div key={reg.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold">{reg.event.title}</h4>
                      <p className="text-sm text-gray-400">
                        {new Date(reg.event.date).toLocaleDateString()} - {reg.attended ? 'Attended' : 'Registered'}
                      </p>
                    </div>
                    <Link to={`/events/${reg.event.id}`} className="btn btn-secondary btn-sm">View</Link>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* My Certificates */}
          <div className="panel-glass p-8">
            <h3 className="text-2xl font-semibold mb-6">My Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-gray-400">You haven't earned any certificates yet. Attend events to get them!</p>
            ) : (
              <div className="space-y-4">
                {certificates.map(cert => (
                  <div key={cert.id} className="flex justify-between items-center bg-gray-700/50 p-4 rounded-lg">
                    <div>
                      <h4 className="font-semibold">Certificate for {cert.event.title}</h4>
                      <p className="text-sm text-gray-400">Issued: {new Date(cert.issued_at).toLocaleDateString()}</p>
                    </div>
                    <a href={cert.certificate_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">Download</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Admin Dashboard Page
 */
function AdminDashboardPage() {
  const { user } = useAuthStore();
  return (
    <section className="panel-glass p-8">
      <h2 className="text-3xl font-bold mb-6 text-amber-400">
        <ShieldCheck className="inline-block w-8 h-8 mr-2" />
        Admin Panel
      </h2>
      <p className="text-lg mb-8">Welcome, {user?.name}. Manage campus events and users.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/events/new" className="admin-card">
          <Plus className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold">Create New Event</h3>
        </Link>
        <Link to="/admin/events/new" className="admin-card"> {/* TODO: Make a page for this */}
          <CalendarSearch className="w-12 h-12 mb-4" />
          <h3 className="text-xl font-semibold">Manage My Events</h3>
        </Link>
        {user?.role === 'ADMIN' && (
          <Link to="/admin/users" className="admin-card">
            <Users className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold">Manage Users</h3>
          </Link>
        )}
      </div>
    </section>
  );
}

/**
 * Admin: Create/Edit Event Page
 */
function CreateEventPage({ isEditMode = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    category: 'tech',
    image_url: ''
  });
  const [loading, setLoading] = useState(false);

  // TODO: Add logic to fetch event data if `isEditMode` is true and `id` exists

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // TODO: Add PUT request logic for `isEditMode`
      await apiClient.post('/events', {
        ...formData,
        date: new Date(formData.date).toISOString(), // Ensure correct date format
      });
      showToast(isEditMode ? 'Event updated!' : 'Event created!');
      navigate('/admin'); // Redirect to admin dash
    } catch (error) {
      console.error("Failed to create/update event", error);
      showToast(error.response?.data?.message || 'Failed to save event.');
    } finally {
      setLoading(false);
    }
  };

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
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Event')}
          </button>
        </div>
      </form>
    </section>
  );
}

/**
 * Admin: Manage Attendance Page
 */
function ManageAttendancePage() {
  const { id } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch event details and registration list
      const [eventRes, regsRes] = await Promise.all([
        apiClient.get(`/events/${id}`),
        apiClient.get(`/events/${id}/registrations`)
      ]);
      setEvent(eventRes.data);
      setRegistrations(regsRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      showToast('Could not load attendance data.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchData();
  }, [id]);

  const handleMarkAttended = async (registrationId) => {
    try {
      await apiClient.post(`/registrations/${registrationId}/attend`);
      showToast('Attendance marked!');
      // Update local state to reflect change
      setRegistrations(prev =>
        prev.map(reg =>
          reg.id === registrationId ? { ...reg, attended: true } : reg
        )
      );
    } catch (error) {
      console.error("Failed to mark attendance", error);
      showToast('Failed to mark attendance.');
    }
  };
  
  const handleGenerateCertificates = async () => {
    try {
      const { data } = await apiClient.post(`/events/${id}/generate-certificates`);
      showToast(data.message);
    } catch(error) {
      console.error("Failed to generate certificates", error);
      showToast('Failed to generate certificates.');
    }
  };

  if (loading) return <p className="text-center text-lg">Loading attendance...</p>;

  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <h2 className="text-3xl font-bold mb-4">Manage Attendance</h2>
      <p className="text-xl text-gray-300 mb-8">For: {event?.title}</p>
      
      <div className="space-y-4">
        {registrations.length === 0 ? (
          <p className="text-gray-400">No one has registered for this event yet.</p>
        ) : (
          registrations.map(reg => (
            <div key={reg.id} className="flex flex-col sm:flex-row justify-between sm:items-center bg-gray-700/50 p-4 rounded-lg">
              <div>
                <h4 className="font-semibold text-lg">{reg.user.name}</h4>
                <p className="text-sm text-gray-400">{reg.user.email}</p>
              </div>
              <button
                onClick={() => handleMarkAttended(reg.id)}
                className={`btn btn-sm ${reg.attended ? 'btn-secondary' : 'btn-primary'}`}
                disabled={reg.attended}
              >
                {reg.attended ? <><Check className="w-4 h-4 mr-1"/> Attended</> : 'Mark Attended'}
              </button>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-700">
        <button className="btn btn-primary" onClick={handleGenerateCertificates}>
          Generate Certificates for All Attended
        </button>
      </div>
    </section>
  );
}

/**
 * Admin: Manage Users Page
 */
function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get('/admin/users');
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      showToast('Could not load users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleRoleChange = async (userId, newRole) => {
    try {
      await apiClient.put(`/admin/users/${userId}/role`, { role: newRole });
      showToast('User role updated!');
      // Update local state
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Failed to update role", error);
      showToast('Failed to update role.');
    }
  };
  
  if (loading) return <p className="text-center text-lg">Loading users...</p>;

  return (
    <section className="max-w-4xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
      <h2 className="text-3xl font-bold mb-8">Manage Users</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-600">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-b border-gray-700/50">
                <td className="p-4">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <select
                    className="form-input bg-gray-800"
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="STUDENT">STUDENT</option>
                    <option value="ORGANIZER">ORGANIZER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// --- Static Pages (About, News, FAQ, Contact) ---
// These are filled with placeholder content from your HTML.

function NewsPage() {
  return (
    <section id="page-news">
      <PageHero
        title="News & Announcements"
        imageUrl="https://images.unsplash.com/photo-1457305237443-44c3d5a30b89?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="Campus News"
      />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">The latest updates from around the campus.</p>
      
      <div className="panel-glass p-8 md:p-12 rounded-2xl md:flex gap-8 items-center mb-12">
        <img src="https://img.jakpost.net/c/2017/04/28/2017_04_28_25988_1493349703._large.jpg" alt="Basketball Finals" className="w-full md:w-1/3 h-64 object-cover rounded-lg mb-6 md:mb-0" />
        <div className="flex-1">
          <span className="text-sm font-medium text-amber-400">CAMPUS UPDATE</span>
          <h2 className="text-3xl font-bold my-3">Varsity Team Heads to the Finals!</h2>
          <p className="text-gray-300 mb-6">
            Get ready to cheer! Our own EventNest Eagles have secured their spot in the national varsity basketball finals.
          </p>
          <Link to="/events" className="btn btn-secondary">View Event Details</Link>
        </div>
      </div>
    </section>
  );
}

function FaqPage() {
  const faqs = [
    { q: "How do I register for an event?", a: "It's simple! First, make sure you are logged in. Then, navigate to the event you're interested in, click 'View Details', and hit the 'Register' button." },
    { q: "Can I see all the events I've registered for?", a: "Yes! After logging in, just navigate to your 'Dashboard' page. The 'My Registered Events' section will show all your upcoming events." },
    { q: "Who can create an event?", a: "Currently, only users with the 'ORGANIZER' or 'ADMIN' role can create events. If your club wants to post an event, please contact an administrator." },
    { q: "How do I get a certificate?", a: "After you register for an event, the event organizer must mark you as 'attended'. Once they do, they can generate certificates, which will then appear in the 'My Certificates' section of your dashboard." }
  ];

  return (
    <section id="page-faq">
      <PageHero
        title="How Can We Help?"
        imageUrl="https://images.unsplash.com/photo-1559863013-5f0d366a7f0e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="FAQ"
      />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">Find answers to common questions about EventNest.</p>

      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, i) => (
          <FaqItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </section>
  );
}

function AboutPage() {
  const teamMembers = [
    { name: 'Arshbir Singh', role: 'Project Lead & Content', image: 'https://img.freepik.com/premium-photo/indian-cartoon-character-with-turban-blue-turban-vector-illustration_994418-97989.jpg' },
    { name: 'Abhay', role: 'Functionality & Interactivity', image: 'https://imgcdn.stablediffusionweb.com/2024/9/8/04fdb256-b489-4571-972c-249a0cb35019.jpg' },
    { name: 'Yogesh', role: 'Design & Styling', image: 'https://imgcdn.stablediffusionweb.com/2024/4/16/7263bda6-c6d4-46f5-90d7-9a659e42bce1.jpg' },
    { name: 'Yuvraj', role: 'Page Structure & Testing', image: 'https://imgcdn.stablediffusionweb.com/2024/8/7/bf3c1151-ba1c-4178-8c3c-747594bd27e3.jpg' }
  ];
  
  return (
    <section id="page-about">
      <PageHero
        title="About EventNest"
        imageUrl="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="About Us"
      />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">We're students, just like you, passionate about building community.</p>
      
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="panel-glass p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              Our mission is to bridge the gap between event organizers and the student body. We aim to foster a more engaged, interconnected, and vibrant campus community.
            </p>
          </div>
          <div className="panel-glass p-8 md:p-12 rounded-2xl">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              Born from a simple idea in a dorm room, EventNest was created by students who were tired of missing out on amazing campus events. So, we built this.
            </p>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-center mb-12">Meet the Team</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map(member => (
            <div key={member.name} className="panel-glass p-6 text-center rounded-2xl">
              <img src={member.image} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-gray-700 object-cover" />
              <h4 className="text-xl font-semibold text-white">{member.name}</h4>
              <p className="text-emerald-400">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    showToast('Message Sent! (Demo)');
    e.target.reset();
  };
  
  return (
    <section id="page-contact">
      <PageHero
        title="Get In Touch"
        imageUrl="https://images.unsplash.com/photo-1596524430615-b46475ddff6e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
        fallbackText="Contact Us"
      />
      <p className="text-lg text-gray-400 text-center mb-12 -mt-4 relative z-10">Have questions or feedback? We'd love to hear from you.</p>

      <div className="max-w-5xl mx-auto panel-glass p-8 md:p-12 rounded-2xl">
        <div className="grid md:grid-cols-2 gap-12">
          <form onSubmit={handleSubmit}>
            <h3 className="text-2xl font-semibold mb-6">Send us a message</h3>
            <div className="space-y-6">
              <div>
                <label className="form-label">Name</label>
                <input type="text" className="form-input" placeholder="Your Name" required />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="form-input" placeholder="you@college.edu" required />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea rows="5" className="form-input" placeholder="Your message..." required></textarea>
              </div>
              <button type="submit" className="btn btn-primary w-full py-3 text-lg">
                <Send className="inline-block mr-2 w-5 h-5" />
                Send Message
              </button>
            </div>
          </form>
          
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">Contact Information</h3>
            <div className="flex items-start gap-4">
              <MapPin className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold">Our Office</h4>
                <p className="text-gray-300">Chitkara University, Punjab</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="w-6 h-6 text-emerald-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-lg font-semibold">Email Us</h4>
                <p className="text-gray-300">support@eventnest.demo</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NotFoundPage() {
  return (
    <section className="text-center py-24">
      <h1 className="text-8xl font-extrabold text-emerald-500">404</h1>
      <h2 className="text-4xl font-bold my-4">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-8">Sorry, we couldn't find the page you're looking for.</p>
      <Link to="/" className="btn btn-primary text-lg">
        Go Back Home
      </Link>
    </section>
  )
}
