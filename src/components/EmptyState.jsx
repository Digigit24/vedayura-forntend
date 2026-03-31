import { motion } from 'framer-motion';
import './EmptyState.css';

/* ── Unique illustration per variant ── */

const CartIllustration = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="es-svg">
        {/* Soft bg circle */}
        <circle cx="100" cy="100" r="80" fill="#f0f7f3" />

        {/* Bag body */}
        <rect x="52" y="82" width="96" height="72" rx="12" fill="white" stroke="#175333" strokeWidth="2.5"/>
        {/* Bag handle */}
        <path d="M76 82 Q76 58 100 58 Q124 58 124 82" stroke="#175333" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
        {/* Bag stripe */}
        <rect x="52" y="100" width="96" height="10" fill="#e8f5ee"/>

        {/* Sad dots (eyes) */}
        <circle cx="88" cy="122" r="4" fill="#175333" opacity="0.6"/>
        <circle cx="112" cy="122" r="4" fill="#175333" opacity="0.6"/>
        {/* Sad mouth */}
        <path d="M88 138 Q100 132 112 138" stroke="#175333" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.5"/>

        {/* Floating leaves */}
        <ellipse cx="38" cy="70" rx="10" ry="6" transform="rotate(-40 38 70)" fill="#1db04c" opacity="0.25"/>
        <ellipse cx="162" cy="65" rx="9" ry="5" transform="rotate(30 162 65)" fill="#1db04c" opacity="0.2"/>
        <ellipse cx="155" cy="155" rx="8" ry="5" transform="rotate(-20 155 155)" fill="#1db04c" opacity="0.18"/>
        <ellipse cx="42" cy="148" rx="7" ry="4" transform="rotate(50 42 148)" fill="#1db04c" opacity="0.15"/>

        {/* Sparkle dots */}
        <circle cx="170" cy="90" r="3" fill="#c8a96e" opacity="0.5"/>
        <circle cx="32" cy="110" r="2.5" fill="#c8a96e" opacity="0.4"/>
        <circle cx="148" cy="48" r="2" fill="#175333" opacity="0.3"/>
        <circle cx="58" cy="48" r="2" fill="#175333" opacity="0.3"/>
    </svg>
);

const WishlistIllustration = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="es-svg">
        {/* Soft bg */}
        <circle cx="100" cy="100" r="80" fill="#f5f0f7"/>

        {/* Botanical arch – left branch */}
        <path d="M100 150 Q75 120 55 95" stroke="#175333" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <ellipse cx="48" cy="88" rx="13" ry="7" transform="rotate(-45 48 88)" fill="#1db04c" opacity="0.3"/>
        <ellipse cx="62" cy="75" rx="11" ry="6" transform="rotate(-25 62 75)" fill="#1db04c" opacity="0.25"/>
        <ellipse cx="58" cy="102" rx="10" ry="5.5" transform="rotate(-60 58 102)" fill="#1db04c" opacity="0.2"/>

        {/* Botanical arch – right branch */}
        <path d="M100 150 Q125 120 145 95" stroke="#175333" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
        <ellipse cx="152" cy="88" rx="13" ry="7" transform="rotate(45 152 88)" fill="#1db04c" opacity="0.3"/>
        <ellipse cx="138" cy="75" rx="11" ry="6" transform="rotate(25 138 75)" fill="#1db04c" opacity="0.25"/>
        <ellipse cx="142" cy="102" rx="10" ry="5.5" transform="rotate(60 142 102)" fill="#1db04c" opacity="0.2"/>

        {/* Heart in center */}
        <path d="M100 130 C100 130 68 110 68 90 C68 78 78 70 88 74 C93 76 97 80 100 84 C103 80 107 76 112 74 C122 70 132 78 132 90 C132 110 100 130 100 130Z"
              fill="white" stroke="#175333" strokeWidth="2.2"/>
        {/* Heart inner detail */}
        <path d="M100 122 C100 122 78 108 78 92 C78 85 84 80 90 82"
              stroke="#175333" strokeWidth="1.2" strokeLinecap="round" opacity="0.25" fill="none"/>

        {/* Sparkles */}
        <circle cx="100" cy="62" r="3" fill="#c8a96e" opacity="0.6"/>
        <circle cx="170" cy="100" r="2.5" fill="#c8a96e" opacity="0.4"/>
        <circle cx="30"  cy="100" r="2.5" fill="#c8a96e" opacity="0.4"/>
        <circle cx="150" cy="152" r="2" fill="#175333" opacity="0.25"/>
        <circle cx="50"  cy="152" r="2" fill="#175333" opacity="0.25"/>
    </svg>
);

const SearchIllustration = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="es-svg">
        {/* Soft bg */}
        <circle cx="100" cy="100" r="80" fill="#f0f5f7"/>

        {/* Magnifier glass circle */}
        <circle cx="90" cy="90" r="42" fill="white" stroke="#175333" strokeWidth="2.5"/>
        <circle cx="90" cy="90" r="42" fill="url(#lens-grad)" opacity="0.4"/>
        <defs>
            <radialGradient id="lens-grad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#e8f5ee"/>
                <stop offset="100%" stopColor="#c8e6d4"/>
            </radialGradient>
        </defs>

        {/* Leaf inside lens */}
        <ellipse cx="90" cy="82" rx="14" ry="22" fill="#1db04c" opacity="0.3"/>
        <path d="M90 60 L90 104" stroke="#175333" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        {/* Small side leaves */}
        <ellipse cx="78" cy="85" rx="9" ry="5" transform="rotate(-30 78 85)" fill="#1db04c" opacity="0.2"/>
        <ellipse cx="102" cy="85" rx="9" ry="5" transform="rotate(30 102 85)" fill="#1db04c" opacity="0.2"/>

        {/* Handle */}
        <path d="M122 122 L148 150" stroke="#175333" strokeWidth="8" strokeLinecap="round"/>
        <path d="M122 122 L148 150" stroke="#2d7a50" strokeWidth="5" strokeLinecap="round" opacity="0.4"/>

        {/* Scattered dots */}
        <circle cx="44"  cy="58"  r="4" fill="#c8a96e" opacity="0.45"/>
        <circle cx="160" cy="68"  r="3" fill="#c8a96e" opacity="0.35"/>
        <circle cx="150" cy="155" r="3" fill="#175333" opacity="0.2"/>
        <circle cx="38"  cy="145" r="2.5" fill="#175333" opacity="0.2"/>
        <circle cx="168" cy="130" r="2" fill="#1db04c" opacity="0.3"/>
    </svg>
);

const illustrations = {
    cart:     <CartIllustration />,
    wishlist: <WishlistIllustration />,
    search:   <SearchIllustration />,
};

export default function EmptyState({ variant = 'search', title, description, action, secondaryAction }) {
    return (
        <motion.div
            className="es-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <div className="es-art">
                {illustrations[variant] ?? illustrations.search}
            </div>

            <div className="es-content">
                <h3 className="es-title">{title}</h3>
                <p className="es-desc">{description}</p>

                {(action || secondaryAction) && (
                    <div className="es-actions">
                        {action && (
                            <button className="es-btn-primary" onClick={action.onClick}>
                                {action.label}
                            </button>
                        )}
                        {secondaryAction && (
                            <button className="es-btn-ghost" onClick={secondaryAction.onClick}>
                                {secondaryAction.label}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
}
