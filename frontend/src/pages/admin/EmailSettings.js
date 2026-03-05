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
      setMessage('Налаштування збережено!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Помилка збереження');
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
            Налаштування Email
          </h1>
          <p className="text-white/60 font-rajdhani">Конфігурація відправки повідомлень</p>
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
            Провайдер Email
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
            {settings.provider === 'resend' && 'Отримайте ключ на resend.com/api-keys'}
            {settings.provider === 'sendgrid' && 'Отримайте ключ на app.sendgrid.com/settings/api_keys'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              Від (Відправник)
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
              Кому (Отримувач)
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
          <h4 className="font-semibold text-neon-cyan mb-2 font-orbitron">Інструкція:</h4>
          <ul className="space-y-2 text-sm text-white/70 font-rajdhani">
            <li>1. Оберіть провайдера (Resend або SendGrid)</li>
            <li>2. Створіть акаунт на сайті провайдера</li>
            <li>3. Отримайте API ключ</li>
            <li>4. Вкажіть email відправника та отримувача</li>
            <li>5. Збережіть налаштування</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
