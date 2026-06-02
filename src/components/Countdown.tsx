import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

type TimeLeft = { d: number; h: number; m: number; s: number };

function diff(target: Date): TimeLeft {
  const ms = Math.max(0, target.getTime() - Date.now());
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1000);
  return { d, h, m, s };
}

/** Build a Google Calendar event link. */
function buildCalendarUrl() {
  const { resepsi } = invitation;
  // Start = countdownTo; End = +2 hours (cover full window).
  const start = new Date(invitation.countdownTo);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Pernikahan ${invitation.bride.short} & ${invitation.groom.short}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: `${resepsi.title} — ${resepsi.place}`,
    location: `${resepsi.place}, ${resepsi.address}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Countdown — "Wanci Pinanggih" (saat dinanti).
 * Maroon arch card matching Mempelai style. Live counter + Save Calendar.
 */
export function Countdown() {
  const rootRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState<TimeLeft>(() => diff(new Date(invitation.countdownTo)));

  useEffect(() => {
    const target = new Date(invitation.countdownTo);
    const id = window.setInterval(() => setTime(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cd-card', {
        opacity: 0, y: 80, scale: 0.96,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.cd-card', start: 'top 88%' },
      });
      gsap.from('.cd-eyebrow, .cd-title, .cd-date', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.15, ease: 'power2.out',
        scrollTrigger: { trigger: '.cd-card', start: 'top 75%' },
      });
      gsap.from('.cd-cell', {
        opacity: 0, y: 30, scale: 0.85,
        duration: 0.7, stagger: 0.12, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.cd-grid', start: 'top 80%' },
      });
      gsap.from('.cd-btn', {
        opacity: 0, y: 20,
        duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: '.cd-btn', start: 'top 90%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const cells: [string, number][] = [
    ['Dina',  time.d],
    ['Jam',   time.h],
    ['Menit', time.m],
    ['Detik', time.s],
  ];

  return (
    <section ref={rootRef} className="cd" aria-label="Countdown">
      <div className="cd-card">
        <p className="cd-eyebrow">Wanci Pinanggih</p>
        <h2 className="cd-title">Counting the Days</h2>
        <p className="cd-date">{invitation.resepsi.date} · {invitation.resepsi.time}</p>

        <div className="cd-grid">
          {cells.map(([label, val]) => (
            <div className="cd-cell" key={label}>
              <span className="cd-num">{String(val).padStart(2, '0')}</span>
              <span className="cd-lbl">{label}</span>
            </div>
          ))}
        </div>

        <a className="cd-btn" href={buildCalendarUrl()} target="_blank" rel="noopener noreferrer">
          Save the Date
        </a>
      </div>

      <style>{`
        .cd {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          display: flex; justify-content: center;
        }
        .cd-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          border-radius: 14px;
          padding: clamp(40px, 7dvh, 64px) clamp(24px, 6vw, 40px);
          text-align: center;
          color: #f3e6c8;
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 4px 16px rgba(0,0,0,0.25),
            0 16px 50px rgba(90, 30, 30, 0.35);
        }
        .cd-card::before {
          content: '';
          position: absolute; inset: 10px;
          border: 1.5px solid #c7a86d;
          border-radius: 8px;
          pointer-events: none;
        }
        .cd-card::after {
          content: '';
          position: absolute; inset: 16px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 6px;
          pointer-events: none;
        }

        .cd-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #c7a86d;
          margin: 0 0 8px;
        }
        .cd-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.4rem, 8vw, 3.2rem);
          color: #f3e6c8;
          font-weight: 400;
          margin: 0 0 8px;
          line-height: 1.1;
        }
        .cd-date {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.95rem, 2.7vw, 1.05rem);
          color: #ebd7a8;
          margin: 0 0 clamp(24px, 4dvh, 36px);
        }

        .cd-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 0 0 clamp(24px, 4dvh, 36px);
        }
        .cd-cell {
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(199,168,109,0.35);
          border-radius: 10px;
          padding: 12px 4px 8px;
          display: flex; flex-direction: column; align-items: center;
        }
        .cd-num {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.5rem, 6vw, 2.1rem);
          font-weight: 600;
          color: #f3e6c8;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }
        .cd-lbl {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.7rem, 2vw, 0.8rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #c7a86d;
          margin-top: 6px;
        }

        .cd-btn {
          display: inline-block;
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.85rem, 2.4vw, 0.95rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a1e1e;
          background: linear-gradient(180deg, #e8c987 0%, #c7a86d 100%);
          border: 1px solid #b08438;
          border-radius: 999px;
          padding: 12px 28px;
          text-decoration: none;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.35) inset,
            0 4px 14px rgba(0,0,0,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .cd-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.4) inset,
            0 8px 20px rgba(0,0,0,0.3);
        }

        @media (min-width: 1024px) {
          .cd-card { max-width: 460px; }
        }
      `}</style>
    </section>
  );
}
