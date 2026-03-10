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
      setMessage('Content saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Save error');
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
            Content Management
          </h1>
          <p className="text-white/60 font-rajdhani">Edit texts and contact information</p>
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
          Save
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
            Hero Section Title
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
            Hero Section Subtitle
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
            About Us Text
          </label>
          <textarea
            value={content.about_text}
            onChange={(e) => setContent({ ...content, about_text: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none"
            data-testid="about-text"
          />
        </div>

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-xl font-bold text-neon-cyan mb-4 font-orbitron">Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-2 font-rajdhani">
                Phone
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

          <div className="mt-4">
            <label className="block text-white font-semibold mb-2 font-rajdhani">
              Address
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

        <div className="border-t border-white/10 pt-6">
          <h3 className="text-xl font-bold text-neon-cyan mb-4 font-orbitron">Social Media Links</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white font-semibold mb-2 font-rajdhani">
                Facebook URL
              </label>
              <input
                type="url"
                value={content.facebook || ''}
                onChange={(e) => setContent({ ...content, facebook: e.target.value })}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 font-rajdhani">
                Instagram URL
              </label>
              <input
                type="url"
                value={content.instagram || ''}
                onChange={(e) => setContent({ ...content, instagram: e.target.value })}
                placeholder="https://instagram.com/yourprofile"
                className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 font-rajdhani">
                Twitter URL
              </label>
              <input
                type="url"
                value={content.twitter || ''}
                onChange={(e) => setContent({ ...content, twitter: e.target.value })}
                placeholder="https://twitter.com/yourhandle"
                className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 font-rajdhani">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={content.linkedin || ''}
                onChange={(e) => setContent({ ...content, linkedin: e.target.value })}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              />
            </div>

            <div>
              <label className="block text-white font-semibold mb-2 font-rajdhani">
                YouTube URL
              </label>
              <input
                type="url"
                value={content.youtube || ''}
                onChange={(e) => setContent({ ...content, youtube: e.target.value })}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
