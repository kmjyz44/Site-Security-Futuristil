import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Lock, User } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await axios.post(`${API}/admin/login`, credentials);
      localStorage.setItem('admin_token', data.access_token);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.detail || 'Login error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(220,25%,5%)] flex items-center justify-center p-4">
      <div className="absolute inset-0 grid-pattern opacity-20"></div>
      <div className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"></div>

      <div className="glass-card p-8 w-full max-w-md relative z-10" data-testid="admin-login-form">
        <div className="text-center mb-8">
          <div className="inline-flex p-4 bg-neon-cyan/20 rounded-2xl border border-neon-cyan/40 mb-4">
            <Lock className="w-8 h-8 text-neon-cyan" />
          </div>
          <h1 className="text-3xl font-bold font-orbitron gradient-text">
            Admin Panel
          </h1>
          <p className="text-white/60 mt-2 font-rajdhani">Ввійдіть to manage site</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white/80 font-rajdhani mb-2">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white"
                placeholder="Enter username"
                data-testid="admin-username"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/80 font-rajdhani mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white"
                placeholder="Enter password"
                data-testid="admin-password"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-center" data-testid="admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-neon"
            data-testid="admin-submit"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <a href="/" className="text-neon-cyan/60 hover:text-neon-cyan text-sm font-rajdhani">
            ← Повернутись to website
          </a>
        </div>

        <div className="mt-6 p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-lg">
          <p className="text-xs text-white/50 text-center font-rajdhani">
            Default credentials: admin / admin123
          </p>
        </div>
      </div>
    </div>
  );
}
