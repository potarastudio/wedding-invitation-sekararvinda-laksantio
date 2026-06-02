import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type Wish = { id: string; name: string; attend: 'hadir' | 'tidak' | 'ragu'; message: string; at: number };

const STORAGE_KEY = 'sv-rsvp-wishes';

function loadWishes(): Wish[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Wish[]) : [];
  } catch { return []; }
}

function saveWishes(list: Wish[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

function timeAgo(ts: number) {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return 'baru saja';
  const m = Math.floor(s / 60); if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60); if (h < 24) return `${h} jam lalu`;
  const d = Math.floor(h / 24); return `${d} hari lalu`;
}

/**
 * RSVP — konfirmasi kehadiran + ucapan & doa.
 * Disimpan ke localStorage (front-end only). Bisa diintegrasikan ke backend nanti.
 */
export function RSVP() {
  const rootRef = useRef<HTMLElement>(null);
  const [wishes, setWishes] = useState<Wish[]>(() => loadWishes());
  const [name, setName] = useState('');
  const [attend, setAttend] = useState<'hadir' | 'tidak' | 'ragu'>('hadir');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.rs-eyebrow, .rs-title, .rs-divider, .rs-card', {
        opacity: 0, y: 30,
        duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.rs-card', start: 'top 85%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    const next: Wish = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name.trim(),
      attend,
      message: message.trim(),
      at: Date.now(),
    };
    const list = [next, ...wishes].slice(0, 200);
    setWishes(list);
    saveWishes(list);
    setName(''); setMessage(''); setAttend('hadir');
    window.setTimeout(() => setSubmitting(false), 400);
  };

  return (
    <section ref={rootRef} className="rs" aria-label="RSVP & Ucapan">
      <p className="rs-eyebrow">Konfirmasi Kehadiran</p>
      <h2 className="rs-title">RSVP &amp; Wishes</h2>
      <div className="rs-divider" aria-hidden>
        <span /><span className="dot" /><span />
      </div>

      <form className="rs-card" onSubmit={submit}>
        <label className="rs-label">
          <span>Nama</span>
          <input
            type="text" required
            value={name} onChange={e => setName(e.target.value)}
            placeholder="Nama Anda"
            maxLength={60}
          />
        </label>

        <fieldset className="rs-field rs-attend">
          <legend>Kehadiran</legend>
          <div className="rs-attend-row">
            {(['hadir', 'tidak', 'ragu'] as const).map(v => (
              <label key={v} className={`rs-radio ${attend === v ? 'is-active' : ''}`}>
                <input type="radio" name="attend" value={v}
                  checked={attend === v} onChange={() => setAttend(v)} />
                <span>{v === 'hadir' ? 'Hadir' : v === 'tidak' ? 'Tidak Hadir' : 'Masih Ragu'}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="rs-label">
          <span>Ucapan &amp; Doa</span>
          <textarea
            required rows={4}
            value={message} onChange={e => setMessage(e.target.value)}
            placeholder="Tuliskan ucapan & doa terbaik untuk kedua mempelai..."
            maxLength={500}
          />
        </label>

        <button type="submit" className="rs-submit" disabled={submitting}>
          {submitting ? 'Mengirim...' : 'Kirim Ucapan'}
        </button>
      </form>

      {wishes.length > 0 && (
        <div className="rs-list" aria-label="Ucapan dari tamu">
          <p className="rs-list-head">{wishes.length} Ucapan</p>
          <ul>
            {wishes.map(w => (
              <li key={w.id} className="rs-wish">
                <div className="rs-wish-head">
                  <span className="rs-wish-name">{w.name}</span>
                  <span className={`rs-wish-tag is-${w.attend}`}>
                    {w.attend === 'hadir' ? 'Hadir' : w.attend === 'tidak' ? 'Tidak Hadir' : 'Masih Ragu'}
                  </span>
                </div>
                <p className="rs-wish-msg">{w.message}</p>
                <p className="rs-wish-time">{timeAgo(w.at)}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <style>{`
        .rs {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          max-width: 560px;
          margin: 0 auto;
          text-align: center;
        }
        .rs-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em; text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #b08438; margin: 0 0 8px;
        }
        .rs-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.6rem, 9vw, 3.4rem);
          color: #5a1e1e; font-weight: 400; margin: 0 0 10px; line-height: 1.1;
        }
        .rs-divider { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 24px; }
        .rs-divider span { display: block; width: 38px; height: 1px; background: #b08438; }
        .rs-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: #b08438; }

        .rs-card {
          position: relative;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          color: #f3e6c8;
          border-radius: 14px;
          padding: clamp(24px, 4dvh, 36px) clamp(20px, 5vw, 32px);
          text-align: left;
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 8px 24px rgba(90,30,30,0.25);
        }
        .rs-card::before {
          content: '';
          position: absolute; inset: 8px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 9px;
          pointer-events: none;
        }

        .rs-label, .rs-field {
          display: block;
          margin-bottom: 16px;
          position: relative;
        }
        .rs-label span, .rs-field legend {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.78rem;
          color: #c7a86d;
          margin-bottom: 6px;
          display: block;
        }
        .rs-card input[type="text"],
        .rs-card textarea {
          width: 100%;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.05rem;
          color: #fbf3e4;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(199,168,109,0.4);
          border-radius: 8px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .rs-card input[type="text"]:focus,
        .rs-card textarea:focus {
          border-color: #c7a86d;
          background: rgba(0,0,0,0.32);
        }
        .rs-card textarea { resize: vertical; min-height: 90px; line-height: 1.5; }
        .rs-card ::placeholder { color: rgba(243,230,200,0.45); }

        .rs-field { border: 0; padding: 0; margin: 0 0 16px; }
        .rs-attend-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
        }
        .rs-radio {
          position: relative;
          display: block;
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.95rem;
          text-align: center;
          color: #ebd7a8;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(199,168,109,0.4);
          border-radius: 8px;
          padding: 10px 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .rs-radio input { position: absolute; opacity: 0; pointer-events: none; }
        .rs-radio.is-active {
          background: linear-gradient(180deg, #e8c987 0%, #c7a86d 100%);
          color: #5a1e1e;
          border-color: #b08438;
          font-weight: 600;
        }

        .rs-submit {
          width: 100%;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a1e1e;
          background: linear-gradient(180deg, #e8c987 0%, #c7a86d 100%);
          border: 1px solid #b08438;
          border-radius: 999px;
          padding: 14px 24px;
          cursor: pointer;
          margin-top: 6px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.35) inset,
            0 4px 14px rgba(0,0,0,0.22);
          transition: transform 0.2s ease;
        }
        .rs-submit:hover:not(:disabled) { transform: translateY(-2px); }
        .rs-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        .rs-list { margin-top: clamp(28px, 5dvh, 44px); text-align: left; }
        .rs-list-head {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.2em; text-transform: uppercase;
          font-size: 0.85rem; color: #b08438;
          text-align: center;
          margin: 0 0 16px;
        }
        .rs-list ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; max-height: 380px; overflow-y: auto; }
        .rs-wish {
          background: rgba(251,243,228,0.85);
          border: 1px solid rgba(176,132,56,0.35);
          border-radius: 10px;
          padding: 12px 14px;
          color: #5a1e1e;
        }
        .rs-wish-head { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
        .rs-wish-name {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          font-size: 0.95rem;
        }
        .rs-wish-tag {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 2px 8px;
          border-radius: 999px;
          border: 1px solid currentColor;
        }
        .rs-wish-tag.is-hadir { color: #2f5d2f; background: #d6ebcc; border-color: #2f5d2f; }
        .rs-wish-tag.is-tidak { color: #7a2424; background: #f4d4d4; border-color: #7a2424; }
        .rs-wish-tag.is-ragu  { color: #8a5a00; background: #f4e2c2; border-color: #8a5a00; }
        .rs-wish-msg {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1rem; line-height: 1.5;
          margin: 4px 0 4px;
        }
        .rs-wish-time {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.78rem;
          color: rgba(90,30,30,0.6);
          margin: 0;
        }
      `}</style>
    </section>
  );
}
