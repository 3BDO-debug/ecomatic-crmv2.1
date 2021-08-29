import axiosInstance, { mainUrl } from '../axios';

export const logoutHandler = async () =>
  axiosInstance
    .post(`${mainUrl}/Accounts/Signout`, { refresh_token: localStorage.getItem('refresh_token') })
    .then((response) => {
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('access_token');
      return response;
    });
