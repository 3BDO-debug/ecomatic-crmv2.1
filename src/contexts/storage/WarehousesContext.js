import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { warehousesFetcher } from '../../APIs/storage/warehouses';

export const WarehousesContext = createContext();

export const WarehousesProvider = ({ children }) => {
  const [warehouses, setWarehouses] = useState({});
  useEffect(() => {
    warehousesFetcher()
      .then((warehousesData) => setWarehouses(warehousesData))
      .catch((error) => console.log(error));
  }, []);
  return (
    <WarehousesContext.Provider value={{ warehousesState: [warehouses, setWarehouses] }}>
      {children}
    </WarehousesContext.Provider>
  );
};

WarehousesProvider.propTypes = {
  children: PropTypes.node
};
