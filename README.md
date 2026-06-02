# Undangan Pernikahan — Sekarvinda &amp; Laksantio

Wedding invitation web app dengan tema **Adat Jawa** (keraton / sogan / gold / maroon), dibuat dengan **React + TypeScript + GSAP + Three.js (R3F)** dan smooth scroll **Lenis**.

## ✨ Fitur

- **Cover** dengan tombol "Buka Undangan" + animasi reveal
- **3D background** procedural Gunungan (kayon wayang) + partikel emas, reaktif terhadap scroll
- **Smooth scroll** (Lenis) terintegrasi GSAP ScrollTrigger
- **Section reveal** otomatis saat scroll
- **Countdown** real-time menuju hari H
- **RSVP & Buku Tamu** (in-memory demo, mudah diganti ke backend)
- **Music toggle** (gamelan placeholder)
- **Personalisasi tamu** via query param `?to=Nama%20Tamu`
- **Mobile-first**, responsif

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Buka http://localhost:5173

Build production:
```bash
npm run build
npm run preview
```

## 📁 Struktur

```
src/
  components/
    three/        # Scene 3D (Gunungan, Particles)
    Cover.tsx     # Halaman cover + tombol Buka Undangan
    Pambuko.tsx   # Pembukaan + quote Jawa
    Mempelai.tsx  # Bride & Groom + silsilah
    AcaraSection.tsx # Akad & Resepsi + countdown
    Galeri.tsx    # Foto pre-wedding
    RSVP.tsx      # Form RSVP & ucapan
    Tutup.tsx     # Penutup "Nuwun"
    MusicToggle.tsx
  data/invitation.ts   # Edit konten di sini
  hooks/
    useLenis.ts
    useSectionReveal.ts
  styles/global.css    # Theme tokens (warna, font)
images/
  cover.png            # Disajikan oleh Vite di "/cover.png"
```

## 🎨 Customization

- **Konten** (nama, tanggal, alamat, dll.): edit [src/data/invitation.ts](src/data/invitation.ts)
- **Warna & font**: edit token CSS di [src/styles/global.css](src/styles/global.css)
- **Musik**: simpan file `gamelan.mp3` di folder `images/audio/gamelan.mp3` (Vite akan menyajikannya di `/audio/gamelan.mp3`) — atau ubah `src` di [src/components/MusicToggle.tsx](src/components/MusicToggle.tsx)
- **3D Gunungan**: bentuknya didefinisikan procedural di [src/components/three/Gunungan.tsx](src/components/three/Gunungan.tsx) — bisa diganti load model `.glb` dengan `useGLTF` dari `@react-three/drei`

## 📝 Catatan teknis

- `vite.config.ts` mengatur `publicDir: 'images'` agar file di `/images` langsung tersaji sebagai static root.
- GSAP `ScrollTrigger` di-sync dengan Lenis pada [src/hooks/useLenis.ts](src/hooks/useLenis.ts).
- Body scroll dikunci sampai user menekan **Buka Undangan**.

## ✅ TODO (silakan request)

- Ganti gunungan procedural dengan model `.glb` asli
- Tambah motif batik (parang / kawung) sebagai texture wayang
- Integrasi RSVP ke Google Sheets / Firebase
- QRIS / Digital Ang-pau
- Live streaming embed
- Maps embed di section Acara

Komentari bagian mana saja yang ingin diubah — dan kita iterate.
