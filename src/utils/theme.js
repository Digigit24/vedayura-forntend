export const THEMES = [
    {
        id: 'forest',
        name: 'Forest',
        primary:      '#175333',
        primaryDark:  '#0F3F2A',
        primaryLight: '#1DB04C',
        accent:       '#7A642B',
        swatch:       '#1DB04C',
    },
    {
        id: 'ocean',
        name: 'Ocean',
        primary:      '#1a4d7a',
        primaryDark:  '#103558',
        primaryLight: '#2196f3',
        accent:       '#c9a84c',
        swatch:       '#2196f3',
    },
    {
        id: 'sunset',
        name: 'Sunset',
        primary:      '#9a3010',
        primaryDark:  '#6e1e08',
        primaryLight: '#e8541a',
        accent:       '#c9a84c',
        swatch:       '#e8541a',
    },
    {
        id: 'lavender',
        name: 'Lavender',
        primary:      '#5b2d8a',
        primaryDark:  '#3d1a5c',
        primaryLight: '#9b59b6',
        accent:       '#c9a84c',
        swatch:       '#9b59b6',
    },
    {
        id: 'rose',
        name: 'Rose',
        primary:      '#9a1a4a',
        primaryDark:  '#6e0f32',
        primaryLight: '#e91e8c',
        accent:       '#c9a84c',
        swatch:       '#e91e8c',
    },
];

export const applyTheme = (themeId) => {
    const theme = THEMES.find(t => t.id === themeId) || THEMES[0];
    const root = document.documentElement;
    // Scoped to profile page + navbar avatar only — does NOT touch global --color-primary
    root.style.setProperty('--pp-primary',       theme.primary);
    root.style.setProperty('--pp-primary-dark',  theme.primaryDark);
    root.style.setProperty('--pp-primary-light', theme.primaryLight);
    root.style.setProperty('--pp-accent',        theme.accent);
    localStorage.setItem('vedayura_theme', themeId);
};

export const loadSavedTheme = () => {
    const saved = localStorage.getItem('vedayura_theme') || 'forest';
    applyTheme(saved);
    return saved;
};
