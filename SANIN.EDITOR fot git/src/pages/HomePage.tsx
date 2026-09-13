import { Seo } from '../components/Seo';
import { Marquee } from '../components/Marquee';
import Hero from '../sections/Hero';
import HomeWork from '../sections/HomeWork';
import EditProcess from '../sections/EditProcess';
import HomeExpertise from '../sections/HomeExpertise';
import HomeAbout from '../sections/HomeAbout';

/* ============================================================
   HOME — the sequence:
   OPENING SHOT → WORK (3 acts + pause) → MARQUEE CUT →
   THE EDIT (pinned process) → EXPERTISE → CLOSING STATEMENT
   ============================================================ */

export default function HomePage() {
  return (
    <>
      <Seo />
      <Hero />
      <HomeWork />
      <Marquee />
      <EditProcess />
      <HomeExpertise />
      <HomeAbout />
    </>
  );
}
