import { createContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { sparepartsFetcher } from '../../APIs/storage/spareparts';

export const SparepartsContext = createContext();

export const SparepartsProvider = ({ children }) => {
  const [spareparts, setSpareparts] = useState([]);
  useEffect(() => {
    sparepartsFetcher()
      .then((sparepartsData) => setSpareparts(sparepartsData))
      .catch((error) => console.log(error));
  }, []);
  return (
    <SparepartsContext.Provider value={{ sparepartsState: [spareparts, setSpareparts] }}>
      {children}
    </SparepartsContext.Provider>
  );
};

SparepartsProvider.propTypes = {
  children: PropTypes.node
};
