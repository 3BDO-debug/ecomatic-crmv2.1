// APIs
import { clientLogsAdder, ticketLogsAdder } from '../APIs/systemUpdates';

export const clientLogs = (clientId, action, setClientLogs) => {
  setClientLogs = setClientLogs || undefined;
  const data = new FormData();
  data.append('action', action);
  clientLogsAdder(clientId, data)
    .then((logsResponse) => {
      if (setClientLogs) {
        setClientLogs(logsResponse);
      }
    })
    .catch((error) => console.log(error));
};

export const ticketLogs = (ticketId, action, stage, setTicketLogs) => {
  setTicketLogs = setTicketLogs || undefined;
  const data = new FormData();
  data.append('action', action);
  data.append('stage', stage);
  ticketLogsAdder(ticketId, data)
    .then((logsResponse) => {
      if (setTicketLogs) {
        setTicketLogs(logsResponse);
      }
    })
    .catch((error) => console.log(error));
};
