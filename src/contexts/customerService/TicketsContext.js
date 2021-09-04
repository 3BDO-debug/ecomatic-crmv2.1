import { createContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// utils
import { ticketsFetcher } from '../../APIs/customerService/tickets';

export const TicketsContext = createContext();

export const TicketsProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);
  useEffect(() => {
    ticketsFetcher()
      .then((ticketsData) => {
        setTickets(ticketsData);
        console.log('FSDF', ticketsData);
      })
      .catch((error) => {
        console.log(error);
        setTickets([]);
      });
  }, []);
  return <TicketsContext.Provider value={{ ticketsState: [tickets, setTickets] }}>{children}</TicketsContext.Provider>;
};

TicketsProvider.propTypes = {
  children: PropTypes.node
};
