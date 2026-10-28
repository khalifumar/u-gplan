import { createClient } from '@supabase/supabase-js';

// Configuration keys from environment or localStorage override
const SUPABASE_URL_KEY = 'ung_supabase_url';
const SUPABASE_ANON_KEY_KEY = 'ung_supabase_anon_key';

export function getSupabaseConfig() {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  
  const localUrl = localStorage.getItem(SUPABASE_URL_KEY) || '';
  const localKey = localStorage.getItem(SUPABASE_ANON_KEY_KEY) || '';

  return {
    url: localUrl || envUrl,
    anonKey: localKey || envKey,
    isConfigured: Boolean((localUrl || envUrl) && (localKey || envKey))
  };
}

export function saveSupabaseConfig(url, anonKey) {
  if (url) localStorage.setItem(SUPABASE_URL_KEY, url.trim());
  else localStorage.removeItem(SUPABASE_URL_KEY);

  if (anonKey) localStorage.setItem(SUPABASE_ANON_KEY_KEY, anonKey.trim());
  else localStorage.removeItem(SUPABASE_ANON_KEY_KEY);
}

let supabaseInstance = null;
let currentConfigKey = '';

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (!config.isConfigured) return null;

  const key = `${config.url}_${config.anonKey}`;
  if (supabaseInstance && currentConfigKey === key) {
    return supabaseInstance;
  }

  try {
    supabaseInstance = createClient(config.url, config.anonKey, {
      auth: { persistSession: false },
      realtime: { params: { eventsPerSecond: 10 } }
    });
    currentConfigKey = key;
    return supabaseInstance;
  } catch (err) {
    console.error('Gagal menginisialisasi Supabase client:', err);
    return null;
  }
}

// Service helper to update Live Status in Supabase
export async function syncLiveStatusToSupabase(partnerId, partnerName, activity, mood, location) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('partner_status')
      .upsert({
        id: partnerId,
        partner_name: partnerName,
        activity,
        mood,
        location,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase sync status error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase error:', e);
    return false;
  }
}

// Service helper to send a Love & Cheer Support Note
export async function sendSupportNoteToSupabase(note) {
  const supabase = getSupabaseClient();
  if (!supabase) return false;

  try {
    const { error } = await supabase
      .from('support_notes')
      .insert({
        id: note.id,
        sender_id: note.senderId,
        sender_name: note.senderName,
        message: note.message,
        emoji: note.emoji || '💖',
        created_at: new Date().toISOString()
      });

    if (error) {
      console.warn('Supabase send note error:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    console.warn('Supabase error:', e);
    return false;
  }
}

// Service helper to fetch latest statuses from Supabase
export async function fetchLiveStatusesFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('partner_status')
      .select('*');

    if (error || !data) return null;

    const formatted = {};
    data.forEach(item => {
      formatted[item.id] = {
        activity: item.activity,
        mood: item.mood,
        location: item.location,
        updatedAt: item.updated_at ? new Date(item.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''
      };
    });
    return formatted;
  } catch (e) {
    return null;
  }
}

// Service helper to fetch support notes from Supabase
export async function fetchSupportNotesFromSupabase() {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from('support_notes')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(30);

    if (error || !data) return null;
    return data.map(item => ({
      id: item.id,
      senderId: item.sender_id,
      senderName: item.sender_name,
      message: item.message,
      emoji: item.emoji,
      createdAt: item.created_at
    }));
  } catch (e) {
    return null;
  }
}

// Subscribe to realtime updates
export function subscribeToSupabaseRealtime(onStatusChange, onNewNote) {
  const supabase = getSupabaseClient();
  if (!supabase) return () => {};

  const channel = supabase.channel('ung-realtime-room');

  if (onStatusChange) {
    channel.on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'partner_status' },
      payload => {
        if (payload.new) {
          onStatusChange(payload.new.id, {
            activity: payload.new.activity,
            mood: payload.new.mood,
            location: payload.new.location,
            updatedAt: new Date(payload.new.updated_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }
    );
  }

  if (onNewNote) {
    channel.on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'support_notes' },
      payload => {
        if (payload.new) {
          onNewNote({
            id: payload.new.id,
            senderId: payload.new.sender_id,
            senderName: payload.new.sender_name,
            message: payload.new.message,
            emoji: payload.new.emoji,
            createdAt: payload.new.created_at
          });
        }
      }
    );
  }

  channel.subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
