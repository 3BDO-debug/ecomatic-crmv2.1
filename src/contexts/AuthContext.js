import React, { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { userInfoFetcher } from '../APIs/auth/userInfo';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (localStorage.getItem('access_token')) {
      userInfoFetcher()
        .then((userInfo) => {
          setUser(userInfo);
          setIsAuthenticated(true);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);
  return (
    <AuthContext.Provider
      value={{ userState: [user, setUser], isAuthenticatedState: [isAuthenticated, setIsAuthenticated] }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};
