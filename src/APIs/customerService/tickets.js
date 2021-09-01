import axiosInstance, { mainUrl } from '../axios';

export const ticketsFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Tickets/Tickets-Data`).then((response) => response.data);

export const ticketsDeleter = async (ticketsData) =>
  axiosInstance({ method: 'delete', url: `${mainUrl}/Tickets/Tickets-Data`, data: ticketsData }).then(
    (response) => response.data
  );

export const ticketIntializer = async (ticketData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Tickets/Ticket-Intializer`, data: ticketData }).then(
    (response) => response.data
  );

export const ticketUpdater = async (ticketId, ticketData) =>
  axiosInstance({ method: 'put', url: `${mainUrl}/Tickets/Ticket-Details-Data/${ticketId}`, data: ticketData }).then(
    (response) => response.data
  );

export const ticketDevicesFetcher = async (ticketId) =>
  axiosInstance.get(`${mainUrl}/Tickets/Ticket-Devices-Data/${ticketId}`).then((response) => response.data);

export const ticketDevicesUpdater = async (ticketId, ticketDeviceData) =>
  axiosInstance({
    method: 'put',
    url: `${mainUrl}/Tickets/Ticket-Devices-Data/${ticketId}`,
    data: ticketDeviceData
  }).then((response) => response.data);

export const ticketDeviceSparepartsFetcher = async (ticketDeviceId) =>
  axiosInstance.get(`${mainUrl}/Tickets/Ticket-Device-Spareparts/${ticketDeviceId}`).then((response) => response.data);

export const ticketDeviceSparepartsDeleter = async (ticketDeviceId, ticketDeviceSparepartsData) =>
  axiosInstance({
    method: 'delete',
    url: `${mainUrl}/Tickets/Ticket-Device-Spareparts/${ticketDeviceId}`,
    data: ticketDeviceSparepartsData
  }).then((response) => response.data);

export const ticketDeviceSparepartsAdder = async (ticketDeviceId, ticketDeviceSparepartsData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Ticket-Device-Spareparts/${ticketDeviceId}`,
    data: ticketDeviceSparepartsData
  }).then((response) => response.data);

export const ticketDeviceServicesFetcher = async (ticketDeviceId) =>
  axiosInstance.get(`${mainUrl}/Tickets/Ticket-Device-Services/${ticketDeviceId}`).then((response) => response.data);

export const ticketDeviceServicesDeleter = async (ticketDeviceId, ticketDeviceServicesData) =>
  axiosInstance({
    method: 'delete',
    url: `${mainUrl}/Tickets/Ticket-Device-Services/${ticketDeviceId}`,
    data: ticketDeviceServicesData
  }).then((response) => response.data);

export const ticketDeviceServicesAdder = async (ticketDeviceId, ticketDeviceServicesData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Ticket-Device-Services/${ticketDeviceId}`,
    data: ticketDeviceServicesData
  }).then((response) => response.data);

export const ticketDeviceUpdater = async (ticketId, deviceData) =>
  axiosInstance({
    method: 'put',
    url: `${mainUrl}/Tickets/Ticket-Devices-Data/${ticketId}`,
    data: deviceData
  }).then((response) => response.data);

export const ticketFollowBackCallFetcher = async (ticketId) =>
  axiosInstance.get(`${mainUrl}/Tickets/Ticket-Followback-Call-Rating/${ticketId}`).then((response) => response.data);

export const ticketFollowBackCallAdder = async (ticketId, followBackCallData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Ticket-Followback-Call-Rating/${ticketId}`,
    data: followBackCallData
  }).then((response) => response.data);
