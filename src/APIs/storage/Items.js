import axiosInstance, { mainUrl } from '../axios';

export const itemsFetcher = async () => axiosInstance.get(`${mainUrl}/Storage/Items`).then((response) => response.data);

export const itemsDeleter = async (itemsData) =>
  axiosInstance({ method: 'delete', url: `${mainUrl}/Storage/Items`, data: itemsData }).then(
    (response) => response.data
  );

export const itemsAdder = async (itemData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Storage/Items`, data: itemData }).then((response) => response.data);
