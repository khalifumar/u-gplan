import React, { useState } from 'react';
import { 
  Users, 
  Download, 
  Upload, 
  RotateCcw, 
  Bell, 
  Check, 
  Sparkles,
  Database,
  Key,
  Globe,
  Heart
} from 'lucide-react';
import { getSupabaseConfig, saveSupabaseConfig } from '../utils/supabase';

export default function SettingsModal({ 
  partners, 
  onUpdatePartners, 
  onExportData, 
  onImportData, 
  onResetData, 
  onClose,
  onSupabaseConfigChange
}) {
  const [activeSubTab, setActiveSubTab] = useState('partners'); // 'partners', 'supabase', 'backup'

  // Partners state
  const [uName, setUName] = useState(partners.u.name);
  const [uAvatar, setUAvatar] = useState(partners.u.avatar);
  const [uRole, setURole] = useState(partners.u.role);
  const [uMotto, setUMotto] = useState(partners.u.motto);

  const [gName, setGName] = useState(partners.g.name);
  const [gAvatar, setGAvatar] = useState(partners.g.avatar);
  const [gRole, setGRole] = useState(partners.g.role);
  const [gMotto, setGMotto] = useState(partners.g.motto);

  // Supabase state
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(currentConfig.anonKey);
  const [supabaseSavedMsg, setSupabaseSavedMsg] = useState(false);

  // Browser notification
  const [notifStatus, setNotifStatus] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  const handleSavePartners = (e) => {
    e.preventDefault();
    onUpdatePartners({
      u: {
        ...partners.u,
        name: uName.trim() || 'Umaar',
        avatar: uAvatar.trim() || '👦🏻',
        role: uRole.trim(),
        motto: uMotto.trim()
      },
      g: {
        ...partners.g,
        name: gName.trim() || 'Gitaa',
        avatar: gAvatar.trim() || '👧🏻',
        role: gRole.trim(),
        motto: gMotto.trim()
      }
    });
    onClose();
  };

  const handleSaveSupabase = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setSupabaseSavedMsg(true);
    if (onSupabaseConfigChange) {
      onSupabaseConfigChange();
    }
    setTimeout(() => {
      setSupabaseSavedMsg(false);
      onClose();
    }, 1200);
  };

  const requestNotification = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifStatus(res);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        onImportData(parsed);
        alert('Data berhasil diimpor!');
        onClose();
      } catch (err) {
        alert('File backup JSON tidak valid.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content glass-card settings-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="card-title-group">
            <Heart size={20} className="text-romantic-rose fill-romantic-rose" />
            <div>
              <h3>Pengaturan & Database</h3>
            </div>
          </div>
          <button type="button" className="btn-icon btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Sub Navigation */}
        <div className="settings-subtabs">
          <button
            type="button"
            className={`settings-subtab-btn ${activeSubTab === 'partners' ? 'subtab-active' : ''}`}
            onClick={() => setActiveSubTab('partners')}
          >
            <Users size={15} />
            <span>Profil Pasangan</span>
          </button>
          <button
            type="button"
            className={`settings-subtab-btn ${activeSubTab === 'supabase' ? 'subtab-active' : ''}`}
            onClick={() => setActiveSubTab('supabase')}
          >
            <Database size={15} />
            <span>Koneksi Supabase</span>
          </button>
          <button
            type="button"
            className={`settings-subtab-btn ${activeSubTab === 'backup' ? 'subtab-active' : ''}`}
            onClick={() => setActiveSubTab('backup')}
          >
            <Download size={15} />
            <span>Cadangan & Notifikasi</span>
          </button>
        </div>

        {/* Tab 1: Partner Profiles */}
        {activeSubTab === 'partners' && (
          <form onSubmit={handleSavePartners} className="settings-form">
            <div className="partner-settings-grid">
              {/* Partner U */}
              <div className="partner-edit-box edit-u">
                <h4>👦🏻 Profil Umaar</h4>
                <div className="form-group">
                  <label>Nama Panggilan</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={uName}
                    onChange={e => setUName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Avatar Emoji</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={uAvatar}
                    onChange={e => setUAvatar(e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div className="form-group">
                  <label>Peran / Fokus</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={uRole}
                    onChange={e => setURole(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Motto / Pesan Semangat</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={uMotto}
                    onChange={e => setUMotto(e.target.value)}
                  />
                </div>
              </div>

              {/* Partner G */}
              <div className="partner-edit-box edit-g">
                <h4>👧🏻 Profil Gitaa</h4>
                <div className="form-group">
                  <label>Nama Panggilan</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={gName}
                    onChange={e => setGName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Avatar Emoji</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={gAvatar}
                    onChange={e => setGAvatar(e.target.value)}
                    maxLength={4}
                  />
                </div>
                <div className="form-group">
                  <label>Peran / Fokus</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={gRole}
                    onChange={e => setGRole(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Motto / Pesan Semangat</label>
                  <input 
                    type="text" 
                    className="input-text"
                    value={gMotto}
                    onChange={e => setGMotto(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Batal
              </button>
              <button type="submit" className="btn-primary">
                Simpan Profil
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Supabase Integration */}
        {activeSubTab === 'supabase' && (
          <form onSubmit={handleSaveSupabase} className="settings-form">
            <div className="supabase-config-card">
              <div className="supabase-header-row">
                <div className="supabase-icon-badge">
                  <Database size={20} className="text-romantic-rose" />
                </div>
                <div>
                  <h4 className="supabase-heading">Sinkronisasi Database Supabase</h4>
                  <p className="supabase-sub">
                    Agar Umaar dan Gitaa bisa saling mengabari secara realtime dari perangkat masing-masing.
                  </p>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Globe size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Supabase Project URL
                </label>
                <input 
                  type="url" 
                  className="input-text"
                  placeholder="https://your-project.supabase.co"
                  value={supabaseUrl}
                  onChange={e => setSupabaseUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>
                  <Key size={13} style={{ display: 'inline', marginRight: 4 }} />
                  Supabase Anon Key (Public Key)
                </label>
                <input 
                  type="password" 
                  className="input-text"
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  value={supabaseAnonKey}
                  onChange={e => setSupabaseAnonKey(e.target.value)}
                />
              </div>

              <div className="supabase-instructions-box">
                <strong>Cara Mudah Setup Supabase:</strong>
                <ol>
                  <li>Buka proyek di <a href="https://supabase.com" target="_blank" rel="noreferrer">Supabase.com</a>.</li>
                  <li>Masuk ke menu <strong>SQL Editor</strong>, lalu tempel isi file <code>supabase_schema.sql</code> yang telah disiapkan di root proyek ini dan klik Run.</li>
                  <li>Salin <strong>Project URL</strong> dan <strong>Anon Public Key</strong> dari menu <strong>Project Settings -&gt; API</strong> ke form di atas, lalu klik Simpan.</li>
                </ol>
              </div>

              {supabaseSavedMsg && (
                <div className="supabase-success-alert">
                  <Check size={16} /> Kredensial Supabase berhasil disimpan! Menghubungkan...
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>
                Tutup
              </button>
              <button type="submit" className="btn-primary">
                Simpan & Hubungkan Supabase
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Backup & Browser Notifications */}
        {activeSubTab === 'backup' && (
          <div className="settings-form">
            {/* Desktop Push Notifications */}
            <div className="settings-section-box">
              <div className="section-title-row">
                <Bell size={18} className="text-romantic-rose" />
                <h4>Notifikasi Pengingat di Perangkat</h4>
              </div>
              <p className="card-sub">Bunyikan alarm dan tampilkan pengingat di layar saat waktu jadwal tiba.</p>
              <div className="notif-btn-row">
                <button 
                  type="button" 
                  className="btn-secondary btn-sm"
                  onClick={requestNotification}
                  disabled={notifStatus === 'granted'}
                >
                  {notifStatus === 'granted' ? '✅ Notifikasi Aktif' : 'Aktifkan Notifikasi'}
                </button>
              </div>
            </div>

            {/* Data Export & Backup */}
            <div className="settings-section-box">
              <div className="section-title-row">
                <Download size={18} className="text-romantic-rose" />
                <h4>Cadangan Data (JSON)</h4>
              </div>
              <p className="card-sub">Simpan cadangan data jadwal & kegiatan ke komputer atau muat kembali dari file.</p>
              <div className="data-actions-row">
                <button type="button" className="btn-secondary btn-sm" onClick={onExportData}>
                  <Download size={14} /> Unduh Cadangan
                </button>
                
                <label className="btn-secondary btn-sm btn-upload-label">
                  <Upload size={14} /> Pulihkan Data
                  <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>

                <button 
                  type="button" 
                  className="btn-secondary btn-sm btn-reset-data" 
                  onClick={() => {
                    if (confirm('Kembalikan semua data ke tampilan awal?')) {
                      onResetData();
                      onClose();
                    }
                  }}
                >
                  <RotateCcw size={14} /> Reset Data Awal
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={onClose}>
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
