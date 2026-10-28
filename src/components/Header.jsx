import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Clock, 
  Bell, 
  Sun, 
  Moon, 
  Settings, 
  Volume2, 
  Users,
  Sparkles
} from 'lucide-react';
import { playChime } from '../utils/audio';

export default function Header({ 
  partners, 
  activeFilter, 
  setActiveFilter, 
  alarms, 
  onOpenSettings, 
  onOpenTimer,
  theme, 
  toggleTheme 
}) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeStr = currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = currentTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' });

  // Upcoming alarm
  const activeAlarms = alarms.filter(a => a.enabled);
  let nextAlarmText = 'Tidak ada alarm aktif';
  if (activeAlarms.length > 0) {
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
    const sorted = [...activeAlarms].sort((a, b) => {
      const [hA, mA] = a.time.split(':').map(Number);
      const [hB, mB] = b.time.split(':').map(Number);
      const minA = hA * 60 + mA;
      const minB = hB * 60 + mB;
      const diffA = (minA - currentMinutes + 1440) % 1440;
      const diffB = (minB - currentMinutes + 1440) % 1440;
      return diffA - diffB;
    });
    const next = sorted[0];
    const [h, m] = next.time.split(':').map(Number);
    const diff = (h * 60 + m - currentMinutes + 1440) % 1440;
    const diffHours = Math.floor(diff / 60);
    const diffMins = diff % 60;
    nextAlarmText = `${next.time} (${diffHours > 0 ? diffHours + 'j ' : ''}${diffMins}m lagi)`;
  }

  return (
    <header className="glass-card header-container">
      <div className="header-brand-wrap">
        <div className="brand-logo-glow romantic-heart-badge">
          <Heart size={20} className="fill-romantic-rose text-romantic-rose animate-pulse" />
        </div>
        <div className="brand-info">
          <div className="brand-title-row">
            <h1 className="brand-title">Umaar & Gitaa</h1>
            <span className="brand-tag">U&G Plan</span>
          </div>
          <p className="brand-sub">Saling Mengabari & Bertumbuh Bersama</p>
        </div>
      </div>

      {/* Center: Live Clock & Next Alarm */}
      <div className="header-center-info">
        <div className="live-clock-badge">
          <Clock size={15} className="text-romantic-rose" />
          <span className="live-clock-time">{timeStr}</span>
          <span className="live-clock-date">{dateStr}</span>
        </div>

        <div className="next-alarm-badge" title="Klik untuk lihat Pengingat & Alarm" onClick={onOpenTimer}>
          <Bell size={13} className="alarm-icon-bell" />
          <span className="alarm-label">Alarm:</span>
          <span className="alarm-time">{nextAlarmText}</span>
        </div>
      </div>

      {/* Right Controls */}
      <div className="header-actions">
        {/* Partner Perspective Switcher */}
        <div className="partner-toggle-group">
          <button 
            type="button"
            className={`partner-tab-btn ${activeFilter === 'all' ? 'active-both' : ''}`}
            onClick={() => setActiveFilter('all')}
            title="Tampilan Bersama Umaar & Gitaa"
          >
            <Users size={14} />
            <span>Bersama</span>
          </button>
          <button 
            type="button"
            className={`partner-tab-btn ${activeFilter === 'u' ? 'active-u' : ''}`}
            onClick={() => setActiveFilter('u')}
            title={`Fokus pada kegiatan ${partners.u.name}`}
          >
            <span>{partners.u.avatar}</span>
            <span>{partners.u.name}</span>
          </button>
          <button 
            type="button"
            className={`partner-tab-btn ${activeFilter === 'g' ? 'active-g' : ''}`}
            onClick={() => setActiveFilter('g')}
            title={`Fokus pada kegiatan ${partners.g.name}`}
          >
            <span>{partners.g.avatar}</span>
            <span>{partners.g.name}</span>
          </button>
        </div>

        {/* Chime Test */}
        <button 
          type="button" 
          className="btn-icon" 
          onClick={() => playChime('zen')} 
          title="Putar Suara Relaksasi"
        >
          <Volume2 size={17} />
        </button>

        {/* Theme Toggle */}
        <button 
          type="button" 
          className="btn-icon" 
          onClick={toggleTheme} 
          title={theme === 'dark' ? 'Ganti ke Tema Terang' : 'Ganti ke Tema Gelap'}
        >
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>

        {/* Settings */}
        <button 
          type="button" 
          className="btn-icon" 
          onClick={onOpenSettings} 
          title="Profil, Supabase & Pengaturan"
        >
          <Settings size={17} />
        </button>
      </div>
    </header>
  );
}
