import { createContext, useState, useContext, useEffect, useCallback } from 'react';
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
    const [isAuthLoading, setIsAuthLoading] = useState(true);

    const getCartKey = useCallback((userId) => {
        return userId ? `ayurveda_cart_${userId}` : 'ayurveda_cart_guest';
    }, []);

    const getWishlistKey = useCallback((userId) => {
        return userId ? `ayurveda_wishlist_${userId}` : 'ayurveda_wishlist_guest';
    }, []);

    const loadUserData = useCallback((userId) => {
        const cartKey = getCartKey(userId);
        const wishlistKey = getWishlistKey(userId);

        try {
            const savedCart = localStorage.getItem(cartKey);
            const savedWishlist = localStorage.getItem(wishlistKey);

            if (savedCart) setCart(JSON.parse(savedCart));
            else setCart([]);

            if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
            else setWishlist([]);
        } catch (e) {
            console.warn('Failed to load user data from localStorage:', e);
            setCart([]);
            setWishlist([]);
        }
    }, [getCartKey, getWishlistKey]);

    // Helper to extract cart items array from various API response shapes
    const extractCartItems = useCallback((res) => {
        if (!res) return null;
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.cart)) return res.cart;
        if (Array.isArray(res.items)) return res.items;
        if (res.cart && Array.isArray(res.cart.items)) return res.cart.items;
        return null;
    }, []);

    // Helper to extract wishlist items array from various API response shapes
    const extractWishlistItems = useCallback((res) => {
        if (!res) return null;
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.wishlist)) return res.wishlist;
        if (res.wishlist && Array.isArray(res.wishlist.items)) return res.wishlist.items;
        if (Array.isArray(res.items)) return res.items;
        return null;
    }, []);

    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(getCartKey(user.id), JSON.stringify(cart));
        } else {
            localStorage.setItem(getCartKey(null), JSON.stringify(cart));
        }
    }, [cart, user?.id, getCartKey]);

    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(getWishlistKey(user.id), JSON.stringify(wishlist));
        } else {
            localStorage.setItem(getWishlistKey(null), JSON.stringify(wishlist));
        }
    }, [wishlist, user?.id, getWishlistKey]);

    useEffect(() => {
        let savedUser = null;
        const savedToken = localStorage.getItem('ayurveda_token');

        try {
            const raw = localStorage.getItem('ayurveda_user');
            if (raw && raw !== 'undefined' && raw !== 'null') {
                savedUser = JSON.parse(raw);
            }
        } catch (e) {
            console.warn('Corrupt user data in localStorage, clearing');
            localStorage.removeItem('ayurveda_user');
        }

        if (savedUser && savedUser.id && savedToken) {
            console.log('✅ Session restored for:', savedUser.name || savedUser.email);
            setUser(savedUser);
            loadUserData(savedUser.id);
            setIsAuthLoading(false);
        } else if (savedToken) {
            console.log('🔄 Token found, fetching user profile...');
            api.auth.me().then(res => {
                if (res && res.user) {
                    console.log('✅ Profile fetched:', res.user.name || res.user.email);
                    setUser(res.user);
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    loadUserData(res.user.id);
                } else {
                    console.warn('Invalid token response, clearing session');
                    localStorage.removeItem('ayurveda_token');
                    localStorage.removeItem('ayurveda_user');
                    loadUserData(null);
                }
            }).catch((err) => {
                console.warn('Failed to fetch profile:', err.message);
                loadUserData(null);
            }).finally(() => {
                setIsAuthLoading(false);
            });
        } else {
            loadUserData(null);
            setIsAuthLoading(false);
        }

        (async () => {
            try {
                const res = await api.products.getAll({ page: 1, limit: 100 });
                console.log("Products API response:", res);
                if (res && Array.isArray(res.products)) {
                    const mappedProducts = res.products.map(p => ({
                        id: p.id,
                        name: p.name,
                        category: p.category?.name || 'Uncategorized',
                        categoryId: p.categoryId,
                        price: p.discountedPrice || p.realPrice,
                        stock: p.stockQuantity,
                        image: p.imageUrls?.[0] || '/assets/product-placeholder.png',
                        images: p.imageUrls || ['/assets/product-placeholder.png'],
                        ingredients: p.ingredients || '',
                        benefits: p.benefits || [],
                    }));
                    setProducts(mappedProducts);
                } else {
                    console.warn('API returned unexpected format, using local data');
                }
            } catch (err) {
                console.warn('Failed to load products from API, using local data', err);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync with server when user logs in
    useEffect(() => {
        if (!user?.id) return;

        const token = localStorage.getItem('ayurveda_token');
        if (!token) {
            console.warn('No token found, skipping server sync');
            return;
        }

        (async () => {
            // ── Cart sync ──
            try {
                const cartRes = await api.cart.get();
                const serverCart = extractCartItems(cartRes) || [];

                const localCart = JSON.parse(localStorage.getItem(getCartKey(user.id)) || '[]');
                for (const item of localCart) {
                    const existsOnServer = serverCart.find(si =>
                        si.id === item.id || si.productId === item.id
                    );
                    if (!existsOnServer) {
                        try {
                            await api.cart.add(item.id, item.quantity);
                        } catch (err) {
                            // Silently ignore sync errors
                        }
                    }
                }

                const updatedCartRes = await api.cart.get();
                const updatedCart = extractCartItems(updatedCartRes);
                if (updatedCart) {
                    setCart(updatedCart);
                }
            } catch (err) {
                console.error('Failed to sync cart with server', err);
            }

            // ── Wishlist sync ──
            try {
                const wishRes = await api.wishlist.get();
                const serverWishlist = extractWishlistItems(wishRes) || [];

                const localWishlist = JSON.parse(localStorage.getItem(getWishlistKey(user.id)) || '[]');
                for (const item of localWishlist) {
                    const itemProductId = item.productId || item.product?.id || item.id;
                    const existsOnServer = serverWishlist.find(si => {
                        const serverProductId = si.productId || si.product?.id || si.id;
                        return serverProductId === itemProductId;
                    });
                    if (!existsOnServer) {
                        try {
                            await api.wishlist.add(itemProductId);
                        } catch (err) {
                            // Silently ignore - likely "already exists"
                        }
                    }
                }

                const updatedWishRes = await api.wishlist.get();
                const updatedWishlist = extractWishlistItems(updatedWishRes);
                if (updatedWishlist) {
                    setWishlist(updatedWishlist);
                }
            } catch (err) {
                console.error('Failed to sync wishlist with server', err);
            }
        })();
    }, [user?.id, getCartKey, getWishlistKey, extractCartItems, extractWishlistItems]);

    const openCart = useCallback(() => setDrawerType("cart"), []);
    const openWishlist = useCallback(() => setDrawerType("wishlist"), []);
    const closeDrawer = useCallback(() => setDrawerType(null), []);

    const logout = useCallback(() => {
        localStorage.removeItem('ayurveda_token');
        localStorage.removeItem('ayurveda_user');
        setUser(null);
        loadUserData(null);
    }, [loadUserData]);

    const addToCart = useCallback((product, quantity = 1) => {
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
    }, [user?.id]);

    const removeFromCart = useCallback((productId) => {
        setCart(prev => {
            const next = prev.filter(item => item.id !== productId);
            if (user?.id) {
                api.cart.remove(productId).catch(err => console.error(err));
            }
            return next;
        });
    }, [user?.id]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const updated = prev.map(item => item.id === productId ? { ...item, quantity } : item);
            if (user?.id) {
                api.cart.update(productId, quantity).catch(err => console.error(err));
            }
            return updated;
        });
    }, [user?.id]);

    const clearCart = useCallback(() => {
        setCart(prev => {
            if (user?.id) {
                prev.forEach(item => {
                    api.cart.remove(item.id).catch(err => console.error(err));
                });
            }
            return [];
        });
    }, [user?.id]);

    const toggleWishlist = useCallback((product) => {
        setWishlist(prev => {
            // Check by product.id or by nested productId/product.id for server-synced items
            const exists = prev.find(item => {
                const itemProductId = item.productId || item.product?.id || item.id;
                return itemProductId === product.id;
            });

            if (exists) {
                if (user?.id) {
                    api.wishlist.remove(product.id).catch(err => console.error(err));
                }
                return prev.filter(item => {
                    const itemProductId = item.productId || item.product?.id || item.id;
                    return itemProductId !== product.id;
                });
            }

            if (user?.id) {
                api.wishlist.add(product.id).catch(err => console.error(err));
            }
            return [...prev, product];
        });
    }, [user?.id]);

    const addToWishlist = useCallback((product) => {
        setWishlist(prev => {
            const exists = prev.find(item => {
                const itemProductId = item.productId || item.product?.id || item.id;
                return itemProductId === product.id;
            });
            if (exists) return prev;

            if (user?.id) {
                api.wishlist.add(product.id).catch(() => {
                    // Silently ignore - likely "already exists"
                });
            }
            return [...prev, product];
        });
    }, [user?.id]);

    const removeFromWishlist = useCallback((productId) => {
        setWishlist(prev => {
            if (user?.id) {
                api.wishlist.remove(productId).catch(err => console.error(err));
            }
            return prev.filter(item => {
                const itemProductId = item.productId || item.product?.id || item.id;
                return itemProductId !== productId;
            });
        });
    }, [user?.id]);

    const isInWishlist = useCallback((productId) => {
        return wishlist.some(item => {
            const itemProductId = item.productId || item.product?.id || item.id;
            return itemProductId === productId;
        });
    }, [wishlist]);

    const login = useCallback(async (email, password) => {
        try {
            const res = await api.auth.login(email, password);
            if (res && res.token) {
                localStorage.setItem('ayurveda_token', res.token);
                if (res.user) {
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    setUser(res.user);
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
    }, [loadUserData]);

    const register = useCallback(async (name, email, password, phone) => {
        try {
            console.log('📤 Sending to backend:', { name, email, password, phone });
            const res = await api.auth.register({
                name,
                email,
                password,
                phone: phone || undefined
            });
            if (res && res.token) {
                localStorage.setItem('ayurveda_token', res.token);
                if (res.user) {
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    setUser(res.user);
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
    }, [loadUserData]);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

    const addProduct = useCallback(async (newProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes("admin");
        if (!isAdmin) throw new Error("Not authorized");

        try {
            const backendPayload = {
                name: newProduct.name,
                ingredients: newProduct.ingredients || "",
                benefits: newProduct.benefits || [],
                categoryId: newProduct.categoryId,
                realPrice: Number(newProduct.price),
                discountedPrice: Number(newProduct.price),
                stockQuantity: Number(newProduct.stock),
                imageUrls: [newProduct.image || "https://picsum.photos/400"],
            };

            const res = await api.products.create(backendPayload);

            if (res && res.product) {
                const mapped = {
                    id: res.product.id,
                    name: res.product.name,
                    image: res.product.imageUrls?.[0],
                    images: res.product.imageUrls || [],
                    category: res.product.category?.name || "Uncategorized",
                    price: res.product.discountedPrice || res.product.realPrice,
                    realPrice: res.product.realPrice,
                    discount_price: res.product.discountedPrice,
                    stock: res.product.stockQuantity,
                    ingredients: res.product.ingredients || "",
                    benefits: res.product.benefits || [],
                };
                setProducts((prev) => [...prev, mapped]);
                return mapped;
            }
            throw new Error("Invalid API response");
        } catch (err) {
            console.error("Create product failed", err);
            throw err;
        }
    }, [user]);

    const updateProduct = useCallback(async (id, updatedProduct) => {
        const isAdmin = user && String(user.role).toLowerCase().includes("admin");
        if (!isAdmin) throw new Error("Not authorized");

        try {
            const backendPayload = {
                name: updatedProduct.name,
                ingredients: updatedProduct.ingredients || "",
                benefits: updatedProduct.benefits || [],
                categoryId: updatedProduct.categoryId,
                realPrice: Number(updatedProduct.price),
                discountedPrice: Number(updatedProduct.price),
                stockQuantity: Number(updatedProduct.stock),
                imageUrls: [updatedProduct.image || "https://picsum.photos/400"],
            };

            const res = await api.products.update(id, backendPayload);

            if (res && res.product) {
                const mapped = {
                    id: res.product.id,
                    name: res.product.name,
                    image: res.product.imageUrls?.[0],
                    images: res.product.imageUrls || [],
                    category: res.product.category?.name || "Uncategorized",
                    categoryId: res.product.categoryId,
                    price: res.product.discountedPrice || res.product.realPrice,
                    realPrice: res.product.realPrice,
                    discount_price: res.product.discountedPrice,
                    stock: res.product.stockQuantity,
                    ingredients: res.product.ingredients || "",
                    benefits: res.product.benefits || [],
                };
                setProducts(prev => prev.map(p => (p.id === mapped.id ? mapped : p)));
                return mapped;
            }
            throw new Error("Invalid API response");
        } catch (err) {
            console.error("Update product failed", err);
            throw err;
        }
    }, [user]);

    const deleteProduct = useCallback(async (id) => {
        const isAdmin = user && String(user.role).toLowerCase().includes("admin");
        if (!isAdmin) throw new Error("Not authorized");

        try {
            await api.products.remove(id);
            setProducts((prev) => prev.filter((p) => p.id !== id));
            return true;
        } catch (err) {
            console.error("Delete product failed", err);
            throw err;
        }
    }, [user]);

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
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        login,
        logout,
        register,
        isMenuOpen,
        toggleMenu,
        isAuthLoading,
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