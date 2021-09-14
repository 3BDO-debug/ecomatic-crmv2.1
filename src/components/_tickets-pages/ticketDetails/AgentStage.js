import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, CardHeader, CardContent, Skeleton, CardActions, Button } from '@material-ui/core';
// utils
import { ticketDevicesDataCreator } from '../../../utils/mock-data/customerService/tickets';
// hooks
import useLocales from '../../../hooks/useLocales';
// context
import { AuthContext } from '../../../contexts';
// components
import CollapsibleTable from '../../collapsible-table';
import SparepartsServices from './SparepartsServices';
import DeviceInfo from './DeviceInfo';

AgentStage.propTypes = {
  ticketDevicesState: PropTypes.array,
  ticketState: PropTypes.object,
  setTicketLogs: PropTypes.func
};

function AgentStage({ ticketDevicesState, ticketState, setTicketLogs }) {
  const { translate } = useLocales();
  const userRole = useContext(AuthContext).userState[0].role;
  const ticketDetails = ticketState[0];
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
      translate,
      userRole
    )
      .then((ticketDevicesData) => setTicketDevicesTableRows(ticketDevicesData))
      .catch((error) => console.log(error));
  }, [ticketDevices, translate, userRole]);

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
                setTicketLogs={setTicketLogs}
              />
            </CardContent>
            <CardActions>
              <Button sx={{ marginLeft: 'auto', order: '2' }} variant="text">
                Total : {ticketDetails.total_cost} EGP
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
            setTicketLogs={setTicketLogs}
          />
        </Box>
      ) : (
        <Skeleton animation="wave" height={500} />
      )}
    </>
  );
}

export default AgentStage;
