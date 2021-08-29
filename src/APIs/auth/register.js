import axiosInstance from '../axios';

export const registerHandler = async (data) =>
  axiosInstance.post('/Accounts/Signup', data).then((response) => response.data);
