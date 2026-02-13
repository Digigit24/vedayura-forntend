import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // This hook listens for changes in the URL
    const { pathname } = useLocation();

    useEffect(() => {
        // Immediately scrolls to the top (0, 0) whenever the path changes
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [pathname]);

    return null; // This component doesn't render anything visually
};

export default ScrollToTop;