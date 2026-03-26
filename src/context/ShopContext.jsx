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
                    const res = await api.addresses.getAll();
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
                        // Deduplicate by content (street+city+pinCode) — server may create
                        // duplicate records if the same address was saved multiple times
                        const seenContent = new Set();
                        const deduped = mapped.filter(a => {
                            const key = `${a.street}|${a.city}|${a.pinCode}`.toLowerCase();
                            if (seenContent.has(key)) return false;
                            seenContent.add(key);
                            return true;
                        });
                        setAddresses(deduped);
                        localStorage.setItem(`ayurveda_addresses_${userId}`, JSON.stringify(deduped));
                    } else {
                        const savedAddresses = localStorage.getItem(`ayurveda_addresses_${userId}`);
                        if (savedAddresses) {
                            const parsed = JSON.parse(savedAddresses);
                            const seenContent = new Set();
                            setAddresses(parsed.filter(a => {
                                const key = `${a.street}|${a.city}|${a.pinCode}`.toLowerCase();
                                if (seenContent.has(key)) return false;
                                seenContent.add(key);
                                return true;
                            }));
                        }
                    }
                } catch (err) {
                    const savedAddresses = localStorage.getItem(`ayurveda_addresses_${userId}`);
                    if (savedAddresses) {
                        const parsed = JSON.parse(savedAddresses);
                        const seenContent = new Set();
                        setAddresses(parsed.filter(a => {
                            const key = `${a.street}|${a.city}|${a.pinCode}`.toLowerCase();
                            if (seenContent.has(key)) return false;
                            seenContent.add(key);
                            return true;
                        }));
                    }
                }
            } else {
                const savedAddresses = localStorage.getItem(`ayurveda_addresses_${userId}`);
                if (savedAddresses) {
                    const parsed = JSON.parse(savedAddresses);
                    const seenContent = new Set();
                    setAddresses(parsed.filter(a => {
                        const key = `${a.street}|${a.city}|${a.pinCode}`.toLowerCase();
                        if (seenContent.has(key)) return false;
                        seenContent.add(key);
                        return true;
                    }));
                }
            }
        } else {
            setAddresses([]);
        }
    }, [getCartKey, getWishlistKey]);

    const extractCartItems = useCallback((res) => {
        if (!res) return null;
        let items = null;
        if (Array.isArray(res)) items = res;
        else if (Array.isArray(res.cart)) items = res.cart;
        else if (Array.isArray(res.items)) items = res.items;
        else if (res.cart && Array.isArray(res.cart.items)) items = res.cart.items;
        if (!items) return null;
        // Normalize server items: id = productId, cartItemId = server cart record id
        return items.map(item => {
            const productId = item.productId || item.product?.id;
            if (!productId) return item; // local item already has id = productId
            return {
                ...(item.product || {}),
                ...item,
                id: productId,
                cartItemId: item.id,
                quantity: item.quantity || 1,
            };
        });
    }, []);

    const extractWishlistItems = useCallback((res) => {
        if (!res) return null;
        let items = null;
        if (Array.isArray(res)) items = res;
        else if (Array.isArray(res.wishlist)) items = res.wishlist;
        else if (res.wishlist && Array.isArray(res.wishlist.items)) items = res.wishlist.items;
        else if (Array.isArray(res.items)) items = res.items;
        if (!items) return null;
        // Normalize server items: id = productId, wishlistItemId = server wishlist record id
        return items.map(item => {
            const productId = item.productId || item.product?.id;
            if (!productId) return item;
            return {
                ...(item.product || {}),
                ...item,
                id: productId,
                wishlistItemId: item.id,
            };
        });
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
                const LIMIT = 100;
                const res = await api.products.getAll({ page: 1, limit: LIMIT });
                if (res && Array.isArray(res.products)) {
                    let allProducts = res.products;
                    const total = res.total ?? res.totalCount ?? res.totalProducts ?? null;
                    if (total && allProducts.length < total) {
                        const totalPages = Math.ceil(total / LIMIT);
                        const pagePromises = [];
                        for (let p = 2; p <= totalPages; p++) {
                            pagePromises.push(api.products.getAll({ page: p, limit: LIMIT }));
                        }
                        const results = await Promise.all(pagePromises);
                        for (const r of results) {
                            if (r && Array.isArray(r.products)) allProducts = [...allProducts, ...r.products];
                        }
                    }
                    const mappedProducts = allProducts.map(p => {
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
                            realPrice: Number(p.realPrice || 0),
                            discountedPrice: Number(p.discountedPrice || p.realPrice || 0),
                            stock: p.stockQuantity ?? 0,
                            stockQuantity: p.stockQuantity ?? 0,
                            image: finalImages[0],
                            images: finalImages,
                            imageUrls: p.imageUrls || finalImages,
                            ingredients: p.ingredients || localMatch?.Ingredients || '',
                            benefits: Array.isArray(p.benefits) && p.benefits.length ? p.benefits : (localMatch?.Benefits || []),
                            description: p.description || '',
                            productType: p.productType || localMatch?.productType || '',
                            variant: p.variant || null,
                            howToUse: p.howToUse || '',
                            servingSize: localMatch?.servingSize || p.servingSize || null,
                        };
                    });
                    setProducts(mappedProducts);
                }
            } catch (err) {
                console.warn('Failed to load products from API', err);
            }
        })();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
        const pid = product?.id || product?.productId;
        if (!pid) return;
        setCart(prev => {
            const existing = prev.find(item => item.id === pid);
            if (existing) {
                const updated = prev.map(item => item.id === pid ? { ...item, quantity: item.quantity + quantity } : item);
                if (user?.id) api.cart.add(pid, updated.find(i => i.id === pid).quantity).catch(() => { });
                return updated;
            }
            if (user?.id) api.cart.add(pid, quantity).catch(() => { });
            return [...prev, { ...product, id: pid, quantity }];
        });
    }, [user?.id]);

    const removeFromCart = useCallback((productId) => {
        setCart(prev => {
            const item = prev.find(i => i.id === productId);
            if (user?.id) api.cart.remove(item?.cartItemId || productId).catch(() => { });
            return prev.filter(i => i.id !== productId);
        });
    }, [user?.id]);

    const updateQuantity = useCallback((productId, quantity) => {
        if (quantity < 1) return;
        setCart(prev => {
            const item = prev.find(i => i.id === productId);
            if (user?.id) api.cart.update(item?.cartItemId || productId, quantity).catch(() => { });
            return prev.map(i => i.id === productId ? { ...i, quantity } : i);
        });
    }, [user?.id]);

    const clearCart = useCallback(() => {
        setCart(() => {
            if (user?.id) api.cart.clear().catch(() => { });
            return [];
        });
    }, [user?.id]);

    const toggleWishlist = useCallback((product) => {
        setWishlist(prev => {
            const id = product.id;
            const exists = prev.find(item => (item.productId || item.product?.id || item.id) === id);
            if (exists) {
                if (user?.id) api.wishlist.remove(exists.wishlistItemId || id).catch(() => { });
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
            const item = prev.find(i => (i.productId || i.product?.id || i.id) === productId);
            if (user?.id) api.wishlist.remove(item?.wishlistItemId || productId).catch(() => { });
            return prev.filter(i => (i.productId || i.product?.id || i.id) !== productId);
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
        } catch {
            // API not implemented yet — silently fall back to local update
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
            // Reload from server on any non-null response (catches {success:true}, {id:...}, {address:...})
            if (res != null) {
                loadUserData(user?.id);
                return;
            }
        } catch (err) {
            console.warn('Add Address API failed, saving locally.');
        }

        const newAddress = { ...addressData, id: Date.now(), isDefault: addresses.length === 0 };
        setAddresses(prev => {
            // Prevent duplicate local entries (same street + city + pinCode)
            const alreadyExists = prev.some(a =>
                a.street === newAddress.street && a.city === newAddress.city && a.pinCode === newAddress.pinCode
            );
            return alreadyExists ? prev : [...prev, newAddress];
        });
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