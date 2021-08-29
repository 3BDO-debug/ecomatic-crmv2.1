import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { itemsFetcher } from '../../APIs/storage/Items';

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  useEffect(() => {
    itemsFetcher()
      .then((itemsData) => setItems(itemsData))
      .catch((error) => console.log(error));
  }, []);
  return <ItemsContext.Provider value={{ itemsState: [items, setItems] }}>{children}</ItemsContext.Provider>;
};

ItemsProvider.propTypes = {
  children: PropTypes.node
};
