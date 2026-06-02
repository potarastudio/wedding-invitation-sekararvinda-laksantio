import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Story — "Lelampahan Tresna" vertical timeline.
 * Center spine with alternating cards (left/right on desktop, all-left on mobile).
 */
export function Story() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.st-eyebrow, .st-title, .st-divider', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.st-head', start: 'top 80%' },
      });
      gsap.utils.toArray<HTMLElement>('.st-item').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });
      // Spine grow
      gsap.from('.st-spine-fill', {
        scaleY: 0,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.st-timeline',
          start: 'top 70%',
          end: 'bottom 70%',
          scrub: 0.5,
        },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="st" aria-label="Love Story">
      <div className="st-head">
        <p className="st-eyebrow">Lelampahan Tresna</p>
        <h2 className="st-title">Our Love Story</h2>
        <div className="st-divider" aria-hidden>
          <span /><span className="dot" /><span />
        </div>
      </div>

      <div className="st-timeline">
        <div className="st-spine" aria-hidden>
          <div className="st-spine-fill" />
        </div>
        {invitation.story.map((s, i) => (
          <div key={s.year} className={`st-item ${i % 2 === 0 ? 'is-left' : 'is-right'}`}>
            <div className="st-dot" aria-hidden />
            <div className="st-card">
              <p className="st-year">{s.year}</p>
              <h3 className="st-card-title">{s.title}</h3>
              <p className="st-text">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .st {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          max-width: 720px;
          margin: 0 auto;
        }
        .st-head { text-align: center; margin-bottom: clamp(32px, 6dvh, 56px); }
        .st-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em; text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #b08438; margin: 0 0 8px;
        }
        .st-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.6rem, 9vw, 3.4rem);
          color: #5a1e1e; font-weight: 400; margin: 0 0 10px; line-height: 1.1;
        }
        .st-divider { display: flex; align-items: center; justify-content: center; gap: 8px; }
        .st-divider span { display: block; width: 38px; height: 1px; background: #b08438; }
        .st-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: #b08438; }

        .st-timeline { position: relative; padding: 20px 0; }

        /* Mobile: spine on the left */
        .st-spine {
          position: absolute;
          top: 0; bottom: 0;
          left: 18px;
          width: 2px;
          background: rgba(176,132,56,0.25);
        }
        .st-spine-fill {
          position: absolute; inset: 0;
          background: linear-gradient(180deg, #c79a4c 0%, #5a1e1e 100%);
        }

        .st-item {
          position: relative;
          padding: 14px 0 14px 48px;
        }
        .st-dot {
          position: absolute;
          left: 11px; top: 28px;
          width: 16px; height: 16px;
          border-radius: 50%;
          background: #c7a86d;
          border: 3px solid #5a1e1e;
          box-shadow: 0 0 0 3px rgba(199,168,109,0.25);
        }
        .st-card {
          position: relative;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          color: #f3e6c8;
          border-radius: 12px;
          padding: 18px 20px 20px;
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 6px 18px rgba(90,30,30,0.22);
        }
        .st-card::before {
          content: '';
          position: absolute; inset: 6px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 8px;
          pointer-events: none;
        }
        .st-year {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.22em; text-transform: uppercase;
          font-size: clamp(0.75rem, 2.1vw, 0.82rem);
          color: #c7a86d;
          margin: 0 0 4px;
        }
        .st-card-title {
          font-family: 'Great Vibes', cursive;
          font-weight: 400;
          font-size: clamp(1.7rem, 6vw, 2.2rem);
          color: #f3e6c8;
          margin: 0 0 8px;
          line-height: 1.1;
        }
        .st-text {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.7vw, 1.05rem);
          line-height: 1.6;
          color: #ebd7a8;
          margin: 0;
        }

        /* Desktop: center spine, alternate sides */
        @media (min-width: 720px) {
          .st-spine { left: 50%; transform: translateX(-50%); }
          .st-item { padding: 18px 0; display: flex; }
          .st-item .st-card { width: calc(50% - 36px); }
          .st-item.is-left  { justify-content: flex-start; }
          .st-item.is-right { justify-content: flex-end; }
          .st-dot { left: 50%; transform: translateX(-50%); top: 36px; }
        }
      `}</style>
    </section>
  );
}
