import axiosInstance, { mainUrl } from './axios';

export const accountsFetcher = async (requiredRole) =>
  axiosInstance.get(`${mainUrl}/Accounts/Employees-Data/${requiredRole}`).then((response) => response.data);
