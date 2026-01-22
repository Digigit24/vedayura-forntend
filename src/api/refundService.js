import axiosClient from './axiosClient';

export const requestRefund = async (refundData) => {
    // refundData: { orderId, reason, userNote }
    const response = await axiosClient.post('/refunds/request', refundData);
    return response.data;
};

export const getMyRefundRequests = async () => {
    const response = await axiosClient.get('/refunds/my-requests');
    return response.data;
};

// Admin endpoints
export const getAllRefunds = async (status, page = 1, limit = 20) => {
    const response = await axiosClient.get('/refunds/admin/all', {
        params: { status, page, limit }
    });
    return response.data;
};

export const approveRefund = async (refundId, adminNote) => {
    const response = await axiosClient.post(`/refunds/admin/${refundId}/approve`, { adminNote });
    return response.data;
};

export const rejectRefund = async (refundId, adminNote) => {
    const response = await axiosClient.post(`/refunds/admin/${refundId}/reject`, { adminNote });
    return response.data;
};

export const checkRefundStatus = async (refundId) => {
    const response = await axiosClient.get(`/refunds/admin/${refundId}/check-status`);
    return response.data;
}
