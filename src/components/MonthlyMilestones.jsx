import React, { useState } from 'react';
import { 
  Plus, 
  Target, 
  Trophy, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessTune } from '../utils/audio';

export default function MonthlyMilestones({ 
  partners, 
  goals, 
  reflection, 
  onAddGoal, 
  onUpdateGoal, 
  onDeleteGoal, 
  onUpdateReflection,
  activeFilter 
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Kesehatan');
  const [formTarget, setFormTarget] = useState(20);
  const [formCurrent, setFormCurrent] = useState(0);
  const [formUnit, setFormUnit] = useState('kali');
  const [formPartner, setFormPartner] = useState('both');
  const [formInsights, setFormInsights] = useState('');

  // Reflection states
  const [isEditingReflection, setIsEditingReflection] = useState(false);
  const [reflectionWins, setReflectionWins] = useState(reflection.keyWins || '');
  const [reflectionChallenges, setReflectionChallenges] = useState(reflection.challenges || '');
  const [reflectionPledge, setReflectionPledge] = useState(reflection.nextPledge || '');

  // Filter goals
  const filteredGoals = goals.filter(g => {
    if (activeFilter === 'u' && g.partner !== 'u' && g.partner !== 'both') return false;
    if (activeFilter === 'g' && g.partner !== 'g' && g.partner !== 'both') return false;
    return true;
  });

  const openAddModal = () => {
    setEditingGoal(null);
    setFormTitle('');
    setFormCategory('Kesehatan');
    setFormTarget(20);
    setFormCurrent(0);
    setFormUnit('kali');
    setFormPartner(activeFilter === 'all' ? 'both' : activeFilter);
    setFormInsights('');
    setIsAddModalOpen(true);
  };

  const openEditModal = (goal) => {
    setEditingGoal(goal);
    setFormTitle(goal.title);
    setFormCategory(goal.category);
    setFormTarget(goal.target);
    setFormCurrent(goal.current);
    setFormUnit(goal.unit);
    setFormPartner(goal.partner);
    setFormInsights(goal.insights || '');
    setIsAddModalOpen(true);
  };

  const handleSaveGoal = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingGoal) {
      onUpdateGoal({
        ...editingGoal,
        title: formTitle.trim(),
        category: formCategory,
        target: Number(formTarget),
        current: Number(formCurrent),
        unit: formUnit.trim(),
        partner: formPartner,
        insights: formInsights.trim()
      });
    } else {
      const newGoal = {
        id: `m-${Date.now()}`,
        title: formTitle.trim(),
        month: 'Bulan Ini',
        category: formCategory,
        target: Number(formTarget),
        current: Number(formCurrent),
        unit: formUnit.trim(),
        partner: formPartner,
        status: 'in-progress',
        insights: formInsights.trim()
      };
      onAddGoal(newGoal);
    }
    setIsAddModalOpen(false);
  };

  const handleIncrement = (goal) => {
    const nextVal = Math.min(goal.target, goal.current + 1);
    onUpdateGoal({ ...goal, current: nextVal });

    if (nextVal >= goal.target && goal.current < goal.target) {
      playSuccessTune();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleDecrement = (goal) => {
    const nextVal = Math.max(0, goal.current - 1);
    onUpdateGoal({ ...goal, current: nextVal });
  };

  const handleSaveReflection = () => {
    onUpdateReflection({
      ...reflection,
      keyWins: reflectionWins.trim(),
      challenges: reflectionChallenges.trim(),
      nextPledge: reflectionPledge.trim()
    });
    setIsEditingReflection(false);
  };

  return (
    <div className="monthly-container">
      {/* Top Action Bar */}
      <div className="monthly-header-row">
        <div className="section-title-wrap">
          <h2 className="section-main-title">Target Bulan Ini</h2>
          <span className="badge-subtle">{filteredGoals.length} Target Aktif</span>
        </div>

        <button type="button" className="btn-primary" onClick={openAddModal}>
          <Plus size={16} />
          <span>Tambah Target</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="goals-grid">
        {filteredGoals.map((goal) => {
          const percent = Math.min(100, Math.round((goal.current / goal.target) * 100));
          const isDone = goal.current >= goal.target;
          const isPartnerBoth = goal.partner === 'both';
          const isPartnerU = goal.partner === 'u';

          return (
            <div key={goal.id} className={`glass-card goal-card ${isDone ? 'goal-completed' : ''}`}>
              <div className="goal-top-meta">
                <span className="cat-pill">{goal.category}</span>
                <span className={`partner-pill ${isPartnerBoth ? 'badge-both' : isPartnerU ? 'badge-u' : 'badge-g'}`}>
                  {isPartnerBoth ? 'Bersama' : isPartnerU ? partners.u.name : partners.g.name}
                </span>
                <div className="goal-card-actions">
                  <button type="button" className="btn-icon btn-sm" onClick={() => openEditModal(goal)}>
                    <Edit3 size={13} />
                  </button>
                  <button type="button" className="btn-icon btn-sm btn-delete" onClick={() => onDeleteGoal(goal.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>

              <h3 className="goal-title">{goal.title}</h3>

              {goal.insights && (
                <p className="goal-insights">{goal.insights}</p>
              )}

              {/* Progress Bar & Value */}
              <div className="goal-progress-section">
                <div className="goal-val-row">
                  <span className="goal-current-text">
                    <strong>{goal.current}</strong> / {goal.target} {goal.unit}
                  </span>
                  <span className={`goal-pct-badge ${isDone ? 'badge-done' : ''}`}>
                    {percent}% {isDone ? '✓' : ''}
                  </span>
                </div>

                <div className="goal-progress-track">
                  <div
                    className="goal-progress-fill"
                    style={{ width: `${percent}%`, background: 'var(--brand-gradient)' }}
                  ></div>
                </div>
              </div>

              {/* Counter Buttons */}
              <div className="goal-counter-row">
                <button 
                  type="button" 
                  className="btn-counter" 
                  onClick={() => handleDecrement(goal)}
                  disabled={goal.current <= 0}
                >
                  -
                </button>
                <span className="counter-val">{goal.current}</span>
                <button 
                  type="button" 
                  className="btn-counter" 
                  onClick={() => handleIncrement(goal)}
                  disabled={isDone}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Monthly Reflection Section */}
      <div className="glass-card reflection-card">
        <div className="card-header-clean">
          <div className="card-title-group">
            <Heart size={18} className="text-romantic-rose fill-romantic-rose" />
            <h3>Refleksi & Catatan Bersama Bulan Ini</h3>
          </div>
          {!isEditingReflection ? (
            <button type="button" className="btn-secondary btn-sm" onClick={() => setIsEditingReflection(true)}>
              <Edit3 size={14} /> <span>Edit Refleksi</span>
            </button>
          ) : (
            <button type="button" className="btn-primary btn-sm" onClick={handleSaveReflection}>
              <span>Simpan Refleksi</span>
            </button>
          )}
        </div>

        {!isEditingReflection ? (
          <div className="reflection-content-grid">
            <div className="reflection-box">
              <h4>✨ Hal Baik & Pencapaian</h4>
              <p>{reflection.keyWins || 'Belum ada catatan hal baik bulan ini.'}</p>
            </div>
            <div className="reflection-box">
              <h4>🌱 Hal yang Perlu Diperbaiki</h4>
              <p>{reflection.challenges || 'Belum ada catatan evaluasi.'}</p>
            </div>
            <div className="reflection-box">
              <h4>🎯 Komitmen Bulan Depan</h4>
              <p>{reflection.nextPledge || 'Belum ada komitmen baru.'}</p>
            </div>
          </div>
        ) : (
          <div className="reflection-edit-form">
            <div className="form-group">
              <label>✨ Hal Baik & Pencapaian Bersama</label>
              <textarea 
                className="input-textarea"
                rows={2}
                value={reflectionWins}
                onChange={e => setReflectionWins(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>🌱 Hal yang Perlu Diperbaiki</label>
              <textarea 
                className="input-textarea"
                rows={2}
                value={reflectionChallenges}
                onChange={e => setReflectionChallenges(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>🎯 Komitmen Bulan Depan</label>
              <textarea 
                className="input-textarea"
                rows={2}
                value={reflectionPledge}
                onChange={e => setReflectionPledge(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modal Add/Edit Goal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingGoal ? 'Edit Target Bulanan' : 'Tambah Target Bulanan'}</h3>
              <button type="button" className="btn-icon btn-sm" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveGoal} className="modal-form">
              <div className="form-group">
                <label>Judul Target *</label>
                <input 
                  type="text" 
                  className="input-text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Contoh: 18 kali olahraga bareng..."
                  required
                />
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

              <div className="form-row-3">
                <div className="form-group">
                  <label>Target Angka</label>
                  <input 
                    type="number" 
                    className="input-text"
                    value={formTarget}
                    onChange={e => setFormTarget(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capaian Saat Ini</label>
                  <input 
                    type="number" 
                    className="input-text"
                    value={formCurrent}
                    onChange={e => setFormCurrent(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Satuan</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={formUnit}
                    onChange={e => setFormUnit(e.target.value)}
                    placeholder="kali, hari, %, buku"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Catatan Target (Opsional)</label>
                <textarea 
                  className="input-textarea"
                  rows={2}
                  value={formInsights}
                  onChange={e => setFormInsights(e.target.value)}
                  placeholder="Detail rencana pencapaian..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingGoal ? 'Simpan Perubahan' : 'Buat Target'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
