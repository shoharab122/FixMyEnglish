const SVG = { fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' };

export const MenuIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" {...SVG}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);
export const CloseIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" {...SVG}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
