import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Galeri — masonry photo grid with lightbox.
 * Tidak pakai card frame; foto langsung di atas SiteBackground (paper cream).
 */
export function Galeri() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gl-eyebrow, .gl-title, .gl-divider', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.gl-head', start: 'top 80%' },
      });
      gsap.utils.toArray<HTMLElement>('.gl-item').forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          scale: 0.92,
          duration: 0.8,
          delay: (i % 2) * 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 92%' },
        });
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(null); };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  return (
    <section ref={rootRef} className="gl" aria-label="Galeri">
      <div className="gl-head">
        <p className="gl-eyebrow">Galeri</p>
        <h2 className="gl-title">Our Moments</h2>
        <div className="gl-divider" aria-hidden>
          <span /><span className="dot" /><span />
        </div>
      </div>

      <div className="gl-grid">
        {invitation.gallery.map((src, i) => (
          <button
            key={src}
            className={`gl-item gl-item-${(i % 5) + 1}`}
            onClick={() => setActive(src)}
            aria-label={`Foto ${i + 1}`}
          >
            <img src={src} alt={`Foto ${i + 1}`} loading="lazy" />
          </button>
        ))}
      </div>

      {active && (
        <div className="gl-lightbox" onClick={() => setActive(null)} role="dialog" aria-modal="true">
          <button className="gl-close" onClick={() => setActive(null)} aria-label="Tutup">×</button>
          <img src={active} alt="" onClick={(e) => e.stopPropagation()} />
        </div>
      )}

      <style>{`
        .gl {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          max-width: 720px;
          margin: 0 auto;
        }
        .gl-head { text-align: center; margin-bottom: clamp(28px, 5dvh, 44px); }
        .gl-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #b08438;
          margin: 0 0 8px;
        }
        .gl-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.6rem, 9vw, 3.4rem);
          color: #5a1e1e;
          font-weight: 400;
          margin: 0 0 10px;
          line-height: 1.1;
        }
        .gl-divider {
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .gl-divider span { display: block; width: 38px; height: 1px; background: #b08438; }
        .gl-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: #b08438; }

        .gl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        .gl-item {
          position: relative;
          padding: 0; margin: 0;
          background: #5a1e1e;
          border: 1px solid #b08438;
          border-radius: 10px;
          overflow: hidden;
          cursor: pointer;
          aspect-ratio: 3 / 4;
          box-shadow: 0 4px 14px rgba(90,30,30,0.18);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .gl-item img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .gl-item:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(90,30,30,0.28); }
        .gl-item:hover img { transform: scale(1.05); }

        /* Varied aspect ratios for masonry feel */
        .gl-item-1 { aspect-ratio: 3 / 4; }
        .gl-item-2 { aspect-ratio: 4 / 5; }
        .gl-item-3 { aspect-ratio: 1 / 1; }
        .gl-item-4 { aspect-ratio: 3 / 4; }
        .gl-item-5 { aspect-ratio: 4 / 5; }

        .gl-lightbox {
          position: fixed; inset: 0;
          z-index: 9000;
          background: rgba(20, 6, 6, 0.92);
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: gl-fade 0.25s ease;
        }
        .gl-lightbox img {
          max-width: 100%; max-height: 90vh;
          border-radius: 8px;
          border: 1px solid #b08438;
          box-shadow: 0 20px 60px rgba(0,0,0,0.5);
        }
        .gl-close {
          position: absolute; top: 18px; right: 18px;
          width: 44px; height: 44px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          color: #fbf3e4;
          border: 1px solid #b08438;
          font-size: 1.8rem; line-height: 1;
          cursor: pointer;
        }
        @keyframes gl-fade { from { opacity: 0 } to { opacity: 1 } }

        @media (min-width: 720px) {
          .gl-grid { grid-template-columns: repeat(3, 1fr); }
        }
      `}</style>
    </section>
  );
}
