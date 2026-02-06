const BASE_URL = import.meta.env.VITE_API_URL || "https://vedayura.celiyo.com/api";

async function request(
  path,
  { method = "GET", body, headers = {}, auth = true } = {},
) {
  const url = `${BASE_URL}${path}`;
  const opts = { method, headers: { ...headers } };
  if (body && typeof body === "object") {
    opts.headers["Content-Type"] = "application/json";
    opts.body = JSON.stringify(body);
  } else if (body) {
    opts.body = body;
  }

  if (auth) {
    const token = localStorage.getItem("ayurveda_token");
    if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, opts);
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    // If response is not JSON, keep it as text
    data = text;
  }
  if (!res.ok) {
    const message =
      (data && data.message) || res.statusText || "API request failed";
    const err = new Error(message);
    err.status = res.status;
    err.response = data;
    throw err;
  }
  return data;
}

export const auth = {
  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  register: (payload) =>
    request("/auth/register", { method: "POST", body: payload, auth: false }),
  me: () => request("/auth/me", { method: "GET" }),
};

export const products = {
  getAll: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/products${qs ? `?${qs}` : ""}`, {
      method: "GET",
      auth: false,
    });
  },
  getById: (id) => request(`/products/${id}`, { method: "GET", auth: false }),
  create: (payload) => request("/products", { method: "POST", body: payload }),
  update: (id, payload) =>
    request(`/products/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

export const cart = {
  get: () => request("/cart", { method: "GET" }),
  add: (productId, quantity = 1) =>
    request("/cart/add", { method: "POST", body: { productId, quantity } }),
  update: (itemId, quantity) =>
    request(`/cart/update/${itemId}`, { method: "PUT", body: { quantity } }),
  remove: (itemId) => request(`/cart/remove/${itemId}`, { method: "DELETE" }),
  clear: () => request("/cart/clear", { method: "DELETE" }),
};

export const wishlist = {
  get: () => request("/wishlist", { method: "GET" }),
  add: (productId) =>
    request("/wishlist/add", { method: "POST", body: { productId } }),
  remove: (itemId) =>
    request(`/wishlist/remove/${itemId}`, { method: "DELETE" }),
};

export const orders = {
  checkout: (payload) =>
    request("/orders/checkout", { method: "POST", body: payload }),
  verifyPayment: (payload) =>
    request("/orders/verify-payment", { method: "POST", body: payload }),
  getAll: () => request("/orders", { method: "GET" }),
  track: (orderId) => request(`/orders/${orderId}/track`, { method: "GET" }),
  cancel: (orderId) => request(`/orders/${orderId}/cancel`, { method: "PUT" }),
};

export const shipping = {
  calculate: (payload) =>
    request("/shipping/calculate", { method: "POST", body: payload }),
  calculateForCart: (payload) =>
    request("/shipping/calculate-for-cart", { method: "POST", body: payload }),
  checkPincode: (pincode) =>
    request(`/shipping/check-pincode/${pincode}`, {
      method: "GET",
      auth: false,
    }),
};

export const addresses = {
  get: () => request("/users/addresses", { method: "GET" }),
  add: (payload) =>
    request("/users/address", { method: "POST", body: payload }),
  update: (id, payload) =>
    request(`/users/address/${id}`, { method: "PUT", body: payload }),
  remove: (id) => request(`/users/address/${id}`, { method: "DELETE" }),
};

export default { auth, products, cart, wishlist, orders, shipping, addresses };
