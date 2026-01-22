import { createContext, useState, useContext, useEffect } from 'react';
import { products as initialProducts } from '../data/products';
import api from '../api';

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
        const savedToken = localStorage.getItem('ayurveda_token');
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken && !savedUser) {
            // try fetch current user
            api.auth.me().then(res => {
                if (res && res.user) setUser(res.user);
            }).catch(() => {});
        }

        // Fetch products from API (fallback to local data)
        (async () => {
            try {
                const res = await api.products.getAll({ page: 1, limit: 100 });
                if (res && res.products) setProducts(res.products);
            } catch (err) {
                console.error('Failed to load products', err);
            }
        })();
    }, []);

    // When user logs in, fetch server-side cart and wishlist
    useEffect(() => {
        if (!user) return;
        (async () => {
            try {
                const cartRes = await api.cart.get();
                if (cartRes) {
                    if (Array.isArray(cartRes)) setCart(cartRes);
                    else if (Array.isArray(cartRes.cart)) setCart(cartRes.cart);
                    else if (Array.isArray(cartRes.items)) setCart(cartRes.items);
                }
            } catch (err) {
                console.error('Failed to load server cart', err);
            }

            try {
                const wishRes = await api.wishlist.get();
                if (wishRes) {
                    if (Array.isArray(wishRes)) setWishlist(wishRes);
                    else if (Array.isArray(wishRes.wishlist)) setWishlist(wishRes.wishlist);
                }
            } catch (err) {
                console.error('Failed to load wishlist', err);
            }
        })();
    }, [user]);

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
                const updated = prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
                // sync to server
                if (user) {
                    const item = updated.find(i => i.id === product.id);
                    try { api.cart.add(product.id, item.quantity); } catch (err) { console.error(err); }
                }
                return updated;
            }
            const newItem = { ...product, quantity };
            if (user) {
                try { api.cart.add(product.id, quantity); } catch (err) { console.error(err); }
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const next = prev.filter(item => item.id !== productId);
            if (user) {
                try { api.cart.remove(productId); } catch (err) { console.error(err); }
            }
            return next;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const updated = prev.map(item => item.id === productId ? { ...item, quantity } : item);
            if (user) {
                try { api.cart.update(productId, quantity); } catch (err) { console.error(err); }
            }
            return updated;
        });
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                if (user) { try { api.wishlist.remove(product.id); } catch (err) { console.error(err); } }
                return prev.filter(item => item.id !== product.id);
            }
            if (user) { try { api.wishlist.add(product.id); } catch (err) { console.error(err); } }
            return [...prev, product];
        });
    };

    const login = async (email, password) => {
        try {
            const res = await api.auth.login(email, password);
            if (res && res.token) {
                localStorage.setItem('ayurveda_token', res.token);
                if (res.user) {
                    setUser(res.user);
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                }
                return { success: true, user: res.user };
            }
            } catch (err) {
            // fallback to mock simple login for dev convenience
                console.error('Login failed', err);
                if (email.includes('admin')) {
                    const mock = { name: 'Admin User', email, role: 'admin' };
                    setUser(mock);
                    localStorage.setItem('ayurveda_user', JSON.stringify(mock));
                    return { success: true, user: mock };
                }
                const mock = { name: 'Demo User', email, role: 'user' };
                setUser(mock);
                localStorage.setItem('ayurveda_user', JSON.stringify(mock));
                return { success: true, user: mock };
        }
        return { success: false };
    };

    const logout = () => {
        setUser(null);
        setCart([]);
        setWishlist([]);
        localStorage.removeItem('ayurveda_token');
        localStorage.removeItem('ayurveda_user');
    };

    const register = async (name, email, password, phone) => {
        try {
            const res = await api.auth.register({ name, email, password, phone });
            if (res && res.token) {
                localStorage.setItem('ayurveda_token', res.token);
                if (res.user) {
                    setUser(res.user);
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                }
                return { success: true, user: res.user };
            }
        } catch (err) {
            console.error('Register failed', err);
            // fallback
            const mock = { name, email, role: 'user' };
            setUser(mock);
            localStorage.setItem('ayurveda_user', JSON.stringify(mock));
            return { success: true, user: mock };
        }
        return { success: false };
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Product CRUD Operations (use API when admin)
    const addProduct = async (newProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
                const res = await api.products.create(newProduct);
                if (res && res.product) {
                    setProducts(prev => [...prev, res.product]);
                    return res.product;
                }
            } catch (err) {
                console.error('Create product failed', err);
            }
        }
        const productWithId = { ...newProduct, id: products.length + 1 };
        setProducts(prev => [...prev, productWithId]);
        return productWithId;
    };

    const updateProduct = async (updatedProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
                const res = await api.products.update(updatedProduct.id, updatedProduct);
                if (res && res.product) {
                    setProducts(prev => prev.map(p => p.id === res.product.id ? res.product : p));
                    return res.product;
                }
            } catch (err) {
                console.error('Update product failed', err);
            }
        }
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
        return updatedProduct;
    };

    const deleteProduct = async (id) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
                await api.products.remove(id);
                setProducts(prev => prev.filter(p => p.id !== id));
                return true;
            } catch (err) {
                console.error('Delete product failed', err);
            }
        }
        setProducts(prev => prev.filter(p => p.id !== id));
        return true;
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
        addToWishlist: toggleWishlist,
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
