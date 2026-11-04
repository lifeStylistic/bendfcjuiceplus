// Saddle-stitch imposition plan for an N-page booklet (N divisible by 4).
// Sheet s (1-based) front: [N-2(s-1) | 1+2(s-1)], back: [2+2(s-1) | N-1-2(s-1)].
// Print duplex, flip on SHORT edge, stack sheets in order, fold in half.
export function imposition(n) {
  if (n % 4) throw new Error(`page count ${n} must be divisible by 4`);
  const sides = [];
  for (let s = 0; s < n / 4; s++) {
    sides.push({ sheet: s + 1, side: 'front', left: n - 2 * s, right: 1 + 2 * s });
    sides.push({ sheet: s + 1, side: 'back', left: 2 + 2 * s, right: n - 1 - 2 * s });
  }
  return sides;
}
