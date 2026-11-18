"use client";

/** Layered, scalloped marigold blooms + mango-style leaf + tassel. Defined once, reused with <use>. */
export const MG_ORANGE = "dw-mg-orange";
export const MG_YELLOW = "dw-mg-yellow";
export const LEAF = "dw-leaf";
export const TASSEL = "dw-tassel";

// ring: number of petals, distance from centre, petal radius. Outer ring is drawn first.
const RINGS = [
  { n: 14, r: 35, p: 15 },
  { n: 12, r: 26, p: 12.5 },
  { n: 10, r: 18, p: 10 },
  { n: 8, r: 11, p: 7.5 },
  { n: 5, r: 5, p: 4.5 },
];
const ORANGE = ["#e8610a", "#f26f0c", "#ff7f11", "#ff8f26", "#ffa43f"];
const YELLOW = ["#f0a30a", "#f7b010", "#ffbf1f", "#ffcd3d", "#ffdc6b"];

function Bloom({ id, tones, stroke }: { id: string; tones: string[]; stroke: string }) {
  return (
    <g id={id}>
      {RINGS.map((ring, ri) =>
        Array.from({ length: ring.n }, (_, i) => {
          const a = (i / ring.n) * Math.PI * 2 + (ri % 2 ? Math.PI / ring.n : 0);
          return (
            <circle
              key={`${ri}-${i}`}
              cx={+(Math.cos(a) * ring.r).toFixed(2)}
              cy={+(Math.sin(a) * ring.r).toFixed(2)}
              r={ring.p}
              fill={tones[ri]}
              stroke={stroke}
              strokeWidth={1}
            />
          );
        }),
      )}
    </g>
  );
}

/** Render once inside the Diwali layer. Everything else references these ids. */
export function MarigoldDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
      <defs>
        <Bloom id={MG_ORANGE} tones={ORANGE} stroke="#c24d05" />
        <Bloom id={MG_YELLOW} tones={YELLOW} stroke="#c98200" />
        {/* leaf: attach point at origin, hangs along +y (88 units long) */}
        <g id={LEAF}>
          <path d="M0 0C15 20 17 60 0 88C-17 60-15 20 0 0Z" fill="#2f7d32" />
          <path d="M0 0C15 20 17 60 0 88Z" fill="#3f9a42" />
          <path d="M0 4L0 80" stroke="#1d5a22" strokeWidth="1.4" fill="none" />
        </g>
        <g id={TASSEL}>
          <circle r="3.5" fill="#d81b7a" />
          <path d="M-6 3L6 3L9 26L-9 26Z" fill="#e91e8c" />
          <path d="M-3 3L-3 26M0 3L0 26M3 3L3 26" stroke="#b01468" strokeWidth="1" fill="none" />
        </g>
      </defs>
    </svg>
  );
}
