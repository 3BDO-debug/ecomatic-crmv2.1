import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, CardHeader, CardContent, Skeleton, CardActions, Button } from '@material-ui/core';
// utils
import { ticketDevicesDataCreator } from '../../../utils/mock-data/customerService/tickets';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import CollapsibleTable from '../../collapsible-table';
import SparepartsServices from './SparepartsServices';
import DeviceInfo from './DeviceInfo';

AgentStage.propTypes = {
  ticketDevicesState: PropTypes.array,
  ticketState: PropTypes.object
};

function AgentStage({ ticketDevicesState, ticketState }) {
  const { translate } = useLocales();
  const [ticketDevices, setTicketDevices] = ticketDevicesState;
  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const [sparepartsServices, triggerSparepartsServices] = useState(false);
  const [triggeredDevice, setTriggeredDevice] = useState(0);
  const [deviceDetails, triggerDeviceDetails] = useState(false);

  useEffect(() => {
    ticketDevicesDataCreator(
      ticketDevices,
      triggerSparepartsServices,
      setTriggeredDevice,
      triggerDeviceDetails,
      translate
    )
      .then((ticketDevicesData) => setTicketDevicesTableRows(ticketDevicesData))
      .catch((error) => console.log(error));
  }, [ticketDevices, translate]);

  return (
    <>
      {ticketDevices.length !== 0 && ticketDevicesTableRows.length !== 0 ? (
        <Box>
          <Card sx={{ boxShadow: 'none' }}>
            <CardHeader title="Ticket Devices" />
            <CardContent>
              <CollapsibleTable
                columnsData={[
                  {
                    id: 'modelNumber',
                    label: translate(
                      'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.modelNumber'
                    )
                  },
                  {
                    id: 'ticketType',
                    label: translate(
                      'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.ticketType'
                    )
                  },
                  {
                    id: 'ticketStatus',
                    label: translate(
                      'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.ticketStatus'
                    )
                  },
                  {
                    id: 'action',
                    label: translate(
                      'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.actions'
                    )
                  }
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
            <CardActions>
              <Button sx={{ marginLeft: 'auto', order: '2' }} variant="text">
                Total : 250 EGP
              </Button>
            </CardActions>
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
      ) : (
        <Skeleton animation="wave" height={500} />
      )}
    </>
  );
}

export default AgentStage;
