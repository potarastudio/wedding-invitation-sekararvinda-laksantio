import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * LiveStreaming — bagi tamu yang tidak bisa hadir.
 * Rectangular card (mirip Countdown) supaya selang-seling dengan arch card.
 */
export function LiveStreaming() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.ls-card', {
        opacity: 0, y: 80, scale: 0.96,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.ls-card', start: 'top 88%' },
      });
      gsap.from('.ls-eyebrow, .ls-title, .ls-divider, .ls-desc, .ls-btn', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.ls-card', start: 'top 75%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const { liveStream, resepsi } = invitation;

  return (
    <section ref={rootRef} className="ls" aria-label="Live Streaming">
      <div className="ls-card">
        <p className="ls-eyebrow">Live Streaming</p>
        <h2 className="ls-title">Siaran Langsung</h2>

        <div className="ls-divider" aria-hidden>
          <span /><span className="dot" /><span />
        </div>

        <p className="ls-desc">
          Bagi Bapak/Ibu/Saudara/i yang berhalangan hadir, dapat menyaksikan
          acara resepsi pernikahan kami secara langsung melalui {liveStream.platform}
          pada {resepsi.date} · {resepsi.time}.
        </p>

        <a className="ls-btn" href={liveStream.url} target="_blank" rel="noopener noreferrer">
          <span className="ls-btn-icon" aria-hidden>▶</span>
          Watch on {liveStream.platform}
        </a>
      </div>

      <style>{`
        .ls {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          display: flex; justify-content: center;
        }
        .ls-card {
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
        .ls-card::before {
          content: '';
          position: absolute; inset: 10px;
          border: 1.5px solid #c7a86d;
          border-radius: 8px;
          pointer-events: none;
        }
        .ls-card::after {
          content: '';
          position: absolute; inset: 16px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 6px;
          pointer-events: none;
        }

        .ls-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #c7a86d;
          margin: 0 0 8px;
        }
        .ls-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.4rem, 8vw, 3.2rem);
          color: #f3e6c8;
          font-weight: 400;
          margin: 0 0 8px;
          line-height: 1.1;
        }
        .ls-divider {
          display: flex; align-items: center; justify-content: center;
          gap: 8px;
          margin: 8px auto 18px;
        }
        .ls-divider span { display: block; width: 38px; height: 1px; background: #c7a86d; }
        .ls-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: #c7a86d; }

        .ls-desc {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.8vw, 1.05rem);
          line-height: 1.7;
          color: #ebd7a8;
          margin: 0 0 clamp(22px, 4dvh, 30px);
          max-width: 320px;
          margin-left: auto;
          margin-right: auto;
        }

        .ls-btn {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.85rem, 2.4vw, 0.95rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5a1e1e;
          background: linear-gradient(180deg, #e8c987 0%, #c7a86d 100%);
          border: 1px solid #b08438;
          border-radius: 999px;
          padding: 12px 26px;
          text-decoration: none;
          margin-top: clamp(22px, 4dvh, 30px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.35) inset,
            0 4px 14px rgba(0,0,0,0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ls-btn-icon { font-size: 0.7em; }
        .ls-btn:hover {
          transform: translateY(-2px);
          box-shadow:
            0 1px 0 rgba(255,255,255,0.4) inset,
            0 8px 20px rgba(0,0,0,0.3);
        }

        @media (min-width: 1024px) {
          .ls-card { max-width: 460px; }
        }
      `}</style>
    </section>
  );
}
