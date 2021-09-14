import axiosInstance, { mainUrl } from './axios';

export const missingDataRequestHandler = async (missingData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/System_Updates/Missing-Data-Requests`, data: missingData }).then(
    (response) => response.data
  );

export const clientLogsFetcher = async (clientId) =>
  axiosInstance.get(`${mainUrl}/System_Updates/Client-Logs/${clientId}`).then((response) => response.data);

export const clientLogsAdder = async (clientId, logData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/System_Updates/Client-Logs/${clientId}`, data: logData }).then(
    (response) => response.data
  );

export const ticketLogsFetcher = async (ticketId) =>
  axiosInstance.get(`${mainUrl}/System_Updates/Ticket-Logs/${ticketId}`).then((response) => response.data);

export const ticketLogsAdder = async (ticketId, logsData) =>
  axiosInstance({ method: 'post', url: `${mainUrl}/System_Updates/Ticket-Logs/${ticketId}`, data: logsData }).then(
    (response) => response.data
  );
