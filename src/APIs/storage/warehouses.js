import axiosInstance, { mainUrl } from '../axios';

export const warehousesFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Storage/Warehouses`).then((response) => response.data);

export const warehousesDeleter = async (warehousesData) =>
  axiosInstance({ method: 'delete', url: `${mainUrl}/Storage/Warehouses`, data: warehousesData }).then(
    (response) => response.data
  );

export const warehousesAdder = async (warehouseData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Storage/Warehouses`, data: warehouseData }).then(
    (response) => response.data
  );
