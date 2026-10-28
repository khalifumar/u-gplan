import React, { useState } from 'react';
import { 
  Compass, 
  Plus, 
  CheckCircle, 
  Clock, 
  Award, 
  Edit3, 
  Trash2, 
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessTune } from '../utils/audio';

export default function AnnualVision({ 
  partners, 
  roadmap, 
  onAddRoadmap, 
  onUpdateRoadmap, 
  onDeleteRoadmap,
  activeFilter 
}) {
  const [selectedQuarter, setSelectedQuarter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formPillar, setFormPillar] = useState('Kesehatan & Vitalitas');
  const [formQuarter, setFormQuarter] = useState('Q4');
  const [formPartner, setFormPartner] = useState('both');
  const [formProgress, setFormProgress] = useState(50);
  const [formStatus, setFormStatus] = useState('in-progress');
  const [formDescription, setFormDescription] = useState('');

  const quarters = ['all', 'Q1', 'Q2', 'Q3', 'Q4'];
  const pillars = [
    'Kesehatan & Vitalitas',
    'Karir & Finansial',
    'Pengembangan Diri',
    'Hubungan & Masa Depan',
    'Liburan & Kebahagiaan'
  ];

  const filteredRoadmap = roadmap.filter(item => {
    if (activeFilter === 'u' && item.partner !== 'u' && item.partner !== 'both') return false;
    if (activeFilter === 'g' && item.partner !== 'g' && item.partner !== 'both') return false;
    if (selectedQuarter !== 'all' && item.quarter !== selectedQuarter) return false;
    return true;
  });

  const openAddModal = (quarter = 'Q4') => {
    setEditingItem(null);
    setFormTitle('');
    setFormPillar('Kesehatan & Vitalitas');
    setFormQuarter(quarter === 'all' ? 'Q4' : quarter);
    setFormPartner(activeFilter === 'all' ? 'both' : activeFilter);
    setFormProgress(50);
    setFormStatus('in-progress');
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormPillar(item.pillar);
    setFormQuarter(item.quarter);
    setFormPartner(item.partner);
    setFormProgress(item.progress);
    setFormStatus(item.status);
    setFormDescription(item.description || '');
    setIsAddModalOpen(true);
  };

  const handleSaveRoadmap = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingItem) {
      onUpdateRoadmap({
        ...editingItem,
        title: formTitle.trim(),
        pillar: formPillar,
        quarter: formQuarter,
        partner: formPartner,
        progress: Number(formProgress),
        status: Number(formProgress) === 100 ? 'completed' : formStatus,
        description: formDescription.trim()
      });
    } else {
      const newItem = {
        id: `y-${Date.now()}`,
        title: formTitle.trim(),
        pillar: formPillar,
        quarter: formQuarter,
        partner: formPartner,
        progress: Number(formProgress),
        status: Number(formProgress) === 100 ? 'completed' : formStatus,
        description: formDescription.trim()
      };
      onAddRoadmap(newItem);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="annual-container">
      {/* Header Row */}
      <div className="annual-header-row">
        <div className="quarter-filter-pills">
          {quarters.map((q) => (
            <button
              key={q}
              type="button"
              className={`cat-pill-btn ${selectedQuarter === q ? 'cat-pill-active' : ''}`}
              onClick={() => setSelectedQuarter(q)}
            >
              {q === 'all' ? 'Semua Kuartal' : q}
            </button>
          ))}
        </div>

        <button type="button" className="btn-primary" onClick={() => openAddModal()}>
          <Plus size={16} />
          <span>Tambah Rencana</span>
        </button>
      </div>

      {/* Roadmap Cards Grid */}
      <div className="roadmap-grid">
        {filteredRoadmap.map((item) => {
          const isDone = item.progress >= 100 || item.status === 'completed';
          const isPartnerBoth = item.partner === 'both';
          const isPartnerU = item.partner === 'u';

          return (
            <div key={item.id} className={`glass-card roadmap-card ${isDone ? 'card-completed' : ''}`}>
              <div className="roadmap-top-meta">
                <span className="quarter-pill">{item.quarter}</span>
                <span className="pillar-tag">{item.pillar}</span>
                <span className={`partner-pill ${isPartnerBoth ? 'badge-both' : isPartnerU ? 'badge-u' : 'badge-g'}`}>
                  {isPartnerBoth ? 'Bersama' : isPartnerU ? partners.u.name : partners.g.name}
                </span>

                <div className="roadmap-actions">
                  <button type="button" className="btn-icon btn-sm" onClick={() => openEditModal(item)}>
                    <Edit3 size={13} />
                  </button>
                  <button type="button" className="btn-icon btn-sm btn-delete" onClick={() => onDeleteRoadmap(item.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3 className="roadmap-title">{item.title}</h3>

              {item.description && (
                <p className="roadmap-desc">{item.description}</p>
              )}

              <div className="roadmap-progress-wrap">
                <div className="roadmap-progress-info">
                  <span className="status-label">
                    {isDone ? '✅ Tercapai' : '⏳ Sedang Berjalan'}
                  </span>
                  <span className="roadmap-pct"><strong>{item.progress}%</strong></span>
                </div>
                <div className="roadmap-track">
                  <div
                    className="roadmap-fill"
                    style={{ width: `${item.progress}%`, background: 'var(--brand-gradient)' }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Add / Edit */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingItem ? 'Edit Rencana Bersama' : 'Tambah Rencana Bersama'}</h3>
              <button type="button" className="btn-icon btn-sm" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveRoadmap} className="modal-form">
              <div className="form-group">
                <label>Judul Rencana / Impian *</label>
                <input 
                  type="text" 
                  className="input-text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Contoh: Liburan bareng / Tabungan masa depan..."
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Pilar Kehidupan</label>
                  <select 
                    className="input-select"
                    value={formPillar}
                    onChange={e => setFormPillar(e.target.value)}
                  >
                    {pillars.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Kuartal</label>
                  <select 
                    className="input-select"
                    value={formQuarter}
                    onChange={e => setFormQuarter(e.target.value)}
                  >
                    <option value="Q1">Q1 (Jan - Mar)</option>
                    <option value="Q2">Q2 (Apr - Jun)</option>
                    <option value="Q3">Q3 (Jul - Sep)</option>
                    <option value="Q4">Q4 (Okt - Des)</option>
                  </select>
                </div>
              </div>

              <div className="form-row-2">
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

                <div className="form-group">
                  <label>Progres Saat Ini: {formProgress}%</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={formProgress}
                    onChange={e => setFormProgress(e.target.value)}
                    className="input-range"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Deskripsi Tambahan (Opsional)</label>
                <textarea 
                  className="input-textarea"
                  rows={2}
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Langkah atau tujuan yang ingin diraih..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Simpan Perubahan' : 'Buat Rencana'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
