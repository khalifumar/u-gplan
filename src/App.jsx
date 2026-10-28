import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import Navigation from './components/Navigation';
import LiveStatusAndSupport from './components/LiveStatusAndSupport';
import Dashboard from './components/Dashboard';
import DailySchedule from './components/DailySchedule';
import MonthlyMilestones from './components/MonthlyMilestones';
import AnnualVision from './components/AnnualVision';
import AlarmManager from './components/AlarmManager';
import AlarmAlertModal from './components/AlarmAlertModal';
import SettingsModal from './components/SettingsModal';
import { 
  loadData, 
  saveData, 
  resetData, 
  exportDataAsJSON 
} from './utils/storage';
import { 
  getSupabaseConfig, 
  syncLiveStatusToSupabase, 
  sendSupportNoteToSupabase, 
  fetchLiveStatusesFromSupabase, 
  fetchSupportNotesFromSupabase, 
  subscribeToSupabaseRealtime 
} from './utils/supabase';
import './App.css';

function App() {
  const [data, setData] = useState(() => loadData());
  const [activeTab, setActiveTab] = useState('status'); // Default tab: 'status' (Kabar & Support)
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'u', 'g'
  const [theme, setTheme] = useState('light'); // Default theme: Light & Romance
  const [activeAlarmTriggered, setActiveAlarmTriggered] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(() => getSupabaseConfig().isConfigured);
  const lastTriggeredTimeRef = useRef('');

  // Persist to localStorage whenever data changes
  useEffect(() => {
    saveData(data);
  }, [data]);

  // Handle Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Check & sync Supabase on mount or config change
  const refreshSupabaseConnection = async () => {
    const config = getSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);

    if (config.isConfigured) {
      try {
        const [cloudStatuses, cloudNotes] = await Promise.all([
          fetchLiveStatusesFromSupabase(),
          fetchSupportNotesFromSupabase()
        ]);

        setData(prev => ({
          ...prev,
          liveStatus: cloudStatuses ? { ...prev.liveStatus, ...cloudStatuses } : prev.liveStatus,
          supportNotes: cloudNotes && cloudNotes.length > 0 ? cloudNotes : prev.supportNotes
        }));
      } catch (err) {
        console.warn('Gagal memuat data dari Supabase:', err);
      }
    }
  };

  useEffect(() => {
    refreshSupabaseConnection();

    // Subscribe to realtime updates if configured
    const unsubscribe = subscribeToSupabaseRealtime(
      (partnerId, newStatus) => {
        setData(prev => ({
          ...prev,
          liveStatus: {
            ...prev.liveStatus,
            [partnerId]: newStatus
          }
        }));
      },
      (newNote) => {
        setData(prev => {
          // Avoid duplicate note
          if (prev.supportNotes.some(n => n.id === newNote.id)) return prev;
          return {
            ...prev,
            supportNotes: [newNote, ...prev.supportNotes]
          };
        });
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Continuous Clock Checker for Alarms
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentH = now.getHours().toString().padStart(2, '0');
      const currentM = now.getMinutes().toString().padStart(2, '0');
      const currentS = now.getSeconds();
      const timeKey = `${currentH}:${currentM}`;
      const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const currentDay = dayNames[now.getDay()];

      if (currentS <= 1 && lastTriggeredTimeRef.current !== timeKey) {
        const matchingAlarm = data.alarms.find(a => 
          a.enabled && 
          a.time === timeKey && 
          (!a.repeat || a.repeat.length === 0 || a.repeat.includes(currentDay))
        );

        if (matchingAlarm) {
          lastTriggeredTimeRef.current = timeKey;
          setActiveAlarmTriggered(matchingAlarm);
        }
      }
    };

    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [data.alarms]);

  // Live Status & Support Handlers
  const handleUpdateStatus = async (partnerId, newStatus) => {
    const partnerName = partnerId === 'u' ? data.partners.u.name : data.partners.g.name;
    setData(prev => ({
      ...prev,
      liveStatus: {
        ...prev.liveStatus,
        [partnerId]: newStatus
      }
    }));

    if (isSupabaseConnected) {
      await syncLiveStatusToSupabase(
        partnerId, 
        partnerName, 
        newStatus.activity, 
        newStatus.mood, 
        newStatus.location
      );
    }
  };

  const handleSendSupportNote = async (note) => {
    setData(prev => ({
      ...prev,
      supportNotes: [note, ...prev.supportNotes]
    }));

    if (isSupabaseConnected) {
      await sendSupportNoteToSupabase(note);
    }
  };

  const handleDeleteSupportNote = (noteId) => {
    setData(prev => ({
      ...prev,
      supportNotes: prev.supportNotes.filter(n => n.id !== noteId)
    }));
  };

  // Daily Task Handlers
  const handleToggleTask = (taskId) => {
    setData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(t => 
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    }));
  };

  const handleAddTask = (newTask) => {
    setData(prev => ({
      ...prev,
      dailyTasks: [newTask, ...prev.dailyTasks]
    }));
  };

  const handleUpdateTask = (updatedTask) => {
    setData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map(t => t.id === updatedTask.id ? updatedTask : t)
    }));
  };

  const handleDeleteTask = (taskId) => {
    setData(prev => ({
      ...prev,
      dailyTasks: prev.dailyTasks.filter(t => t.id !== taskId)
    }));
  };

  // Monthly Goal Handlers
  const handleAddGoal = (newGoal) => {
    setData(prev => ({
      ...prev,
      monthlyGoals: [newGoal, ...prev.monthlyGoals]
    }));
  };

  const handleUpdateGoal = (updatedGoal) => {
    setData(prev => ({
      ...prev,
      monthlyGoals: prev.monthlyGoals.map(g => g.id === updatedGoal.id ? updatedGoal : g)
    }));
  };

  const handleDeleteGoal = (goalId) => {
    setData(prev => ({
      ...prev,
      monthlyGoals: prev.monthlyGoals.filter(g => g.id !== goalId)
    }));
  };

  const handleUpdateReflection = (newReflection) => {
    setData(prev => ({
      ...prev,
      monthlyReflection: newReflection
    }));
  };

  // Annual Roadmap Handlers
  const handleAddRoadmap = (newItem) => {
    setData(prev => ({
      ...prev,
      annualRoadmap: [newItem, ...prev.annualRoadmap]
    }));
  };

  const handleUpdateRoadmap = (updatedItem) => {
    setData(prev => ({
      ...prev,
      annualRoadmap: prev.annualRoadmap.map(r => r.id === updatedItem.id ? updatedItem : r)
    }));
  };

  const handleDeleteRoadmap = (itemId) => {
    setData(prev => ({
      ...prev,
      annualRoadmap: prev.annualRoadmap.filter(r => r.id !== itemId)
    }));
  };

  // Alarm Handlers
  const handleToggleAlarm = (alarmId) => {
    setData(prev => ({
      ...prev,
      alarms: prev.alarms.map(a => 
        a.id === alarmId ? { ...a, enabled: !a.enabled } : a
      )
    }));
  };

  const handleAddAlarm = (newAlarm) => {
    setData(prev => ({
      ...prev,
      alarms: [newAlarm, ...prev.alarms]
    }));
  };

  const handleUpdateAlarm = (updatedAlarm) => {
    setData(prev => ({
      ...prev,
      alarms: prev.alarms.map(a => a.id === updatedAlarm.id ? updatedAlarm : a)
    }));
  };

  const handleDeleteAlarm = (alarmId) => {
    setData(prev => ({
      ...prev,
      alarms: prev.alarms.filter(a => a.id !== alarmId)
    }));
  };

  const handleTriggerTestAlarm = (customAlarm) => {
    const testAlarm = customAlarm || {
      id: 'test-alarm',
      title: 'Waktunya Kegiatan Bersama 🌟',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sound: 'sunrise',
      partner: 'both',
      motivation: 'Semangat terus hari ini, kita saling mendukung setiap langkah!'
    };
    setActiveAlarmTriggered(testAlarm);
  };

  const handleSnoozeAlarm = () => {
    const currentAlarm = activeAlarmTriggered;
    setActiveAlarmTriggered(null);

    // Schedule re-trigger in 5 minutes
    setTimeout(() => {
      setActiveAlarmTriggered({
        ...currentAlarm,
        title: `[Ditunda] ${currentAlarm.title}`
      });
    }, 5 * 60 * 1000);
  };

  const handleDismissAlarm = () => {
    setActiveAlarmTriggered(null);
  };

  // Partner & Backup Handlers
  const handleUpdatePartners = (newPartners) => {
    setData(prev => ({
      ...prev,
      partners: newPartners
    }));
  };

  const handleExportData = () => {
    exportDataAsJSON(data);
  };

  const handleImportData = (importedData) => {
    setData(importedData);
    saveData(importedData);
  };

  const handleResetData = () => {
    const fresh = resetData();
    setData(fresh);
  };

  // Global Daily task stats
  const totalDaily = data.dailyTasks.length;
  const completedDaily = data.dailyTasks.filter(t => t.completed).length;
  const taskStats = {
    total: totalDaily,
    completed: completedDaily,
    percent: totalDaily > 0 ? Math.round((completedDaily / totalDaily) * 100) : 0
  };

  const activeAlarmCount = data.alarms.filter(a => a.enabled).length;

  return (
    <div className="app-shell">
      {/* Top Header */}
      <Header
        partners={data.partners}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        alarms={data.alarms}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTimer={() => setActiveTab('alarms')}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Tab Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        taskStats={taskStats}
        alarmCount={activeAlarmCount}
      />

      {/* Main Content Area */}
      <main className="main-content-wrapper">
        {activeTab === 'status' && (
          <LiveStatusAndSupport
            partners={data.partners}
            liveStatus={data.liveStatus}
            supportNotes={data.supportNotes}
            onUpdateStatus={handleUpdateStatus}
            onSendSupportNote={handleSendSupportNote}
            onDeleteSupportNote={handleDeleteSupportNote}
            isSupabaseConnected={isSupabaseConnected}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            partners={data.partners}
            dailyTasks={data.dailyTasks}
            monthlyGoals={data.monthlyGoals}
            annualRoadmap={data.annualRoadmap}
            weeklyHistory={data.weeklyHistory}
            onNavigate={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'daily' && (
          <DailySchedule
            partners={data.partners}
            tasks={data.dailyTasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
            onUpdateTask={handleUpdateTask}
            activeFilter={activeFilter}
          />
        )}

        {activeTab === 'monthly' && (
          <MonthlyMilestones
            partners={data.partners}
            goals={data.monthlyGoals}
            reflection={data.monthlyReflection}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
            onUpdateReflection={handleUpdateReflection}
            activeFilter={activeFilter}
          />
        )}

        {activeTab === 'annual' && (
          <AnnualVision
            partners={data.partners}
            roadmap={data.annualRoadmap}
            onAddRoadmap={handleAddRoadmap}
            onUpdateRoadmap={handleUpdateRoadmap}
            onDeleteRoadmap={handleDeleteRoadmap}
            activeFilter={activeFilter}
          />
        )}

        {activeTab === 'alarms' && (
          <AlarmManager
            partners={data.partners}
            alarms={data.alarms}
            onToggleAlarm={handleToggleAlarm}
            onAddAlarm={handleAddAlarm}
            onUpdateAlarm={handleUpdateAlarm}
            onDeleteAlarm={handleDeleteAlarm}
            onTriggerTestAlarm={handleTriggerTestAlarm}
            activeFilter={activeFilter}
          />
        )}
      </main>

      {/* Triggered Alarm Overlay Modal */}
      {activeAlarmTriggered && (
        <AlarmAlertModal
          alarm={activeAlarmTriggered}
          partners={data.partners}
          onDismiss={handleDismissAlarm}
          onSnooze={handleSnoozeAlarm}
        />
      )}

      {/* Settings & Supabase Modal */}
      {isSettingsOpen && (
        <SettingsModal
          partners={data.partners}
          onUpdatePartners={handleUpdatePartners}
          onExportData={handleExportData}
          onImportData={handleImportData}
          onResetData={handleResetData}
          onClose={() => setIsSettingsOpen(false)}
          onSupabaseConfigChange={refreshSupabaseConnection}
        />
      )}
    </div>
  );
}

export default App;
