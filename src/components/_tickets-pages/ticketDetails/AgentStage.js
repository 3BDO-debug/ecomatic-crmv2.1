import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Autocomplete
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketDevicesFetcher } from '../../../APIs/customerService/tickets';
import { ticketDevicesDataCreator } from '../../../utils/mock-data/customerService/tickets';
// components
import CollapsibleTable from '../../collapsible-table';
import SparepartsServices from './SparepartsServices';
import Label from '../../Label';
import DeviceInfo from './DeviceInfo';

AgentStage.propTypes = {
  ticketId: PropTypes.number,
  ticketState: PropTypes.object
};

function AgentStage({ ticketId, ticketState }) {
  const ticketDetails = ticketState[0];
  const [ticketDevices, setTicketDevices] = useState([]);
  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const [sparepartsServices, triggerSparepartsServices] = useState(false);
  const [triggeredDevice, setTriggeredDevice] = useState(0);
  const [deviceDetails, triggerDeviceDetails] = useState(false);

  useEffect(() => {
    ticketDevicesFetcher(ticketId)
      .then((ticketDevicesData) => {
        setTicketDevices(ticketDevicesData);
        ticketDevicesDataCreator(
          ticketDevicesData,
          [ticketDevicesTableRows, setTicketDevicesTableRows],
          [sparepartsServices, triggerSparepartsServices],
          [triggeredDevice, setTriggeredDevice],
          triggerDeviceDetails
        );
      })
      .catch((error) => console.log(error));
  }, [ticketId, ticketDetails]);
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
      />
    </Box>
  );
}

export default AgentStage;
