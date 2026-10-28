import React, { useState } from 'react';
import { 
  Heart, 
  Send, 
  Sparkles, 
  Clock, 
  MapPin, 
  Smile, 
  Edit3, 
  Check, 
  Flame, 
  MessageCircleHeart, 
  Coffee, 
  BookOpen, 
  GraduationCap, 
  Car, 
  Utensils, 
  Laptop, 
  Trash2, 
  Database, 
  Wifi, 
  WifiOff 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessTune, playChime } from '../utils/audio';

export default function LiveStatusAndSupport({
  partners,
  liveStatus,
  supportNotes,
  onUpdateStatus,
  onSendSupportNote,
  onDeleteSupportNote,
  isSupabaseConnected,
  onOpenSettings
}) {
  // Modal / Form state for status update
  const [editingPartner, setEditingPartner] = useState(null); // 'u' or 'g'
  const [statusActivity, setStatusActivity] = useState('');
  const [statusMood, setStatusMood] = useState('Semangat 🥰');
  const [statusLocation, setStatusLocation] = useState('Rumah 🏠');

  // Support Note form state
  const [noteSender, setNoteSender] = useState('u'); // 'u' or 'g'
  const [customMessage, setCustomMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💖');

  // Quick activity suggestions
  const quickActivities = [
    { text: 'Lagi fokus kerja / belajar 📚', mood: 'Fokus ⚡', loc: 'Meja Belajar' },
    { text: 'Lagi ngoding & ngerjain proyek 💻', mood: 'Produktif 🚀', loc: 'Kamar' },
    { text: 'Lagi ada kelas / bimbingan 🎓', mood: 'Semangat ✨', loc: 'Kampus' },
    { text: 'Lagi istirahat & makan siang 🍜', mood: 'Kenyang 🥰', loc: 'Tempat Makan' },
    { text: 'Lagi otw di jalan 🛵', mood: 'Hati-hati 🛡️', loc: 'Perjalanan' },
    { text: 'Lagi santai rebahan / me-time ☕', mood: 'Rileks 🌸', loc: 'Kamar' },
    { text: 'Lagi olahraga & gerak badan 🏃', mood: 'Bugar 💪', loc: 'Luar' },
    { text: 'Sudah siap istirahat & tidur 🌙', mood: 'Mengantuk 😴', loc: 'Kamar' }
  ];

  // Quick love cheer presets
  const cheerPresets = [
    { text: 'Semangat yaa sayang kegiatannya hari ini! 🥰', emoji: '💖' },
    { text: 'Jangan lupa minum air & makan siang yaa 💧🍱', emoji: '🌸' },
    { text: 'Aku bangga banget sama perjuangan kamu! ✨', emoji: '🌟' },
    { text: 'Istirahat dulu sejenak yuk, jangan diforsir ya ☕', emoji: '🤗' },
    { text: 'Kangen kamu, lancar terus harinya! 💕', emoji: '💌' },
    { text: 'Kamu pasti bisa melewatinya dengan keren! 💪', emoji: '⚡' }
  ];

  const handleOpenEditStatus = (partnerId) => {
    setEditingPartner(partnerId);
    const current = liveStatus[partnerId] || {};
    setStatusActivity(current.activity || '');
    setStatusMood(current.mood || 'Semangat 🥰');
    setStatusLocation(current.location || 'Rumah 🏠');
  };

  const handleSaveStatus = (e) => {
    e.preventDefault();
    if (!statusActivity.trim() || !editingPartner) return;

    onUpdateStatus(editingPartner, {
      activity: statusActivity.trim(),
      mood: statusMood.trim(),
      location: statusLocation.trim(),
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    playSuccessTune();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#fda4af', '#fb7185', '#f43f5e', '#ec4899']
    });

    setEditingPartner(null);
  };

  const handleSendCheer = (messageText, emoji) => {
    const sender = noteSender === 'u' ? partners.u : partners.g;
    const newNote = {
      id: `note-${Date.now()}`,
      senderId: sender.id,
      senderName: sender.name,
      message: messageText,
      emoji: emoji || '💖',
      createdAt: new Date().toISOString()
    };

    onSendSupportNote(newNote);
    playChime('sunrise');

    // Sweet romantic heart confetti
    confetti({
      particleCount: 65,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#f43f5e', '#ec4899', '#fb7185', '#a855f7']
    });

    setCustomMessage('');
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customMessage.trim()) return;
    handleSendCheer(customMessage.trim(), selectedEmoji);
  };

  return (
    <div className="status-support-container">
      {/* Realtime Supabase Connection Banner */}
      <div className="connection-status-pill">
        <div className="conn-status-left">
          {isSupabaseConnected ? (
            <>
              <span className="status-dot dot-online"></span>
              <span className="status-text">Terhubung ke Supabase • Kabar & Support Terkoneksi Realtime</span>
            </>
          ) : (
            <>
              <span className="status-dot dot-local"></span>
              <span className="status-text">Mode Penyimpanan Lokal (Bisa hubungkan Supabase di Pengaturan)</span>
            </>
          )}
        </div>
        <button 
          type="button" 
          className="btn-link-settings"
          onClick={onOpenSettings}
        >
          Pengaturan Supabase
        </button>
      </div>

      {/* Duo Live Status Cards (Umaar & Gitaa) */}
      <div className="duo-status-grid">
        {/* Card Umaar */}
        <div className="glass-card status-card card-umaar">
          <div className="status-card-header">
            <div className="partner-identity">
              <span className="partner-avatar-badge">{partners.u.avatar}</span>
              <div>
                <h3 className="partner-name-heading">{partners.u.name}</h3>
                <span className="partner-role-sub">{partners.u.role}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-edit-status"
              onClick={() => handleOpenEditStatus('u')}
            >
              <Edit3 size={14} />
              <span>Update Kabar</span>
            </button>
          </div>

          <div className="status-activity-box">
            <span className="activity-label">Sedang apa sekarang:</span>
            <p className="activity-text">
              {liveStatus.u?.activity || 'Belum ada kabar terbaru hari ini'}
            </p>
          </div>

          <div className="status-meta-row">
            <div className="status-tag">
              <Smile size={13} className="tag-icon" />
              <span>{liveStatus.u?.mood || 'Semangat ⚡'}</span>
            </div>
            <div className="status-tag">
              <MapPin size={13} className="tag-icon" />
              <span>{liveStatus.u?.location || 'Rumah 🏠'}</span>
            </div>
            <div className="status-tag time-tag">
              <Clock size={13} className="tag-icon" />
              <span>{liveStatus.u?.updatedAt || 'Hari ini'}</span>
            </div>
          </div>
        </div>

        {/* Card Gitaa */}
        <div className="glass-card status-card card-gitaa">
          <div className="status-card-header">
            <div className="partner-identity">
              <span className="partner-avatar-badge">{partners.g.avatar}</span>
              <div>
                <h3 className="partner-name-heading">{partners.g.name}</h3>
                <span className="partner-role-sub">{partners.g.role}</span>
              </div>
            </div>
            <button
              type="button"
              className="btn-edit-status"
              onClick={() => handleOpenEditStatus('g')}
            >
              <Edit3 size={14} />
              <span>Update Kabar</span>
            </button>
          </div>

          <div className="status-activity-box">
            <span className="activity-label">Sedang apa sekarang:</span>
            <p className="activity-text">
              {liveStatus.g?.activity || 'Belum ada kabar terbaru hari ini'}
            </p>
          </div>

          <div className="status-meta-row">
            <div className="status-tag">
              <Smile size={13} className="tag-icon" />
              <span>{liveStatus.g?.mood || 'Happy 🥰'}</span>
            </div>
            <div className="status-tag">
              <MapPin size={13} className="tag-icon" />
              <span>{liveStatus.g?.location || 'Rumah 🏠'}</span>
            </div>
            <div className="status-tag time-tag">
              <Clock size={13} className="tag-icon" />
              <span>{liveStatus.g?.updatedAt || 'Hari ini'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Saling Support & Kirim Semangat Section */}
      <div className="support-section-grid">
        {/* Send Support Box */}
        <div className="glass-card support-send-card">
          <div className="card-header-clean">
            <div className="card-title-group">
              <Heart size={20} className="text-romantic-rose fill-romantic-rose" />
              <h3>Kirim Semangat & Cinta</h3>
            </div>
          </div>

          {/* Sender Switcher */}
          <div className="sender-select-row">
            <span className="sender-select-label">Kirim sebagai:</span>
            <div className="sender-toggle-wrap">
              <button
                type="button"
                className={`sender-btn ${noteSender === 'u' ? 'active-u' : ''}`}
                onClick={() => setNoteSender('u')}
              >
                <span>{partners.u.avatar}</span>
                <span>{partners.u.name}</span>
              </button>
              <button
                type="button"
                className={`sender-btn ${noteSender === 'g' ? 'active-g' : ''}`}
                onClick={() => setNoteSender('g')}
              >
                <span>{partners.g.avatar}</span>
                <span>{partners.g.name}</span>
              </button>
            </div>
          </div>

          {/* Quick Cheerful Presets */}
          <div className="cheer-presets-wrapper">
            <span className="presets-label">Pesan Semangat Sekali Klik:</span>
            <div className="presets-buttons">
              {cheerPresets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="preset-cheer-btn"
                  onClick={() => handleSendCheer(preset.text, preset.emoji)}
                >
                  <span className="preset-emoji">{preset.emoji}</span>
                  <span className="preset-text">{preset.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Input */}
          <form onSubmit={handleCustomSubmit} className="custom-cheer-form">
            <div className="custom-input-wrapper">
              <input
                type="text"
                className="input-text cheer-input"
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder={`Tulis pesan sayang atau semangat untuk ${noteSender === 'u' ? partners.g.name : partners.u.name}...`}
              />
              <button
                type="submit"
                className="btn-primary btn-send-cheer"
                disabled={!customMessage.trim()}
              >
                <Send size={15} />
                <span>Kirim</span>
              </button>
            </div>
          </form>
        </div>

        {/* Support & Kabar Feed */}
        <div className="glass-card support-feed-card">
          <div className="card-header-clean">
            <div className="card-title-group">
              <MessageCircleHeart size={20} className="text-romantic-rose" />
              <h3>Pesan Semangat Terbaru</h3>
            </div>
            <span className="badge-subtle">{supportNotes.length} Pesan</span>
          </div>

          <div className="support-notes-list">
            {supportNotes.length === 0 ? (
              <div className="empty-notes-box">
                <Heart size={28} className="empty-heart-icon" />
                <p>Belum ada pesan semangat hari ini. Yuk kirim pesan manis untuk menyemangati!</p>
              </div>
            ) : (
              supportNotes.map((note) => {
                const isU = note.senderId === 'u';
                const formattedTime = note.createdAt 
                  ? new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                return (
                  <div key={note.id} className={`support-note-item ${isU ? 'note-u' : 'note-g'}`}>
                    <div className="note-avatar-col">
                      <span className="note-sender-avatar">
                        {isU ? partners.u.avatar : partners.g.avatar}
                      </span>
                    </div>
                    <div className="note-body-col">
                      <div className="note-header-meta">
                        <strong className="note-sender-name">{note.senderName}</strong>
                        <span className="note-timestamp">{formattedTime}</span>
                      </div>
                      <p className="note-message-text">{note.message}</p>
                    </div>
                    <button
                      type="button"
                      className="btn-delete-note"
                      onClick={() => onDeleteSupportNote(note.id)}
                      title="Hapus pesan"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Modal Edit Status */}
      {editingPartner && (
        <div className="modal-backdrop" onClick={() => setEditingPartner(null)}>
          <div className="modal-content glass-card edit-status-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="card-title-group">
                <span className="modal-title-emoji">
                  {editingPartner === 'u' ? partners.u.avatar : partners.g.avatar}
                </span>
                <h3>Update Kabar {editingPartner === 'u' ? partners.u.name : partners.g.name}</h3>
              </div>
              <button 
                type="button" 
                className="btn-icon btn-sm" 
                onClick={() => setEditingPartner(null)}
              >
                ✕
              </button>
            </div>

            {/* Quick Suggestions */}
            <div className="quick-suggestions-box">
              <span className="quick-suggest-label">Pilih Cepat Kegiatan:</span>
              <div className="suggestions-chips">
                {quickActivities.map((act, i) => (
                  <button
                    key={i}
                    type="button"
                    className="suggestion-chip"
                    onClick={() => {
                      setStatusActivity(act.text);
                      setStatusMood(act.mood);
                      setStatusLocation(act.loc);
                    }}
                  >
                    {act.text}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSaveStatus} className="modal-form">
              <div className="form-group">
                <label>Sedang apa sekarang? *</label>
                <input
                  type="text"
                  className="input-text"
                  value={statusActivity}
                  onChange={e => setStatusActivity(e.target.value)}
                  placeholder="Contoh: Lagi ngerjain tugas / Otw kampus / Istirahat..."
                  required
                />
              </div>

              <div className="form-row-2">
                <div className="form-group">
                  <label>Mood / Kondisi</label>
                  <input
                    type="text"
                    className="input-text"
                    value={statusMood}
                    onChange={e => setStatusMood(e.target.value)}
                    placeholder="Semangat / Santai / Ngantuk"
                  />
                </div>
                <div className="form-group">
                  <label>Lokasi Saat Ini</label>
                  <input
                    type="text"
                    className="input-text"
                    value={statusLocation}
                    onChange={e => setStatusLocation(e.target.value)}
                    placeholder="Rumah / Kampus / Kafe"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setEditingPartner(null)}
                >
                  Batal
                </button>
                <button type="submit" className="btn-primary">
                  Simpan & Bagikan Kabar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
