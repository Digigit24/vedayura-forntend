import api from './axiosClient'; // or your axios instance

export const createProduct = (data) => {
  return api.post('/admin/products', data);
};

export const updateProduct = (id, data) => {
  return api.put(`/admin/products/${id}`, data);
};

export const deleteProduct = (id) => {
  return api.delete(`/admin/products/${id}`);
};
