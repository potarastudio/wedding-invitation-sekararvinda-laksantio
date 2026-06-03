import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Tutup — penutup undangan dengan foto pasangan, paribasan Jawa,
 * salam wassalam, dan tanda tangan keluarga.
 */
export function Tutup() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.tp-photo', {
        opacity: 0, y: 50, scale: 0.94,
        duration: 1.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.tp-photo', start: 'top 88%' },
      });
      gsap.from('.tp-thanks, .tp-salam, .tp-sign, .tp-names, .tp-fams', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: '.tp-card', start: 'top 80%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const { bride, groom, couplePhoto } = invitation;

  return (
    <section ref={rootRef} className="tp" aria-label="Penutup">
      <div className="tp-photo">
        <img src={couplePhoto} alt={`${bride.short} & ${groom.short}`} />
      </div>

      <div className="tp-card">
        <div className="tp-body">
          <p className="tp-thanks">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila
            Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.
            Atas perhatian dan kehadirannya, kami sampaikan terima kasih.
          </p>

          <p className="tp-salam">Wassalamualaikum Warahmatullahi Wabarakatuh</p>

          <p className="tp-sign">Kami yang berbahagia,</p>
          <h2 className="tp-names">{bride.short} &amp; {groom.short}</h2>
          <p className="tp-fams">Beserta Kedua Keluarga</p>
        </div>
      </div>

      <style>{`
        .tp {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(80px, 14dvh, 160px);
          max-width: 520px;
          margin: 0 auto;
          text-align: center;
        }

        .tp-photo {
          position: relative;
          width: clamp(220px, 70vw, 320px);
          aspect-ratio: 3 / 4;
          margin: 0 auto clamp(28px, 5dvh, 44px);
          border-radius: 999px 999px 16px 16px;
          overflow: hidden;
          border: 2px solid #b08438;
          box-shadow:
            0 0 0 4px rgba(176,132,56,0.18),
            0 16px 40px rgba(90,30,30,0.28);
        }
        .tp-photo img { width: 100%; height: 100%; object-fit: cover; display: block; }

        .tp-card {
          position: relative;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          color: #f3e6c8;
          border-radius: 16px;
          padding: clamp(28px, 5dvh, 48px) clamp(22px, 6vw, 38px);
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 8px 24px rgba(90,30,30,0.25);
        }
        .tp-card::before {
          content: '';
          position: absolute; inset: 8px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 11px;
          pointer-events: none;
        }
        .tp-body { position: relative; }

        .tp-quote {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(1.05rem, 3.2vw, 1.25rem);
          line-height: 1.6;
          color: #f3e6c8;
          margin: 0 0 8px;
        }
        .tp-source {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-size: clamp(0.72rem, 2vw, 0.8rem);
          color: #c7a86d;
          margin: 0 0 20px;
        }

        .tp-divider { display: flex; align-items: center; justify-content: center; gap: 8px; margin: 14px auto 22px; }
        .tp-divider span { display: block; width: 38px; height: 1px; background: #c7a86d; }
        .tp-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: #c7a86d; }

        .tp-thanks {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.8vw, 1.05rem);
          line-height: 1.7;
          color: #ebd7a8;
          margin: 0 auto 22px;
          max-width: 420px;
        }
        .tp-salam {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(1rem, 3vw, 1.15rem);
          color: #f3e6c8;
          margin: 0 0 clamp(28px, 5dvh, 44px);
        }

        .tp-sign {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.9rem, 2.7vw, 1rem);
          color: #ebd7a8;
          margin: 0 0 6px;
        }
        .tp-names {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(3rem, 12vw, 4.5rem);
          color: #f3e6c8;
          font-weight: 400;
          line-height: 1;
          margin: 0 0 6px;
        }
        .tp-fams {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: clamp(0.78rem, 2.2vw, 0.88rem);
          color: #c7a86d;
          margin: 0;
        }
      `}</style>
    </section>
  );
}
