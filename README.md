## ✨ Fitur Utama

1. **Kabar & Support (Live Updates & Love Notes)**
   - **Status Terkini Umaar & Gitaa**: Ketahui pasangan sedang apa sekarang (*"Lagi fokus belajar"*, *"Lagi istirahat makan"*, *"Lagi otw"*, dll.) lengkap dengan mood, lokasi, dan waktu pembaruan.
   - **Kirim Semangat & Cinta**: Kirim pesan manis / cheer sekali klik atau ketik pesan khusus disertai animasi konfeti hati dan alunan suara manis.
   - **Riwayat Pesan Support**: Rekam jejak pesan kasih dan saling menyemangati.

2. **Ringkasan (Dashboard)**
   - Skor Sinergi & Harmoni Harian.
   - Keseimbangan penyelesaian kegiatan Umaar dan Gitaa hari ini.
   - Grafik konsistensi 7 hari terakhir.
   - Kata mutiara & motivasi penyemangat.

3. **Jadwal Hari Ini (Daily Schedule)**
   - Pengelompokan waktu: Pagi, Siang, Sore, Malam.
   - Kategori: Kesehatan, Karir, Pengembangan Diri, Hubungan, Keahlian.
   - Filter pelaksana: Bersama, Umaar, atau Gitaa.

4. **Target Bulanan (Monthly Milestones)**
   - Target angka & progres persentase per bulan.
   - Refleksi bersama: Hal baik yang diraih & komitmen perbaikan.

5. **Rencana Bersama (Annual Vision Roadmap)**
   - Pembagian target kuartal (Q1 - Q4) untuk rencana jangka panjang dan liburan impian bersama.

6. **Pengingat & Alarm**
   - Pengingat kegiatan dengan alunan melodi menenangkan.
   - Timer fokus (Pomodoro) untuk produktif bareng.

---

## 🚀 Panduan Setup Database Supabase

Website ini sudah dilengkapi integrasi **Supabase** secara realtime dan fallback aman ke penyimpanan lokal (offline):

1. Buat akun / proyek gratis di [Supabase.com](https://supabase.com).
2. Masuk ke menu **SQL Editor** di dashboard Supabase Anda.
3. Salin seluruh isi file [`supabase_schema.sql`](./supabase_schema.sql) ke SQL Editor lalu klik tombol **Run**.
4. Buka menu **Project Settings -> API**, salin:
   - **Project URL**
   - **anon / public key**
5. Anda bisa langsung menempelkannya di aplikasi melalui menu **Pengaturan (Ikon Roda Gigi) -> Tab Koneksi Supabase**, atau membuat file `.env`:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## 🌐 Panduan Hosting di Vercel

1. Push repository ini ke akun GitHub Anda.
2. Buka [Vercel.com](https://vercel.com) dan pilih **Add New Project**.
3. Import repository GitHub Anda.
4. Pada bagian **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL` = (URL Supabase Anda)
   - `VITE_SUPABASE_ANON_KEY` = (Anon Key Supabase Anda)
5. Klik **Deploy**! Website sudah live dan bisa diakses oleh Umaar & Gitaa dari HP atau laptop masing-masing.

---

## 💻 Menjalankan di Komputer Lokal

```bash
# Instalasi dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Membangun bundle produksi
npm run build
```
