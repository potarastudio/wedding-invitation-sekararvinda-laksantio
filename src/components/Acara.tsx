import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Acara — "Reroncening Acara" (susunan acara).
 * Single Resepsi card in capsule arch (top & bottom rounded) like Mempelai.
 */
export function Acara() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ac-card', {
        opacity: 0, y: 80, scale: 0.96,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ac-card', start: 'top 88%' },
      });
      gsap.from('.ac-eyebrow, .ac-title, .ac-divider, .ac-name, .ac-line, .ac-btn', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.ac-card', start: 'top 75%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const { resepsi, mapsUrl } = invitation;

  return (
    <section ref={rootRef} className="ac" aria-label="Acara">
      <div className="ac-card">
        <p className="ac-eyebrow">Reroncening Acara</p>
        <h2 className="ac-title">Wedding Reception</h2>

        <div className="ac-divider" aria-hidden>
          <span /><span className="dot" /><span />
        </div>

        <p className="ac-name">{resepsi.title}</p>
        <p className="ac-line ac-date">{resepsi.date}</p>
        <p className="ac-line ac-time">{resepsi.time}</p>

        <div className="ac-place">
          <p className="ac-line ac-venue">{resepsi.place}</p>
          <p className="ac-line ac-addr">{resepsi.address}</p>
        </div>

        <a className="ac-btn" href={mapsUrl} target="_blank" rel="noopener noreferrer">
          Open Maps
        </a>
      </div>

      <style>{`
        .ac {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          display: flex; justify-content: center;
        }
        .ac-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          border-radius: 180px;
          padding: clamp(56px, 9dvh, 90px) clamp(24px, 6vw, 40px);
          text-align: center;
          color: #f3e6c8;
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 4px 16px rgba(0,0,0,0.25),
            0 16px 50px rgba(90, 30, 30, 0.35);
        }
        .ac-card::before {
          content: '';
          position: absolute; inset: 10px;
          border: 1.5px solid #c7a86d;
          border-radius: 170px;
          pointer-events: none;
        }
        .ac-card::after {
          content: '';
          position: absolute; inset: 16px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 162px;
          pointer-events: none;
        }

        .ac-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #c7a86d;
          margin: 0 0 8px;
        }
        .ac-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.4rem, 8vw, 3.2rem);
          color: #f3e6c8;
          font-weight: 400;
          margin: 0 0 12px;
          line-height: 1.1;
        }
        .ac-divider {
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          margin: 8px auto 22px;
        }
        .ac-divider span {
          display: block;
          width: 38px; height: 1px;
          background: #c7a86d;
        }
        .ac-divider .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #c7a86d;
        }

        .ac-name {
          font-family: 'Playfair Display', serif;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: clamp(0.85rem, 2.4vw, 0.95rem);
          color: #c7a86d;
          margin: 0 0 14px;
        }
        .ac-line {
          font-family: 'Cormorant Garamond', serif;
          margin: 2px 0;
          color: #fbf3e4;
        }
        .ac-date {
          font-size: clamp(1.05rem, 3.2vw, 1.25rem);
          font-weight: 600;
        }
        .ac-time {
          font-style: italic;
          font-size: clamp(0.95rem, 2.7vw, 1.05rem);
          color: #ebd7a8;
        }
        .ac-place { margin: clamp(18px, 3dvh, 26px) 0 clamp(22px, 4dvh, 32px); }
        .ac-venue {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.1rem, 3.4vw, 1.3rem);
          font-weight: 600;
          color: #f3e6c8;
          margin-bottom: 6px;
        }
        .ac-addr {
          font-size: clamp(0.85rem, 2.5vw, 0.95rem);
          line-height: 1.6;
          color: #ebd7a8;
          max-width: 280px;
          margin: 0 auto;
        }

        .ac-btn {
          display: inline-flex; align-items: center; gap: 8px;
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
        .ac-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.4) inset,
            0 8px 20px rgba(0,0,0,0.3);
        }

        @media (min-width: 1024px) {
          .ac-card { max-width: 460px; }
        }
      `}</style>
    </section>
  );
}
