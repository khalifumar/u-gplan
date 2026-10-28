-- ===================================================
-- Skrip Skema Supabase untuk Platform Umaar & Gitaa
-- Jalankan skrip ini di SQL Editor dashboard Supabase Anda
-- ===================================================

-- 1. Tabel Status & Kabar Terkini (Umaar & Gitaa)
CREATE TABLE IF NOT EXISTS public.partner_status (
    id TEXT PRIMARY KEY, -- 'u' atau 'g'
    partner_name TEXT NOT NULL,
    activity TEXT NOT NULL,
    mood TEXT DEFAULT 'Semangat 🥰',
    location TEXT DEFAULT 'Rumah 🏠',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan RLS (Row Level Security) tapi izinkan akses publik/anon untuk kemudahan
ALTER TABLE public.partner_status ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read status" ON public.partner_status FOR SELECT USING (true);
CREATE POLICY "Allow public write status" ON public.partner_status FOR ALL USING (true);

-- 2. Tabel Catatan Semangat & Pesan Support (Love Notes)
CREATE TABLE IF NOT EXISTS public.support_notes (
    id TEXT PRIMARY KEY,
    sender_id TEXT NOT NULL,
    sender_name TEXT NOT NULL,
    message TEXT NOT NULL,
    emoji TEXT DEFAULT '💖',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.support_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read support_notes" ON public.support_notes FOR SELECT USING (true);
CREATE POLICY "Allow public insert support_notes" ON public.support_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public delete support_notes" ON public.support_notes FOR DELETE USING (true);

-- 3. Data Awal (Seed Data)
INSERT INTO public.partner_status (id, partner_name, activity, mood, location, updated_at)
VALUES 
  ('u', 'Umaar', 'Lagi fokus nyiapin kegiatan hari ini 💻', 'Fokus & Semangat ⚡', 'Kamar', now()),
  ('g', 'Gitaa', 'Lagi santai sarapan & cek jadwal 🌸', 'Happy & Ceria 🥰', 'Rumah', now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.support_notes (id, sender_id, sender_name, message, emoji, created_at)
VALUES 
  ('note-1', 'g', 'Gitaa', 'Semangat hari ini ya sayang! Jangan lupa makan siang 💖', '🌸', now() - interval '2 hour'),
  ('note-2', 'u', 'Umaar', 'Makasih sayang, kamu juga semangat kegiatannya hari ini! 🥰', '⚡', now() - interval '1 hour')
ON CONFLICT (id) DO NOTHING;

-- 4. Aktifkan Realtime Replication untuk tabel partner_status dan support_notes
ALTER PUBLICATION supabase_realtime ADD TABLE public.partner_status;
ALTER PUBLICATION supabase_realtime ADD TABLE public.support_notes;
