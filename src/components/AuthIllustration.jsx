const Sprig = ({ transform, scale = 1 }) => (
    <g transform={`${transform} scale(${scale})`}>
        <line x1="0" y1="0" x2="0" y2="-60" stroke="rgba(255,255,255,0.65)" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M0,-14 C-17,-18 -21,-8 -12,-5 C-6,-3 -1,-7 0,-14 Z" fill="rgba(29,176,76,0.72)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
        <path d="M0,-14 C17,-18 21,-8 12,-5 C6,-3 1,-7 0,-14 Z"  fill="rgba(29,176,76,0.72)" stroke="rgba(255,255,255,0.35)" strokeWidth="0.8" />
        <path d="M0,-31 C-14,-34 -17,-26 -9,-23 C-5,-21 -1,-25 0,-31 Z" fill="rgba(29,176,76,0.62)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
        <path d="M0,-31 C14,-34 17,-26 9,-23 C5,-21 1,-25 0,-31 Z"  fill="rgba(29,176,76,0.62)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.7" />
        <path d="M0,-46 C-10,-49 -12,-42 -7,-40 C-3,-38 -1,-42 0,-46 Z" fill="rgba(29,176,76,0.5)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
        <path d="M0,-46 C10,-49 12,-42 7,-40 C3,-38 1,-42 0,-46 Z"  fill="rgba(29,176,76,0.5)" stroke="rgba(255,255,255,0.22)" strokeWidth="0.6" />
        <ellipse cx="0" cy="-60" rx="3" ry="5" fill="rgba(255,255,255,0.5)" />
    </g>
);

const AuthIllustration = () => {
    // centre of the mandala in the 480×720 viewBox
    const cx = 240, cy = 390;

    // 8 lotus petal angles
    const petalAngles = [0, 45, 90, 135, 180, 225, 270, 315];

    // 8 small accent-dot angles (between petals, on inner ring r=68)
    const accentAngles = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
    const accentDot = (a) => {
        const rad = (a - 90) * (Math.PI / 180);
        return { x: cx + 68 * Math.cos(rad), y: cy + 68 * Math.sin(rad) };
    };

    // 4 sprig positions on the outer ring (r ≈ 175) at diagonal angles
    const sprigs = [
        { angle: 45,  tx: cx + 124, ty: cy - 124 },  // NE
        { angle: 135, tx: cx + 124, ty: cy + 124 },  // SE
        { angle: 225, tx: cx - 124, ty: cy + 124 },  // SW
        { angle: 315, tx: cx - 124, ty: cy - 124 },  // NW
    ];

    // scattered background dots
    const dots = [
        [52, 165], [428, 148], [58, 600], [422, 612],
        [155, 52],  [325, 45],  [458, 330], [28, 445],
        [195, 668], [295, 662], [138, 695], [345, 688],
        [460, 490], [22, 280],
    ];

    // cross accents
    const crosses = [
        [80, 290], [400, 285], [72, 500], [408, 498],
        [240, 175], [240, 600],
    ];

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 480 720"
            width="100%"
            height="100%"
            style={{ position: 'absolute', inset: 0 }}
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
        >
            <defs>
                <radialGradient id="aig-glow" cx="50%" cy="54%" r="48%">
                    <stop offset="0%"   stopColor="#1DB04C" stopOpacity="0.18" />
                    <stop offset="100%" stopColor="#0F3F2A" stopOpacity="0" />
                </radialGradient>
            </defs>

            {/* Ambient centre glow */}
            <ellipse cx={cx} cy={cy} rx="230" ry="290" fill="url(#aig-glow)" />

            {/* ── Concentric rings ── */}
            <circle cx={cx} cy={cy} r="188" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="3 10" />
            <circle cx={cx} cy={cy} r="143" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
            <circle cx={cx} cy={cy} r="90"  fill="rgba(29,176,76,0.05)" stroke="rgba(29,176,76,0.38)" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="32"  fill="rgba(29,176,76,0.1)"  stroke="rgba(255,255,255,0.42)" strokeWidth="1.5" />

            {/* ── Lotus petals ── */}
            {petalAngles.map(a => (
                <path
                    key={a}
                    d="M0,0 C-15,-26 -15,-68 0,-118 C15,-68 15,-26 0,0 Z"
                    transform={`translate(${cx},${cy}) rotate(${a})`}
                    fill="rgba(255,255,255,0.055)"
                    stroke="rgba(255,255,255,0.26)"
                    strokeWidth="1"
                />
            ))}

            {/* ── Accent dots between petals (on inner ring) ── */}
            {accentAngles.map(a => {
                const { x, y } = accentDot(a);
                return <circle key={a} cx={x} cy={y} r="2" fill="rgba(255,255,255,0.28)" />;
            })}

            {/* ── Diamond accents on mid ring at cardinal positions ── */}
            {[0, 90, 180, 270].map(a => {
                const rad = (a - 90) * (Math.PI / 180);
                const x = cx + 143 * Math.cos(rad);
                const y = cy + 143 * Math.sin(rad);
                return (
                    <g key={a} transform={`translate(${x},${y}) rotate(${a})`}>
                        <path d="M0,-5 L4,0 L0,5 L-4,0 Z" fill="rgba(29,176,76,0.6)" />
                    </g>
                );
            })}

            {/* ── Centre herb icon ── */}
            <g transform={`translate(${cx},${cy})`}>
                <line x1="0" y1="14" x2="0" y2="-16" stroke="rgba(255,255,255,0.88)" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M0,-4 C-12,-9 -14,-20 -5,-20 C-2,-14 -1,-8 0,-4 Z" fill="rgba(255,255,255,0.78)" />
                <path d="M0,-4 C12,-9 14,-20 5,-20 C2,-14 1,-8 0,-4 Z"  fill="rgba(255,255,255,0.78)" />
                <path d="M0,-16 C-8,-20 -9,-28 -3,-27 C-1,-23 0,-19 0,-16 Z" fill="rgba(255,255,255,0.58)" />
                <path d="M0,-16 C8,-20 9,-28 3,-27 C1,-23 0,-19 0,-16 Z"  fill="rgba(255,255,255,0.58)" />
            </g>

            {/* ── Tulsi sprigs at 4 diagonal corners ── */}
            {sprigs.map(({ angle, tx, ty }) => (
                <Sprig key={angle} transform={`translate(${tx},${ty}) rotate(${angle})`} />
            ))}

            {/* ── Scattered background dots ── */}
            {dots.map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r={i % 4 === 0 ? 2.2 : 1.4} fill="rgba(255,255,255,0.18)" />
            ))}

            {/* ── Cross / asterisk accents ── */}
            {crosses.map(([x, y], i) => (
                <g key={i} transform={`translate(${x},${y})`}>
                    <line x1="-5" y1="0"  x2="5" y2="0"  stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="round" />
                    <line x1="0"  y1="-5" x2="0" y2="5"  stroke="rgba(255,255,255,0.22)" strokeWidth="1" strokeLinecap="round" />
                    <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeLinecap="round" />
                    <line x1="3.5"  y1="-3.5" x2="-3.5" y2="3.5" stroke="rgba(255,255,255,0.14)" strokeWidth="1" strokeLinecap="round" />
                </g>
            ))}

            {/* ── Brand text — top ── */}
            <g transform="translate(240,75)">
                <text
                    textAnchor="middle" y="0"
                    fill="rgba(255,255,255,0.88)"
                    fontSize="21" fontWeight="700" letterSpacing="9"
                    fontFamily="Georgia,'Times New Roman',serif"
                >VEDAYURA</text>
                <line x1="-110" y1="16" x2="-28" y2="16" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                <circle cx="0" cy="19" r="2.5" fill="rgba(29,176,76,0.85)" />
                <line x1="28"  y1="16" x2="110" y2="16" stroke="rgba(255,255,255,0.22)" strokeWidth="1" />
                <text
                    textAnchor="middle" y="34"
                    fill="rgba(255,255,255,0.38)"
                    fontSize="8" letterSpacing="4"
                    fontFamily="system-ui,sans-serif"
                >PURE AYURVEDA</text>
            </g>

            {/* ── Tagline — bottom ── */}
            <g transform="translate(240,648)">
                <line x1="-105" y1="0" x2="-24" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                <circle cx="0" cy="0" r="2" fill="rgba(29,176,76,0.65)" />
                <line x1="24" y1="0" x2="105" y2="0" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" />
                <text
                    textAnchor="middle" y="18"
                    fill="rgba(255,255,255,0.42)"
                    fontSize="9.5" letterSpacing="1.4"
                    fontFamily="system-ui,sans-serif"
                >Ancient Wisdom · Modern Wellness</text>
            </g>
        </svg>
    );
};

export default AuthIllustration;
