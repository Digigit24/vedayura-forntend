import { createContext, useState, useContext, useEffect } from 'react';
import productsData from '../data/products';
import api from '../api';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState(productsData);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [drawerType, setDrawerType] = useState(null);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Load state from local storage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('ayurveda_cart');
        const savedWishlist = localStorage.getItem('ayurveda_wishlist');
        const savedUser = localStorage.getItem('ayurveda_user');
        const savedToken = localStorage.getItem('ayurveda_token');
        
        if (savedCart) setCart(JSON.parse(savedCart));
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        if (savedUser) setUser(JSON.parse(savedUser));
        if (savedToken && !savedUser) {
            api.auth.me().then(res => {
                if (res && res.user) setUser(res.user);
            }).catch(() => { });
        }

        // Fetch products from API (fallback to local data)
        (async () => {
            try {
                const res = await api.products.getAll({ page: 1, limit: 100 });
                if (res && Array.isArray(res.products)) {
                    // Map backend fields to frontend fields
                    const mappedProducts = res.products.map(p => ({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        image: p.imageUrls?.[0] || '/assets/product-placeholder.png',
                        images: p.imageUrls || ['/assets/product-placeholder.png'],
                        category: p.category?.name || 'Uncategorized',
                        price: p.discountedPrice || p.realPrice,
                        realPrice: p.realPrice,
                        discount_price: p.discountedPrice,
                        stock: p.stockQuantity,
                        rating: p.averageRating || 0,
                        Ingredients: p.description || '',
                        Benefits: []
                    }));
                    setProducts(mappedProducts);
                } else {
                    console.warn('API returned unexpected format, using local data');
                }
            } catch (err) {
                console.warn('Failed to load products from API, using local data', err);
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

    const openCart = () => setDrawerType("cart");
    const openWishlist = () => setDrawerType("wishlist");
    const closeDrawer = () => setDrawerType(null);

    const logout = () => {
        localStorage.removeItem('ayurveda_token');
        localStorage.removeItem('ayurveda_user');
        setUser(null);
        setWishlist([]);
    };

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                const updated = prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
                if (user) {
                    const item = updated.find(i => i.id === product.id);
                    api.cart.add(product.id, item.quantity).catch(err => console.error(err));
                }
                return updated;
            }
            const newItem = { ...product, quantity };
            if (user) {
                api.cart.add(product.id, quantity).catch(err => console.error(err));
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const next = prev.filter(item => item.id !== productId);
            if (user) {
                api.cart.remove(productId).catch(err => console.error(err));
            }
            return next;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const updated = prev.map(item => item.id === productId ? { ...item, quantity } : item);
            if (user) {
                api.cart.update(productId, quantity).catch(err => console.error(err));
            }
            return updated;
        });
    };

    const clearCart = () => setCart([]);

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                if (user) {
                    api.wishlist.remove(product.id).catch(err => console.error(err));
                }
                return prev.filter(item => item.id !== product.id);
            }
            if (user) {
                api.wishlist.add(product.id).catch(err => console.error(err));
            }
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
            // API returned but no token - invalid credentials
            return { success: false, message: res?.message || 'Invalid email or password' };
        } catch (err) {
            console.error('Login failed', err);
            // Check if it's an API error response (wrong credentials)
            if (err.response?.status === 401 || err.response?.status === 400) {
                return { success: false, message: err.response?.data?.message || 'Invalid email or password' };
            }
            // Network error or server down
            return { success: false, message: 'Unable to connect to server. Please try again.' };
        }
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
            // API returned but no token
            return { success: false, message: res?.message || res?.error || 'Registration failed' };
        } catch (err) {
            console.error('Register failed', err);
            // Extract error message from various possible locations
            const errorMsg = err.response?.data?.message 
                || err.response?.data?.error 
                || err.message 
                || 'Registration failed. Please try again.';
            return { success: false, message: errorMsg };
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Product CRUD Operations (use API when admin)
    const addProduct = async (newProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
                // Map frontend fields to backend fields
                const backendPayload = {
                    name: newProduct.name,
                    description: newProduct.description || '',
                    categoryId: newProduct.categoryId,
                    realPrice: newProduct.price,
                    discountedPrice: newProduct.price,
                    stockQuantity: newProduct.stock,
                    imageUrls: [newProduct.image || 'https://picsum.photos/400']
                };
                const res = await api.products.create(backendPayload);
                if (res && res.product) {
                    const mapped = {
                        id: res.product.id,
                        name: res.product.name,
                        image: res.product.imageUrls?.[0],
                        category: res.product.category?.name || 'Uncategorized',
                        price: res.product.discountedPrice || res.product.realPrice,
                        stock: res.product.stockQuantity
                    };
                    setProducts(prev => [...prev, mapped]);
                    return mapped;
                }
            } catch (err) {
                console.error('Create product failed', err);
            }
        }
        // Fallback for local-only
        const productWithId = { ...newProduct, id: Date.now() };
        setProducts(prev => [...prev, productWithId]);
        return productWithId;
    };

    const updateProduct = async (updatedProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
                // Map frontend fields to backend fields
                const backendPayload = {
                    name: updatedProduct.name,
                    description: updatedProduct.description || '',
                    realPrice: updatedProduct.price,
                    discountedPrice: updatedProduct.price,
                    stockQuantity: updatedProduct.stock,
                    imageUrls: [updatedProduct.image || 'https://picsum.photos/400']
                };
                const res = await api.products.update(updatedProduct.id, backendPayload);
                if (res && res.product) {
                    const mapped = {
                        id: res.product.id,
                        name: res.product.name,
                        image: res.product.imageUrls?.[0],
                        category: res.product.category?.name || 'Uncategorized',
                        price: res.product.discountedPrice || res.product.realPrice,
                        stock: res.product.stockQuantity
                    };
                    setProducts(prev => prev.map(p => p.id === mapped.id ? mapped : p));
                    return mapped;
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
        user,
        setUser,
        products,
        cart,
        setCart,
        wishlist,
        setWishlist,
        drawerType,
        openCart,
        openWishlist,
        closeDrawer,
        closeCart: closeDrawer,
        addToCart,
        removeFromCart,
        updateQuantity,
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

export const useShop = () => useContext(ShopContext);