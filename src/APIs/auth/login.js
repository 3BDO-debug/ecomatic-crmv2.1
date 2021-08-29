import axios from 'axios';
import axiosInstance, { mainUrl } from '../axios';

export const loginHandler = async (data) =>
  axios.post(`${mainUrl}/api/token/`, data).then((response) => {
    localStorage.setItem('access_token', response.data.access);
    localStorage.setItem('refresh_token', response.data.refresh);
    axiosInstance.defaults.headers.Authorization = `JWT ${localStorage.getItem('access_token')}`;
    return response.data;
  });
