import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { 
  LayoutDashboard, FileText, Image, Mail, Bot, LogOut, 
  Menu, X, Settings, MessageSquare 
} from 'lucide-react';
import ContentManagement from './ContentManagement';
import SectionsManagement from './SectionsManagement';
import EmailSettings from './EmailSettings';
import MessagesManagement from './MessagesManagement';
import ChatbotSettings from './ChatbotSettings';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!localStorage.getItem('admin_token')) {
      navigate('/admin/login');
    } else {
      loadUnreadCount();
    }
  }, [navigate]);

  const loadUnreadCount = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/admin/messages`, getAuthHeaders());
      setUnreadCount(data.filter(m => !m.read).length);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Panel' },
    { path: '/admin/content', icon: FileText, label: 'Content' },
    { path: '/admin/sections', icon: Image, label: 'Sections' },
    { path: '/admin/messages', icon: MessageSquare, label: 'Messages', badge: unreadCount },
    { path: '/admin/email', icon: Mail, label: 'Email' },
    { path: '/admin/chatbot', icon: Bot, label: 'Chatbot' },
  ];

  return (
    <div className="min-h-screen bg-[hsl(220,25%,5%)] flex">
      {/* Sidebar */}
      <aside className={`${
        sidebarOpen ? 'w-64' : 'w-20'
      } bg-[hsl(220,20%,8%)] border-r border-neon-cyan/20 transition-all duration-300 flex flex-col`}>
        <div className="p-6 border-b border-neon-cyan/20 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold font-orbitron gradient-text">
              Admin
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-neon-cyan/10 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-neon-cyan" /> : <Menu className="w-5 h-5 text-neon-cyan" />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
                data-testid={`menu-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && (
                  <>
                    <span className="flex-1 font-rajdhani font-medium">{item.label}</span>
                    {item.badge > 0 && (
                      <span className="px-2 py-1 bg-neon-purple text-xs font-bold rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neon-cyan/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-white/70 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-all"
            data-testid="logout-btn"
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span className="font-rajdhani font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Routes>
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="sections" element={<SectionsManagement />} />
            <Route path="messages" element={<MessagesManagement onUpdate={loadUnreadCount} />} />
            <Route path="email" element={<EmailSettings />} />
            <Route path="chatbot" element={<ChatbotSettings />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function DashboardHome() {
  const [stats, setStats] = useState({ messages: 0, sections: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [messagesRes, sectionsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}/api/admin/messages`, getAuthHeaders()),
        axios.get(`${BACKEND_URL}/api/admin/sections`, getAuthHeaders()),
      ]);
      setStats({
        messages: messagesRes.data.length,
        sections: sectionsRes.data.length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
          Dashboard
        </h1>
        <p className="text-white/60 font-rajdhani">Manage site content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <MessageSquare className="w-12 h-12 text-neon-cyan mb-4" />
          <h3 className="text-3xl font-bold text-white mb-2">{stats.messages}</h3>
          <p className="text-white/60 font-rajdhani">Messages</p>
        </div>

        <div className="glass-card p-6">
          <Image className="w-12 h-12 text-neon-purple mb-4" />
          <h3 className="text-3xl font-bold text-white mb-2">{stats.sections}</h3>
          <p className="text-white/60 font-rajdhani">Sections</p>
        </div>

        <div className="glass-card p-6">
          <Settings className="w-12 h-12 text-neon-cyan mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">System</h3>
          <p className="text-green-400 font-rajdhani">Active</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h2 className="text-2xl font-bold font-orbitron text-neon-cyan mb-4">
          Quick Access
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/admin/content"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <FileText className="w-6 h-6 text-neon-cyan mb-2" />
            <h3 className="font-semibold text-white mb-1">Edit Content</h3>
            <p className="text-sm text-white/60 font-rajdhani">Change texts and contacts</p>
          </Link>

          <Link
            to="/admin/sections"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <Image className="w-6 h-6 text-neon-purple mb-2" />
            <h3 className="font-semibold text-white mb-1">Manage Sections</h3>
            <p className="text-sm text-white/60 font-rajdhani">Add/change services</p>
          </Link>

          <Link
            to="/admin/email"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <Mail className="w-6 h-6 text-neon-cyan mb-2" />
            <h3 className="font-semibold text-white mb-1">Configure Email</h3>
            <p className="text-sm text-white/60 font-rajdhani">Email configuration</p>
          </Link>

          <Link
            to="/admin/chatbot"
            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
          >
            <Bot className="w-6 h-6 text-neon-purple mb-2" />
            <h3 className="font-semibold text-white mb-1">Configure Chatbot</h3>
            <p className="text-sm text-white/60 font-rajdhani">Preparation for integration</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
