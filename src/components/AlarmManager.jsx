import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Plus, 
  Volume2, 
  Play, 
  Pause, 
  RotateCcw, 
  Trash2, 
  Edit3, 
  Sparkles, 
  Clock,
  Heart
} from 'lucide-react';
import { playChime } from '../utils/audio';

export default function AlarmManager({ 
  partners, 
  alarms, 
  onToggleAlarm, 
  onAddAlarm, 
  onUpdateAlarm, 
  onDeleteAlarm, 
  onTriggerTestAlarm,
  activeFilter 
}) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAlarm, setEditingAlarm] = useState(null);

  // Focus Timer State
  const [timerMode, setTimerMode] = useState('focus'); // focus, shortBreak, longBreak
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [pomodoroCount, setPomodoroCount] = useState(3);

  // Form states
  const [formTitle, setFormTitle] = useState('');
  const [formTime, setFormTime] = useState('07:00');
  const [formSound, setFormSound] = useState('sunrise');
  const [formPartner, setFormPartner] = useState('both');
  const [formMotivation, setFormMotivation] = useState('');
  const [formDays, setFormDays] = useState(['Sen', 'Sel', 'Rab', 'Kam', 'Jum']);

  const allDays = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

  const soundOptions = [
    { id: 'sunrise', name: 'Alunan Pagi Harmoni (Melodi Tenang)' },
    { id: 'zen', name: 'Genta Zen Relaksasi (528Hz Suara Jernih)' },
    { id: 'cyber', name: 'Ritme Semangat Modern (Nada Lembut)' },
    { id: 'bell', name: 'Lonceng Damai & Sejuk (Menenangkan)' }
  ];

  // Focus Timer interval
  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      playChime('bell');
      if (timerMode === 'focus') {
        setPomodoroCount(prev => prev + 1);
      }
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds, timerMode]);

  const switchTimerMode = (mode) => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === 'focus') setTimerSeconds(25 * 60);
    if (mode === 'shortBreak') setTimerSeconds(5 * 60);
    if (mode === 'longBreak') setTimerSeconds(15 * 60);
  };

  const toggleTimer = () => {
    setIsTimerRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'focus') setTimerSeconds(25 * 60);
    if (timerMode === 'shortBreak') setTimerSeconds(5 * 60);
    if (timerMode === 'longBreak') setTimerSeconds(15 * 60);
  };

  const timerMin = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
  const timerSec = (timerSeconds % 60).toString().padStart(2, '0');

  const filteredAlarms = alarms.filter(a => {
    if (activeFilter === 'u' && a.partner !== 'u' && a.partner !== 'both') return false;
    if (activeFilter === 'g' && a.partner !== 'g' && a.partner !== 'both') return false;
    return true;
  });

  const openAddModal = () => {
    setEditingAlarm(null);
    setFormTitle('');
    setFormTime('07:00');
    setFormSound('sunrise');
    setFormPartner(activeFilter === 'all' ? 'both' : activeFilter);
    setFormMotivation('');
    setFormDays(['Sen', 'Sel', 'Rab', 'Kam', 'Jum']);
    setIsAddModalOpen(true);
  };

  const openEditModal = (alarm) => {
    setEditingAlarm(alarm);
    setFormTitle(alarm.title);
    setFormTime(alarm.time);
    setFormSound(alarm.sound || 'sunrise');
    setFormPartner(alarm.partner);
    setFormMotivation(alarm.motivation || '');
    setFormDays(alarm.repeat || allDays);
    setIsAddModalOpen(true);
  };

  const handleDayToggle = (day) => {
    setFormDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSaveAlarm = (e) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingAlarm) {
      onUpdateAlarm({
        ...editingAlarm,
        title: formTitle.trim(),
        time: formTime,
        sound: formSound,
        partner: formPartner,
        motivation: formMotivation.trim(),
        repeat: formDays
      });
    } else {
      const newAlarm = {
        id: `a-${Date.now()}`,
        title: formTitle.trim(),
        time: formTime,
        sound: formSound,
        partner: formPartner,
        enabled: true,
        repeat: formDays,
        motivation: formMotivation.trim()
      };
      onAddAlarm(newAlarm);
    }
    setIsAddModalOpen(false);
  };

  return (
    <div className="alarm-manager-grid">
      {/* Left: Scheduled Alarms List */}
      <div className="glass-card alarms-list-card">
        <div className="card-header-clean">
          <div className="card-title-group">
            <Bell size={20} className="text-romantic-rose" />
            <div>
              <h3>Daftar Pengingat & Alarm</h3>
              <p className="card-sub">{filteredAlarms.filter(a => a.enabled).length} pengingat aktif</p>
            </div>
          </div>
          <button type="button" className="btn-primary btn-sm" onClick={openAddModal}>
            <Plus size={15} /> <span>Tambah Alarm</span>
          </button>
        </div>

        <div className="alarms-list">
          {filteredAlarms.length === 0 ? (
            <div className="empty-alarms-box">
              <p>Belum ada alarm. Buat pengingat untuk rutinitas penting bersama.</p>
            </div>
          ) : (
            filteredAlarms.map((alarm) => {
              const isPartnerBoth = alarm.partner === 'both';
              const isPartnerU = alarm.partner === 'u';

              return (
                <div key={alarm.id} className={`alarm-row ${alarm.enabled ? 'alarm-active' : 'alarm-disabled'}`}>
                  <div className="alarm-time-group">
                    <span className="alarm-big-time">{alarm.time}</span>
                    <span className={`partner-pill ${isPartnerBoth ? 'badge-both' : isPartnerU ? 'badge-u' : 'badge-g'}`}>
                      {isPartnerBoth ? 'Bersama' : isPartnerU ? partners.u.name : partners.g.name}
                    </span>
                  </div>

                  <div className="alarm-meta-group">
                    <h4 className="alarm-title-text">{alarm.title}</h4>
                    {alarm.motivation && (
                      <p className="alarm-motivation-text">"{alarm.motivation}"</p>
                    )}
                    <div className="alarm-days-pills">
                      {allDays.map(day => (
                        <span 
                          key={day} 
                          className={`day-mini-pill ${(alarm.repeat || []).includes(day) ? 'day-active' : ''}`}
                        >
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions & Switch Toggle */}
                  <div className="alarm-actions-group">
                    <button 
                      type="button" 
                      className="btn-icon btn-sm" 
                      onClick={() => playChime(alarm.sound || 'sunrise')}
                      title="Tes suara"
                    >
                      <Volume2 size={13} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-icon btn-sm" 
                      onClick={() => openEditModal(alarm)}
                      title="Edit alarm"
                    >
                      <Edit3 size={13} />
                    </button>
                    <button 
                      type="button" 
                      className="btn-icon btn-sm btn-delete" 
                      onClick={() => onDeleteAlarm(alarm.id)}
                      title="Hapus alarm"
                    >
                      <Trash2 size={13} />
                    </button>

                    <label className="switch-toggle" title={alarm.enabled ? 'Matikan alarm' : 'Aktifkan alarm'}>
                      <input 
                        type="checkbox" 
                        checked={alarm.enabled} 
                        onChange={() => onToggleAlarm(alarm.id)} 
                      />
                      <span className="slider-round"></span>
                    </label>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right: Romantic Focus Timer (Pomodoro) */}
      <div className="glass-card timer-pomodoro-card">
        <div className="card-header-clean">
          <div className="card-title-group">
            <Clock size={18} className="text-romantic-rose" />
            <h3>Timer Fokus Bersama</h3>
          </div>
          <span className="badge-subtle">{pomodoroCount} Sesi Selesai</span>
        </div>

        {/* Mode Switcher */}
        <div className="timer-modes-row">
          <button 
            type="button" 
            className={`timer-mode-btn ${timerMode === 'focus' ? 'mode-active' : ''}`}
            onClick={() => switchTimerMode('focus')}
          >
            Fokus (25m)
          </button>
          <button 
            type="button" 
            className={`timer-mode-btn ${timerMode === 'shortBreak' ? 'mode-active' : ''}`}
            onClick={() => switchTimerMode('shortBreak')}
          >
            Istirahat (5m)
          </button>
          <button 
            type="button" 
            className={`timer-mode-btn ${timerMode === 'longBreak' ? 'mode-active' : ''}`}
            onClick={() => switchTimerMode('longBreak')}
          >
            Santai (15m)
          </button>
        </div>

        {/* Giant Timer Display */}
        <div className="giant-timer-display">
          <div className="timer-digits-wrap">
            <span className="digits">{timerMin}:{timerSec}</span>
          </div>
          <span className="timer-mode-caption">
            {timerMode === 'focus' ? 'Waktu Fokus Produktif 🎯' : 'Istirahat & Minum Air 💧'}
          </span>
        </div>

        {/* Timer Controls */}
        <div className="timer-controls-row">
          <button 
            type="button" 
            className={`btn-primary btn-timer-main ${isTimerRunning ? 'btn-pause' : ''}`} 
            onClick={toggleTimer}
          >
            {isTimerRunning ? <Pause size={18} /> : <Play size={18} />}
            <span>{isTimerRunning ? 'Jeda' : 'Mulai'}</span>
          </button>
          <button type="button" className="btn-secondary" onClick={resetTimer} title="Reset waktu">
            <RotateCcw size={16} />
            <span>Reset</span>
          </button>
        </div>

        {/* Sound test buttons */}
        <div className="quick-sound-test-box">
          <span className="quick-sound-title">Uji Coba Suara Alarm:</span>
          <div className="sound-chips-row">
            {soundOptions.map(s => (
              <button 
                key={s.id} 
                type="button" 
                className="sound-chip-btn"
                onClick={() => playChime(s.id)}
              >
                <Volume2 size={12} />
                <span>{s.name.split(' (')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Add / Edit Alarm Modal */}
      {isAddModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content glass-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAlarm ? 'Edit Pengingat' : 'Tambah Pengingat Baru'}</h3>
              <button type="button" className="btn-icon btn-sm" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveAlarm} className="modal-form">
              <div className="form-group">
                <label>Judul Pengingat *</label>
                <input 
                  type="text" 
                  className="input-text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Contoh: Bangun Pagi / Minum Air Siang..."
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Waktu Alarm</label>
                  <input 
                    type="time" 
                    className="input-text"
                    value={formTime}
                    onChange={e => setFormTime(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Untuk Siapa</label>
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
                <label>Pilihan Suara Alarm</label>
                <select 
                  className="input-select"
                  value={formSound}
                  onChange={e => setFormSound(e.target.value)}
                >
                  {soundOptions.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Ulangi Hari</label>
                <div className="days-picker-row">
                  {allDays.map(day => (
                    <button
                      key={day}
                      type="button"
                      className={`day-picker-btn ${formDays.includes(day) ? 'picker-active' : ''}`}
                      onClick={() => handleDayToggle(day)}
                    >
                      {day}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Pesan Motivasi / Pengingat (Opsional)</label>
                <textarea 
                  className="input-textarea"
                  rows={2}
                  value={formMotivation}
                  onChange={e => setFormMotivation(e.target.value)}
                  placeholder="Kata-kata penyemangat saat alarm berbunyi..."
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  {editingAlarm ? 'Simpan Perubahan' : 'Buat Pengingat'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
