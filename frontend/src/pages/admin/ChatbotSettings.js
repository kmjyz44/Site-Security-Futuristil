import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Bot, Palette, MessageCircle } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function ChatbotSettings() {
  const [settings, setSettings] = useState({
    enabled: false,
    widget_color: '#00e1ff',
    welcome_message: 'Вітаємо! Чим можемо допомогти?',
    position: 'bottom-right'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/chatbot-settings`, getAuthHeaders());
      setSettings(data);
    } catch (error) {
      console.error('Error loading chatbot settings:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API}/admin/chatbot-settings`, settings, getAuthHeaders());
      setMessage('Settings saved!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error збереження');
      console.error('Error saving chatbot settings:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
            Chatbot Settings
          </h1>
          <p className="text-white/60 font-rajdhani">Prepare place for chatbot integration</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-neon flex items-center gap-2"
          data-testid="save-chatbot-settings"
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
        {/* Enable Toggle */}
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
          <div className="flex items-center gap-3">
            <Bot className="w-6 h-6 text-neon-cyan" />
            <div>
              <h3 className="font-semibold text-white font-orbitron">Enable Chatbot</h3>
              <p className="text-sm text-white/60 font-rajdhani">Enable/Disable widget</p>
            </div>
          </div>
          <button
            onClick={() => setSettings({ ...settings, enabled: !settings.enabled })}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              settings.enabled ? 'bg-neon-cyan' : 'bg-white/20'
            }`}
            data-testid="chatbot-toggle"
          >
            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
              settings.enabled ? 'translate-x-8' : 'translate-x-0'
            }`} />
          </button>
        </div>

        {/* Color Picker */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3 font-rajdhani">
            <Palette className="w-5 h-5 text-neon-cyan" />
            Widget Color
          </label>
          <div className="flex items-center gap-4">
            <input
              type="color"
              value={settings.widget_color}
              onChange={(e) => setSettings({ ...settings, widget_color: e.target.value })}
              className="w-20 h-12 rounded-lg cursor-pointer"
              data-testid="widget-color"
            />
            <input
              type="text"
              value={settings.widget_color}
              onChange={(e) => setSettings({ ...settings, widget_color: e.target.value })}
              className="flex-1 px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white font-mono"
            />
          </div>
        </div>

        {/* Welcome Message */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3 font-rajdhani">
            <MessageCircle className="w-5 h-5 text-neon-cyan" />
            Welcome Message
          </label>
          <textarea
            value={settings.welcome_message}
            onChange={(e) => setSettings({ ...settings, welcome_message: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none"
            placeholder="Enter welcome message..."
            data-testid="welcome-message"
          />
        </div>

        {/* Position */}
        <div>
          <label className="block text-white font-semibold mb-3 font-rajdhani">
            Widget Position
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setSettings({ ...settings, position: 'bottom-right' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.position === 'bottom-right'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              data-testid="position-bottom-right"
            >
              <div className="font-semibold font-rajdhani">Bottom Right</div>
              <div className="text-xs mt-1 opacity-70">bottom-right</div>
            </button>
            <button
              onClick={() => setSettings({ ...settings, position: 'bottom-left' })}
              className={`p-4 rounded-lg border-2 transition-all ${
                settings.position === 'bottom-left'
                  ? 'border-neon-cyan bg-neon-cyan/10 text-neon-cyan'
                  : 'border-white/20 bg-white/5 text-white/70 hover:bg-white/10'
              }`}
              data-testid="position-bottom-left"
            >
              <div className="font-semibold font-rajdhani">Bottom Left</div>
              <div className="text-xs mt-1 opacity-70">bottom-left</div>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 bg-neon-purple/10 border border-neon-purple/30 rounded-lg">
          <h4 className="font-semibold text-neon-purple mb-2 font-orbitron flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Information
          </h4>
          <p className="text-sm text-white/70 font-rajdhani">
            This page is prepared for future chatbot integration. 
            You can configure basic parameters that will be used after connecting the chatbot.
          </p>
        </div>

        {/* Preview */}
        {settings.enabled && (
          <div className="p-6 bg-white/5 rounded-lg border border-white/10">
            <h4 className="font-semibold text-white mb-4 font-orbitron">Preview</h4>
            <div className="relative h-48 bg-[hsl(220,25%,5%)] rounded-lg overflow-hidden">
              <div
                className={`absolute ${settings.position === 'bottom-right' ? 'bottom-4 right-4' : 'bottom-4 left-4'}`}
                style={{ backgroundColor: settings.widget_color }}
              >
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
