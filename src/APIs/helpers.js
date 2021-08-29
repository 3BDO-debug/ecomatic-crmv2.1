import axiosInstance, { mainUrl } from './axios';

export const expectedWarrantyStartDateCalc = async (calcData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Clients/Expected-Warranty-Start-Date`, data: calcData }).then(
    (response) => response.data
  );

export const warrantyStatusChecker = async (itemData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Clients/Client-Device-Warranty-Status`, data: itemData }).then(
    (response) => response.data
  );
