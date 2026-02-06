import axiosClient from './axiosClient';

export const getAllCategories = async () => {
  const res = await axiosClient.get('/categories');
  return res.data;
};
