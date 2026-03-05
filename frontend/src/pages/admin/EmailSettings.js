import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Mail } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function EmailSettings() {
  const [settings, setSettings] = useState({
    provider: 'resend',
    api_key: '',
    from_email: '',
    to_email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/email-settings`, getAuthHeaders());
      setSettings(data);
    } catch (error) {
      console.error('Error loading email settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API}/admin/email-settings`, settings, getAuthHeaders());
      setMessage('Settings saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error збереження');
      console.error('Error saving email settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
            Email Settings
          </h1>
          <p className="text-white/60 font-rajdhani">Configure message sending</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-neon flex items-center gap-2"
          data-testid="save-email-settings"
        >
          <Save className="w-5 h-5" />
          Зберегти
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('збережено')
            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-white font-semibold mb-3 font-rajdhani">
            Email Provider
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setSettings({ ...settings, provider: 'resend' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.provider === 'resend'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              data-testid="provider-resend"
            >
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold font-orbitron">Resend</div>
              <div className="text-sm mt-1 opacity-70">resend.com</div>
            </button>
            <button
              onClick={() => setSettings({ ...settings, provider: 'sendgrid' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.provider === 'sendgrid'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              data-testid="provider-sendgrid"
            >
              <Mail className="w-8 h-8 mx-auto mb-2" />
              <div className="font-bold font-orbitron">SendGrid</div>
              <div className="text-sm mt-1 opacity-70">sendgrid.com</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2 font-rajdhani">
            API Key
          </label>
          <input
            type="text"
            value={settings.api_key}
            onChange={(e) => setSettings({ ...settings, api_key: e.target.value })}
            placeholder="Введіть API ключ {settings.provider}"
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white font-mono"
            data-testid="api-key"
          />
          <p className="text-xs text-white/40 mt-2 font-rajdhani">
            {settings.provider === 'resend' && 'Get key at resend.com/api-keys'}
            {settings.provider === 'sendgrid' && 'Get key at app.sendgrid.com/settings/api_keys'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              From (Sender)
            </label>
            <input
              type="email"
              value={settings.from_email}
              onChange={(e) => setSettings({ ...settings, from_email: e.target.value })}
              placeholder="noreply@yourdomain.com"
              className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              data-testid="from-email"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              To (Recipient)
            </label>
            <input
              type="email"
              value={settings.to_email}
              onChange={(e) => setSettings({ ...settings, to_email: e.target.value })}
              placeholder="admin@yourdomain.com"
              className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              data-testid="to-email"
            />
          </div>
        </div>

        <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
          <h4 className="font-semibold text-neon-cyan mb-2 font-orbitron">Instructions:</h4>
          <ul className="space-y-2 text-sm text-white/70 font-rajdhani">
            <li>1. Choose provider (Resend or SendGrid)</li>
            <li>2. Create account on provider's website</li>
            <li>3. Get API key</li>
            <li>4. Specify sender and recipient email</li>
            <li>5. Save settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
