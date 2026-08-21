/*
 * Shared classes for the solid brand buttons (violet/cyan fill, night label).
 *
 * hover:text-night is not redundant: legacy style.css sets a global
 * `a:hover { color: #469fdf }` whose (0,1,1) specificity outranks `.text-night`
 * (0,1,0), so every one of these buttons that renders as an <a> lost its label
 * colour on hover. Any new solid button must use this const, not a hand-rolled
 * copy — the trap is invisible until you hover.
 */
export const solidButton =
  "rounded-full font-semibold text-night transition hover:brightness-110 hover:text-night focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan";
