import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { clientsFetcher } from '../../APIs/customerService/clients';

export const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    clientsFetcher()
      .then((clientsData) => setClients(clientsData))
      .catch((error) => console.log(error));
  }, []);
  return <ClientsContext.Provider value={{ clientsState: [clients, setClients] }}>{children}</ClientsContext.Provider>;
};

ClientsProvider.propTypes = {
  children: PropTypes.node
};
