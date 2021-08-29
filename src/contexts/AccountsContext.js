import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { accountsFetcher } from '../APIs/accounts';

export const AccountsContext = createContext();

export const AccountsProvider = ({ children }) => {
  const [accounts, setAccounts] = useState({});
  const [requiredRole, setRequiredRole] = useState('Employees');
  useEffect(() => {
    accountsFetcher(requiredRole)
      .then((accountsData) => setAccounts(accountsData))
      .catch((error) => console.log(error));
  }, [requiredRole]);
  return (
    <AccountsContext.Provider
      value={{ accountsState: [accounts, setAccounts], requiredRoleState: [requiredRole, setRequiredRole] }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

AccountsProvider.propTypes = {
  children: PropTypes.node
};
