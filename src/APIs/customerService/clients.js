import axiosInstance, { mainUrl } from '../axios';

export const clientsFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Clients/Clients-Data`).then((response) => response.data);

export const clientsDeleter = async (clientsData) =>
  axiosInstance({ method: 'delete', url: `${mainUrl}/Clients/Clients-Data`, data: clientsData }).then(
    (response) => response.data
  );

export const clientsAdder = async (clientData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Clients/Clients-Data`, data: clientData }).then(
    (response) => response.data
  );

export const clientLookup = async (clientData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Clients/Client-Lookup`, data: clientData }).then(
    (response) => response.data
  );

export const clientDataFetcher = async (clientId) =>
  axiosInstance.get(`${mainUrl}/Clients/Client-Details/${clientId}`).then((response) => response.data);

export const clientDataUpdater = async (clientId, clientData) =>
  axiosInstance({ method: 'put', url: `${mainUrl}/Clients/Client-Details/${clientId}`, data: clientData }).then(
    (response) => response.data
  );

export const clientDevicesFetcher = async (clientId) =>
  axiosInstance.get(`${mainUrl}/Clients/Client-Devices-Data/${clientId}`).then((response) => response.data);

export const clientDevicesAdder = async (clientId, deviceData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Clients/Client-Devices-Data/${clientId}`, data: deviceData }).then(
    (response) => response.data
  );

export const clientDevicesDeleter = async (clientId, devicesData) =>
  axiosInstance({
    method: 'delete',
    url: `${mainUrl}/Clients/Client-Devices-Data/${clientId}`,
    data: devicesData
  }).then((response) => response.data);
