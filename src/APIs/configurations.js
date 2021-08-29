import axiosInstance, { mainUrl } from './axios';

export const brandsFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Brands`).then((response) => response.data);

export const categoriesFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Categories`).then((response) => response.data);

export const citiesFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Cities`).then((response) => response.data);

export const regionsFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Regions`).then((response) => response.data);

export const clientsCategoriesFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Clients-Categories`).then((response) => response.data);

export const branchesFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Branches`).then((response) => response.data);

export const distributorsFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Distributors`).then((response) => response.data);

export const servicesFetcher = async () =>
  axiosInstance.get(`${mainUrl}/Configurations/Ticket-Services`).then((response) => response.data);
