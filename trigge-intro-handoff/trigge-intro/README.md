# Trigge Solutions – first-visit intro + animated hero

Handoff for implementing the approved design on the Trigge website.

**Open `index.html` in a browser first.** It is the approved, working prototype, and the source of truth for every value below. It needs no build step, and everything in it is plain HTML, CSS and JS.

---

## What to build

On a visitor's **first visit**, a black loader plays. The Trigge mark is drawn by a pen, a counter runs, then a black curtain lifts to reveal the hero. The logo flies into the navbar slot, the hero content animates in, a 3D laptop opens, a phone slides out beside it, and both screens then loop through portfolio projects.

On **later visits**, skip the loader and show the hero in its final state. The laptop still opens, and the phone slide-out and carousel still run.

## Files

```
index.html                     approved prototype (template + Component logic + tiny runtime)
assets/logo/trigge-mark.svg    the T mark (white). Same path data is inlined in index.html
assets/hero-video-placeholder.jpg   STAND-IN for the real hero video (see "Hero background")
assets/screens/0N-*-desktop.jpg    laptop screen images, exactly 1768×1044 (2× of 884×522)
assets/screens/0N-*-mobile.jpg     phone screen images, exactly 472×1008 (2× of 236×504)
```

The screen images are final, pre-composed at the exact aspect ratio of each screen. Use `object-fit: cover`; nothing gets cropped.

## How the prototype is structured

Everything is one 1440×810 stage (`#fit`). The prototype scales it to fit the window.

- `<template id="scene">` holds the markup. `{{name}}` holes are filled every frame. `<sc-for>` repeats children and `<sc-if>` toggles them.
- `class Component` → `renderVals()` computes **every animated value from one clock `t` (ms)**. Read this function: it is the animation spec.
- The runtime at the top of the second script only renders the template. **Do not ship the runtime.** Port `renderVals()` into your stack, for example React state plus inline styles, a GSAP timeline, or vanilla `requestAnimationFrame`.

Helpers used in the timeline:

```js
seg(a, b)  = clamp((t - a) / (b - a), 0, 1)                 // progress of a segment
out(p)     = 1 - (1 - p)^3                                  // ease-out cubic
io(p)      = p < .5 ? 4p^3 : 1 - (-2p + 2)^3 / 2            // ease-in-out cubic
```

**Speed:** the clock runs at **1.2×** (`speed: 1.2`). All times below are *design ms*; divide by 1.2 for real seconds.

## Timeline (design ms → real seconds at 1.2×)

| design ms | real s | what happens |
|---|---|---|
| 100 → 1350 | 0.08 → 1.13 | **Pen traces the big T outline.** White 22-unit stroke in viewBox units. A pen tip (white dot r=22 plus blue `#9dbaf0` glow r=70 at 35%) rides the line head. The outline is a polyline built from the T path points (`parse()` / `partial()`). |
| 1250 → 1850 | 1.04 → 1.54 | T fill fades in. The outline fades out from 1650 to 2050. |
| 1350 → 1700 | 1.13 → 1.42 | The **small inner triangle is not traced**. It just fades in (`fill2`, ease-out). |
| 100 → 2000 | → 1.67 | **Blueprint grid** spreads from the logo centre: mask radius 0 → 700px, soft 260px edge. Lines are 48px (white 3%) and 192px (white 7.5%). It dims to 40% between 3400 and 3800. |
| 300 → 3450 | → 2.88 | **Blue glow** behind the logo: `rgba(157,186,240,a)`, a = 0.05 → 0.15 as the counter runs, size 360 → 540px. **No pulse or bloom** (removed on purpose). |
| 1350 + i·70 → 2000 + i·70 | | "TRIGGE" letters rise 46px → 0 with opacity, staggered. |
| 1750 → 2750 | | "SOLUTIONS" letter-spacing 0.95em → 0.42em, fading in. |
| 1950 → 3450 | 1.63 → 2.88 | **Counter 000 → 100** and a 320px progress line. IDEAS → CODE → SOLUTIONS light up at 0, 34 and 67. Passed arrows turn `#9dbaf0`. |
| 3400 → 3700 | | Counter and words fade out. |
| 3650 → 4650 | 3.04 → 3.88 | **Curtain lifts upward** (`clip-path: inset(0 0 X% 0)`, X 0 → 100, ease-in-out). A 1px blue light line rides its bottom edge. **The logo flies to the navbar**: translate(-366px, -308px), scale 1 → 0.36, transform-origin top-left. |
| 3650 → 5550 | | Hero background scales 1.12 → 1. |
| 4150 + k·110 | | Hero items rise 26px and fade in (eyebrow, headline lines, paragraph, CTA, laptop). The headline lines slide up out of an `overflow:hidden` mask. |
| 4400 + k·110 | | Nav links and the "Get in Touch" button drop 12px and fade in. |
| 4900 → 6000 | 4.08 → 5.0 | **Laptop lid opens** from −90° (closed) to +10°, ease-in-out, no bounce. The lid's shadow on the keyboard fades in. |
| 5600 → 6300 | | Laptop screen wakes: opacity 0 → 1, scale 1.06 → 1, and a faint blue glow on the keys. |
| 6000 → 6900 | 5.0 → 5.75 | **Phone slides out from behind the laptop screen** (x 300 → 495 in stage units, starting at z −75, hidden behind the lid). |
| 6600 → 7100 | | The phone moves forward to z +45, a bit in front of the screen plane, rotateY −10°. It floats above the floor with a soft blurred shadow under it. |
| ≥ 7600 | ≈ 6.3 | **Carousel starts** (next section). |

## Portfolio carousel

- There are 5 projects, in order: furniture store, sales CRM, Mediterranean stays, project dashboard, home services. See the `work` array.
- Every **3.2 s** the laptop screen scrolls up to the next project: the current image goes from translateY 0 to −100%, and the next comes up from +100%. It takes 950ms with `cubic-bezier(.65,0,.35,1)`.
- The phone does the same with a **140ms delay**.
- Elements that are neither current nor previous jump to +100% with `transition: none`, off-screen. The loop is endless.
- Pause the carousel when the tab is hidden (`visibilitychange`). The prototype doesn't do this yet.

## 3D laptop and phone (CSS 3D only, no WebGL)

- Container: `perspective: 1900px; perspective-origin: 38% 52%`, `scale(.86)`, at stage left 830px and top 178px.
- Stage transform: `rotateX(-6deg) rotateY(tiltY)`. This gives the low camera angle the client approved.
- **Mouse tilt:** `tiltY = -22° + mx·5°`, where mx is −1…1 across the hero. Use a 700ms ease-out transition. Keep it subtle: the client asked for **less** movement.
- **Thickness:** edges are **stacked rounded slices** with `translateZ(-0.5 … -n px)`, so the rounded corners have no seams. There are 10 slices for the base, 6 for the lid and 14 for the phone. Do **not** use flat edge strips; they showed a line at the corners.
- Laptop: brushed-metal gradients, a keyboard of individual keys (the `keyRows` layout), trackpad, hinge, and webcam dot. The lid screen glare shifts with the mouse. The lid back carries the Trigge mark at 22%.
- Phone: 128×262 with 21px corner radius (reduced on purpose), a thin metal rim, a side button and a camera bump. The **camera cutout** is 32×7px, 4.5px from the top of the screen. The screen images already include the matching top strip.
- The **large floor shadow under the laptop was removed** on purpose. Only the tight contact shadow under the base remains.
- Check Safari: `preserve-3d` with `filter`, `clip-path` and `opacity` on ancestors can flatten 3D. In the prototype, opacity sits on leaf faces and never on `preserve-3d` groups. Keep it that way.

## Hero background

- The approved look is the **client's office video**, darkened and blurred, with slow motion.
- `hero-video-placeholder.jpg` is only a stand-in: a frame from their site with the old text removed. **In production, use the real `<video autoplay muted loop playsinline>`** with the same treatment:
  - Overlay `linear-gradient(90deg, rgba(8,10,14,.72), rgba(8,10,14,.5) 45%, rgba(8,10,14,.35))`.
  - A bottom fade 180px tall to `rgba(8,10,14,.7)`.
  - Optionally a slow light band sweeping across (28s cycle) and a soft warm flicker.
- The prototype fakes camera motion on the still image with a 26s push-in and drift (scale 1.06 → 1.15). A real video doesn't need that.

## Layout and copy (as approved)

- Headline "Custom Software / Solutions for Your / Business". "Business" is `#9dbaf0`. It is 60/60, weight 700, letter-spacing −0.02em.
- Paragraph max-width **470px**. It was narrowed so the laptop base doesn't touch the text.
- Fonts: **Manrope** for UI and body, **Montserrat** for the wordmark, eyebrow and loader words, **JetBrains Mono** for the counter. All three are from Google Fonts.

## Production requirements (not in the prototype)

1. **First visit only:** set `localStorage.trigge_intro_seen = '1'` when the intro finishes or is skipped. If the flag exists, render the hero in its final state immediately.
2. **Skip:** a click, a key press or a scroll during the loader jumps straight to the curtain lift (t = 3650).
3. **`prefers-reduced-motion`:** no loader. Show the hero with a simple fade, the lid already open, the phone in place, no tilt and no carousel scrolling. Crossfade or show a static first project instead.
4. **Responsive:** the stage is designed at 1440×810. Rebuild the hero with your real layout, and keep the loader centred at any size. **Below about 900px wide:** hide the 3D devices or swap in a flat image, and keep the loader, scaled down.
5. **Performance:** preload the logo and the first desktop and mobile screens before starting the clock. Lazy-load the other screens. Keep the loader at or under about 3s real time before the curtain lifts, which it already is. Drive everything from **one** `requestAnimationFrame` clock and stop it when idle, except the carousel timer and the video.
6. **No layout jump:** the navbar logo slot must be exactly where the flying logo lands. Hide the real nav logo until the flight ends, then swap it in.
7. **Accessibility:** the loader gets `aria-hidden="true"`, the hero heading stays the page's `<h1>`, the screen images get alt text (see `work[].alt`), and focus must not be trapped during the intro.

## Screen image notes

The lower parts of the desktop and mobile screens (feature cards, CRM widgets, trust bar and so on) were **designed as extensions** of the client's original mockups. Their names, prices and ratings are sample content. Replace them if real data is available. The home-services phone screen has its "Get a Quote" button removed on purpose (it collided with the camera cutout), and its before/after slider uses the client's bathroom photo.
