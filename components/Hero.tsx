import HeroScene from "./HeroScene";
import InlineScript from "./InlineScript";
import { heroFontVars } from "@/lib/fonts";
import { INTRO_SEEN_KEY } from "@/lib/intro";

// Runs while the HTML is parsed, before the first paint: a visitor opening the
// site in a new tab gets <html data-intro="play">, which shows the loader (see
// globals.css) and tells HeroScene to play the intro. Visitors who already saw
// it in this tab, and reduced-motion visitors, don't, so they never see a
// flash of the loader. Adding ?intro to the URL plays it again regardless, for
// reviewing it.
const FIRST_VISIT = `try{if((/[?&]intro(=|&|$)/.test(location.search)||!sessionStorage.getItem(${JSON.stringify(INTRO_SEEN_KEY)}))&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="play"}catch(e){}`;

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
