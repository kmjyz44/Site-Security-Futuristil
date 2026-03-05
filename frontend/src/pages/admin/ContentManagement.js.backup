import { useState, useEffect } from 'react';
import axios from 'axios';
import { Save, Loader } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function ContentManagement() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/content`, getAuthHeaders());
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      await axios.put(`${API}/admin/content`, content, getAuthHeaders());
      setMessage('Контент успішно збережено!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Помилка збереження');
      console.error('Error saving content:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!content) return <div className="text-white">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
            Керування Контентом
          </h1>
          <p className="text-white/60 font-rajdhani">Редагування текстів та контактної інформації</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-neon flex items-center gap-2"
          data-testid="save-content-btn"
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Зберегти
        </button>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('успішно')
            ? 'bg-green-500/20 border border-green-500/30 text-green-400'
            : 'bg-red-500/20 border border-red-500/30 text-red-400'
        }`}>
          {message}
        </div>
      )}

      <div className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-white font-semibold mb-2 font-rajdhani">
            Заголовок Hero Секції
          </label>
          <input
            type="text"
            value={content.hero_title}
            onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            data-testid="hero-title"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2 font-rajdhani">
            Підзаголовок Hero Секції
          </label>
          <input
            type="text"
            value={content.hero_subtitle}
            onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            data-testid="hero-subtitle"
          />
        </div>

        <div>
          <label className="block text-white font-semibold mb-2 font-rajdhani">
            Текст "Про Нас"
          </label>
          <textarea
            value={content.about_text}
            onChange={(e) => setContent({ ...content, about_text: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none"
            data-testid="about-text"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              Телефон
            </label>
            <input
              type="text"
              value={content.phone}
              onChange={(e) => setContent({ ...content, phone: e.target.value })}
              className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              data-testid="phone"
            />
          </div>

          <div>
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              Email
            </label>
            <input
              type="email"
              value={content.email}
              onChange={(e) => setContent({ ...content, email: e.target.value })}
              className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              data-testid="email"
            />
          </div>
        </div>

        <div>
          <label className="block text-white font-semibold mb-2 font-rajdhani">
            Адреса
          </label>
          <input
            type="text"
            value={content.address}
            onChange={(e) => setContent({ ...content, address: e.target.value })}
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            data-testid="address"
          />
        </div>
      </div>
    </div>
  );
}
