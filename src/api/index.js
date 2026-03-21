import axiosClient from './axiosClient';

const api = {
  // ====== AUTH ======
  auth: {
    login: async (email, password) => {
      const res = await axiosClient.post('/auth/login', { email, password });
      return res.data;
    },
    register: async ({ name, email, password, phone }) => {
      const res = await axiosClient.post('/auth/register', { name, email, password, phone });
      return res.data;
    },
    me: async () => {
      const res = await axiosClient.get('/auth/me');
      return res.data;
    },
    update: async (data) => {
      const res = await axiosClient.put('/auth/update', data);
      return res.data;
    },
  },

  // ====== ADDRESSES ======
  addresses: {
    getAll: async () => {
      const res = await axiosClient.get('/users/addresses');
      return res.data;
    },
    add: async (data) => {
      const res = await axiosClient.post('/users/address', data);
      return res.data;
    },
    update: async (id, data) => {
      const res = await axiosClient.put(`/users/address/${id}`, data);
      return res.data;
    },
    remove: async (id) => {
      const res = await axiosClient.delete(`/users/address/${id}`);
      return res.data;
    },
  },


  // ====== PRODUCTS ======
  products: {
    getAll: async (params = {}) => {
      const res = await axiosClient.get('/products', { params });
      return res.data;
    },
    getById: async (id) => {
      const res = await axiosClient.get(`/products/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await axiosClient.post('/products', data);
      return res.data;
    },
    update: async (id, data) => {
      const res = await axiosClient.put(`/products/${id}`, data);
      return res.data;
    },
    remove: async (id) => {
      const res = await axiosClient.delete(`/products/${id}`);
      return res.data;
    },
  },

  // ====== CART ======
  cart: {
    get: async () => {
      const res = await axiosClient.get('/cart');
      return res.data;
    },
    add: async (productId, quantity = 1) => {
      const res = await axiosClient.post('/cart', { productId, quantity });
      return res.data;
    },
    update: async (productId, quantity) => {
      const res = await axiosClient.put('/cart', { productId, quantity });
      return res.data;
    },
    remove: async (productId) => {
      const res = await axiosClient.delete(`/cart/${productId}`);
      return res.data;
    },
  },

  // ====== WISHLIST ======
  // ====== WISHLIST ======
  wishlist: {
    get: async () => {
      const res = await axiosClient.get('/wishlist');
      return res.data;
    },
    add: async (productId) => {
      const res = await axiosClient.post('/wishlist/add', { productId });  // was '/wishlist'
      return res.data;
    },
    remove: async (productId) => {
      const res = await axiosClient.delete(`/wishlist/${productId}`);
      return res.data;
    },
  },

  // ====== ORDERS ======
  orders: {
    getAll: async () => {
      const res = await axiosClient.get('/orders');
      return res.data;
    },
    getById: async (id) => {
      const res = await axiosClient.get(`/orders/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await axiosClient.post('/orders', data);
      return res.data;
    },
  },

  // ====== CATEGORIES ======
  categories: {
    getAll: async () => {
      const res = await axiosClient.get('/categories');
      return res.data;
    },
  },

  // ====== REVIEWS ======
  reviews: {
    getByProduct: async (productId, page = 1) => {
      const res = await axiosClient.get(`/reviews/product/${productId}`, { params: { page } });
      return res.data;
    },
    getTop: async () => {
      const res = await axiosClient.get('/reviews/top');
      return res.data;
    },
    create: async (productId, data) => {
      const res = await axiosClient.post(`/reviews/product/${productId}`, data);
      return res.data;
    },
  },
};

export default api;