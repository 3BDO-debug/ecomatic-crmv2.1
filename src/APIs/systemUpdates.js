import axiosInstance, { mainUrl } from './axios';

export const missingDataRequestHandler = async (missingData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/System_Updates/Missing-Data-Requests`, data: missingData }).then(
    (response) => response.data
  );
