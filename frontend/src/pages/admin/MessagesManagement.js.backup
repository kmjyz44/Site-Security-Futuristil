import { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, MailOpen, User, Phone, MessageSquare } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function MessagesManagement({ onUpdate }) {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/messages`, getAuthHeaders());
      setMessages(data);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const markAsRead = async (timestamp) => {
    try {
      await axios.put(`${API}/admin/messages/${timestamp}/read`, {}, getAuthHeaders());
      loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.read) {
      markAsRead(message.timestamp);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
          Повідомлення
        </h1>
        <p className="text-white/60 font-rajdhani">
          Всього: {messages.length} | Непрочитані: {messages.filter(m => !m.read).length}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages List */}
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          {messages.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Mail className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 font-rajdhani">Повідомлень ще немає</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.timestamp}
                onClick={() => handleMessageClick(message)}
                className={`glass-card p-4 cursor-pointer transition-all ${
                  selectedMessage?.timestamp === message.timestamp
                    ? 'border-neon-cyan'
                    : message.read
                    ? 'opacity-60 hover:opacity-100'
                    : 'border-neon-purple'
                }`}
                data-testid={`message-${message.timestamp}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {message.read ? (
                      <MailOpen className="w-5 h-5 text-white/40" />
                    ) : (
                      <Mail className="w-5 h-5 text-neon-purple" />
                    )}
                    <span className="font-semibold text-white font-rajdhani">{message.name}</span>
                  </div>
                  <span className="text-xs text-white/40 font-rajdhani">
                    {new Date(message.timestamp).toLocaleDateString('uk-UA')}
                  </span>
                </div>
                <p className="text-sm text-white/70 font-rajdhani line-clamp-2">{message.message}</p>
              </div>
            ))
          )}
        </div>

        {/* Message Detail */}
        <div className="glass-card p-6">
          {selectedMessage ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <h3 className="text-2xl font-bold text-neon-cyan font-orbitron">
                  {selectedMessage.name}
                </h3>
                {!selectedMessage.read && (
                  <span className="px-3 py-1 bg-neon-purple/20 border border-neon-purple/40 rounded-full text-neon-purple text-sm">
                    Нове
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-neon-cyan" />
                  <div>
                    <p className="text-xs text-white/40 font-rajdhani">Email</p>
                    <a href={`mailto:${selectedMessage.email}`} className="text-white hover:text-neon-cyan">
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                {selectedMessage.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-neon-cyan" />
                    <div>
                      <p className="text-xs text-white/40 font-rajdhani">Телефон</p>
                      <a href={`tel:${selectedMessage.phone}`} className="text-white hover:text-neon-cyan">
                        {selectedMessage.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-neon-cyan mt-1" />
                  <div className="flex-1">
                    <p className="text-xs text-white/40 mb-2 font-rajdhani">Повідомлення</p>
                    <p className="text-white/90 whitespace-pre-wrap font-rajdhani leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-white/40 font-rajdhani">
                    Отримано: {new Date(selectedMessage.timestamp).toLocaleString('uk-UA')}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-white/40">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-rajdhani">Оберіть повідомлення для перегляду</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
