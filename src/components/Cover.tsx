import { useRef } from 'react';
import gsap from 'gsap';
import { invitation } from '../data/invitation';

interface Props {
  onOpen: () => void;
  onTrigger?: () => void;
  guestName?: string;
}

/**
 * Cover — layered 2D scene (cream / Javanese romantic).
 *
 * Asset slots (drop files into `images/cover/` — Vite serves them at `/cover/...`):
 *   /cover/paper-bg.jpg     full-bleed cream paper texture (fallback: CSS gradient)
 *   /cover/batik-top.png    decorative batik / truntum band at top      (~1200x320, transparent)
 *   /cover/tree-left.png    faded tree silhouette, left mid             (~600x900,  transparent)
 *   /cover/tree-right.png   faded tree silhouette, right mid            (~600x900,  transparent)
 *   /cover/joglo-bottom.png joglo / pendopo silhouette bottom           (~1400x500, transparent)
 *   /cover/gunungan-pair.png  small wayang gunungan pair, bottom-center (~300x180,  transparent)
 *   /cover/rose-tl.png        rose cluster, top-left corner
 *   /cover/rose-tr.png        rose cluster, top-right corner
 *   /cover/rose-bl.png        rose cluster, bottom-left corner
 *   /cover/rose-br.png        rose cluster, bottom-right corner
 *   /cover/photo.jpg          couple photo (rendered inside oval frame)
 *
 * Any missing asset is auto-hidden (onError) — layout stays intact.
 */
export function Cover({ onOpen, onTrigger, guestName }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  // Intro is pure CSS keyframes (see <style> below) — robust against rAF throttling.

  const handleOpen = () => {
    onTrigger?.(); // mount Pambuko di belakang segera, supaya tidak ada page kosong
    const el = rootRef.current;
    if (!el) { onOpen(); return; }
    const tl = gsap.timeline({ onComplete: onOpen });
    // Naik sedikit + fade ke 0 — agar handoff ke gunungan-gate Pambuko terasa mulus
    tl.to(el, {
      yPercent: -15,
      opacity: 0,
      duration: 0.9,
      ease: 'power3.inOut',
    });
  };

  // Hide an image gracefully if the asset file is not provided yet
  const hideOnError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    (e.currentTarget as HTMLImageElement).style.display = 'none';
  };

  return (
    <div ref={rootRef} className="cv">
      {/* Layer 0 — paper background */}
      <div className="cv-paper" />

      {/* Layer 1 — faded scenery (sawah / pegunungan / hutan) yang membuat pohon & joglo "menyatu" */}
      <img className="cv-scenery" src="/cover/scenery-bg.png" alt="" aria-hidden decoding="async" fetchPriority="high" onError={hideOnError} />

      {/* Layer 2 — joglo silhouette (di dalam scenery) */}
      <img className="cv-joglo"    src="/cover/joglo-bottom.png"  alt="" aria-hidden decoding="async" fetchPriority="low" onError={hideOnError} />
      <img className="cv-gunungan" src="/cover/gunungan-pair.png" alt="" aria-hidden decoding="async" fetchPriority="low" onError={hideOnError} />

      {/* Layer 3 — batik truntum band di atas (geometris, full-bleed) */}
      <img className="cv-batik-top" src="/cover/batik-top.png" alt="" aria-hidden decoding="async" fetchPriority="low" onError={hideOnError} />

      {/* Layer 4 — mawar kecil di 2 pojok bawah (atas dikosongkan agar batik truntum jadi hero) */}
      <img className="cv-rose cv-rose-bl" src="/cover/rose-bl.png" alt="" aria-hidden decoding="async" fetchPriority="low" onError={hideOnError} />
      <img className="cv-rose cv-rose-br" src="/cover/rose-br.png" alt="" aria-hidden decoding="async" fetchPriority="low" onError={hideOnError} />

      {/* Layer 5 — content */}
      <div className="cv-inner">
        <p className="cv-eyebrow">The Wedding Of</p>

        <h1 className="cv-script">
          {invitation.bride.short} <span className="cv-amp">&amp;</span> {invitation.groom.short}
        </h1>

        <div className="cv-photo">
          <img src="/cover/photo.jpg" alt="" decoding="async" fetchPriority="high" onError={hideOnError} />
          <span className="cv-photo-ring" />
        </div>

        <p className="cv-guest">
          Kepada Yth:<br />
          Bapak/Ibu/Saudara/i<br />
          <strong>{guestName ?? 'Nama Tamu'}</strong>
        </p>

        <button className="cv-cta" onClick={handleOpen}>
          <span className="cv-cta-icon">✉</span>
          <span>Buka Undangan</span>
        </button>
      </div>

      <style>{`
        .cv {
          position: fixed; inset: 0; z-index: 50;
          overflow: hidden;
          color: #5a1e1e;
          background: #fbf3e4;
          isolation: isolate;
        }

        /* ---------- intro keyframes (CSS, not GSAP — runs even when tab is throttled) ---------- */
        @keyframes cv-fade        { from { opacity: 0; }                    to { opacity: var(--cv-op, 1); } }
        @keyframes cv-fade-down   { from { opacity: 0; transform: translate(-50%, -40px); } to { opacity: var(--cv-op, 1); transform: translate(-50%, 0); } }
        @keyframes cv-fade-up     { from { opacity: 0; transform: translate(-50%,  40px); } to { opacity: var(--cv-op, 1); transform: translate(-50%, 0); } }
        @keyframes cv-fade-up-sm  { from { opacity: 0; transform: translate(-50%,  20px); } to { opacity: var(--cv-op, 1); transform: translate(-50%, 0); } }
        @keyframes cv-slide-in-l  { from { opacity: 0; transform: translateX(-40px); }     to { opacity: var(--cv-op, 1); transform: translateX(0); } }
        @keyframes cv-slide-in-r  { from { opacity: 0; transform: translateX( 40px) scaleX(-1); } to { opacity: var(--cv-op, 1); transform: translateX(0) scaleX(-1); } }
        @keyframes cv-rise        { from { opacity: 0; transform: translateY( 14px); }     to { opacity: 1; transform: translateY(0); } }
        @keyframes cv-pop         { from { opacity: 0; transform: scale(0.85); }           to { opacity: 1; transform: scale(1); } }

        /* ---------- paper background ---------- */
        .cv-paper {
          position: absolute; inset: 0; z-index: 0;
          background:
            radial-gradient(ellipse at 50% 30%, #fbf3e4 0%, #f3e6cf 55%, #e8d6b6 100%);
        }

        .cv-paper { animation: cv-fade 1s ease-out both; }

        /* ---------- decorative layers ---------- */

        /* Scenery: faded landscape (sawah / pegunungan / pohon kiri-kanan).
           Full-bleed cover — jadi anchor visual seluruh layar. */
        .cv-scenery {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center bottom;
          z-index: 1; pointer-events: none;
          opacity: 0.85;
          mix-blend-mode: multiply;
          --cv-op: 0.85;
          animation: cv-fade 1.4s ease-out 0.2s both;
        }

        /* Joglo silhouette — subtle, di garis horizon bawah scenery */
        .cv-joglo {
          position: absolute; bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: min(520px, 92vw); height: auto;
          z-index: 2; pointer-events: none;
          opacity: 0.45;
          mix-blend-mode: multiply;
          --cv-op: 0.45;
          animation: cv-fade-up 1s ease-out 0.6s both;
        }
        .cv-gunungan {
          position: absolute; bottom: 12px; left: 50%;
          transform: translateX(-50%);
          width: min(90px, 18vw);
          height: auto; z-index: 3;
          pointer-events: none; opacity: 0.9;
          mix-blend-mode: multiply;
          --cv-op: 0.9;
          animation: cv-fade-up-sm 0.7s ease-out 1.1s both;
        }

        /* Batik truntum band — geometric, full-width, fades ke bawah */
        .cv-batik-top {
          position: absolute; top: 0; left: 0;
          width: 100%;
          height: clamp(110px, 18vh, 180px);
          object-fit: cover;
          object-position: center top;
          z-index: 4; pointer-events: none;
          mix-blend-mode: multiply;
          opacity: 0.55;
          --cv-op: 0.55;
          -webkit-mask-image: linear-gradient(to bottom, #000 40%, transparent 100%);
                  mask-image: linear-gradient(to bottom, #000 40%, transparent 100%);
          animation: cv-fade 1.2s ease-out 0.1s both;
        }

        /* 4 small rose clusters anchored at corners.
           Source PNG has roses in the top-left quadrant; we mirror it for other corners. */
        .cv-rose {
          position: absolute;
          width: clamp(120px, 32vw, 200px);
          height: auto;
          z-index: 5; pointer-events: none;
          mix-blend-mode: multiply;
        }
        .cv-rose-tl { top: 0;    left: 0;    animation: cv-fade 0.9s ease-out 0.4s both; }
        .cv-rose-tr { top: 0;    right: 0;   transform: scaleX(-1); animation: cv-fade 0.9s ease-out 0.5s both; }
        .cv-rose-bl { bottom: 0; left: 0;    transform: scaleY(-1); animation: cv-fade 0.9s ease-out 0.7s both; }
        .cv-rose-br { bottom: 0; right: 0;   transform: scale(-1, -1); animation: cv-fade 0.9s ease-out 0.8s both; }

        /* ---------- content (mobile-first) ---------- */
        .cv-inner {
          position: relative; z-index: 10;
          text-align: center;
          max-width: 380px;
          width: 100%;
          margin: 0 auto;
          /* mobile: pakai dvh utk hp dgn URL bar dinamis */
          padding: clamp(140px, 22dvh, 200px) 20px clamp(140px, 22dvh, 200px);
          min-height: 100dvh;
          min-height: 100vh; /* fallback */
          display: flex; flex-direction: column; align-items: center;
          gap: 6px;
        }
        .cv-eyebrow {
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-weight: 600;
          letter-spacing: 0.18em;
          font-size: clamp(0.9rem, 2vw, 1.1rem);
          color: #5a1e1e;
          margin: 0;
          animation: cv-rise 0.7s ease-out 1.5s both;
        }
        .cv-script {
          font-family: 'Great Vibes', cursive;
          font-weight: 400;
          font-size: clamp(3rem, 10vw, 5rem);
          line-height: 1.0;
          color: #5a1e1e;
          letter-spacing: 0.01em;
          margin: 0;
          animation: cv-rise 1s ease-out 1.8s both;
        }
        .cv-amp {
          font-family: 'Great Vibes', cursive;
          font-size: 0.9em;
          color: #8a2a2a;
          margin: 0 0.1em;
        }

        /* photo oval with gold ring */
        .cv-photo {
          position: relative;
          width: clamp(110px, 32%, 160px);
          aspect-ratio: 3 / 4;
          margin: 8px 0 4px;
          border-radius: 50% / 50%;
          overflow: hidden;
          background: #e8d6b6;
          box-shadow:
            0 12px 30px rgba(80,20,20,.25),
            inset 0 0 0 6px #fbf3e4,
            inset 0 0 0 8px #c79a4c;
          animation: cv-pop 0.9s ease-out 2.0s both;
        }
        .cv-photo img {
          width: 100%; height: 100%;
          object-fit: cover;
          display: block;
        }
        .cv-photo-ring {
          position: absolute; inset: -10px;
          border-radius: 50% / 50%;
          border: 1px solid rgba(199,154,76,.6);
          pointer-events: none;
        }

        .cv-guest {
          margin-top: 14px;
          font-family: 'Playfair Display', 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          color: #5a1e1e;
          line-height: 1.55;
          animation: cv-rise 0.6s ease-out 2.5s both;
        }
        .cv-guest strong {
          display: inline-block;
          margin-top: 4px;
          font-weight: 700;
          font-size: 1.15em;
          letter-spacing: 0.02em;
        }

        .cv-cta {
          margin-top: 18px;
          display: inline-flex; align-items: center; gap: 10px;
          padding: 12px 26px;
          background: #5a1e1e;
          color: #fbf3e4;
          border: 1px solid #3e1414;
          border-radius: 999px;
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          box-shadow: 0 8px 22px rgba(80,20,20,.35);
          transition: transform .25s ease, box-shadow .25s ease;
          animation: cv-rise 0.6s ease-out 2.8s both;
        }
        .cv-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(80,20,20,.45);
        }
        .cv-cta-icon {
          display: inline-grid; place-items: center;
          width: 22px; height: 22px;
          border-radius: 50%;
          background: #fbf3e4;
          color: #5a1e1e;
          font-size: 0.7rem;
        }

        /* ---------- responsive (mobile-first; tweaks for larger screens) ---------- */
        @media (min-width: 641px) {
          .cv-inner { max-width: 420px; gap: 8px; }
          .cv-rose  { width: clamp(140px, 18vw, 200px); }
        }
        @media (min-width: 1024px) {
          .cv-scenery   { opacity: 0.75; }
          .cv-batik-top { height: clamp(140px, 16vh, 200px); }
          .cv-rose      { width: 200px; }
        }
        /* very short landscape (mobile rotated) */
        @media (max-height: 520px) {
          .cv-inner    { padding-top: 80px; padding-bottom: 90px; gap: 2px; }
          .cv-batik-top { height: 80px; }
          .cv-joglo    { width: min(360px, 70vw); }
        }
      `}</style>
    </div>
  );
}
