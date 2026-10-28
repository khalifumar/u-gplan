// Storage and Seed Data Manager untuk Umaar & Gitaa
const STORAGE_KEY = 'ung_plan_data_v2';

export const INITIAL_DATA = {
  partners: {
    u: {
      id: 'u',
      name: 'Umaar',
      role: 'Umaar (Fokus & Strategi)',
      color: '#4f46e5',
      avatar: '👦🏻',
      motto: 'Selalu berjuang dan setia support Gitaa'
    },
    g: {
      id: 'g',
      name: 'Gitaa',
      role: 'Gitaa (Kreatif & Bahagia)',
      color: '#ec4899',
      avatar: '👧🏻',
      motto: 'Menemani dan bertumbuh penuh kasih bersama Umaar'
    }
  },
  liveStatus: {
    u: {
      activity: 'Lagi fokus nyiapin kegiatan hari ini 💻',
      mood: 'Semangat & Produktif ⚡',
      location: 'Kamar 🏠',
      updatedAt: '08:00'
    },
    g: {
      activity: 'Lagi santai sarapan & cek jadwal 🌸',
      mood: 'Ceria & Happy 🥰',
      location: 'Rumah 🏠',
      updatedAt: '08:15'
    }
  },
  supportNotes: [
    {
      id: 'note-1',
      senderId: 'g',
      senderName: 'Gitaa',
      message: 'Semangat yaa Umaar hari ini! Jangan lupa banyak minum air putih & istirahat 💖',
      emoji: '🌸',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: 'note-2',
      senderId: 'u',
      senderName: 'Umaar',
      message: 'Makasih banyak sayang! Gitaa juga lancar ya kegiatannya hari ini, I love you! 🥰',
      emoji: '⚡',
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  dailyTasks: [
    {
      id: 'd-1',
      title: 'Bangun pagi, minum air hangat & doa bersama',
      time: '06:00',
      duration: '30m',
      category: 'Kesehatan',
      partner: 'both',
      completed: true,
      notes: 'Awali hari dengan rasa syukur.'
    },
    {
      id: 'd-2',
      title: 'Fokus Kerja & Belajar Sesi 1',
      time: '08:30',
      duration: '90m',
      category: 'Karir',
      partner: 'u',
      completed: true,
      notes: 'Selesaikan prioritas utama.'
    },
    {
      id: 'd-3',
      title: 'Eksplorasi Desain & Tugas Kreatif',
      time: '09:00',
      duration: '90m',
      category: 'Keahlian',
      partner: 'g',
      completed: true,
      notes: 'Bikin moodboard & konsep visual.'
    },
    {
      id: 'd-4',
      title: 'Makan siang sehat & saling berkabar',
      time: '12:30',
      duration: '45m',
      category: 'Hubungan',
      partner: 'both',
      completed: false,
      notes: 'Cerita singkat kegiatan pagi ini.'
    },
    {
      id: 'd-5',
      title: 'Olahraga ringan & jalan sore',
      time: '17:00',
      duration: '45m',
      category: 'Kesehatan',
      partner: 'both',
      completed: false,
      notes: 'Jaga stamina bareng.'
    },
    {
      id: 'd-6',
      title: 'Baca buku bermanfaat 15-20 menit',
      time: '20:30',
      duration: '30m',
      category: 'Pengembangan Diri',
      partner: 'both',
      completed: false,
      notes: 'Tambah wawasan baru.'
    },
    {
      id: 'd-7',
      title: 'Saling ngobrol santai & doa sebelum tidur',
      time: '21:30',
      duration: '30m',
      category: 'Hubungan',
      partner: 'both',
      completed: false,
      notes: 'Saling apresiasi hal baik hari ini.'
    }
  ],
  monthlyGoals: [
    {
      id: 'm-1',
      title: 'Konsisten olahraga bareng 18 sesi',
      month: 'Bulan Ini',
      category: 'Kesehatan',
      current: 12,
      target: 18,
      unit: 'sesi',
      partner: 'both',
      status: 'in-progress',
      insights: 'Sudah jalan 3 minggu, badan terasa lebih bugar!'
    },
    {
      id: 'm-2',
      title: 'Selesaikan sertifikasi & proyek utama',
      month: 'Bulan Ini',
      category: 'Karir',
      current: 80,
      target: 100,
      unit: '% selesai',
      partner: 'u',
      status: 'in-progress',
      insights: 'Tinggal revisi akhir dan presentasi.'
    },
    {
      id: 'm-3',
      title: 'Selesaikan 3 karya desain & portofolio',
      month: 'Bulan Ini',
      category: 'Keahlian',
      current: 2,
      target: 3,
      unit: 'karya',
      partner: 'g',
      status: 'in-progress',
      insights: 'Hasil desain semakin rapi dan konsisten.'
    },
    {
      id: 'm-4',
      title: 'Quality time & date hemat setiap weekend',
      month: 'Bulan Ini',
      category: 'Hubungan',
      current: 3,
      target: 4,
      unit: 'minggu',
      partner: 'both',
      status: 'in-progress',
      insights: 'Masak bareng dan jalan-jalan santai sangat berkesan!'
    }
  ],
  monthlyReflection: {
    month: 'Bulan Ini',
    keyWins: 'Bisa saling mengingatkan hal positif dan menjaga komunikasi hangat setiap hari.',
    challenges: 'Kadang tidur terlalu larut kalau lagi keasyikan nugas.',
    nextPledge: 'Usahakan jam 22.30 sudah mulai persiapan istirahat tidur.'
  },
  annualRoadmap: [
    {
      id: 'y-1',
      title: 'Membangun gaya hidup sehat & bugar bersama',
      pillar: 'Kesehatan & Vitalitas',
      quarter: 'Q1',
      partner: 'both',
      progress: 90,
      status: 'completed',
      description: 'Pola makan bergizi, tidur cukup, dan olahraga rutin.'
    },
    {
      id: 'y-2',
      title: 'Pencapaian karir & keahlian profesional Umaar',
      pillar: 'Karir & Finansial',
      quarter: 'Q2',
      partner: 'u',
      progress: 85,
      status: 'completed',
      description: 'Meningkatkan skill teknis dan stabilitas karir.'
    },
    {
      id: 'y-3',
      title: 'Pengembangan talenta & karya Gitaa',
      pillar: 'Pengembangan Diri',
      quarter: 'Q2',
      partner: 'g',
      progress: 85,
      status: 'completed',
      description: 'Melatih kemampuan visual design dan kreativitas.'
    },
    {
      id: 'y-4',
      title: 'Tabungan impian & rencana masa depan bersama',
      pillar: 'Hubungan & Masa Depan',
      quarter: 'Q3',
      partner: 'both',
      progress: 75,
      status: 'in-progress',
      description: 'Menyiapkan target finansial dan rencana jangka panjang.'
    },
    {
      id: 'y-5',
      title: 'Liburan & refreshing bareng ke tempat impian',
      pillar: 'Hubungan & Kebahagiaan',
      quarter: 'Q4',
      partner: 'both',
      progress: 40,
      status: 'in-progress',
      description: 'Healing bersama dan merayakan proses bertumbuh satu tahun ini.'
    }
  ],
  alarms: [
    {
      id: 'a-1',
      title: 'Bangun Pagi & Doa Bersama 🌅',
      time: '05:30',
      sound: 'sunrise',
      partner: 'both',
      enabled: true,
      repeat: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'],
      motivation: 'Selamat pagi sayang! Awali hari dengan semangat dan senyuman.'
    },
    {
      id: 'a-2',
      title: 'Istirahat Siang & Minum Air 💧',
      time: '12:00',
      sound: 'zen',
      partner: 'both',
      enabled: true,
      repeat: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      motivation: 'Yuk istirahatkan mata sejenak, minum air putih, dan makan siang sehat.'
    },
    {
      id: 'a-3',
      title: 'Peregangan Sore / Jalan Santai 🏃',
      time: '17:00',
      sound: 'cyber',
      partner: 'both',
      enabled: true,
      repeat: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum'],
      motivation: 'Waktunya gerak badan supaya tidak pegal-pegal!'
    },
    {
      id: 'a-4',
      title: 'Saling Berkabar & Waktu Tidur 🌙',
      time: '21:30',
      sound: 'bell',
      partner: 'both',
      enabled: true,
      repeat: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      motivation: 'Tutup hari dengan saling mengabari dan bersyukur hari ini telah dilalui dengan baik.'
    }
  ],
  weeklyHistory: [
    { day: 'Sen', uCompleted: 6, gCompleted: 6, totalTasks: 7 },
    { day: 'Sel', uCompleted: 7, gCompleted: 6, totalTasks: 7 },
    { day: 'Rab', uCompleted: 6, gCompleted: 7, totalTasks: 7 },
    { day: 'Kam', uCompleted: 7, gCompleted: 7, totalTasks: 7 },
    { day: 'Jum', uCompleted: 6, gCompleted: 6, totalTasks: 7 },
    { day: 'Sab', uCompleted: 5, gCompleted: 5, totalTasks: 6 },
    { day: 'Min', uCompleted: 6, gCompleted: 6, totalTasks: 6 }
  ]
};

export function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // Also check previous v1 key for migration
    const oldRaw = !raw ? localStorage.getItem('ung_plan_data_v1') : null;
    
    if (!raw && !oldRaw) {
      saveData(INITIAL_DATA);
      return INITIAL_DATA;
    }

    const parsed = JSON.parse(raw || oldRaw);
    
    // Ensure partners are Umaar & Gitaa
    const partners = {
      u: {
        ...INITIAL_DATA.partners.u,
        ...(parsed.partners?.u || {}),
        name: parsed.partners?.u?.name === 'Umar' ? 'Umaar' : (parsed.partners?.u?.name || 'Umaar')
      },
      g: {
        ...INITIAL_DATA.partners.g,
        ...(parsed.partners?.g || {}),
        name: (parsed.partners?.g?.name === 'Ghina' || parsed.partners?.g?.name === 'Gita') ? 'Gitaa' : (parsed.partners?.g?.name || 'Gitaa')
      }
    };

    return {
      ...INITIAL_DATA,
      ...parsed,
      partners,
      liveStatus: parsed.liveStatus || INITIAL_DATA.liveStatus,
      supportNotes: parsed.supportNotes || INITIAL_DATA.supportNotes
    };
  } catch (e) {
    console.error('Gagal memuat data, mengembalikan data awal:', e);
    return INITIAL_DATA;
  }
}

export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Gagal menyimpan data ke localStorage:', e);
  }
}

export function resetData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem('ung_plan_data_v1');
  return INITIAL_DATA;
}

export function exportDataAsJSON(data) {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Umaar_Gitaa_Plan_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
