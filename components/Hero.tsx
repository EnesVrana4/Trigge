import HeroScene from "./HeroScene";
import InlineScript from "./InlineScript";
import { heroFontVars } from "@/lib/fonts";
import { INTRO_SEEN_KEY } from "@/lib/intro";

// Phones show the content immediately. Desktop keeps the first-visit intro;
// ?intro allows an explicit preview on any screen, respecting reduced motion.
const FIRST_VISIT = `try{if((/[?&]intro(=|&|$)/.test(location.search)||(matchMedia("(min-width: 768px)").matches&&!navigator.connection?.saveData&&!sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)})))&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="play"}catch(e){}`;

export default function Hero() {
  return (
    <>
      {/* Only runs on a full page load; after a client navigation the hero
          skips the loader. */}
      <InlineScript html={FIRST_VISIT} />
      <HeroScene fontClass={heroFontVars} />
    </>
  );
}
