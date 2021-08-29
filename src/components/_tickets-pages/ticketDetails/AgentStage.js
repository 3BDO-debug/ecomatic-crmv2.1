import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, CardHeader, CardContent } from '@material-ui/core';
// utils
import { ticketDevicesFetcher } from '../../../APIs/customerService/tickets';
import { ticketDevicesDataCreator } from '../../../utils/mock-data/customerService/tickets';
// components
import CollapsibleTable from '../../collapsible-table';
import SparepartsServices from './SparepartsServices';

AgentStage.propTypes = {
  ticketId: PropTypes.number
};

function AgentStage({ ticketId }) {
  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const [sparepartsServices, triggerSparepartsServices] = useState(false);
  const [triggeredDevice, setTriggeredDevice] = useState(0);
  useEffect(() => {
    ticketDevicesFetcher(ticketId).then((ticketDevicesData) => {
      setTicketDevicesTableRows(
        ticketDevicesDataCreator(
          ticketDevicesData,
          [sparepartsServices, triggerSparepartsServices],
          [triggeredDevice, setTriggeredDevice]
        )
      );
    });
  }, [ticketId]);
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
          <SparepartsServices open={sparepartsServices} closeHandler={() => triggerSparepartsServices(false)} />
        </CardContent>
      </Card>
    </Box>
  );
}

export default AgentStage;
