import React, { useState } from 'react';
import {
  Flame,
  Target,
  TrendingUp,
  Award,
  Heart,
  Sparkles,
  CheckCircle2,
  Zap,
  BarChart3,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSuccessTune } from '../utils/audio';

const QUOTES = [
  { text: "Dua hati yang saling mendukung dan bertumbuh bersama akan mampu melewati segala rintangan.", author: "Umaar & Gitaa" },
  { text: "Kemenangan besar berawal dari konsistensi kecil yang dilakukan setiap hari dengan penuh rasa syukur.", author: "Inspirasi U&G" },
  { text: "Ketika kita saling menyemangati, beban yang berat pun terasa jauh lebih ringan.", author: "Pesan Kasih" },
  { text: "Fokus pada proses hari ini, masa depan indah sedang kita bangun bersama-sama.", author: "Langkah Bersama" },
  { text: "Hal paling indah dalam hidup adalah memiliki pasangan yang sama-sama ingin menjadi lebih baik setiap hari.", author: "Komitmen Cinta" }
];

export default function Dashboard({
  partners,
  dailyTasks,
  monthlyGoals,
  annualRoadmap,
  weeklyHistory,
  onNavigate
}) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [boostMessage, setBoostMessage] = useState(null);

  // Stats
  const totalDaily = dailyTasks.length;
  const completedDaily = dailyTasks.filter(t => t.completed).length;
  const dailyPercent = totalDaily > 0 ? Math.round((completedDaily / totalDaily) * 100) : 0;

  // Partner specific
  const uTasks = dailyTasks.filter(t => t.partner === 'u' || t.partner === 'both');
  const uCompleted = uTasks.filter(t => t.completed).length;
  const uPercent = uTasks.length > 0 ? Math.round((uCompleted / uTasks.length) * 100) : 0;

  const gTasks = dailyTasks.filter(t => t.partner === 'g' || t.partner === 'both');
  const gCompleted = gTasks.filter(t => t.completed).length;
  const gPercent = gTasks.length > 0 ? Math.round((gCompleted / gTasks.length) * 100) : 0;

  // Monthly stats
  const totalMonthly = monthlyGoals.length;
  const monthlyPercent = totalMonthly > 0
    ? Math.round(monthlyGoals.reduce((acc, g) => acc + Math.min(100, Math.round((g.current / g.target) * 100)), 0) / totalMonthly)
    : 0;

  // Annual stats
  const totalAnnual = annualRoadmap.length;
  const annualAvgProgress = totalAnnual > 0
    ? Math.round(annualRoadmap.reduce((acc, r) => acc + r.progress, 0) / totalAnnual)
    : 0;

  // Synergy Score
  const synergyScore = Math.round((dailyPercent * 0.5) + (monthlyPercent * 0.3) + (annualAvgProgress * 0.2));

  // Category counts
  const categories = ['Kesehatan', 'Karir', 'Pengembangan Diri', 'Hubungan', 'Keahlian'];
  const categoryStats = categories.map(cat => {
    const catTasks = dailyTasks.filter(t => t.category === cat);
    const catDone = catTasks.filter(t => t.completed).length;
    return {
      name: cat,
      total: catTasks.length,
      done: catDone,
      percent: catTasks.length > 0 ? Math.round((catDone / catTasks.length) * 100) : 100
    };
  });

  const handleSendBoost = () => {
    playSuccessTune();
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#ec4899', '#4f46e5', '#f59e0b']
    });
    setBoostMessage(`Semangat terkirim! 🥰 ${partners.u.name} & ${partners.g.name} semakin kompak!`);
    setTimeout(() => setBoostMessage(null), 4000);
  };

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % QUOTES.length);
  };

  return (
    <div className="dashboard-grid">
      {/* Top Banner: Synergy Score */}
      <div className="glass-card synergy-banner">
        <div className="synergy-left">
          <div className="synergy-badge">
            <Heart size={15} className="text-romantic-rose fill-romantic-rose" />
            <span>Kompak & Bertumbuh Bersama</span>
          </div>
          <h2 className="synergy-heading">
            {synergyScore >= 80 ? '🔥 Sangat Kompak & Penuh Semangat!' : synergyScore >= 50 ? '⚡ Sinergi Bagus Hari Ini' : '🌱 Mulai Konsisten Bersama'}
          </h2>
          <p className="synergy-desc">
            Saling menjaga komunikasi dan menyelesaikan kegiatan hari ini demi masa depan yang lebih baik.
          </p>

          <div className="synergy-bar-wrapper">
            <div className="synergy-bar-track">
              <div
                className="synergy-bar-fill"
                style={{ width: `${synergyScore}%` }}
              ></div>
            </div>
            <div className="synergy-bar-info">
              <span>Progres Sinergi: <strong>{synergyScore}%</strong></span>
              <span>Target: 100% Harmoni Harian</span>
            </div>
          </div>
        </div>

        <div className="synergy-right">
          <div className="synergy-score-circle">
            <svg viewBox="0 0 100 100" className="progress-ring-svg">
              <circle cx="50" cy="50" r="42" className="progress-ring-bg" />
              <circle
                cx="50"
                cy="50"
                r="42"
                className="progress-ring-circle"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * synergyScore) / 100}
              />
            </svg>
            <div className="circle-inner-content">
              <span className="circle-score-number">{synergyScore}%</span>
              <span className="circle-score-label">Sinergi</span>
            </div>
          </div>

          <button type="button" className="btn-primary btn-boost" onClick={handleSendBoost}>
            <Heart size={16} className="fill-white" />
            <span>Kirim Semangat Cinta 🥰</span>
          </button>
          {boostMessage && <div className="boost-toast">{boostMessage}</div>}
        </div>
      </div>

      {/* KPI 4-Card Row */}
      <div className="kpi-cards-grid">
        <div className="glass-card kpi-card" onClick={() => onNavigate('daily')}>
          <div className="kpi-icon-wrap kpi-daily">
            <CheckCircle2 size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Jadwal Hari Ini</span>
            <div className="kpi-val-row">
              <span className="kpi-value">{completedDaily}/{totalDaily}</span>
              <span className="kpi-badge badge-green">{dailyPercent}%</span>
            </div>
            <span className="kpi-hint">Lihat jadwal harian</span>
          </div>
        </div>

        <div className="glass-card kpi-card">
          <div className="kpi-icon-wrap kpi-streak">
            <Flame size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Streak Bersama</span>
            <div className="kpi-val-row">
              <span className="kpi-value">18</span>
              <span className="kpi-badge badge-orange">Hari Aktif</span>
            </div>
            <span className="kpi-hint">Terus jaga ritme positif</span>
          </div>
        </div>

        <div className="glass-card kpi-card" onClick={() => onNavigate('monthly')}>
          <div className="kpi-icon-wrap kpi-monthly">
            <Target size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Target Bulan Ini</span>
            <div className="kpi-val-row">
              <span className="kpi-value">{monthlyPercent}%</span>
              <span className="kpi-badge badge-blue">Sesuai Rencana</span>
            </div>
            <span className="kpi-hint">Lihat target bulanan</span>
          </div>
        </div>

        <div className="glass-card kpi-card" onClick={() => onNavigate('annual')}>
          <div className="kpi-icon-wrap kpi-annual">
            <Award size={20} />
          </div>
          <div className="kpi-details">
            <span className="kpi-label">Rencana Bersama</span>
            <div className="kpi-val-row">
              <span className="kpi-value">{annualAvgProgress}%</span>
              <span className="kpi-badge badge-purple">Roadmap</span>
            </div>
            <span className="kpi-hint">Lihat rencana jangka panjang</span>
          </div>
        </div>
      </div>

      {/* Duo Comparison & Weekly Consistency */}
      <div className="dashboard-charts-row">
        {/* Duo Growth Balance */}
        <div className="glass-card duo-comparison-card">
          <div className="card-header-clean">
            <div className="card-title-group">
              <Heart size={18} className="text-romantic-rose fill-romantic-rose" />
              <h3>Keseimbangan Kegiatan Hari Ini</h3>
            </div>
          </div>

          <div className="duo-profiles-wrapper">
            {/* Umaar */}
            <div className="duo-profile-box u-box">
              <div className="duo-profile-top">
                <span className="duo-avatar">{partners.u.avatar}</span>
                <div>
                  <h4 className="duo-name">{partners.u.name}</h4>
                  <span className="duo-role">{partners.u.role}</span>
                </div>
              </div>
              <div className="duo-stat-line">
                <span>Penyelesaian Hari Ini:</span>
                <strong>{uPercent}% ({uCompleted}/{uTasks.length})</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${uPercent}%`, background: partners.u.color }}></div>
              </div>
              <p className="duo-motto">"{partners.u.motto}"</p>
            </div>

            {/* Gitaa */}
            <div className="duo-profile-box g-box">
              <div className="duo-profile-top">
                <span className="duo-avatar">{partners.g.avatar}</span>
                <div>
                  <h4 className="duo-name">{partners.g.name}</h4>
                  <span className="duo-role">{partners.g.role}</span>
                </div>
              </div>
              <div className="duo-stat-line">
                <span>Penyelesaian Hari Ini:</span>
                <strong>{gPercent}% ({gCompleted}/{gTasks.length})</strong>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${gPercent}%`, background: partners.g.color }}></div>
              </div>
              <p className="duo-motto">"{partners.g.motto}"</p>
            </div>
          </div>

          <div className="mutual-balance-footer">
            <Heart size={15} className="text-romantic-rose fill-romantic-rose" />
            <span>
              {Math.abs(uPercent - gPercent) <= 15
                ? 'Sangat seimbang! Umaar dan Gitaa melangkah berdampingan.'
                : uPercent > gPercent
                  ? `${partners.u.name} sudah banyak menyelesaikan kegiatan, yuk semangati ${partners.g.name}!`
                  : `${partners.g.name} sangat produktif hari ini, yuk ${partners.u.name} susul semangatnya!`}
            </span>
          </div>
        </div>

        {/* Weekly Consistency Bar Chart */}
        <div className="glass-card weekly-chart-card">
          <div className="card-header-clean">
            <div className="card-title-group">
              <BarChart3 size={18} className="text-romantic-rose" />
              <h3>Konsistensi Mingguan (7 Hari)</h3>
            </div>
            <div className="chart-legend">
              <span className="legend-dot dot-u"></span> <span>{partners.u.name}</span>
              <span className="legend-dot dot-g"></span> <span>{partners.g.name}</span>
            </div>
          </div>

          <div className="weekly-bars-container">
            {weeklyHistory.map((item, idx) => {
              const uHeight = Math.round((item.uCompleted / item.totalTasks) * 100);
              const gHeight = Math.round((item.gCompleted / item.totalTasks) * 100);

              return (
                <div key={idx} className="bar-col">
                  <div className="bar-pair">
                    <div
                      className="bar-sub bar-u"
                      style={{ height: `${Math.max(12, uHeight)}%` }}
                      title={`${partners.u.name}: ${item.uCompleted}/${item.totalTasks} selesai`}
                    ></div>
                    <div
                      className="bar-sub bar-g"
                      style={{ height: `${Math.max(12, gHeight)}%` }}
                      title={`${partners.g.name}: ${item.gCompleted}/${item.totalTasks} selesai`}
                    ></div>
                  </div>
                  <span className="bar-day-label">{item.day}</span>
                </div>
              );
            })}
          </div>

          <div className="chart-footnote">
            <span>✨ Rata-rata 88% konsistensi kegiatan harian minggu ini</span>
          </div>
        </div>
      </div>

      {/* Category Wheel & Quote Card */}
      <div className="dashboard-bottom-row">
        {/* Category Breakdown */}
        <div className="glass-card category-breakdown-card">
          <div className="card-header-clean">
            <div className="card-title-group">
              <TrendingUp size={18} className="text-romantic-rose" />
              <h3>Kategori Kegiatan Hari Ini</h3>
            </div>
          </div>
          <div className="category-list">
            {categoryStats.map((cat, i) => (
              <div key={i} className="category-item-row">
                <div className="cat-item-left">
                  <span className="cat-pill">{cat.name}</span>
                  <span className="cat-count">{cat.done}/{cat.total} selesai</span>
                </div>
                <div className="cat-progress-track">
                  <div
                    className="cat-progress-fill"
                    style={{ width: `${cat.percent}%`, background: 'var(--brand-gradient)' }}
                  ></div>
                </div>
                <span className="cat-pct-label">{cat.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Inspirational Card */}
        <div className="glass-card quote-wisdom-card">
          <div className="quote-badge">
            <Sparkles size={14} />
            <span>Pesan Kasih & Motivasi</span>
          </div>
          <blockquote className="quote-text">
            "{QUOTES[quoteIndex].text}"
          </blockquote>
          <span className="quote-author">— {QUOTES[quoteIndex].author}</span>
          <button type="button" className="btn-secondary btn-quote-next" onClick={nextQuote}>
            Inspirasi Lain 💫
          </button>
        </div>
      </div>
    </div>
  );
}
