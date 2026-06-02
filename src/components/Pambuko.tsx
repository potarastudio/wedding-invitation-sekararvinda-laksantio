import { useEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Pambuko — opening section.
 *
 * On mount, plays the cinematic "wayang gates opening" transition:
 *   1. Two gunungan (halves of /cover/gunungan-pair.png, split via clip-path)
 *      start crossed at the centre forming an X.
 *   2. The scene behind (joglo + scenery + trees) fades in zoomed-in (1.5x).
 *   3. The two gunungan rotate back to upright and slide off the screen edges
 *      — like ceremonial gates opening.
 *   4. The camera "pulls back": the scene zooms out from 1.5x → 1x while the
 *      side trees slide in from the edges. Trees then sway gently (CSS loop).
 *   5. The content (bismillah + ayat + opening line) fades in last.
 */
export function Pambuko() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── initial state ────────────────────────────────────────────────
      // Scene starts hidden + zoomed in (camera close on the joglo)
      gsap.set('.pb-scene',    { opacity: 0, scale: 1.5, transformOrigin: '50% 70%' });
      // Trees + canopy: only opacity is animated by GSAP (transform owned by CSS for sway + mirror)
      gsap.set('.pb-tree-l',   { opacity: 0 });
      gsap.set('.pb-tree-r',   { opacity: 0 });
      gsap.set('.pb-canopy',   { opacity: 0, y: -20 });
      gsap.set('.pb-content',  { opacity: 0, y: 40 });

      // Gates: two big gunungan crossed at the centre forming an X-shape gate.
      // Symmetric asset, no mirror. Each anchored at viewport centre, rotates from inner-bottom corner.
      gsap.set('.pb-gate-l', {
        opacity: 1,
        xPercent: 22,
        rotation: 15,
        scaleX: 1, scaleY: 1,
        transformOrigin: '100% 100%',
      });
      gsap.set('.pb-gate-r', {
        opacity: 1,
        xPercent: -22,
        rotation: -15,
        scaleX: 1, scaleY: 1,
        transformOrigin: '0% 100%',
      });

      // ── timeline ─────────────────────────────────────────────────────
      // Delay everything ~1s so Cover (0.9s fade) fully disappears first.
      // While Cover is fading, gunungan are already in crossed-X pose underneath.
      const HOLD = 1.0;
      const tl = gsap.timeline({ delay: HOLD, defaults: { ease: 'power3.out' } });

      // (1) gates open: straighten + slide WAY off screen + fade out, both at same label
      tl.addLabel('open', 0.3);
      tl.to('.pb-gate-l', {
        xPercent: -220, rotation: 0, scaleX: 1, scaleY: 1, opacity: 0,
        duration: 1.5, ease: 'power3.inOut',
      }, 'open');
      tl.to('.pb-gate-r', {
        xPercent: 220, rotation: 0, scaleX: 1, scaleY: 1, opacity: 0,
        duration: 1.5, ease: 'power3.inOut',
      }, 'open');

      // (2) content
      tl.to('.pb-content', { opacity: 1, y: 0, duration: 0.9 }, 1.6);
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const hideOnError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    (e.currentTarget as HTMLImageElement).style.display = 'none';
  };

  return (
    <section ref={rootRef} className="pb" aria-label="Pambuko">
      {/* Gates — solo gunungan, dipakai 2x */}
      <img className="pb-gate pb-gate-l" src="/cover/gunungan-solo.png" alt="" aria-hidden onError={hideOnError} />
      <img className="pb-gate pb-gate-r" src="/cover/gunungan-solo.png" alt="" aria-hidden onError={hideOnError} />

      {/* Content card */}
      <div className="pb-content">
        <div className="pb-card">
          <p className="pb-bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</p>
          <p className="pb-eyebrow">Assalamu'alaikum Wr. Wb.</p>
          <h2 className="pb-title">Pambuko</h2>
          <p className="pb-verse">
            “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu
            istri-istri dari jenismu sendiri, supaya kamu cenderung dan merasa
            tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.
            Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda
            bagi kaum yang berfikir.”
          </p>
          <p className="pb-source">— QS. Ar-Rum : 21 —</p>
        </div>
      </div>

      <style>{`
        .pb {
          position: relative;
          z-index: 1;
          min-height: 100dvh;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
          color: #5a1e1e;
        }

        /* ── wayang gates: solo gunungan anchored at bottom centre.
              All transforms owned by GSAP. ── */
        .pb-gate {
          position: absolute;
          bottom: -32vh;
          height: 145dvh;
          width: auto;
          z-index: 8;
          pointer-events: none;
          transform-origin: 50% 100%;
          will-change: transform, opacity;
        }
        .pb-gate-l { right: 50%; }
        .pb-gate-r { left:  50%; }

        /* Desktop / landscape */
        @media (min-width: 1024px) {
          .pb-gate { height: 110dvh; bottom: -12vh; }
        }

        /* ── content wrapper (centers card in viewport) ── */
        .pb-content {
          position: relative; z-index: 10;
          min-height: 100dvh;
          min-height: 100vh;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(60px, 10dvh, 100px) 18px clamp(80px, 14dvh, 140px);
          will-change: transform, opacity;
        }

        /* ── card frame: cream paper with double gold border and rounded top arch ── */
        .pb-card {
          position: relative;
          width: 100%;
          max-width: 380px;
          background: linear-gradient(180deg, #fbf3e4 0%, #f6ebd2 100%);
          border-radius: 180px 180px 14px 14px;
          padding: clamp(40px, 7dvh, 70px) clamp(22px, 6vw, 36px) clamp(36px, 6dvh, 56px);
          text-align: center;
          display: flex; flex-direction: column; align-items: center;
          gap: 14px;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.6) inset,
            0 2px 10px rgba(90, 30, 30, 0.08),
            0 8px 30px rgba(90, 30, 30, 0.12);
        }
        /* outer thin gold border */
        .pb-card::before {
          content: '';
          position: absolute; inset: 8px;
          border: 1.5px solid #b08438;
          border-radius: 168px 168px 8px 8px;
          pointer-events: none;
        }
        /* inner thin gold border */
        .pb-card::after {
          content: '';
          position: absolute; inset: 14px;
          border: 1px solid rgba(176, 132, 56, 0.5);
          border-radius: 160px 160px 6px 6px;
          pointer-events: none;
        }

        .pb-bismillah {
          font-family: 'Amiri', 'Scheherazade New', serif;
          font-size: clamp(1.4rem, 5.5vw, 2rem);
          color: #5a1e1e;
          line-height: 1.6;
          margin: 0;
        }
        .pb-eyebrow {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.85rem, 2.4vw, 1rem);
          letter-spacing: 0.16em;
          color: #8a2a2a;
          text-transform: uppercase;
          margin: 4px 0 0;
        }
        .pb-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.6rem, 9vw, 4.2rem);
          line-height: 1.0;
          color: #5a1e1e;
          margin: 0;
        }
        .pb-verse {
          font-family: 'Cormorant Garamond', 'Playfair Display', serif;
          font-size: clamp(0.95rem, 2.5vw, 1.1rem);
          line-height: 1.7;
          color: #5a1e1e;
          font-style: italic;
          margin: 8px 0 0;
        }
        .pb-source {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.85rem, 2.2vw, 0.95rem);
          letter-spacing: 0.08em;
          color: #8a2a2a;
          margin: 0;
        }

        @media (min-width: 1024px) {
          .pb-card { max-width: 460px; }
        }
      `}</style>
    </section>
  );
}
