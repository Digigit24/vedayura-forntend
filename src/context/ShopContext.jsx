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

    // Helper functions to get user-specific localStorage keys
    const getCartKey = (userId) => userId ? `ayurveda_cart_${userId}` : 'ayurveda_cart_guest';
    const getWishlistKey = (userId) => userId ? `ayurveda_wishlist_${userId}` : 'ayurveda_wishlist_guest';

    // Load user-specific cart and wishlist from localStorage
    const loadUserData = (userId) => {
        const cartKey = getCartKey(userId);
        const wishlistKey = getWishlistKey(userId);
        
        const savedCart = localStorage.getItem(cartKey);
        const savedWishlist = localStorage.getItem(wishlistKey);
        
        if (savedCart) setCart(JSON.parse(savedCart));
        else setCart([]);
        
        if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
        else setWishlist([]);
    };

    // Save cart to localStorage for current user
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(getCartKey(user.id), JSON.stringify(cart));
        } else {
            localStorage.setItem(getCartKey(null), JSON.stringify(cart));
        }
    }, [cart, user?.id]);

    // Save wishlist to localStorage for current user
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(getWishlistKey(user.id), JSON.stringify(wishlist));
        } else {
            localStorage.setItem(getWishlistKey(null), JSON.stringify(wishlist));
        }
    }, [wishlist, user?.id]);

    // Initial load: check for saved user and token
    useEffect(() => {
        const savedUser = localStorage.getItem('ayurveda_user');
        const savedToken = localStorage.getItem('ayurveda_token');
        
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            // Load user-specific data
            loadUserData(parsedUser.id);
        } else if (savedToken) {
            // Token exists but no user - fetch user data
            api.auth.me().then(res => {
                if (res && res.user) {
                    setUser(res.user);
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    loadUserData(res.user.id);
                }
            }).catch(() => {
                // Invalid token, load guest data
                loadUserData(null);
            });
        } else {
            // No user, load guest data
            loadUserData(null);
        }

        // Fetch products from API (fallback to local data)
        (async () => {
            try {
                const res = await api.products.getAll({ page: 1, limit: 100 });
                if (res && Array.isArray(res.products)) {
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

    // Sync with server when user logs in
    useEffect(() => {
        if (!user?.id) return;

        (async () => {
            try {
                // Fetch server-side cart
                const cartRes = await api.cart.get();
                if (cartRes) {
                    let serverCart = [];
                    if (Array.isArray(cartRes)) serverCart = cartRes;
                    else if (Array.isArray(cartRes.cart)) serverCart = cartRes.cart;
                    else if (Array.isArray(cartRes.items)) serverCart = cartRes.items;

                    // Merge local cart with server cart (server takes precedence)
                    const localCart = JSON.parse(localStorage.getItem(getCartKey(user.id)) || '[]');
                    
                    // Upload local items to server if they don't exist
                    for (const item of localCart) {
                        const existsOnServer = serverCart.find(si => si.id === item.id || si.productId === item.id);
                        if (!existsOnServer) {
                            try {
                                await api.cart.add(item.id, item.quantity);
                            } catch (err) {
                                console.error('Failed to sync local cart item', err);
                            }
                        }
                    }

                    // Reload cart from server after sync
                    const updatedCartRes = await api.cart.get();
                    if (updatedCartRes) {
                        if (Array.isArray(updatedCartRes)) setCart(updatedCartRes);
                        else if (Array.isArray(updatedCartRes.cart)) setCart(updatedCartRes.cart);
                        else if (Array.isArray(updatedCartRes.items)) setCart(updatedCartRes.items);
                    }
                }
            } catch (err) {
                console.error('Failed to sync cart with server', err);
            }

            try {
                // Fetch server-side wishlist
                const wishRes = await api.wishlist.get();
                if (wishRes) {
                    let serverWishlist = [];
                    if (Array.isArray(wishRes)) serverWishlist = wishRes;
                    else if (Array.isArray(wishRes.wishlist)) serverWishlist = wishRes.wishlist;

                    // Merge local wishlist with server wishlist
                    const localWishlist = JSON.parse(localStorage.getItem(getWishlistKey(user.id)) || '[]');
                    
                    // Upload local items to server if they don't exist
                    for (const item of localWishlist) {
                        const existsOnServer = serverWishlist.find(si => si.id === item.id || si.productId === item.id);
                        if (!existsOnServer) {
                            try {
                                await api.wishlist.add(item.id);
                            } catch (err) {
                                console.error('Failed to sync local wishlist item', err);
                            }
                        }
                    }

                    // Reload wishlist from server after sync
                    const updatedWishRes = await api.wishlist.get();
                    if (updatedWishRes) {
                        if (Array.isArray(updatedWishRes)) setWishlist(updatedWishRes);
                        else if (Array.isArray(updatedWishRes.wishlist)) setWishlist(updatedWishRes.wishlist);
                    }
                }
            } catch (err) {
                console.error('Failed to sync wishlist with server', err);
            }
        })();
    }, [user?.id]);

    const openCart = () => setDrawerType("cart");
    const openWishlist = () => setDrawerType("wishlist");
    const closeDrawer = () => setDrawerType(null);

    const logout = () => {
        // Clear auth data
        localStorage.removeItem('ayurveda_token');
        localStorage.removeItem('ayurveda_user');
        
        // Reset to guest state
        setUser(null);
        
        // Load guest cart and wishlist
        loadUserData(null);
    };

    const addToCart = (product, quantity = 1) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                const updated = prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
                if (user?.id) {
                    const item = updated.find(i => i.id === product.id);
                    api.cart.add(product.id, item.quantity).catch(err => console.error(err));
                }
                return updated;
            }
            const newItem = { ...product, quantity };
            if (user?.id) {
                api.cart.add(product.id, quantity).catch(err => console.error(err));
            }
            return [...prev, newItem];
        });
    };

    const removeFromCart = (productId) => {
        setCart(prev => {
            const next = prev.filter(item => item.id !== productId);
            if (user?.id) {
                api.cart.remove(productId).catch(err => console.error(err));
            }
            return next;
        });
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const updated = prev.map(item => item.id === productId ? { ...item, quantity } : item);
            if (user?.id) {
                api.cart.update(productId, quantity).catch(err => console.error(err));
            }
            return updated;
        });
    };

    const clearCart = () => {
        setCart([]);
        if (user?.id) {
            // Clear cart on server as well
            cart.forEach(item => {
                api.cart.remove(item.id).catch(err => console.error(err));
            });
        }
    };

    const toggleWishlist = (product) => {
        setWishlist(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) {
                if (user?.id) {
                    api.wishlist.remove(product.id).catch(err => console.error(err));
                }
                return prev.filter(item => item.id !== product.id);
            }
            if (user?.id) {
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
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    setUser(res.user);
                    
                    // Load user-specific data after login
                    loadUserData(res.user.id);
                }
                return { success: true, user: res.user };
            }
            return { success: false, message: res?.message || 'Invalid email or password' };
        } catch (err) {
            console.error('Login failed', err);
            if (err.response?.status === 401 || err.response?.status === 400) {
                return { success: false, message: err.response?.data?.message || 'Invalid email or password' };
            }
            return { success: false, message: 'Unable to connect to server. Please try again.' };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const res = await api.auth.register({ name, email, password, phone });
            if (res && res.token) {
                localStorage.setItem('ayurveda_token', res.token);
                if (res.user) {
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    setUser(res.user);
                    
                    // Load user-specific data after registration
                    loadUserData(res.user.id);
                }
                return { success: true, user: res.user };
            }
            return { success: false, message: res?.message || res?.error || 'Registration failed' };
        } catch (err) {
            console.error('Register failed', err);
            const errorMsg = err.response?.data?.message 
                || err.response?.data?.error 
                || err.message 
                || 'Registration failed. Please try again.';
            return { success: false, message: errorMsg };
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    // Product CRUD Operations
    const addProduct = async (newProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
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
        const productWithId = { ...newProduct, id: Date.now() };
        setProducts(prev => [...prev, productWithId]);
        return productWithId;
    };

    const updateProduct = async (updatedProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes('admin');
        if (isAdmin) {
            try {
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

export const useShop = () => useContext(ShopContext);