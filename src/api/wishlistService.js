import axiosClient from './axiosClient';

export const getWishlist = async () => {
    const response = await axiosClient.get('/wishlist');
    return response.data;
};

export const addToWishlist = async (productId) => {
    const response = await axiosClient.post('/wishlist/add', { productId });
    return response.data;
};

export const removeFromWishlist = async (itemId) => {
    const response = await axiosClient.delete(`/wishlist/remove/${itemId}`);
    return response.data;
};
