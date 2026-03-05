import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, Save, X, Eye, EyeOff } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('admin_token')}` }
});

export default function SectionsManagement() {
  const [sections, setSections] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({
    title: '',
    description: '',
    image: '',
    icon: 'shield',
    order: 0,
    visible: true
  });

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/sections`, getAuthHeaders());
      setSections(data);
    } catch (error) {
      console.error('Error loading sections:', error);
    }
  };

  const handleEdit = (section) => {
    setEditingId(section.id);
    setEditForm(section);
  };

  const handleSaveEdit = async () => {
    try {
      await axios.put(`${API}/admin/sections/${editingId}`, editForm, getAuthHeaders());
      setEditingId(null);
      setEditForm(null);
      loadSections();
    } catch (error) {
      console.error('Error updating section:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цей розділ?')) return;
    try {
      await axios.delete(`${API}/admin/sections/${id}`, getAuthHeaders());
      loadSections();
    } catch (error) {
      console.error('Error deleting section:', error);
    }
  };

  const handleAddSection = async () => {
    try {
      await axios.post(`${API}/admin/sections`, addForm, getAuthHeaders());
      setShowAddForm(false);
      setAddForm({ title: '', description: '', image: '', icon: 'shield', order: 0, visible: true });
      loadSections();
    } catch (error) {
      console.error('Error adding section:', error);
    }
  };

  const toggleVisibility = async (section) => {
    try {
      await axios.put(`${API}/admin/sections/${section.id}`, {
        visible: !section.visible
      }, getAuthHeaders());
      loadSections();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold font-orbitron gradient-text mb-2">
            Керування Розділами
          </h1>
          <p className="text-white/60 font-rajdhani">Додавання, редагування та видалення послуг</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-neon flex items-center gap-2"
          data-testid="add-section-btn"
        >
          {showAddForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {showAddForm ? 'Скасувати' : 'Додати Розділ'}
        </button>
      </div>

      {showAddForm && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="text-xl font-bold text-neon-cyan font-orbitron">Новий Розділ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Заголовок"
              value={addForm.title}
              onChange={(e) => setAddForm({ ...addForm, title: e.target.value })}
              className="px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            />
            <input
              type="text"
              placeholder="Іконка (shield, camera, zap, home, lock, tv)"
              value={addForm.icon}
              onChange={(e) => setAddForm({ ...addForm, icon: e.target.value })}
              className="px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            />
          </div>
          <textarea
            placeholder="Опис"
            value={addForm.description}
            onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white resize-none"
          />
          <input
            type="text"
            placeholder="Шлях до зображення (/images/...)"
            value={addForm.image}
            onChange={(e) => setAddForm({ ...addForm, image: e.target.value })}
            className="w-full px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
          />
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Порядок"
              value={addForm.order}
              onChange={(e) => setAddForm({ ...addForm, order: parseInt(e.target.value) })}
              className="w-32 px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg focus:border-neon-cyan focus:outline-none text-white"
            />
            <button
              onClick={handleAddSection}
              className="btn-neon"
            >
              Зберегти
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section) => (
          <div key={section.id} className="glass-card p-6" data-testid={`section-${section.id}`}>
            {editingId === section.id ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className="px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg text-white"
                  />
                  <input
                    type="text"
                    value={editForm.icon}
                    onChange={(e) => setEditForm({ ...editForm, icon: e.target.value })}
                    className="px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg text-white"
                  />
                </div>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg text-white resize-none"
                />
                <input
                  type="text"
                  value={editForm.image}
                  onChange={(e) => setEditForm({ ...editForm, image: e.target.value })}
                  className="w-full px-4 py-2 bg-[hsl(220,20%,10%)] border border-white/20 rounded-lg text-white"
                />
                <div className="flex gap-4">
                  <button onClick={handleSaveEdit} className="btn-neon flex items-center gap-2">
                    <Save className="w-4 h-4" /> Зберегти
                  </button>
                  <button
                    onClick={() => { setEditingId(null); setEditForm(null); }}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg text-white transition-colors"
                  >
                    Скасувати
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-neon-cyan font-orbitron">{section.title}</h3>
                    <span className="text-sm text-white/40 font-rajdhani">#{section.order}</span>
                    {!section.visible && (
                      <span className="px-2 py-1 bg-white/10 text-xs text-white/60 rounded">
                        Приховано
                      </span>
                    )}
                  </div>
                  <p className="text-white/70 font-rajdhani mb-2">{section.description}</p>
                  <p className="text-sm text-white/50 font-mono">{section.image}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleVisibility(section)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                    title={section.visible ? 'Приховати' : 'Показати'}
                  >
                    {section.visible ? (
                      <Eye className="w-5 h-5 text-green-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-white/40" />
                    )}
                  </button>
                  <button
                    onClick={() => handleEdit(section)}
                    className="p-2 hover:bg-neon-cyan/10 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-5 h-5 text-neon-cyan" />
                  </button>
                  <button
                    onClick={() => handleDelete(section.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
