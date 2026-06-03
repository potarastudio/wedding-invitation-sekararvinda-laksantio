import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Mempelai — couple introduction (Sarimbit).
 * Long maroon arch card containing salam + 2 stacks (bride, ampersand, groom).
 * Background scenery & trees come from <SiteBackground /> (fixed behind).
 */
export function Mempelai() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.mp-card', {
        opacity: 0,
        y: 80,
        scale: 0.96,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.mp-card', start: 'top 88%' },
      });
      gsap.from('.mp-lead', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.mp-card', start: 'top 75%' },
      });
      gsap.utils.toArray<HTMLElement>('.mp-stack').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 50,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' },
        });
      });
      gsap.from('.mp-amp', {
        opacity: 0,
        scale: 0.5,
        duration: 0.9,
        ease: 'back.out(1.6)',
        scrollTrigger: { trigger: '.mp-amp', start: 'top 85%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const { bride, groom } = invitation;

  return (
    <section ref={rootRef} className="mp" aria-label="Mempelai">
      <div className="mp-card">
        <p className="mp-lead">
          Dengan memohon rahmat dan ridho Allah Swt. kami bermaksud mengundang
          Bapak/Ibu/Saudara/i untuk menghadiri acara pernikahan putra-putri kami:
        </p>

        {/* Bride */}
        <div className="mp-stack">
          <div className="mp-photo-wrap">
            <div className="mp-photo-clip">
              <img className="mp-photo" src={bride.photo} alt={bride.short} />
            </div>
            <img className="mp-oval"  src="/cover/oval-frame.png" alt="" aria-hidden />
          </div>
          <h3 className="mp-name-script">{bride.short}</h3>
          <p className="mp-full">{bride.name}</p>
          <p className="mp-order">{bride.order}</p>
          <p className="mp-parent">{bride.father}</p>
          <p className="mp-and-small">&amp;</p>
          <p className="mp-parent">{bride.mother}</p>
        </div>

        <div className="mp-amp">&amp;</div>

        {/* Groom */}
        <div className="mp-stack">
          <div className="mp-photo-wrap">
            <div className="mp-photo-clip">
              <img className="mp-photo" src={groom.photo} alt={groom.short} />
            </div>
            <img className="mp-oval"  src="/cover/oval-frame.png" alt="" aria-hidden />
          </div>
          <h3 className="mp-name-script">{groom.short}</h3>
          <p className="mp-full">{groom.name}</p>
          <p className="mp-order">{groom.order}</p>
          <p className="mp-parent">{groom.father}</p>
          <p className="mp-and-small">&amp;</p>
          <p className="mp-parent">{groom.mother}</p>
        </div>
      </div>

      <style>{`
        .mp {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          display: flex; justify-content: center;
        }

        .mp-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          border-radius: 180px 180px 180px 180px;
          /* Padding atas dinaikkan supaya teks tidak menabrak lengkungan kapsul
             di layar yang lebih sempit / aspek-rasio tinggi. */
          padding: clamp(96px, 14dvh, 140px) clamp(28px, 7vw, 44px) clamp(64px, 9dvh, 96px);
          text-align: center;
          color: #f3e6c8;
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 4px 16px rgba(0,0,0,0.25),
            0 16px 50px rgba(90, 30, 30, 0.35);
        }
        .mp-card::before {
          content: '';
          position: absolute; inset: 10px;
          border: 1.5px solid #c7a86d;
          border-radius: 170px;
          pointer-events: none;
        }
        .mp-card::after {
          content: '';
          position: absolute; inset: 16px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 162px;
          pointer-events: none;
        }

        .mp-lead {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.6vw, 1.05rem);
          line-height: 1.55;
          color: #ebd7a8;
          margin: 0 auto clamp(24px, 4dvh, 38px);
          max-width: 30ch;
          text-wrap: balance;
        }

        .mp-stack {
          display: flex; flex-direction: column; align-items: center;
          gap: 4px;
        }

        .mp-photo-wrap {
          position: relative;
          width: clamp(220px, 70vw, 300px);
          aspect-ratio: 460 / 586;
          margin: 0 auto 18px;
        }
        /* Clip container: matches the actual oval cutout of the frame PNG
           so the photo never bleeds past the ornament. */
        .mp-photo-clip {
          position: absolute;
          top: 14%; left: 20%;
          width: 60%; height: 72%;
          border-radius: 50% / 50%;
          overflow: hidden;
          z-index: 1;
          background: #2a0f0a;
        }
        .mp-photo {
          width: 100%; height: 100%;
          object-fit: cover;
          /* Zoom-in lebih dekat ke wajah — tetap di dalam clip oval */
          object-position: center 22%;
          transform: scale(1.15);
          transform-origin: center 30%;
          display: block;
        }
        .mp-oval {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          z-index: 2;
          pointer-events: none;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.25));
        }

        .mp-name-script {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.6rem, 9vw, 3.6rem);
          line-height: 1;
          color: #f3e6c8;
          margin: 6px 0 4px;
          font-weight: 400;
        }
        .mp-full {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.8rem, 2.4vw, 0.9rem);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #c7a86d;
          margin: 0 0 14px;
        }
        .mp-order {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.9rem, 2.5vw, 1rem);
          color: #ebd7a8;
          margin: 0 0 4px;
        }
        .mp-parent {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.95rem, 2.7vw, 1.05rem);
          color: #fbf3e4;
          margin: 1px 0;
          font-weight: 500;
        }
        .mp-and-small {
          font-family: 'Great Vibes', cursive;
          font-size: 1.3rem;
          color: #c7a86d;
          margin: 0 !important;
        }

        .mp-amp {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(4.5rem, 16vw, 6.5rem);
          line-height: 1;
          color: #c7a86d;
          margin: clamp(28px, 5dvh, 48px) 0;
        }

        @media (min-width: 1024px) {
          .mp-card { max-width: 460px; }
        }
      `}</style>
    </section>
  );
}
