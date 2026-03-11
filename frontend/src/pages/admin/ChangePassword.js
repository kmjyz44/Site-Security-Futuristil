import { useState } from 'react';
import axios from 'axios';
import { Lock, Save } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function ChangePassword() {
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    // Validation
    if (passwords.newPassword !== passwords.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match!' });
      return;
    }

    if (passwords.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters!' });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('old_password', passwords.oldPassword);
      formData.append('new_password', passwords.newPassword);

      await axios.post(`${API}/admin/change-password`, formData, getAuthHeaders());
      
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        setMessage({ type: '', text: '' });
      }, 3000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.detail || 'Error changing password'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
          Change Password
        </h1>
        <p className="text-white/60 font-rajdhani">Update your admin password</p>
      </div>

      <div className="glass-card p-6 max-w-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              Current Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
              <input
                type="password"
                required
                value={passwords.oldPassword}
                onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
              <input
                type="password"
                required
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
                placeholder="Enter new password"
                minLength={6}
              />
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neon-cyan/50" />
              <input
                type="password"
                required
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
                placeholder="Confirm new password"
                minLength={6}
              />
            </div>
          </div>

          {message.text && (
            <div className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-neon flex items-center justify-center gap-2"
          >
            {loading ? 'Changing...' : (
              <>
                <Save className="w-5 h-5" />
                Change Password
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
          <h4 className="font-semibold text-neon-cyan mb-2 font-orbitron text-sm">
            Password Requirements:
          </h4>
          <ul className="text-sm text-white/70 font-rajdhani space-y-1">
            <li>• Minimum 6 characters</li>
            <li>• Use a strong, unique password</li>
            <li>• Don't share your password</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
