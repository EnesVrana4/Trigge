import Image from "next/image";
import type { CSSProperties } from "react";
import { MARK_T, MARK_TRANSFORM, MARK_TRIANGLE, MARK_VIEWBOX, WORK } from "@/lib/intro";

/**
 * The hero's 3D laptop and phone, in plain CSS 3D. Everything that animates
 * is read from CSS variables set by HeroScene on an ancestor:
 *   --lid        lid angle in deg (-90 closed, 10 open)
 *   --lid-shade  lid shadow on the keyboard, 0-1
 *   --scr        screens waking up, 0-1
 *   --tilt       stage rotateY in deg, follows the mouse
 *   --gx         screen glare position, %
 *   --ph-x/--ph-z/--ph-o/--ph-shadow   the phone sliding out
 *
 * Opacity only ever sits on leaf faces, never on a preserve-3d group: Safari
 * flattens 3D under opacity, filter or clip-path.
 */

// Rounded edges are stacks of rounded slices, so the corners have no seams.
const band = (n: number, hi: number, lo: number) =>
  Array.from({ length: n }, (_, i) => {
    const v = Math.round(hi + ((lo - hi) * i) / Math.max(1, n - 1));
    return { z: -(i + 0.5), bg: `rgb(${v},${v + 7},${v + 15})` };
  });
const LID_SLICES = band(6, 96, 62);
const BASE_SLICES = band(10, 150, 32);
const PHONE_SLICES = Array.from({ length: 14 }, (_, i) => {
  const mid = Math.abs(i - 6.5) / 6.5; // 0 in the middle of the band, 1 at the rims
  const light = Math.round(70 + 70 * (1 - mid));
  return { z: -(i + 0.5), bg: `rgb(${light},${light + 7},${light + 16})` };
});

const ones = (n: number) => Array.from({ length: n }, () => 1);
const KEY_ROWS = [
  { h: 10, keys: ones(14) },
  { h: 21, keys: [...ones(13), 1.6] },
  { h: 21, keys: [1.6, ...ones(13)] },
  { h: 21, keys: [1.9, ...ones(11), 1.9] },
  { h: 21, keys: [2.4, ...ones(10), 2.4] },
  { h: 21, keys: [...ones(4), 5.4, ...ones(4)] },
];

const SLIDE_EASE = "cubic-bezier(0.65, 0, 0.35, 1)";

function slideStyle(i: number, slide: number, prev: number, delay: number): CSSProperties {
  if (i === slide) return { transform: "translateY(0%)", transition: `transform 950ms ${SLIDE_EASE} ${delay}ms` };
  if (i === prev) return { transform: "translateY(-100%)", transition: `transform 950ms ${SLIDE_EASE} ${delay}ms` };
  // Waiting below the screen for its turn.
  return { transform: "translateY(100%)", transition: "none" };
}

const px = (name: string) => `calc(var(${name}) * 1px)`;

export default function HeroDevices({ slide, prev }: { slide: number; prev: number }) {
  return (
    <div
      className="absolute left-0 top-0 h-[560px] w-[700px]"
      style={{ perspective: 1900, perspectiveOrigin: "38% 52%" }}
    >
      <div
        className="absolute left-5 top-0 h-[540px] w-[460px]"
        style={{
          transformStyle: "preserve-3d",
          transform: "rotateX(-6deg) rotateY(calc(var(--tilt) * 1deg))",
          transition: "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* Base, lying flat */}
        <div
          className="absolute left-0 top-[320px] h-[300px] w-[460px]"
          style={{
            transformOrigin: "50% 0",
            transform: "rotateX(90deg)",
            transformStyle: "preserve-3d",
            borderRadius: "8px 8px 18px 18px",
            background:
              "linear-gradient(112deg, rgba(255,255,255,0) 28%, rgba(255,255,255,0.08) 46%, rgba(255,255,255,0) 60%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px), linear-gradient(180deg, #4e555e 0%, #41474f 45%, #373d44 100%)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09), inset 0 -2px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Tight contact shadow under the base */}
          <div
            className="absolute -left-3.5 -top-1.5 h-[320px] w-[488px] rounded-[26px] bg-black/75"
            style={{ filter: "blur(16px)", transform: "translateZ(-14px)" }}
          />
          {BASE_SLICES.map((s) => (
            <div
              key={s.z}
              className="absolute inset-0"
              style={{ borderRadius: "8px 8px 18px 18px", background: s.bg, transform: `translateZ(${s.z}px)` }}
            />
          ))}
          <div
            className="absolute left-[60px] top-0 h-2.5 w-[340px] rounded-b-md"
            style={{ background: "linear-gradient(180deg, #0c0e10 0%, #2b3036 55%, #15181b 100%)" }}
          />
          {[18, 412].map((left) => (
            <div
              key={left}
              className="absolute top-7 h-[148px] w-[30px] rounded"
              style={{
                left,
                backgroundImage: "radial-gradient(circle, #1b1f24 0px, #1b1f24 1px, rgba(0,0,0,0) 1.5px)",
                backgroundSize: "5px 5px",
              }}
            />
          ))}
          {/* Keyboard */}
          <div
            className="absolute left-[58px] top-6 flex h-[152px] w-[344px] flex-col gap-1 rounded-[7px] bg-[#23272c] p-[5px]"
            style={{ boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6)" }}
          >
            {KEY_ROWS.map((row, r) => (
              <div key={r} className="flex gap-1" style={{ height: row.h }}>
                {row.keys.map((grow, k) => (
                  <div
                    key={k}
                    className="rounded-[3px]"
                    style={{
                      flexGrow: grow,
                      flexBasis: 0,
                      background: "linear-gradient(180deg, #1c1f23 0%, #111316 100%)",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.07), inset 0 -1px 0 rgba(0,0,0,0.4), 0 0 0 0.5px rgba(0,0,0,0.6), 0 1px 1px rgba(0,0,0,0.5)",
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Trackpad */}
          <div
            className="absolute left-[140px] top-[190px] h-[94px] w-[180px] rounded-lg"
            style={{
              background:
                "linear-gradient(125deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0) 45%), linear-gradient(180deg, #474e57 0%, #3c4249 100%)",
              boxShadow:
                "inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 2px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.25)",
            }}
          />
          {/* Screen light on the keys */}
          <div
            className="absolute left-[58px] top-6 h-[152px] w-[344px] rounded-[7px]"
            style={{
              background: "radial-gradient(ellipse 70% 90% at 50% 0%, rgba(157,186,240,0.10) 0%, rgba(157,186,240,0) 70%)",
              opacity: "var(--scr)",
            }}
          />
          <div className="absolute left-[200px] top-[294px] h-1.5 w-[60px] rounded-t-md bg-[#2a2f35]" />
          <div
            className="absolute left-0 top-0 h-[150px] w-[460px] rounded-t-md"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 100%)",
              opacity: "var(--lid-shade)",
            }}
          />
          <div
            className="absolute left-0 top-0 h-[170px] w-[460px]"
            style={{
              background: "radial-gradient(ellipse 60% 100% at 50% 0%, rgba(157,186,240,0.16) 0%, rgba(157,186,240,0) 70%)",
              opacity: "var(--scr)",
            }}
          />
        </div>

        {/* Lid */}
        <div
          className="absolute left-0 top-7 h-[290px] w-[460px]"
          style={{
            transformOrigin: "50% 100%",
            transform: "rotateX(calc(var(--lid) * 1deg))",
            transformStyle: "preserve-3d",
          }}
        >
          <div
            className="absolute inset-0 box-border bg-[#050608] px-[9px] pb-5 pt-[9px]"
            style={{
              backfaceVisibility: "hidden",
              borderRadius: "16px 16px 5px 5px",
              boxShadow: "inset 0 0 0 1px #7a828c, inset 0 0 0 2.5px #2c3238, inset 0 0 0 4px #07080a",
            }}
          >
            {/* Webcam */}
            <div className="absolute left-[226px] top-[3px] flex h-1 w-2 items-center justify-center">
              <div className="h-1 w-1 rounded-full bg-[#1a2230]" style={{ boxShadow: "0 0 0 1px #0d1116" }} />
            </div>
            <div className="relative h-full w-full overflow-hidden rounded bg-black">
              <div
                className="absolute inset-0"
                style={{ opacity: "var(--scr)", transform: "scale(calc(1.06 - 0.06 * var(--scr)))" }}
              >
                {WORK.map((w, i) => (
                  <Image
                    key={w.key}
                    src={w.desk}
                    alt={`${w.alt} on the laptop`}
                    fill
                    sizes="442px"
                    preload={i === 0}
                    className="object-cover"
                    style={slideStyle(i, slide, prev, 0)}
                  />
                ))}
              </div>
              <div
                className="absolute inset-0"
                style={{
                  background: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0) 60%, rgba(0,0,0,0.35) 100%)",
                  opacity: "var(--scr)",
                }}
              />
            </div>
            {/* Glare, shifting with the mouse */}
            <div
              className="absolute inset-0"
              style={{
                borderRadius: "14px 14px 4px 4px",
                background:
                  "linear-gradient(118deg, rgba(255,255,255,0) calc(var(--gx) * 1%), rgba(255,255,255,0.10) calc((var(--gx) + 10) * 1%), rgba(255,255,255,0.02) calc((var(--gx) + 26) * 1%), rgba(255,255,255,0) calc((var(--gx) + 40) * 1%))",
              }}
            />
          </div>
          {LID_SLICES.map((s) => (
            <div
              key={s.z}
              className="absolute inset-0"
              style={{ borderRadius: "16px 16px 5px 5px", background: s.bg, transform: `translateZ(${s.z}px)` }}
            />
          ))}
          {/* Back of the lid, with the mark */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "translateZ(-6px) rotateY(180deg)",
              borderRadius: "16px 16px 5px 5px",
              background:
                "linear-gradient(120deg, rgba(255,255,255,0) 25%, rgba(255,255,255,0.09) 45%, rgba(255,255,255,0) 62%), repeating-linear-gradient(90deg, rgba(255,255,255,0.02) 0px, rgba(255,255,255,0.02) 1px, rgba(0,0,0,0) 1px, rgba(0,0,0,0) 3px), linear-gradient(165deg, #5b636d 0%, #474e57 40%, #373d44 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          >
            <svg width="58" height="41" viewBox={MARK_VIEWBOX} aria-hidden>
              <g transform={MARK_TRANSFORM} fill="#ffffff" fillOpacity={0.22}>
                <path d={MARK_T} />
                <path d={MARK_TRIANGLE} />
              </g>
            </svg>
          </div>
        </div>

        {/* Phone: slides out from behind the screen */}
        <div
          className="absolute left-0 top-[34px] h-[262px] w-32"
          style={{
            transformStyle: "preserve-3d",
            transform: `translate3d(${px("--ph-x")}, 0px, ${px("--ph-z")}) rotateY(-10deg)`,
          }}
        >
          <div
            className="absolute -left-[26px] top-[296px] h-20 w-[180px]"
            style={{
              transformOrigin: "50% 0",
              transform: "translateZ(-47px) rotateX(90deg)",
              background:
                "radial-gradient(ellipse 48% 40% at 50% 50%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0) 75%)",
              filter: "blur(5px)",
              opacity: "var(--ph-shadow)",
            }}
          />
          {PHONE_SLICES.map((s) => (
            <div
              key={s.z}
              className="absolute inset-0 rounded-[21px]"
              style={{ background: s.bg, transform: `translateZ(${s.z}px)`, opacity: "var(--ph-o)" }}
            />
          ))}
          {/* Side button */}
          <div
            className="absolute left-32 top-[62px] h-9 w-2.5 rounded-[3px]"
            style={{
              transformOrigin: "0 50%",
              transform: "translateX(0.6px) translateZ(-2px) rotateY(90deg)",
              background: "linear-gradient(90deg, #a7afb9 0%, #5d656e 100%)",
              opacity: "var(--ph-o)",
            }}
          />
          {/* Back, with the camera bump */}
          <div
            className="absolute inset-0 rounded-[21px]"
            style={{
              backfaceVisibility: "hidden",
              transform: "translateZ(-14px) rotateY(180deg)",
              background: "linear-gradient(160deg, #454c55 0%, #30363c 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
              opacity: "var(--ph-o)",
            }}
          >
            <div
              className="absolute left-2.5 top-2.5 h-[46px] w-[46px] rounded-[13px] bg-[#2a2f35]"
              style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}
            />
          </div>
          {/* Front */}
          <div
            className="absolute inset-0 box-border rounded-[21px] bg-[#060708] p-[5px]"
            style={{
              backfaceVisibility: "hidden",
              boxShadow: "inset 0 0 0 1.5px #8a929c, inset 0 0 0 3px #1c2025",
              opacity: "var(--ph-o)",
            }}
          >
            <div className="relative h-full w-full overflow-hidden rounded-2xl bg-[#0b0e13]">
              {WORK.map((w, i) => (
                <Image
                  key={w.key}
                  src={w.phone}
                  alt={`${w.alt} on the phone`}
                  fill
                  sizes="118px"
                  preload={i === 0}
                  className="object-cover object-top"
                  style={slideStyle(i, slide, prev, 140)}
                />
              ))}
              {/* Camera cutout */}
              <div className="absolute left-[43px] top-[4.5px] h-[7px] w-8 rounded-full bg-black" />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(125deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.02) 35%, rgba(255,255,255,0) 50%)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
