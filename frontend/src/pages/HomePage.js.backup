import { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, Camera, Zap, Home, Lock, Tv, Mail, Phone, MapPin, Send } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const iconMap = {
  shield: Shield,
  camera: Camera,
  zap: Zap,
  home: Home,
  lock: Lock,
  tv: Tv,
};

export default function HomePage() {
  const [content, setContent] = useState(null);
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadContent();
    loadSections();
  }, []);

  const loadContent = async () => {
    try {
      const { data } = await axios.get(`${API}/content`);
      setContent(data);
    } catch (error) {
      console.error('Error loading content:', error);
    }
  };

  const loadSections = async () => {
    try {
      const { data } = await axios.get(`${API}/sections`);
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormStatus('');
    try {
      await axios.post(`${API}/contact`, formData);
      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setFormStatus(''), 5000);
    } catch (error) {
      setFormStatus('error');
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!content) return null;

  return (
    <div className="min-h-screen bg-[hsl(220,25%,5%)] text-white">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 glass-card border-b border-neon-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold font-orbitron gradient-text">
              {content.hero_title}
            </h1>
            <a href="#contact" className="btn-neon">
              Зв'язатися
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl md:text-7xl font-bold font-orbitron mb-6 gradient-text">
            {content.hero_title}
          </h2>
          <p className="text-xl md:text-2xl text-white/70 mb-12 font-rajdhani">
            {content.hero_subtitle}
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#services" className="btn-neon">
              Наші Послуги
            </a>
            <a href="#contact" className="btn-neon-purple">
              Зв'язатися
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-center mb-16 gradient-text">
            Наші Послуги
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section) => {
              const Icon = iconMap[section.icon] || Shield;
              return (
                <div
                  key={section.id}
                  className="glass-card p-6 group hover:scale-105 transition-all duration-300 cursor-pointer"
                  data-testid={`service-${section.id}`}
                >
                  <div className="relative h-48 mb-6 overflow-hidden rounded-xl">
                    <img
                      src={section.image}
                      alt={section.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,5%)] to-transparent"></div>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-neon-cyan/20 rounded-xl border border-neon-cyan/40 group-hover:shadow-neon transition-shadow">
                      <Icon className="w-6 h-6 text-neon-cyan" />
                    </div>
                    <h3 className="text-xl font-bold font-orbitron text-neon-cyan">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-white/70 font-rajdhani">{section.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gradient-to-b from-transparent via-[hsl(220,25%,8%)] to-transparent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold font-orbitron mb-8 gradient-text">
            Про Нас
          </h2>
          <p className="text-xl text-white/70 font-rajdhani leading-relaxed">
            {content.about_text}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 relative">
        <div className="absolute inset-0 grid-pattern opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold font-orbitron text-center mb-16 gradient-text">
            Зв'яжіться З Нами
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
              <div className="glass-card p-6 flex items-center gap-4" data-testid="contact-phone">
                <div className="p-4 bg-neon-cyan/20 rounded-xl border border-neon-cyan/40">
                  <Phone className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-white/60 font-rajdhani">Телефон</p>
                  <a href={`tel:${content.phone}`} className="text-xl font-semibold text-neon-cyan hover:underline">
                    {content.phone}
                  </a>
                </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-4" data-testid="contact-email">
                <div className="p-4 bg-neon-cyan/20 rounded-xl border border-neon-cyan/40">
                  <Mail className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-white/60 font-rajdhani">Email</p>
                  <a href={`mailto:${content.email}`} className="text-xl font-semibold text-neon-cyan hover:underline">
                    {content.email}
                  </a>
                </div>
              </div>
              <div className="glass-card p-6 flex items-center gap-4" data-testid="contact-address">
                <div className="p-4 bg-neon-cyan/20 rounded-xl border border-neon-cyan/40">
                  <MapPin className="w-6 h-6 text-neon-cyan" />
                </div>
                <div>
                  <p className="text-white/60 font-rajdhani">Адреса</p>
                  <p className="text-xl font-semibold text-white">{content.address}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="glass-card p-8">
              <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
                <div>
                  <label className="block text-white/80 font-rajdhani mb-2">
                    Ім'я *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white"
                    placeholder="Ваше ім'я"
                    data-testid="contact-name"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-rajdhani mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white"
                    placeholder="your@email.com"
                    data-testid="contact-email-input"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-rajdhani mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white"
                    placeholder="+380..."
                    data-testid="contact-phone-input"
                  />
                </div>
                <div>
                  <label className="block text-white/80 font-rajdhani mb-2">
                    Повідомлення *
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white resize-none"
                    placeholder="Ваше повідомлення..."
                    data-testid="contact-message"
                  />
                </div>
                {formStatus === 'success' && (
                  <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-400" data-testid="contact-success">
                    Повідомлення успішно надіслано!
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400" data-testid="contact-error">
                    Помилка відправки. Спробуйте ще раз.
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-neon flex items-center justify-center gap-2"
                  data-testid="contact-submit"
                >
                  {loading ? 'Відправка...' : 'Надіслати'}
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-neon-cyan/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60 font-rajdhani">
            © 2024 {content.hero_title}. Всі права захищено.
          </p>
          <a href="/admin/login" className="text-neon-cyan/40 hover:text-neon-cyan/60 text-sm mt-2 inline-block">
            Адмін
          </a>
        </div>
      </footer>
    </div>
  );
}
