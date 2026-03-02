import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Landing from './pages/Landing';
import Gallery from './pages/Gallery';
import Login from './pages/Login';
import Register from './pages/Register';

function AppContent({ user, setUser, loading }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Clean up malformed URLs
  useEffect(() => {
    if (location.pathname.includes('!')) {
      const cleanPath = location.pathname.replace(/!/g, '');
      navigate(cleanPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <Navigate to="/gallery" replace /> : <Landing />} 
      />
      <Route 
        path="/login" 
        element={<Login />} 
      />
      <Route 
        path="/register" 
        element={<Register />} 
      />
      <Route 
        path="/gallery" 
        element={user ? <Gallery user={user} setUser={setUser} /> : <Navigate to="/" replace />} 
      />

    </Routes>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/auth/current-user', {
      credentials: 'include'
    })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not authenticated');
      })
      .then(data => {
        if (data.user) {
          setUser(data.user);
        }
      })
      .catch(err => console.error('Auth check failed:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Router basename="/FinalProject">
      <AppContent user={user} setUser={setUser} loading={loading} />
    </Router>
  );
}

export default App;