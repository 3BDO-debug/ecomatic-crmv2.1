import axiosInstance, { mainUrl } from '../axios';

export const ticketIntializer = async (ticketData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/Tickets/Ticket-Intializer`, data: ticketData }).then(
    (response) => response.data
  );

export const ticketDevicesFetcher = async (ticketId) =>
  axiosInstance.get(`${mainUrl}/Tickets/Ticket-Devices-Data/${ticketId}`).then((response) => response.data);
