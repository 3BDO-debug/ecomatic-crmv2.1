import axiosInstance, { mainUrl } from '../axios';

export const sparepartsFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Storage/Spareparts`).then((response) => response.data);

export const sparepartsDeleter = async (sparepartsData) =>
  axiosInstance({ method: 'delete', url: `${mainUrl}/Storage/Spareparts`, data: sparepartsData }).then(
    (response) => response.data
  );

export const sparepartAdder = async (sparepart) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Storage/Spareparts`, data: sparepart }).then(
    (response) => response.data
  );
