import React from 'react';
import PropTypes from 'prop-types';
// components
import TicketDevices from './TicketDevices';

TechnicianStage.propTypes = {
  ticketDevicesState: PropTypes.array,
  ticketState: PropTypes.object,
  setTicketLogs: PropTypes.func,
  activeView: PropTypes.number
};

function TechnicianStage({ ticketDevicesState, ticketState, setTicketLogs, activeView }) {
  return (
    <TicketDevices
      ticketDevicesState={ticketDevicesState}
      ticketState={ticketState}
      setTicketLogs={setTicketLogs}
      activeView={activeView}
    />
  );
}

export default TechnicianStage;
