import { useEffect, useState } from 'react';
import { Cover } from './components/Cover';
import { Pambuko } from './components/Pambuko';
import { Mempelai } from './components/Mempelai';
import { Countdown } from './components/Countdown';
import { Acara } from './components/Acara';
import { LiveStreaming } from './components/LiveStreaming';
import { Galeri } from './components/Galeri';
import { Story } from './components/Story';
import { Gift } from './components/Gift';
import { RSVP } from './components/RSVP';
import { Tutup } from './components/Tutup';
import { SiteBackground } from './components/SiteBackground';
import { useLenis } from './hooks/useLenis';

export default function App() {
  const [triggered, setTriggered] = useState(false); // klik → Pambuko mount di belakang Cover
  const [opened, setOpened]       = useState(false); // Cover sudah fade out & unmount
  useLenis(opened);

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
          <>
            <SiteBackground />
            <Pambuko />
            <Mempelai />
            <Countdown />
            <Acara />
            <LiveStreaming />
            <Galeri />
            <Story />
            <Gift />
            <RSVP />
            <Tutup />
          </>
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
