import { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts } from '../data/products';

const ShopContext = createContext();

export const useShop = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState(initialProducts);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Load state from local storage on mount (optional but good for UX)
    useEffect(() => {
        const savedCart = localStorage.getItem('ayurveda_cart');
        const savedWishlist = localStorage.getItem('ayurveda_wishlist');
        const savedUser = localStorage.getItem('ayurveda_user');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    useEffect(() => {
        localStorage.setItem('ayurveda_cart', JSON.stringify(cart));
    }, [cart]);

    useEffect(() => {
        localStorage.setItem('ayurveda_wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    useEffect(() => {
        if (user) {
            localStorage.setItem('ayurveda_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('ayurveda_user');
        }
    }, [user]);

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => prev.map(item =>
            item.id === productId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                return prev.filter(item => item.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const login = (email, password) => {
        // Mock login
        if (email === 'admin@vedayura.com' && password === 'admin') {
            setUser({ name: 'Admin User', email, role: 'admin' });
            return true;
        }
        // Fallback for any other admin-like attempts for testing
        if (email.includes('admin')) {
            setUser({ name: 'Admin User', email, role: 'admin' });
            return true;
        }
        setUser({ name: 'Demo User', email, role: 'user' });
        return true;
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setWishlist([]);
    };

    const register = (name, email, password) => {
        setUser({ name, email, role: 'user' });
        return true;
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Product CRUD Operations
    const addProduct = (newProduct) => {
        const productWithId = { ...newProduct, id: products.length + 1 };
        setProducts([...products, productWithId]);
    };

    const updateProduct = (updatedProduct) => {
        setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id) => {
        setProducts(products.filter(p => p.id !== id));
    };

    const value = {
        products,
        cart,
        wishlist,
        user,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        login,
        logout,
        register,
        isMenuOpen,
        toggleMenu,
        addProduct,
        updateProduct,
        deleteProduct
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};
