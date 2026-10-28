import React from 'react';
import { 
  HeartHandshake,
  LayoutDashboard, 
  CalendarDays, 
  Target, 
  Compass, 
  Bell 
} from 'lucide-react';

export default function Navigation({ activeTab, setActiveTab, taskStats, alarmCount }) {
  const tabs = [
    {
      id: 'status',
      label: 'Kabar & Support',
      shortLabel: 'Kabar',
      icon: HeartHandshake,
      badge: 'Live'
    },
    {
      id: 'dashboard',
      label: 'Dashboard',
      shortLabel: 'Dashboard',
      icon: LayoutDashboard,
      badge: `${taskStats.percent}%`
    },
    {
      id: 'daily',
      label: 'Jadwal Hari Ini',
      shortLabel: 'Jadwal',
      icon: CalendarDays,
      badge: `${taskStats.completed}/${taskStats.total}`
    },
    {
      id: 'monthly',
      label: 'Target Bulanan',
      shortLabel: 'Bulanan',
      icon: Target,
      badge: null
    },
    {
      id: 'annual',
      label: 'Rencana Bersama',
      shortLabel: 'Tahunan',
      icon: Compass,
      badge: null
    },
    {
      id: 'alarms',
      label: 'Pengingat & Alarm',
      shortLabel: 'Alarm',
      icon: Bell,
      badge: alarmCount > 0 ? `${alarmCount} aktif` : null
    }
  ];

  return (
    <nav className="nav-container">
      <div className="nav-tabs-wrapper">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab-item ${isActive ? 'nav-tab-active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={17} className="nav-tab-icon" />
              <span className="nav-tab-label-full">{tab.label}</span>
              <span className="nav-tab-label-short">{tab.shortLabel}</span>
              {tab.badge && (
                <span className={`nav-tab-badge ${isActive ? 'badge-highlight' : ''}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
