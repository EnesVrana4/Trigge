"use client";

import { useEffect, useRef, useState } from "react";
import {
  ClipboardList,
  Code2,
  PenTool,
  ShieldCheck,
  UserRound,
} from "lucide-react";

// The board is laid out in fixed pixels and scaled down on small screens, so
// the card flights always line up.
const CARD_W = 108;
const CARD_H = 56;
const GAP = 10;
const HEADER = 32;
const PAD = 14;

const COLUMNS = [
  { title: "Design", tint: "text-accent-light" },
  { title: "Build", tint: "text-accent" },
  { title: "Review", tint: "text-emerald-400" },
];

const CARDS = [
  { title: "Checkout flow", role: "UX", Icon: PenTool },
  { title: "Search API", role: "Dev", Icon: Code2 },
  { title: "Cart tests", role: "QA", Icon: ShieldCheck },
  { title: "Pricing page", role: "You", Icon: UserRound },
  { title: "Order emails", role: "PM", Icon: ClipboardList },
];

const ACTIVITY = [
  "UX shared new screens",
  "Dev pushed to staging",
  "QA passed 12 checks",
  "You approved the milestone",
];

const STEP = 2200;
const SHIP_BACK = 900;
const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

type Board = number[][];

const START: Board = [[0, 3], [1, 4], [2]];

export default function TeamBoard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useState<Board>(START);
  const boardRef = useRef<Board>(START);
  // The card in flight right now, lit up while it travels.
  const [flying, setFlying] = useState<number | null>(null);
  // Cards on their way out of Review, briefly shown as shipped.
  const [shipped, setShipped] = useState<number[]>([]);
  const [activity, setActivity] = useState(0);
  const [seen, setSeen] = useState(false);
  const [held, setHeld] = useState(false);
  const [still, setStill] = useState(false);
  const source = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStill(true);
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  // Move one card along every step: Design to Build to Review, then it ships
  // and comes back as new work.
  useEffect(() => {
    if (!seen || still || held) return;

    const pending: number[] = [];
    const commit = (next: Board) => {
      boardRef.current = next;
      setBoard(next);
    };

    const id = window.setInterval(() => {
      const next = boardRef.current.map((column) => [...column]);
      let from = source.current;
      for (let i = 0; i < COLUMNS.length && next[from].length === 0; i++) {
        from = (from + 1) % COLUMNS.length;
      }
      if (next[from].length === 0) return;
      source.current = (from + 1) % COLUMNS.length;

      const card = next[from].shift() as number;
      if (from === COLUMNS.length - 1) {
        // Off the board, then back in as new work.
        setShipped((list) => [...list, card]);
        pending.push(
          window.setTimeout(() => {
            setShipped((list) => list.filter((item) => item !== card));
            const back = boardRef.current.map((column) => [...column]);
            back[0] = [...back[0], card];
            commit(back);
          }, SHIP_BACK),
        );
      } else {
        next[from + 1] = [...next[from + 1], card];
      }

      commit(next);
      setFlying(card);
      pending.push(window.setTimeout(() => setFlying(null), 700));
      setActivity((a) => (a + 1) % ACTIVITY.length);
    }, STEP);

    return () => {
      window.clearInterval(id);
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, [seen, still, held]);

  const place = (card: number) => {
    for (let column = 0; column < board.length; column++) {
      const slot = board[column].indexOf(card);
      if (slot !== -1) {
        return {
          x: PAD + column * (CARD_W + GAP),
          y: PAD + HEADER + slot * (CARD_H + GAP),
        };
      }
    }
    return null;
  };

  const width = PAD * 2 + COLUMNS.length * CARD_W + (COLUMNS.length - 1) * GAP;
  const height = PAD * 2 + HEADER + 3 * (CARD_H + GAP) + 26;

  return (
    <div ref={wrapRef} className="flex justify-center">
      <div
        onPointerEnter={(event) => event.pointerType === "mouse" && setHeld(true)}
        onPointerLeave={(event) => event.pointerType === "mouse" && setHeld(false)}
        style={{ width, height }}
        className={`relative origin-top scale-[0.85] transition-all duration-700 sm:scale-100 lg:scale-110 ${EASE} ${
          seen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        {/* The window: this is the staging link the copy talks about. */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl border border-white/10 bg-navy-900/80 shadow-2xl shadow-navy-950/60 backdrop-blur">
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-3 py-2">
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="h-2 w-2 rounded-full bg-white/20" />
            <span className="ml-1 truncate rounded-md bg-navy-950/60 px-2 py-0.5 text-[9px] text-white/40">
              staging.yourproject.com
            </span>
            <span className="ml-auto flex items-center gap-1 text-[9px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              LIVE
            </span>
          </div>
        </div>

        {/* Columns */}
        <div className="absolute inset-0" style={{ padding: PAD, paddingTop: PAD + 26 }}>
          <div className="flex gap-[10px]">
            {COLUMNS.map((column, i) => (
              <div
                key={column.title}
                style={{ width: CARD_W }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div className="flex items-center justify-between px-2 py-1.5">
                  <span className={`text-[10px] font-semibold ${column.tint}`}>
                    {column.title}
                  </span>
                  <span
                    key={board[i].length}
                    className="animate-appear rounded-full bg-white/10 px-1.5 text-[9px] text-white/60"
                  >
                    {board[i].length}
                  </span>
                </div>
                <div style={{ height: 3 * (CARD_H + GAP) - 24 }} />
              </div>
            ))}
          </div>
        </div>

        {/* Cards, flying between the columns. */}
        {CARDS.map((card, i) => {
          const spot = place(i);
          const leaving = shipped.includes(i);
          if (!spot && !leaving) return null;
          const x = spot ? spot.x : PAD + 2 * (CARD_W + GAP);
          const y = spot ? spot.y + 26 : PAD + HEADER + 26;
          return (
            <div
              key={card.title}
              style={{
                width: CARD_W,
                height: CARD_H,
                transform: `translate(${x}px, ${y - (leaving ? 26 : 0)}px)`,
              }}
              className={`absolute left-0 top-0 rounded-lg border bg-navy-800 p-2 transition-all duration-700 ${EASE} ${
                leaving ? "scale-95 opacity-0" : "scale-100 opacity-100"
              } ${
                flying === i
                  ? "z-10 scale-[1.06] border-accent/50 shadow-xl shadow-accent/20"
                  : "border-white/10 shadow-lg"
              }`}
            >
              <p className="truncate text-[10px] font-semibold text-white/90">
                {card.title}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <card.Icon size={11} strokeWidth={2} />
                </span>
                <span className="text-[9px] font-medium text-white/50">
                  {card.role}
                </span>
              </div>
            </div>
          );
        })}

        {/* Teammates moving around the board. */}
        {!still && (
          <>
            <Cursor name="UX" className="animate-cursor-a" color="#a8c9f5" />
            <Cursor name="You" className="animate-cursor-b" color="#10b981" />
          </>
        )}

        {/* What just happened, in one line. */}
        <div className="absolute inset-x-3 bottom-2 flex items-center gap-2 text-[10px] text-white/45">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span key={activity} className="animate-appear truncate">
            {ACTIVITY[activity]}
          </span>
        </div>
      </div>
    </div>
  );
}

/** A teammate's pointer, with their name on the tag. */
function Cursor({
  name,
  color,
  className,
}: {
  name: string;
  color: string;
  className: string;
}) {
  return (
    <div className={`pointer-events-none absolute left-0 top-0 ${className}`}>
      <svg width="14" height="16" viewBox="0 0 14 16" fill={color} aria-hidden>
        <path d="M1 1l11 6.5-4.8 1.2L4.9 14Z" />
      </svg>
      <span
        style={{ backgroundColor: color }}
        className="ml-2 inline-block rounded px-1 py-px text-[8px] font-semibold text-navy-950"
      >
        {name}
      </span>
    </div>
  );
}
