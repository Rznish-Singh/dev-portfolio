// Apple-style palette. Light: #0066CC blue, #FFFFFF, #F5F5F7, #1D1D1F. Dark uses Apple's dark system colours.
export function IoTheme() {
  return (
    <style>{`
.io{--io-bg:#F5F5F7;--io-card:#FFFFFF;--io-line:#D2D2D7;--io-ink:#1D1D1F;--io-sub:#6E6E73;--io-skel:#E8E8ED;
--io-blue:#0066CC;--io-green:#34C759;--io-amber:#FF9F0A;--io-red:#FF3B30;--io-purple:#AF52DE;--io-pink:#FF2D55;--io-teal:#32ADE6;
--io-photo:linear-gradient(160deg,#FF9F0A,#FF2D55 45%,#AF52DE 75%,#0066CC);color:var(--io-ink)}
.dark .io,[data-theme="dark"] .io{--io-bg:#1D1D1F;--io-card:#2C2C2E;--io-line:#424245;--io-ink:#F5F5F7;--io-sub:#A1A1A6;--io-skel:#3A3A3C;
--io-blue:#2997FF;--io-green:#30D158;--io-amber:#FF9F0A;--io-red:#FF453A;--io-purple:#BF5AF2;--io-pink:#FF375F;--io-teal:#64D2FF}
.io *{border-color:var(--io-line)}
`}</style>
  );
}
