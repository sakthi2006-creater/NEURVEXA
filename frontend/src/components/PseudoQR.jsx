import { useMemo } from "react";

/** Visual placeholder QR pattern derived deterministically from the given data.
 *  For a real scannable QR, swap this for a library like `qrcode` server-side
 *  or `qrcode.react` on the frontend. */
export default function PseudoQR({ data, size = 140 }) {
  const cells = 14;
  const grid = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < data.length; i++) seed = (seed * 31 + data.charCodeAt(i)) >>> 0;
    const rand = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    const g = [];
    for (let y = 0; y < cells; y++) {
      const row = [];
      for (let x = 0; x < cells; x++) {
        const inFinder = (x < 3 && y < 3) || (x > cells - 4 && y < 3) || (x < 3 && y > cells - 4);
        row.push(inFinder ? (((x + y) % 2 === 0) ? 1 : ((x === 1 || y === 1) ? 1 : 0)) : (rand() > 0.55 ? 1 : 0));
      }
      g.push(row);
    }
    return g;
  }, [data]);
  const cell = size / cells;
  return (
    <svg width={size} height={size} style={{ background: "#F8FAFC", borderRadius: 8 }}>
      {grid.map((row, y) => row.map((v, x) => v ? (
        <rect key={`${x}-${y}`} x={x * cell} y={y * cell} width={cell} height={cell} fill="#02040D" />
      ) : null))}
    </svg>
  );
}
