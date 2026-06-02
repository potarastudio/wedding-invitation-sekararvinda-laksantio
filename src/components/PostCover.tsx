import { Pambuko } from './Pambuko';
import { Mempelai } from './Mempelai';
import { Countdown } from './Countdown';
import { Acara } from './Acara';
import { LiveStreaming } from './LiveStreaming';
import { Galeri } from './Galeri';
import { Story } from './Story';
import { Gift } from './Gift';
import { RSVP } from './RSVP';
import { Tutup } from './Tutup';
import { SiteBackground } from './SiteBackground';
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
      <LiveStreaming />
      <Galeri />
      <Story />
      <Gift />
      <RSVP />
      <Tutup />
    </>
  );
}
