import axiosInstance, { mainUrl } from '../axios';

export const userInfoFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Accounts/User-Info`).then((response) => response.data);
