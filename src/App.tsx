import { lazy, Suspense, useEffect, useState } from 'react';
import { Cover } from './components/Cover';

// All post-Cover content (including GSAP/Lenis) is code-split out of the
// initial bundle. It starts downloading the moment the guest taps "Buka
// Undangan" (which sets `triggered`), so by the time the Cover finishes
// its fade-out the next screen is usually ready.
const PostCover = lazy(() => import('./components/PostCover'));

export default function App() {
  const [triggered, setTriggered] = useState(false); // klik → mulai mount Pambuko di belakang Cover
  const [opened, setOpened]       = useState(false); // Cover sudah fade out & unmount

  useEffect(() => {
    document.body.style.overflow = opened ? '' : 'hidden';
  }, [opened]);

  const guestName = (() => {
    const params = new URLSearchParams(window.location.search);
    // Support: /?to=Bapak%20Andi   /?to=bapak-andi   /?to=bapak_andi   /#bapak-andi
    const raw = params.get('to') ?? params.get('guest') ?? decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!raw) return undefined;
    return raw
      .replace(/[-_+]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toLocaleUpperCase('id-ID') + w.slice(1).toLocaleLowerCase('id-ID'))
      .join(' ');
  })();

  return (
    <>
      <main>
        {triggered && (
          <Suspense fallback={null}>
            <PostCover opened={opened} />
          </Suspense>
        )}
      </main>

      {!opened && (
        <Cover
          onTrigger={() => setTriggered(true)}
          onOpen={() => setOpened(true)}
          guestName={guestName}
        />
      )}
    </>
  );
}
