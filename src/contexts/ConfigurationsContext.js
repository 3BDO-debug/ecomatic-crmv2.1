import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  brandsFetcher,
  categoriesFetcher,
  citiesFetcher,
  regionsFetcher,
  clientsCategoriesFetcher,
  branchesFetcher,
  distributorsFetcher,
  servicesFetcher
} from '../APIs/configurations';

export const ConfigurationsContext = createContext();

export const ConfigurationsProvider = ({ children }) => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [regions, setRegions] = useState([]);
  const [clientsCategories, setClientsCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [distributor, setDistributor] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    brandsFetcher()
      .then((brandsData) => setBrands(brandsData))
      .catch((error) => console.log(error));
    categoriesFetcher()
      .then((categoriesData) => setCategories(categoriesData))
      .catch((error) => console.log(error));
    citiesFetcher()
      .then((citiesData) => setCities(citiesData))
      .catch((error) => console.log(error));
    regionsFetcher()
      .then((regionsData) => setRegions(regionsData))
      .catch((error) => console.log(error));
    clientsCategoriesFetcher()
      .then((clientsCategoriesData) => setClientsCategories(clientsCategoriesData))
      .catch((error) => console.log(error));
    branchesFetcher()
      .then((branchesData) => setBranches(branchesData))
      .catch((error) => console.log(error));
    distributorsFetcher()
      .then((distributosData) => setDistributor(distributosData))
      .catch((error) => console.log(error));
    servicesFetcher()
      .then((servicesData) => setServices(servicesData))
      .catch((error) => console.log(error));
  }, []);
  return (
    <ConfigurationsContext.Provider
      value={{
        brandsState: [brands, setBrands],
        categoriesState: [categories, setCategories],
        citiesState: [cities, setCities],
        regionsState: [regions, setRegions],
        clientsCategoriesState: [clientsCategories, setClientsCategories],
        branchesState: [branches, setBranches],
        distributorsState: [distributor, setDistributor]
      }}
    >
      {children}
    </ConfigurationsContext.Provider>
  );
};

ConfigurationsProvider.propTypes = {
  children: PropTypes.node
};
