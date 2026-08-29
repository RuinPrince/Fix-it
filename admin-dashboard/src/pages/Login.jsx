// ============================================
// Fix It Admin — Login Page
// ============================================
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../store/store';
import toast from 'react-hot-toast';
import './pages.css';

export default function Login() {
  const [email, setEmail] = useState('admin@fixit.gov.in');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      toast.error(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-logo">🔧</div>
          <h1>Fix It</h1>
          <p>Smart Civic Issue Reporting Platform</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" style={{ color: '#94a3b8' }}>Email Address</label>
            <input type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@fixit.gov.in" required />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ color: '#94a3b8' }}>Password</label>
            <input type="password" className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" required />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? '⏳ Signing in...' : 'Sign In to Dashboard'}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#64748b', marginTop: '0.75rem' }}>
            Demo: admin@fixit.gov.in / password123
          </p>
        </form>
      </div>
    </div>
  );
}
