import { useEffect, useRef, useState } from 'react';

interface Props {
  /** Mulai memutar saat true (di-set setelah tamu menekan "Buka Undangan"). */
  enabled: boolean;
  /** Path file audio (di-serve dari /images/ via Vite). Default: /audio/turning-page.mp3 */
  src?: string;
}

/**
 * Backsound — floating toggle (kanan-bawah) untuk memutar musik latar.
 *
 * Catatan teknis:
 * - Browser modern memblokir autoplay audio dengan suara. Jadi kita mulai dengan
 *   `muted` (yang diizinkan), lalu coba unmute setelah elemen mulai play. Jika
 *   browser tetap memblokir suara, tombol akan tetap muncul sehingga tamu bisa
 *   mengaktifkan dengan satu tap.
 * - Saat tamu menekan "Buka Undangan" (`enabled=true`), interaksi klik tersebut
 *   biasanya sudah cukup untuk meng-unlock audio context — sehingga suara langsung
 *   terdengar.
 */
export function Backsound({ enabled, src = '/audio/turning-page.mp3' }: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);

  // Start ketika cover dibuka
  useEffect(() => {
    if (!enabled) return;
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0.55;
    a.muted = false;
    a.play()
      .then(() => setPlaying(true))
      .catch(() => {
        // Autoplay ditolak: tetap siap, tunggu klik tombol
        setPlaying(false);
      });
  }, [enabled]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      a.muted = false;
      a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  if (!available) return null;

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="auto"
        onError={() => setAvailable(false)}
      />
      {enabled && (
        <button
          type="button"
          className={`bs-btn ${playing ? 'is-playing' : ''}`}
          onClick={toggle}
          aria-label={playing ? 'Matikan musik' : 'Putar musik'}
          title={playing ? 'Matikan musik' : 'Putar musik'}
        >
          <span className="bs-disc" aria-hidden>
            <span className="bs-note">{playing ? '♪' : '♪'}</span>
          </span>
        </button>
      )}

      <style>{`
        .bs-btn {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 60;
          width: 46px; height: 46px;
          border-radius: 50%;
          border: 1px solid #c7a86d;
          background: #5a1e1e;
          color: #f3e6c8;
          display: grid; place-items: center;
          box-shadow: 0 8px 22px rgba(80,20,20,.35);
          padding: 0;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .bs-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(80,20,20,.45); }
        .bs-disc {
          display: grid; place-items: center;
          width: 28px; height: 28px;
          border-radius: 50%;
          background: radial-gradient(circle at 50% 50%, #c7a86d 0%, #8a6a2a 70%);
          color: #2a0f0a;
          font-size: 1rem;
        }
        .bs-btn.is-playing .bs-disc { animation: bs-spin 4s linear infinite; }
        @keyframes bs-spin { to { transform: rotate(360deg); } }

        @media (min-width: 768px) {
          .bs-btn { width: 52px; height: 52px; right: 24px; bottom: 24px; }
          .bs-disc { width: 32px; height: 32px; font-size: 1.1rem; }
        }
      `}</style>
    </>
  );
}
