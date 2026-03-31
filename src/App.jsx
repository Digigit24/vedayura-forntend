import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ShopProvider } from './context/ShopContext';
import Layout from './components/Layout';
import CartDrawer from './components/CartDrawer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import About from './pages/About';
import Catalog from './pages/Catalog';
import { Toaster } from 'react-hot-toast';
import Contact from './pages/Contact';
import ScrollToTop from './components/ScrollToTop';
import ScrollToTopButton from './components/ScrollToTopButton';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';

const toastOptions = {
  style: {
    fontFamily: 'var(--font-body)',
    fontSize: '0.875rem',
    borderRadius: 'var(--radius-md)',
    padding: '12px 16px',
    boxShadow: 'var(--shadow-md)',
  },
  success: {
    icon: '🌿',
    style: {
      background: '#fff',
      color: '#175333',
      border: '1px solid rgba(23,83,51,0.2)',
      borderLeft: '4px solid #1DB04C',
    },
    duration: 3500,
  },
  error: {
    icon: '✕',
    style: {
      background: '#fff',
      color: '#DC2626',
      border: '1px solid rgba(220,38,38,0.2)',
      borderLeft: '4px solid #DC2626',
    },
    duration: 4500,
  },
  loading: {
    style: {
      background: '#fff',
      color: '#175333',
      border: '1px solid rgba(23,83,51,0.15)',
      borderLeft: '4px solid #7A642B',
    },
  },
};

function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><ProtectedRoute><Profile /></ProtectedRoute></PageTransition>} />
        <Route path="/admin" element={<PageTransition><ProtectedRoute adminOnly><Admin /></ProtectedRoute></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/catalog" element={<PageTransition><Catalog /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ShopProvider>
      <Router>
        <ScrollToTop />
        <Toaster position="top-left" toastOptions={toastOptions} />
        <CartDrawer />
        <ScrollToTopButton />

        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </ShopProvider>
  );
}

export default App;
