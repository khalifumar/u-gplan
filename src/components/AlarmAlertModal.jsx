import React, { useEffect } from 'react';
import { Bell, Sparkles, CheckCircle2, Clock, Heart } from 'lucide-react';
import { startAlarmSound, stopAlarmSound, playSuccessTune } from '../utils/audio';
import confetti from 'canvas-confetti';

export default function AlarmAlertModal({ alarm, partners, onDismiss, onSnooze }) {
  useEffect(() => {
    startAlarmSound(alarm?.sound || 'sunrise');

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`Pengingat: ${alarm?.title || 'Waktunya Kegiatan'}`, {
          body: alarm?.motivation || 'Waktunya menjalankan rutinitas hari ini bersama!',
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">💖</text></svg>'
        });
      } catch (e) {
        // Ignore notification errors
      }
    }

    return () => {
      stopAlarmSound();
    };
  }, [alarm]);

  const handleDismiss = () => {
    stopAlarmSound();
    playSuccessTune();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.5 },
      colors: ['#f43f5e', '#ec4899', '#fda4af']
    });
    onDismiss();
  };

  const handleSnooze = () => {
    stopAlarmSound();
    onSnooze();
  };

  const isPartnerBoth = alarm?.partner === 'both';
  const isPartnerU = alarm?.partner === 'u';

  return (
    <div className="alarm-modal-backdrop">
      <div className="alarm-modal-dialog glass-card">
        {/* Animated Rings */}
        <div className="alarm-pulse-rings">
          <div className="ring ring-1"></div>
          <div className="ring ring-2"></div>
          <div className="ring ring-3"></div>
          <div className="alarm-center-icon">
            <Bell size={40} className="alarm-bell-animated text-romantic-rose" />
          </div>
        </div>

        <div className="alarm-modal-body">
          <div className="alarm-alert-time-badge">
            <Clock size={16} />
            <span>{alarm?.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>

          <span className={`partner-pill ${isPartnerBoth ? 'badge-both' : isPartnerU ? 'badge-u' : 'badge-g'}`}>
            {isPartnerBoth ? 'Untuk Kita Berdua' : isPartnerU ? `Khusus ${partners.u.name}` : `Khusus ${partners.g.name}`}
          </span>

          <h2 className="alarm-alert-title">{alarm?.title || 'Waktunya Kegiatan!'}</h2>

          {alarm?.motivation && (
            <div className="alarm-motivation-callout">
              <Heart size={16} className="text-romantic-rose fill-romantic-rose" />
              <p>"{alarm.motivation}"</p>
            </div>
          )}

          <div className="alarm-modal-actions-row">
            <button type="button" className="btn-secondary btn-snooze" onClick={handleSnooze}>
              Tunda 5 Menit
            </button>
            <button type="button" className="btn-primary btn-dismiss" onClick={handleDismiss}>
              <CheckCircle2 size={18} />
              <span>Selesai / Matikan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
