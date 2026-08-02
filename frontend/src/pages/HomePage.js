import React, { useState, useEffect, useRef } from 'react';
import { Shield, Camera, Lock, Zap, Phone, Mail, MapPin, ChevronRight, Star, CheckCircle, Menu, X, Eye, Wifi, Monitor, Bell } from 'lucide-react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const iconMap = {
  Shield, Camera, Lock, Zap, Eye, Wifi, Monitor, Bell
};

// Brand logos (using text-based representations)
const brands = [
  { name: 'Hikvision', color: '#0066CC' },
  { name: 'Dahua', color: '#E60012' },
  { name: 'Ubiquiti', color: '#0559C9' },
  { name: 'TP-Link', color: '#4ACBD6' },
  { name: 'Ezviz', color: '#00A4E4' },
  { name: 'Reolink', color: '#00B050' },
];

// Real equipment images from search results
const equipmentImages = {
  hikvision_ptz: 'https://kimi-web-img.moonshot.cn/img/www.hikvision.com/a032f67400d9367f7c9531ef539be4392e3cf124.jpg',
  hikvision_network: 'https://kimi-web-img.moonshot.cn/img/www.hikvision.com/04a383ae81892b75225d016676b4739d4028b8e3.png',
  hikvision_colorvu: 'https://kimi-web-img.moonshot.cn/img/www.hikvision.com/e0b78b7b2ffa26e6ec84308385ff5432e72790d7.jpg',
  dahua_family: 'https://kimi-web-img.moonshot.cn/img/cctvdirect.co.uk/3a1b7cd776dee87724fba8b451272fac5343b2c5.jpg',
  dahua_kit: 'https://kimi-web-img.moonshot.cn/img/www.spymonkey.com.au/3f5274c83da3527377f2def6442e004b5db76b61.jpg',
  dahua_dvr: 'https://kimi-web-img.moonshot.cn/img/m.media-amazon.com/3ffe682b71a5dd1148261b482dd1b4c1738b6f3f.jpg',
  ubiquiti_family: 'https://kimi-web-img.moonshot.cn/img/www.ui.com/917e74c0d0c00f1258aa634bad8fd0067e3e9d16.jpg',
  ubiquiti_compact: 'https://kimi-web-img.moonshot.cn/img/images.svc.ui.com/1c906e537a6e330def87728562a10c41349f9005',
  professional_install: 'https://kimi-web-img.moonshot.cn/img/kualitek.com/61fb8841305458635e7c4ba81d8a8ef4b9660b6e.jpg',
  ceiling_mount: 'https://kimi-web-img.moonshot.cn/img/cdn.prod.website-files.com/aaf42ec158cdfa04a661aac8d01d014b17c9fa6c.webp',
};

export default function HomePage() {
  const [content, setContent] = useState({
    hero_title: 'Professional Security Systems',
    hero_subtitle: 'Hikvision · Dahua · Ubiquiti · Authorized Installation',
    about_text: 'We are an authorized dealer and installation partner for leading security brands. Our certified technicians provide professional installation of Hikvision, Dahua, Ubiquiti and other top-tier surveillance systems for homes and businesses.',
    address: 'Chicago, IL',
    phone: '+1 (312) 555-0199',
    email: 'info@securehomechicago.com'
  });
  const [sections, setSections] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState({ loading: false, success: false, error: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeBrand, setActiveBrand] = useState(0);

  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  useEffect(() => {
    fetchContent();
    fetchSections();

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    // Brand rotation
    const brandInterval = setInterval(() => {
      setActiveBrand(prev => (prev + 1) % brands.length);
    }, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(brandInterval);
    };
  }, []);

  const fetchContent = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/content`);
      if (res.data) setContent(prev => ({ ...prev, ...res.data }));
    } catch (e) {
      console.log('Using default content');
    }
  };

  const fetchSections = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/sections`);
      if (res.data?.length > 0) {
        setSections(res.data.filter(s => s.visible !== false));
      } else {
        setDefaultSections();
      }
    } catch (e) {
      setDefaultSections();
    }
  };

  const setDefaultSections = () => {
    setSections([
      { _id: '1', title: 'IP Camera Systems', description: 'Professional Hikvision & Dahua IP cameras with 4K resolution, night vision, and AI analytics', icon: 'Camera', image: equipmentImages.hikvision_network },
      { _id: '2', title: 'PTZ Cameras', description: 'Pan-Tilt-Zoom cameras with 360° coverage, auto-tracking, and long-range night vision', icon: 'Eye', image: equipmentImages.hikvision_ptz },
      { _id: '3', title: 'NVR & DVR Systems', description: 'Network and digital video recorders with up to 128 channels and AI-powered search', icon: 'Monitor', image: equipmentImages.dahua_dvr },
      { _id: '4', title: 'Smart Home Security', description: 'Ubiquiti UniFi Protect ecosystem with doorbell cameras, sensors, and cloud access', icon: 'Wifi', image: equipmentImages.ubiquiti_family },
      { _id: '5', title: 'Access Control', description: 'Electronic locks, card readers, and biometric systems for secure entry management', icon: 'Lock', image: equipmentImages.dahua_kit },
      { _id: '6', title: 'Alarm Systems', description: '24/7 monitored alarm systems with motion detectors, glass break sensors, and mobile alerts', icon: 'Bell', image: equipmentImages.professional_install },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus({ loading: true, success: false, error: '' });
    try {
      await axios.post(`${API_URL}/api/contact`, formData);
      setFormStatus({ loading: false, success: true, error: '' });
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setFormStatus({ loading: false, success: false, error: 'Failed to send message. Please try again.' });
    }
  };

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[hsl(220,25%,5%)] text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_hsl(220,25%,8%)_0%,_hsl(220,25%,3%)_100%)]" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[128px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/5 rounded-full blur-[128px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[hsl(220,25%,5%)]/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text font-orbitron">SecureHome</span>
                <span className="text-xs text-white/50 block -mt-1">Chicago</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Home', ref: heroRef },
                { label: 'Services', ref: servicesRef },
                { label: 'About', ref: aboutRef },
                { label: 'Contact', ref: contactRef },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.ref)}
                  className="text-sm text-white/70 hover:text-neon-cyan transition-colors duration-300 relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-neon-cyan transition-all duration-300 group-hover:w-full" />
                </button>
              ))}
              <button onClick={() => scrollTo(contactRef)} className="btn-neon text-xs">
                Get Quote
              </button>
            </div>

            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[hsl(220,25%,5%)]/95 backdrop-blur-xl border-t border-white/10">
            <div className="px-4 py-6 space-y-4">
              {[
                { label: 'Home', ref: heroRef },
                { label: 'Services', ref: servicesRef },
                { label: 'About', ref: aboutRef },
                { label: 'Contact', ref: contactRef },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollTo(item.ref)}
                  className="block w-full text-left text-lg text-white/80 hover:text-neon-cyan py-2"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon-cyan/10 border border-neon-cyan/30">
                <Star className="w-4 h-4 text-neon-cyan" />
                <span className="text-sm text-neon-cyan font-medium">Authorized Dealer — Hikvision · Dahua · Ubiquiti</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                <span className="block text-white">Professional</span>
                <span className="block gradient-text">Security Systems</span>
                <span className="block text-white/80 text-3xl md:text-4xl mt-2">Installation & Service</span>
              </h1>

              <p className="text-lg text-white/60 max-w-xl leading-relaxed">
                {content.hero_subtitle}. Certified technicians, warranty support, and 24/7 monitoring solutions for residential and commercial properties.
              </p>

              <div className="flex flex-wrap gap-4">
                <button onClick={() => scrollTo(contactRef)} className="btn-neon">
                  Get Free Consultation
                </button>
                <button onClick={() => scrollTo(servicesRef)} className="btn-neon-purple">
                  View Equipment
                </button>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-purple/30 border-2 border-[hsl(220,25%,5%)] flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white/70" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  </div>
                  <p className="text-sm text-white/50">500+ installations in Chicago</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-neon-cyan/20">
                <img 
                  src={equipmentImages.hikvision_network} 
                  alt="Hikvision Professional Camera Systems" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,5%)] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="glass-card p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-neon-cyan" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">Hikvision ColorVu 3.0</p>
                        <p className="text-sm text-white/60">Full-color night vision technology</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 glass-card px-4 py-2 animate-bounce" style={{ animationDuration: '3s' }}>
                <span className="text-sm font-semibold text-neon-cyan">4K Ultra HD</span>
              </div>
              <div className="absolute -bottom-4 -left-4 glass-card px-4 py-2 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
                <span className="text-sm font-semibold text-neon-purple">AI Analytics</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="relative py-16 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-white/40 text-sm uppercase tracking-widest mb-8">Authorized Partners & Equipment</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {brands.map((brand, index) => (
              <div 
                key={brand.name}
                className={`transition-all duration-500 ${index === activeBrand ? 'scale-110 opacity-100' : 'opacity-40 hover:opacity-70'}`}
              >
                <span 
                  className="text-xl md:text-2xl font-bold font-orbitron"
                  style={{ color: index === activeBrand ? brand.color : 'white' }}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section ref={servicesRef} className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-neon-cyan text-sm uppercase tracking-widest">Our Equipment</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Professional <span className="gradient-text">Security Solutions</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We supply and install industry-leading equipment from Hikvision, Dahua, Ubiquiti and other top manufacturers with full warranty support.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => {
              const Icon = iconMap[section.icon] || Shield;
              return (
                <div 
                  key={section._id || index}
                  className="group relative glass-card overflow-hidden hover:border-neon-cyan/50 transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={section.image || equipmentImages.professional_install} 
                      alt={section.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220,25%,5%)] via-[hsl(220,25%,5%)]/50 to-transparent" />
                    <div className="absolute top-4 left-4 w-12 h-12 rounded-xl bg-neon-cyan/20 backdrop-blur-sm border border-neon-cyan/30 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-neon-cyan" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed mb-4">
                      {section.description}
                    </p>
                    <div className="flex items-center gap-2 text-neon-cyan text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Learn More</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hover glow effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-t from-neon-cyan/5 to-transparent" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipment Showcase */}
      <section className="relative py-24 bg-[hsl(220,25%,3%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-neon-purple text-sm uppercase tracking-widest">Equipment Showcase</span>
              <h2 className="text-4xl md:text-5xl font-bold">
                Hikvision <span className="gradient-text">ColorVu 3.0</span> Technology
              </h2>
              <p className="text-white/60 leading-relaxed">
                Experience full-color imaging 24/7 with Hikvision's latest ColorVu 3.0 technology. 
                Combined with AcuSense 3.0 AI analytics, these cameras provide accurate human and vehicle detection 
                with minimal false alarms.
              </p>

              <div className="space-y-4">
                {[
                  '4K Ultra HD Resolution (8MP)',
                  'Full-color Night Vision (0.0005 Lux)',
                  'AcuSense 3.0 AI Human/Vehicle Detection',
                  'Audio 2.0 - Built-in Microphone & Speaker',
                  'IP67 Weatherproof Rating',
                  'H.265+ Video Compression'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-neon-cyan flex-shrink-0" />
                    <span className="text-white/80">{feature}</span>
                  </div>
                ))}
              </div>

              <button onClick={() => scrollTo(contactRef)} className="btn-neon">
                Request Pricing
              </button>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={equipmentImages.hikvision_colorvu} alt="Hikvision ColorVu" className="w-full h-auto" />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={equipmentImages.hikvision_ptz} alt="Hikvision PTZ" className="w-full h-auto" />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={equipmentImages.dahua_family} alt="Dahua Cameras" className="w-full h-auto" />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10">
                    <img src={equipmentImages.ubiquiti_compact} alt="Ubiquiti Compact" className="w-full h-auto" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Installations' },
              { value: '50+', label: 'Business Clients' },
              { value: '6+', label: 'Years Experience' },
              { value: '24/7', label: 'Support' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text font-orbitron mb-2">{stat.value}</div>
                <div className="text-white/50 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="relative py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="rounded-2xl overflow-hidden border border-white/10">
                <img 
                  src={equipmentImages.professional_install} 
                  alt="Professional Security Installation" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass-card p-6 max-w-xs">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                    <Shield className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white">Certified Installers</p>
                    <p className="text-sm text-white/60">Hikvision & Dahua trained</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 order-1 lg:order-2">
              <span className="text-neon-cyan text-sm uppercase tracking-widest">About Us</span>
              <h2 className="text-4xl md:text-5xl font-bold">
                Trusted Security <span className="gradient-text">Professionals</span>
              </h2>
              <p className="text-white/60 leading-relaxed text-lg">
                {content.about_text}
              </p>
              <p className="text-white/60 leading-relaxed">
                As an authorized dealer for Hikvision, Dahua, and Ubiquiti, we provide genuine equipment 
                with manufacturer warranties. Our team stays current with the latest security technologies 
                to deliver cutting-edge solutions for your property.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4">
                {[
                  'Licensed & Insured',
                  'Same-Day Service',
                  'Free Estimates',
                  'Warranty Support'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-neon-cyan" />
                    <span className="text-white/80 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="relative py-24 bg-[hsl(220,25%,3%)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-neon-cyan text-sm uppercase tracking-widest">Contact Us</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">
              Get Your <span className="gradient-text">Free Quote</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Ready to secure your property? Contact us for a free consultation and estimate. 
              We'll recommend the best equipment for your needs and budget.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="glass-card p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Address</p>
                      <p className="text-white/60">{content.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-purple/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Phone</p>
                      <p className="text-white/60">{content.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-neon-cyan" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Email</p>
                      <p className="text-white/60">{content.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-xl font-bold text-white mb-4">Business Hours</h3>
                <div className="space-y-2 text-white/60">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span className="text-white">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span className="text-white">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span className="text-white/40">Emergency Only</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send Message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm text-white/70 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white placeholder-white/30"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white placeholder-white/30"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white placeholder-white/30"
                    placeholder="+1 (312) ..."
                  />
                </div>
                <div>
                  <label className="block text-sm text-white/70 mb-2">Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none focus:ring-2 focus:ring-neon-cyan/20 text-white placeholder-white/30 resize-none"
                    placeholder="Tell us about your project..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={formStatus.loading}
                  className="w-full btn-neon text-center justify-center"
                >
                  {formStatus.loading ? 'Sending...' : 'Send Message'}
                </button>
                {formStatus.success && (
                  <p className="text-neon-cyan text-sm text-center">Message sent successfully!</p>
                )}
                {formStatus.error && (
                  <p className="text-red-400 text-sm text-center">{formStatus.error}</p>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neon-cyan to-neon-blue flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold gradient-text font-orbitron">SecureHome</span>
              </div>
              <p className="text-white/50 max-w-sm">
                Professional security system installation and service in Chicago. 
                Authorized dealer for Hikvision, Dahua, and Ubiquiti.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Services</h4>
              <ul className="space-y-2 text-white/50">
                <li>IP Camera Systems</li>
                <li>PTZ Cameras</li>
                <li>NVR & DVR</li>
                <li>Access Control</li>
                <li>Alarm Systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Brands</h4>
              <ul className="space-y-2 text-white/50">
                <li>Hikvision</li>
                <li>Dahua</li>
                <li>Ubiquiti</li>
                <li>TP-Link</li>
                <li>Ezviz</li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/40 text-sm">
              © 2026 SecureHome Chicago. All rights reserved.
            </p>
            <div className="flex gap-6">
              <span className="text-white/40 text-sm">Authorized Hikvision Dealer</span>
              <span className="text-white/40 text-sm">Authorized Dahua Partner</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
