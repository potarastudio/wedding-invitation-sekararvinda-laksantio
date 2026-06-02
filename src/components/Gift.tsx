import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { invitation } from '../data/invitation';

gsap.registerPlugin(ScrollTrigger);

/**
 * Gift — "Tandha Katresnan" wedding gift section.
 * Toggle reveal → Bank Mandiri card (copy rekening) + Shipping address card (copy).
 */
export function Gift() {
  const rootRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gf-eyebrow, .gf-title, .gf-divider, .gf-lead, .gf-toggle', {
        opacity: 0, y: 24,
        duration: 0.8, stagger: 0.1, ease: 'power2.out',
        scrollTrigger: { trigger: '.gf-head', start: 'top 80%' },
      });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const copy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      /* ignore */
    }
  };

  const { gift, shipping } = invitation;

  return (
    <section ref={rootRef} className="gf" aria-label="Wedding Gift">
      <div className="gf-head">
        <p className="gf-eyebrow">Tandha Katresnan</p>
        <h2 className="gf-title">Wedding Gift</h2>
        <div className="gf-divider" aria-hidden>
          <span /><span className="dot" /><span />
        </div>
        <p className="gf-lead">
          Doa restu Bapak/Ibu/Saudara/i adalah anugerah terindah. Namun, bila berkenan
          memberikan tanda kasih, dapat melalui:
        </p>
        <button className="gf-toggle" onClick={() => setOpen(v => !v)} aria-expanded={open}>
          {open ? 'Tutup Amplop' : 'Buka Amplop'}
        </button>
      </div>

      {open && (
        <div className="gf-cards">
          {/* Rekening */}
          <div className="gf-card">
            <p className="gf-card-eyebrow">Transfer</p>
            <h3 className="gf-card-title">{gift.bank}</h3>
            <p className="gf-acct-no">{gift.accountNumber}</p>
            <p className="gf-acct-name">a.n. {gift.accountName}</p>
            <button
              className="gf-btn"
              onClick={() => copy(gift.accountNumber, 'rek')}
            >
              {copied === 'rek' ? 'Tersalin ✓' : 'Salin Nomor Rekening'}
            </button>
          </div>

          {/* Shipping */}
          <div className="gf-card">
            <p className="gf-card-eyebrow">Kirim Hadiah</p>
            <h3 className="gf-card-title">{shipping.recipient}</h3>
            <p className="gf-ship-phone">{shipping.phone}</p>
            <p className="gf-ship-addr">{shipping.address}</p>
            <button
              className="gf-btn"
              onClick={() => copy(`${shipping.recipient}\n${shipping.phone}\n${shipping.address}`, 'ship')}
            >
              {copied === 'ship' ? 'Tersalin ✓' : 'Salin Alamat'}
            </button>
          </div>
        </div>
      )}

      <style>{`
        .gf {
          position: relative;
          z-index: 1;
          padding: clamp(40px, 7dvh, 80px) 18px clamp(60px, 10dvh, 120px);
          max-width: 720px;
          margin: 0 auto;
        }
        .gf-head { text-align: center; }
        .gf-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.3em; text-transform: uppercase;
          font-size: clamp(0.75rem, 2.2vw, 0.85rem);
          color: #b08438; margin: 0 0 8px;
        }
        .gf-title {
          font-family: 'Great Vibes', cursive;
          font-size: clamp(2.6rem, 9vw, 3.4rem);
          color: #5a1e1e; font-weight: 400; margin: 0 0 10px; line-height: 1.1;
        }
        .gf-divider { display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 18px; }
        .gf-divider span { display: block; width: 38px; height: 1px; background: #b08438; }
        .gf-divider .dot { width: 6px; height: 6px; border-radius: 50%; background: #b08438; }
        .gf-lead {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.8vw, 1.05rem);
          line-height: 1.7;
          color: #5a1e1e;
          max-width: 360px;
          margin: 0 auto 22px;
        }
        .gf-toggle {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.85rem, 2.4vw, 0.95rem);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #5a1e1e;
          background: linear-gradient(180deg, #e8c987 0%, #c7a86d 100%);
          border: 1px solid #b08438;
          border-radius: 999px;
          padding: 12px 30px;
          cursor: pointer;
          box-shadow:
            0 1px 0 rgba(255,255,255,0.35) inset,
            0 4px 14px rgba(0,0,0,0.18);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .gf-toggle:hover { transform: translateY(-2px); }

        .gf-cards {
          display: grid;
          gap: 16px;
          margin-top: clamp(24px, 4dvh, 36px);
          animation: gf-rise 0.5s ease both;
        }
        @keyframes gf-rise { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: none } }

        .gf-card {
          position: relative;
          background: linear-gradient(180deg, #5a1e1e 0%, #4a1414 100%);
          color: #f3e6c8;
          border-radius: 14px;
          padding: clamp(24px, 4dvh, 36px) clamp(20px, 5vw, 32px);
          text-align: center;
          box-shadow:
            0 1px 0 rgba(255,224,160,0.18) inset,
            0 8px 24px rgba(90,30,30,0.25);
        }
        .gf-card::before {
          content: '';
          position: absolute; inset: 8px;
          border: 1px solid rgba(199,168,109,0.45);
          border-radius: 9px;
          pointer-events: none;
        }
        .gf-card-eyebrow {
          font-family: 'Playfair Display', serif;
          letter-spacing: 0.28em; text-transform: uppercase;
          font-size: clamp(0.7rem, 2vw, 0.78rem);
          color: #c7a86d;
          margin: 0 0 6px;
        }
        .gf-card-title {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.1rem, 3.4vw, 1.3rem);
          font-weight: 600;
          color: #f3e6c8;
          margin: 0 0 12px;
        }
        .gf-acct-no {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1.3rem, 5vw, 1.7rem);
          letter-spacing: 0.08em;
          color: #c7a86d;
          font-variant-numeric: tabular-nums;
          margin: 0 0 4px;
        }
        .gf-acct-name {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: #ebd7a8;
          margin: 0 0 18px;
        }
        .gf-ship-phone {
          font-family: 'Playfair Display', serif;
          font-size: clamp(1rem, 3vw, 1.15rem);
          color: #c7a86d;
          margin: 0 0 6px;
        }
        .gf-ship-addr {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(0.95rem, 2.7vw, 1.05rem);
          color: #ebd7a8;
          line-height: 1.6;
          margin: 0 0 18px;
        }
        .gf-btn {
          font-family: 'Playfair Display', serif;
          font-size: clamp(0.8rem, 2.3vw, 0.9rem);
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #5a1e1e;
          background: linear-gradient(180deg, #e8c987 0%, #c7a86d 100%);
          border: 1px solid #b08438;
          border-radius: 999px;
          padding: 10px 22px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }
        .gf-btn:hover { transform: translateY(-2px); }

        @media (min-width: 720px) {
          .gf-cards { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </section>
  );
}
