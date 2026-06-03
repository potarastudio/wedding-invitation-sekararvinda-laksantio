import { Pambuko } from './Pambuko';
import { Mempelai } from './Mempelai';
import { Countdown } from './Countdown';
import { Acara } from './Acara';
import { Galeri } from './Galeri';
import { Gift } from './Gift';
import { RSVP } from './RSVP';
import { Tutup } from './Tutup';
import { SiteBackground } from './SiteBackground';
import { Backsound } from './Backsound';
import { useLenis } from '../hooks/useLenis';

interface Props {
  opened: boolean;
}

/**
 * All sections rendered AFTER the user taps "Buka Undangan".
 * Isolated into its own module so it can be code-split via React.lazy,
 * keeping the initial bundle (Cover only) tiny.
 */
export default function PostCover({ opened }: Props) {
  useLenis(opened);
  return (
    <>
      <SiteBackground />
      <Pambuko />
      <Mempelai />
      <Countdown />
      <Acara />
      <Galeri />
      <Gift />
      <RSVP />
      <Tutup />
      <Backsound enabled={opened} src="/audio/Turning Page (Instrumental).mp3" />
    </>
  );
}
