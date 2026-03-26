import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    // This hook listens for changes in the URL
    const { pathname } = useLocation();

    useEffect(() => {
        document.documentElement.style.scrollBehavior = 'auto';
        window.scrollTo(0, 0);
        document.documentElement.style.scrollBehavior = '';
    }, [pathname]);

    return null; // This component doesn't render anything visually
};

export default ScrollToTop;