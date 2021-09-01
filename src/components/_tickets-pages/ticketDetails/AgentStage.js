import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, CardHeader, CardContent } from '@material-ui/core';
// utils
import { ticketDevicesDataCreator } from '../../../utils/mock-data/customerService/tickets';
// components
import CollapsibleTable from '../../collapsible-table';
import SparepartsServices from './SparepartsServices';
import DeviceInfo from './DeviceInfo';

AgentStage.propTypes = {
  ticketDevicesState: PropTypes.array,
  ticketState: PropTypes.object
};

function AgentStage({ ticketDevicesState, ticketState }) {
  const [ticketDevices, setTicketDevices] = ticketDevicesState;
  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const [sparepartsServices, triggerSparepartsServices] = useState(false);
  const [triggeredDevice, setTriggeredDevice] = useState(0);
  const [deviceDetails, triggerDeviceDetails] = useState(false);

  useEffect(() => {
    ticketDevicesDataCreator(ticketDevices, triggerSparepartsServices, setTriggeredDevice, triggerDeviceDetails)
      .then((ticketDevicesData) => setTicketDevicesTableRows(ticketDevicesData))
      .catch((error) => console.log(error));
  }, [ticketDevices]);

  return (
    <Box>
      <Card sx={{ boxShadow: 'none' }}>
        <CardHeader title="Ticket Devices" />
        <CardContent>
          <CollapsibleTable
            columnsData={[
              { id: 'modelNumber', label: 'Model number' },
              { id: 'ticketType', label: 'Ticket type' },
              { id: 'ticketStatus', label: 'Ticket status' },
              { id: 'action', label: 'Actions' }
            ]}
            rowsData={ticketDevicesTableRows}
          />
          <SparepartsServices
            triggeredDevice={triggeredDevice}
            open={sparepartsServices}
            closeHandler={() => triggerSparepartsServices(false)}
            ticketState={ticketState}
          />
        </CardContent>
      </Card>
      {/* Device details */}
      <DeviceInfo
        ticketState={ticketState}
        ticketDevicesState={[ticketDevices, setTicketDevices]}
        triggeredDevice={triggeredDevice}
        isTriggered={deviceDetails}
        triggerHandler={() => triggerDeviceDetails(false)}
        isEditable
      />
    </Box>
  );
}

export default AgentStage;
