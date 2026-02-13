import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import api from '../api';
import productsData from '../data/products';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
    const [products, setProducts] = useState(productsData);
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [drawerType, setDrawerType] = useState(null);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const [addresses, setAddresses] = useState([]);

    const getCartKey = useCallback((userId) => {
        return userId ? `ayurveda_cart_${userId}` : 'ayurveda_cart_guest';
    }, []);

    const getWishlistKey = useCallback((userId) => {
        return userId ? `ayurveda_wishlist_${userId}` : 'ayurveda_wishlist_guest';
    }, []);

    const loadUserData = useCallback(async (userId) => {
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

        if (userId) {
            const token = localStorage.getItem('ayurveda_token');
            // Ensure token is present and not a stringified "null" or "undefined"
            if (token && token !== 'null' && token !== 'undefined') {
                try {
                    const res = await api.addresses.get();
                    if (res && (Array.isArray(res) || Array.isArray(res.addresses))) {
                        const serverAddresses = Array.isArray(res) ? res : res.addresses;
                        const mapped = serverAddresses.map(addr => ({
                            id: addr.id,
                            firstName: addr.firstName || '',
                            lastName: addr.lastName || '',
                            email: addr.email || '',
                            phone: addr.phone || '',
                            street: addr.street || '',
                            city: addr.city || '',
                            state: addr.state || '',
                            pinCode: addr.pincode || addr.pinCode || '',
                            type: addr.type || 'Home',
                            isDefault: addr.isDefault || false
                        }));
                        setAddresses(mapped);
                        localStorage.setItem(`ayurveda_addresses_${userId}`, JSON.stringify(mapped));
                    } else {
                        const savedAddresses = localStorage.getItem(`ayurveda_addresses_${userId}`);
                        if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
                    }
                } catch (err) {
                    // If error is 401/403, it's an auth issue (expired token), not a server failure.
                    // We suppress the warning for auth issues to avoid alarming logs.
                    if (!err.response || (err.response.status !== 401 && err.response.status !== 403)) {
                        console.warn('Failed to fetch addresses from server, using local storage.');
                    }
                    const savedAddresses = localStorage.getItem(`ayurveda_addresses_${userId}`);
                    if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
                }
            } else {
                const savedAddresses = localStorage.getItem(`ayurveda_addresses_${userId}`);
                if (savedAddresses) setAddresses(JSON.parse(savedAddresses));
            }
        } else {
            setAddresses([]);
        }
    }, [getCartKey, getWishlistKey]);

    const extractCartItems = useCallback((res) => {
        if (!res) return null;
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.cart)) return res.cart;
        if (Array.isArray(res.items)) return res.items;
        if (res.cart && Array.isArray(res.cart.items)) return res.cart.items;
        return null;
    }, []);

    const extractWishlistItems = useCallback((res) => {
        if (!res) return null;
        if (Array.isArray(res)) return res;
        if (Array.isArray(res.wishlist)) return res.wishlist;
        if (res.wishlist && Array.isArray(res.wishlist.items)) return res.wishlist.items;
        if (Array.isArray(res.items)) return res.items;
        return null;
    }, []);

    // Sync cart to localStorage
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(getCartKey(user.id), JSON.stringify(cart));
        } else {
            localStorage.setItem(getCartKey(null), JSON.stringify(cart));
        }
    }, [cart, user?.id, getCartKey]);

    // Sync wishlist to localStorage
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(getWishlistKey(user.id), JSON.stringify(wishlist));
        } else {
            localStorage.setItem(getWishlistKey(null), JSON.stringify(wishlist));
        }
    }, [wishlist, user?.id, getWishlistKey]);

    // Sync addresses to localStorage
    useEffect(() => {
        if (user?.id) {
            localStorage.setItem(`ayurveda_addresses_${user.id}`, JSON.stringify(addresses));
        }
    }, [addresses, user?.id]);

    // ===== AUTH — runs once on mount =====
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
            setUser(savedUser);
            loadUserData(savedUser.id);
            setIsAuthLoading(false);
        } else if (savedToken) {
            api.auth.me().then(res => {
                if (res && res.user) {
                    setUser(res.user);
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    loadUserData(res.user.id);
                } else {
                    localStorage.removeItem('ayurveda_token');
                    localStorage.removeItem('ayurveda_user');
                    loadUserData(null);
                }
            }).catch(() => {
                loadUserData(null);
            }).finally(() => {
                setIsAuthLoading(false);
            });
        } else {
            loadUserData(null);
            setIsAuthLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ===== PRODUCTS — runs once on mount, separate from auth =====
    useEffect(() => {
        (async () => {
            try {
                const res = await api.products.getAll({ page: 1, limit: 100 });
                if (res && Array.isArray(res.products)) {
                    const mappedProducts = res.products.map(p => {
                        const localMatch = productsData.find(local =>
                            (p.name || '').toLowerCase().trim() === (local.name || '').toLowerCase().trim() &&
                            (p.category?.name || p.category || '').toLowerCase().trim() === (local.category || '').toLowerCase().trim()
                        );
                        const finalImages = (localMatch && localMatch.images && localMatch.images.length > 0)
                            ? localMatch.images
                            : (p.imageUrls && p.imageUrls.length > 0 ? p.imageUrls : ['/assets/product-placeholder.png']);

                        return {
                            ...p,
                            id: p.id,
                            name: p.name,
                            category: p.category?.name || (typeof p.category === 'string' ? p.category : 'Uncategorized'),
                            categoryId: p.categoryId,
                            price: Number(p.discountedPrice || p.realPrice || 0),
                            stock: p.stockQuantity ?? 0,
                            image: finalImages[0],
                            images: finalImages,
                            imageUrls: p.imageUrls || finalImages,
                            ingredients: p.ingredients || '',
                            benefits: p.benefits || [],
                            description: p.description || '',
                        };
                    });
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.warn('Failed to load products from API', err);
            }
        })();
    }, []);

    // ===== SYNC cart & wishlist with server when user logs in =====
    useEffect(() => {
        if (!user?.id) return;
        const token = localStorage.getItem('ayurveda_token');
        if (!token) return;

        (async () => {
            try {
                const cartRes = await api.cart.get();
                const serverCart = extractCartItems(cartRes) || [];
                const localCart = JSON.parse(localStorage.getItem(getCartKey(user.id)) || '[]');
                for (const item of localCart) {
                    if (!serverCart.find(si => si.id === item.id || si.productId === item.id)) {
                        await api.cart.add(item.id, item.quantity).catch(() => { });
                    }
                }
                const updatedCartRes = await api.cart.get();
                const updatedCart = extractCartItems(updatedCartRes);
                if (updatedCart) setCart(updatedCart);
            } catch (err) {
                console.error('Cart sync failed', err);
            }

            try {
                const wishRes = await api.wishlist.get();
                const serverWishlist = extractWishlistItems(wishRes) || [];
                const localWishlist = JSON.parse(localStorage.getItem(getWishlistKey(user.id)) || '[]');
                for (const item of localWishlist) {
                    const id = item.productId || item.product?.id || item.id;
                    if (!serverWishlist.find(si => (si.productId || si.product?.id || si.id) === id)) {
                        await api.wishlist.add(id).catch(() => { });
                    }
                }
                const updatedWishRes = await api.wishlist.get();
                const updatedWishlist = extractWishlistItems(updatedWishRes);
                if (updatedWishlist) setWishlist(updatedWishlist);
            } catch (err) {
                console.error('Wishlist sync failed', err);
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
                const updated = prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
                if (user?.id) api.cart.add(product.id, updated.find(i => i.id === product.id).quantity).catch(() => { });
                return updated;
            }
            if (user?.id) api.cart.add(product.id, quantity).catch(() => { });
            return [...prev, { ...product, quantity }];
        });
    }, [user?.id]);

    const removeFromCart = useCallback((productId) => {
        setCart(prev => {
            if (user?.id) api.cart.remove(productId).catch(() => { });
            return prev.filter(item => item.id !== productId);
        });
    }, [user?.id]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            if (user?.id) api.cart.update(productId, quantity).catch(() => { });
            return prev.map(item => item.id === productId ? { ...item, quantity } : item);
        });
    }, [user?.id]);

    const clearCart = useCallback(() => {
        setCart(prev => {
            if (user?.id) prev.forEach(item => api.cart.remove(item.id).catch(() => { }));
            return [];
        });
    }, [user?.id]);

    const toggleWishlist = useCallback((product) => {
        setWishlist(prev => {
            const id = product.id;
            const exists = prev.find(item => (item.productId || item.product?.id || item.id) === id);
            if (exists) {
                if (user?.id) api.wishlist.remove(id).catch(() => { });
                return prev.filter(item => (item.productId || item.product?.id || item.id) !== id);
            }
            if (user?.id) api.wishlist.add(id).catch(() => { });
            return [...prev, product];
        });
    }, [user?.id]);

    const addToWishlist = useCallback((product) => {
        setWishlist(prev => {
            const id = product.id;
            if (prev.find(item => (item.productId || item.product?.id || item.id) === id)) return prev;
            if (user?.id) api.wishlist.add(id).catch(() => { });
            return [...prev, product];
        });
    }, [user?.id]);

    const removeFromWishlist = useCallback((productId) => {
        setWishlist(prev => {
            if (user?.id) api.wishlist.remove(productId).catch(() => { });
            return prev.filter(item => (item.productId || item.product?.id || item.id) !== productId);
        });
    }, [user?.id]);

    const isInWishlist = useCallback((productId) => {
        return wishlist.some(item => (item.productId || item.product?.id || item.id) === productId);
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
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        }
    }, [loadUserData]);

    const register = useCallback(async (name, email, password, phone) => {
        try {
            const res = await api.auth.register({ name, email, password, phone: phone || undefined });
            if (res && res.token) {
                localStorage.setItem('ayurveda_token', res.token);
                if (res.user) {
                    localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                    setUser(res.user);
                    loadUserData(res.user.id);
                }
                return { success: true, user: res.user };
            }
            return { success: false, message: res?.message || 'Registration failed' };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Registration failed' };
        }
    }, [loadUserData]);

    const toggleMenu = useCallback(() => setIsMenuOpen(prev => !prev), []);

    const addProduct = useCallback(async (newProduct) => {
        if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
        const res = await api.products.create({
            name: newProduct.name,
            ingredients: newProduct.ingredients || "",
            benefits: newProduct.benefits || [],
            categoryId: newProduct.categoryId,
            realPrice: Number(newProduct.price),
            discountedPrice: Number(newProduct.price),
            stockQuantity: Number(newProduct.stock),
            imageUrls: [newProduct.image || "https://picsum.photos/400"],
        });
        if (res && res.product) {
            const mapped = {
                id: res.product.id,
                name: res.product.name,
                image: res.product.imageUrls?.[0],
                category: res.product.category?.name || "Uncategorized",
                price: res.product.discountedPrice || res.product.realPrice,
                stock: res.product.stockQuantity,
            };
            setProducts(prev => [...prev, mapped]);
            return mapped;
        }
        throw new Error("Failed to add product");
    }, [user]);

    const updateProduct = useCallback(async (id, updated) => {
        if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
        const res = await api.products.update(id, {
            name: updated.name,
            ingredients: updated.ingredients || "",
            benefits: updated.benefits || [],
            categoryId: updated.categoryId,
            realPrice: Number(updated.price),
            discountedPrice: Number(updated.price),
            stockQuantity: Number(updated.stock),
            imageUrls: [updated.image || "https://picsum.photos/400"],
        });
        if (res && res.product) {
            const mapped = {
                id: res.product.id,
                name: res.product.name,
                image: res.product.imageUrls?.[0],
                category: res.product.category?.name || "Uncategorized",
                price: res.product.discountedPrice || res.product.realPrice,
                stock: res.product.stockQuantity,
            };
            setProducts(prev => prev.map(p => p.id === id ? mapped : p));
            return mapped;
        }
        throw new Error("Failed to update product");
    }, [user]);

    const deleteProduct = useCallback(async (id) => {
        if (!user || user.role !== 'ADMIN') throw new Error("Not authorized");
        await api.products.remove(id);
        setProducts(prev => prev.filter(p => p.id !== id));
    }, [user]);

    const updateProfile = useCallback(async (profileData) => {
        try {
            const res = await api.auth.update(profileData);
            if (res && res.user) {
                setUser(res.user);
                localStorage.setItem('ayurveda_user', JSON.stringify(res.user));
                return { success: true, user: res.user };
            }
        } catch (err) {
            console.warn('Update Profile API failed or not implemented, falling back to local only.');
        }

        const updatedUser = { ...user, ...profileData };
        setUser(updatedUser);
        localStorage.setItem('ayurveda_user', JSON.stringify(updatedUser));
        return { success: true, user: updatedUser };
    }, [user]);

    const addAddress = useCallback(async (addressData) => {
        try {
            const payload = {
                street: addressData.street,
                city: addressData.city,
                state: addressData.state,
                pincode: addressData.pinCode,
                country: 'India',
                isDefault: addressData.isDefault
            };
            const res = await api.addresses.add(payload);
            if (res && (res.id || res.address)) {
                loadUserData(user?.id);
                return;
            }
        } catch (err) {
            console.warn('Add Address API failed, saving locally.');
        }

        const newAddress = { ...addressData, id: Date.now(), isDefault: addresses.length === 0 };
        setAddresses(prev => [...prev, newAddress]);
    }, [addresses.length, loadUserData, user?.id]);

    const updateAddress = useCallback(async (id, updatedData) => {
        try {
            const payload = {
                street: updatedData.street,
                city: updatedData.city,
                state: updatedData.state,
                pincode: updatedData.pinCode,
                country: 'India',
                isDefault: updatedData.isDefault
            };
            await api.addresses.update(id, payload);
            loadUserData(user?.id);
            return;
        } catch (err) {
            console.warn('Update Address API failed, updating locally.');
        }
        setAddresses(prev => prev.map(addr => addr.id === id ? { ...addr, ...updatedData } : addr));
    }, [loadUserData, user?.id]);

    const deleteAddress = useCallback(async (id) => {
        try {
            await api.addresses.remove(id);
            loadUserData(user?.id);
            return;
        } catch (err) {
            console.warn('Delete Address API failed, removing locally.');
        }
        setAddresses(prev => prev.filter(addr => addr.id !== id));
    }, [loadUserData, user?.id]);

    const setDefaultAddress = useCallback(async (id) => {
        const addr = addresses.find(a => a.id === id);
        if (addr) {
            await updateAddress(id, { ...addr, isDefault: true });
        }
    }, [addresses, updateAddress]);

    const getDefaultAddress = useCallback(() => {
        return addresses.find(addr => addr.isDefault) || addresses[0];
    }, [addresses]);

    const value = {
        products, cart, wishlist, user, drawerType, isMenuOpen, isAuthLoading, addresses,
        openCart, openWishlist, closeDrawer, closeCart: closeDrawer,
        addToCart, removeFromCart, updateQuantity, clearCart,
        toggleWishlist, addToWishlist, removeFromWishlist, isInWishlist,
        login, logout, register, toggleMenu,
        addProduct, updateProduct, deleteProduct,
        updateProfile, addAddress, updateAddress, deleteAddress, setDefaultAddress, getDefaultAddress
    };

    return (
        <ShopContext.Provider value={value}>
            {children}
        </ShopContext.Provider>
    );
};

export const useShop = () => useContext(ShopContext);