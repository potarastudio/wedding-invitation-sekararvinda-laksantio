/**
 * SiteBackground — fixed scenery + canopy + trees yang menjadi background
 * untuk SEMUA section setelah cover dibuka. Tidak ikut scroll.
 */
export function SiteBackground() {
  const hideOnError: React.ReactEventHandler<HTMLImageElement> = (e) => {
    (e.currentTarget as HTMLImageElement).style.display = 'none';
  };

  return (
    <div className="site-bg" aria-hidden>
      <div className="site-bg-paper" />
      <img className="site-bg-scenery" src="/cover/scenery-bg.png" alt="" onError={hideOnError} />
      <img className="site-bg-joglo"   src="/cover/joglo-bottom.png" alt="" onError={hideOnError} />
      <img className="site-bg-canopy"  src="/cover/canopy-top.png"   alt="" onError={hideOnError} />
      <img className="site-bg-tree site-bg-tree-l" src="/cover/tree-fg.png" alt="" onError={hideOnError} />
      <img className="site-bg-tree site-bg-tree-r" src="/cover/tree-fg.png" alt="" onError={hideOnError} />

      <style>{`
        .site-bg {
          position: fixed; inset: 0;
          z-index: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .site-bg-paper {
          position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 35%, #fbf3e4 0%, #f3e6cf 60%, #e8d6b6 100%);
        }
        .site-bg-scenery {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover; object-position: center bottom;
          opacity: 0.7; mix-blend-mode: multiply;
        }
        .site-bg-joglo {
          position: absolute; bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: min(540px, 92vw); height: auto;
          opacity: 0.55; mix-blend-mode: multiply;
        }
        .site-bg-canopy {
          position: absolute; top: 0; left: 50%;
          transform: translateX(-50%);
          width: 100%; max-width: 900px;
          height: auto;
          z-index: 1;
        }
        .site-bg-tree {
          position: absolute; bottom: 0;
          width: clamp(160px, 42vw, 320px); height: auto;
          opacity: 0.95;
          z-index: 1;
        }
        .site-bg-tree-l { left:  -3vw; }
        .site-bg-tree-r { right: -3vw; transform: scaleX(-1); }

        @media (min-width: 1024px) {
          .site-bg-tree { width: min(320px, 24vw); }
        }
      `}</style>
    </div>
  );
}
