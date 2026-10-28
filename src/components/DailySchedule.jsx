import React, { useState } from 'react';
import { 
  Plus, 
  Check, 
  Clock, 
  Trash2, 
  Edit3, 
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessTune } from '../utils/audio';

export default function DailySchedule({ 
  partners, 
  tasks, 
  onToggleTask, 
  onAddTask, 
  onDeleteTask, 
  onUpdateTask,
  activeFilter 
}) {
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('08:00');
  const [formDuration, setFormDuration] = useState('45m');
  const [formCategory, setFormCategory] = useState('Kesehatan');
  const [formPartner, setFormPartner] = useState('both');
  const [formNotes, setFormNotes] = useState('');

  const categories = ['Semua', 'Kesehatan', 'Karir', 'Pengembangan Diri', 'Hubungan', 'Keahlian'];

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'u' && task.partner !== 'u' && task.partner !== 'both') return false;
    if (activeFilter === 'g' && task.partner !== 'g' && task.partner !== 'both') return false;
    if (selectedCategory !== 'Semua' && task.category.toLowerCase() !== selectedCategory.toLowerCase()) return false;
    return true;
  });

  const getSection = (timeStr) => {
    const hour = parseInt(timeStr.split(':')[0], 10);
    if (hour >= 4 && hour < 12) return 'Pagi';
    if (hour >= 12 && hour < 17) return 'Siang';
    if (hour >= 17 && hour < 21) return 'Sore';
    return 'Malam';
  };

  const sections = ['Pagi', 'Siang', 'Sore', 'Malam'];
  const sectionMeta = {
    Pagi: { icon: '🌅', label: 'Awali Hari dengan Semangat (04:00 - 12:00)' },
    Siang: { icon: '☀️', label: 'Fokus & Aktivitas Siang (12:00 - 17:00)' },
    Sore: { icon: '🌆', label: 'Sore Hari & Istirahat (17:00 - 21:00)' },
    Malam: { icon: '🌙', label: 'Waktu Bersyukur & Istirahat (21:00 - Selesai)' }
  };

  const openAddModal = (defaultTime = '08:00') => {
    setEditingTask(null);
    setFormTitle('');
    setFormTime(defaultTime);
    setFormDuration('45m');
    setFormCategory('Kesehatan');
    setFormPartner(activeFilter === 'all' ? 'both' : activeFilter);
    setFormNotes('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormTime(task.time);
    setFormDuration(task.duration || '30m');
    setFormCategory(task.category);
    setFormPartner(task.partner);
    setFormNotes(task.notes || '');
    setIsAddModalOpen(true);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        title: formTitle.trim(),
        time: formTime,
        duration: formDuration,
        category: formCategory,
        partner: formPartner,
        notes: formNotes.trim()
      });
    } else {
      const newTask = {
        id: `d-${Date.now()}`,
        title: formTitle.trim(),
        time: formTime,
        duration: formDuration,
        category: formCategory,
        partner: formPartner,
        completed: false,
        notes: formNotes.trim()
      };
      onAddTask(newTask);
    }
    setIsAddModalOpen(false);
  };

  const handleToggle = (task) => {
    const nextState = !task.completed;
    onToggleTask(task.id);

    if (nextState) {
      playSuccessTune();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#fda4af', '#fb7185', '#ec4899']
      });
    }
  };

  return (
    <div className="daily-schedule-wrapper">
      {/* Top Controls: Filter bar, Add button */}
      <div className="schedule-header-row">
        {/* Category Pills */}
        <div className="category-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill-btn ${selectedCategory === cat ? 'cat-pill-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <button type="button" className="btn-primary" onClick={() => openAddModal()}>
          <Plus size={16} />
          <span>Tambah Jadwal</span>
        </button>
      </div>

      {/* Sections by Timeblock */}
      <div className="timeblocks-container">
        {sections.map((secName) => {
          const secTasks = filteredTasks
            .filter(t => getSection(t.time) === secName)
            .sort((a, b) => a.time.localeCompare(b.time));

          const secDone = secTasks.filter(t => t.completed).length;

          return (
            <div key={secName} className="glass-card timeblock-section">
              <div className="timeblock-header">
                <div className="timeblock-title-group">
                  <span className="timeblock-emoji">{sectionMeta[secName].icon}</span>
                  <div>
                    <h3 className="timeblock-title">{secName}</h3>
                    <span className="timeblock-sub">{sectionMeta[secName].label}</span>
                  </div>
                </div>

                <div className="timeblock-stats">
                  <span className="timeblock-count">{secDone}/{secTasks.length} Selesai</span>
                  <button 
                    type="button" 
                    className="btn-icon btn-sm" 
                    onClick={() => openAddModal(secName === 'Pagi' ? '08:00' : secName === 'Siang' ? '13:00' : secName === 'Sore' ? '17:00' : '21:00')} 
                    title={`Tambah jadwal ${secName}`}
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {secTasks.length === 0 ? (
                <div className="empty-timeblock">
                  <p>Belum ada jadwal untuk waktu {secName.toLowerCase()}.</p>
                </div>
              ) : (
                <div className="tasks-list">
                  {secTasks.map((task) => {
                    const isPartnerBoth = task.partner === 'both';
                    const isPartnerU = task.partner === 'u';

                    return (
                      <div 
                        key={task.id} 
                        className={`task-row ${task.completed ? 'task-row-completed' : ''}`}
                      >
                        <button
                          type="button"
                          className={`task-check-circle ${task.completed ? 'checked' : ''}`}
                          onClick={() => handleToggle(task)}
                          title={task.completed ? 'Tandai belum selesai' : 'Tandai selesai'}
                        >
                          {task.completed && <Check size={14} strokeWidth={3} />}
                        </button>

                        <div className="task-body">
                          <div className="task-top-meta">
                            <span className="task-time-badge">
                              <Clock size={12} />
                              {task.time} {task.duration ? `(${task.duration})` : ''}
                            </span>
                            <span className="cat-pill">
                              {task.category}
                            </span>
                            <span className={`partner-pill ${isPartnerBoth ? 'badge-both' : isPartnerU ? 'badge-u' : 'badge-g'}`}>
                              {isPartnerBoth ? 'Bersama' : isPartnerU ? partners.u.name : partners.g.name}
                            </span>
                          </div>

                          <h4 className={`task-title ${task.completed ? 'title-done' : ''}`}>
                            {task.title}
                          </h4>

                          {task.notes && (
                            <p className="task-notes">{task.notes}</p>
                          )}
                        </div>

                        <div className="task-actions">
                          <button 
                            type="button" 
                            className="btn-icon btn-sm"
                            onClick={() => openEditModal(task)}
                            title="Edit jadwal"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button 
                            type="button" 
                            className="btn-icon btn-sm btn-delete"
                            onClick={() => onDeleteTask(task.id)}
                            title="Hapus jadwal"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add / Edit Task Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingTask ? 'Edit Jadwal Kegiatan' : 'Tambah Jadwal Kegiatan'}</h3>
              <button type="button" className="btn-icon btn-sm" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveForm} className="modal-form">
              <div className="form-group">
                <label>Nama Kegiatan *</label>
                <input 
                  type="text" 
                  className="input-text" 
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Contoh: Belajar bareng / Jalan santai..."
                  required 
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Waktu Mulai</label>
                  <input 
                    type="time" 
                    className="input-text"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Durasi</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={formDuration}
                    onChange={e => setFormDuration(e.target.value)}
                    placeholder="30m, 45m, 1j"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Kategori</label>
                  <select 
                    className="input-select"
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                  >
                    <option value="Kesehatan">Kesehatan</option>
                    <option value="Karir">Karir</option>
                    <option value="Pengembangan Diri">Pengembangan Diri</option>
                    <option value="Hubungan">Hubungan</option>
                    <option value="Keahlian">Keahlian</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Pelaksana</label>
                  <select 
                    className="input-select"
                    value={formPartner}
                    onChange={e => setFormPartner(e.target.value)}
                  >
                    <option value="both">Bersama (Umaar & Gitaa)</option>
                    <option value="u">{partners.u.name} (Umaar)</option>
                    <option value="g">{partners.g.name} (Gitaa)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Catatan Tambahan (Opsional)</label>
                <textarea 
                  className="input-textarea"
                  rows={2}
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  placeholder="Pengingat atau detail kegiatan..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingTask ? 'Simpan Perubahan' : 'Tambah Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
