import axiosInstance, { mainUrl } from './axios';

export const gasOvenAdder = async (deviceId, formData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Gas-Oven-Instllation-Requirements-Form/${deviceId}`,
    data: formData
  }).then((response) => response.data);

export const gasOvenFetcher = async (deviceId) =>
  axiosInstance
    .get(`${mainUrl}/Tickets/Gas-Oven-Instllation-Requirements-Form/${deviceId}`)
    .then((response) => response.data);

export const slimHobAdder = async (deviceId, formData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Slim-Hob-Instllation-Requirements-Form/${deviceId}`,
    data: formData
  }).then((response) => response.data);

export const slimHobFetcher = async (deviceId) =>
  axiosInstance
    .get(`${mainUrl}/Tickets/Slim-Hob-Instllation-Requirements-Form/${deviceId}`)
    .then((response) => response.data);

export const cookerAdder = async (deviceId, formData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Cooker-Instllation-Requirements-Form/${deviceId}`,
    data: formData
  }).then((response) => response.data);

export const cookerFetcher = async (deviceId) =>
  axiosInstance
    .get(`${mainUrl}/Tickets/Cooker-Instllation-Requirements-Form/${deviceId}`)
    .then((response) => response.data);

export const hoodFetcher = async (deviceId) =>
  axiosInstance
    .get(`${mainUrl}/Tickets/Hood-Instllation-Requirements-Form/${deviceId}`)
    .then((response) => response.data);

export const hoodAdder = async (deviceId, formData) =>
  axiosInstance({
    method: 'post',
    url: `${mainUrl}/Tickets/Hood-Instllation-Requirements-Form/${deviceId}`,
    data: formData
  }).then((response) => response.data);
