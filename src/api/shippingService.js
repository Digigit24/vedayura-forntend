import axiosClient from './axiosClient';

export const calculateShippingCost = async (details) => {
    // details: { deliveryPincode, weightKg, codAmount }
    const response = await axiosClient.post('/shipping/calculate', details);
    return response.data;
};

export const calculateCartShipping = async (deliveryPincode) => {
    const response = await axiosClient.post('/shipping/calculate-for-cart', { deliveryPincode });
    return response.data;
};

export const checkPincodeServiceability = async (pincode) => {
    const response = await axiosClient.get(`/shipping/check-pincode/${pincode}`);
    return response.data;
};

export const createOrderWithShipping = async (orderData) => {
    // orderData: { addressId, idempotencyKey }
    const response = await axiosClient.post('/orders/checkout', orderData);
    return response.data;
};

export const verifyPaymentAndCreateShipment = async (paymentData) => {
    // paymentData: { orderId, razorpayPaymentId, razorpayOrderId, razorpaySignature }
    const response = await axiosClient.post('/orders/verify-payment', paymentData);
    return response.data;
};

export const trackOrder = async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}/track`);
    return response.data;
};

export const getOrderDetails = async (orderId) => {
    const response = await axiosClient.get(`/orders/${orderId}`);
    return response.data;
}
