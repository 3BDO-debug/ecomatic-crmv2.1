import React, { useEffect, useState, useContext, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';

// material
import { Box, Card, CardHeader, CardContent, Skeleton, CardActions, Button } from '@material-ui/core';
// hooks
import useLocales from '../../../hooks/useLocales';
// context
import { AuthContext } from '../../../contexts';
// utils
import { ticketDevicesDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { completeTicketDeviceHandler } from '../../../utils/ticketHandlers';
// components
import SparepartsServices from './SparepartsServices';
import DeviceInfo from './DeviceInfo';
import DeviceNotes from './DeviceNotes';
import CollapsibleTable from '../../collapsible-table';
import InstallationRequirements from '../../installationRequirements/InstallationRequirements';
import NotCompletedForm from './NotCompletedForm';
import RedirectTicketDevice from './RedirectTicketDevice';

TicketDevices.propTypes = {
  ticketDevicesState: PropTypes.array,
  ticketState: PropTypes.object,
  setTicketLogs: PropTypes.func,
  activeView: PropTypes.number
};

function TicketDevices({ ticketDevicesState, ticketState, setTicketLogs, activeView }) {
  const { translate } = useLocales();

  const userRole = useContext(AuthContext).userState[0].role;
  const [ticketDetails, setTicketDetails] = ticketState;

  const [ticketDevices, setTicketDevices] = ticketDevicesState;

  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const [sparepartsServices, triggerSparepartsServices] = useState(false);
  const [triggeredDevice, setTriggeredDevice] = useState(0);
  const [deviceDetails, triggerDeviceDetails] = useState(false);
  const [completed, triggerCompleted] = useState(false);
  const [notCompleted, triggerNotCompleted] = useState(false);
  const [deviceNotes, triggerDeviceNotes] = useState(false);
  const [redirectDeviceTicket, triggerRedirectTicketDevice] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const dataCreator = useCallback(async () => {
    await ticketDevicesDataCreator(
      ticketDetails,
      ticketDevices,
      triggerSparepartsServices,
      setTriggeredDevice,
      triggerDeviceDetails,
      translate,
      userRole,
      triggerDeviceNotes,
      triggerCompleted,
      triggerNotCompleted,
      triggerRedirectTicketDevice,
      activeView
    )
      .then((ticketDevicesData) => setTicketDevicesTableRows(ticketDevicesData))
      .catch((error) => console.log(error));
  }, [activeView, ticketDetails, ticketDevices, translate, userRole]);

  useEffect(() => {
    dataCreator();
  }, [ticketDevices, translate, userRole, dataCreator]);

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
                    id: 'reminder',
                    label: translate(
                      'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.reminder'
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
      {/* Notes popup */}
      <DeviceNotes
        triggerHandler={() => triggerDeviceNotes(false)}
        isTriggered={deviceNotes}
        triggeredDevice={triggeredDevice}
        ticketDetails={ticketDetails}
        setTicketDevices={setTicketDevices}
      />
      {/* Completed form */}
      <InstallationRequirements
        saveHandler={() =>
          completeTicketDeviceHandler(
            triggeredDevice.id,
            ticketDetails,
            setTicketDevices,

            enqueueSnackbar,
            closeSnackbar,
            setTicketLogs
          )
        }
        triggerHandler={() => triggerCompleted(false)}
        isTriggered={completed}
        triggeredDevice={triggeredDevice}
        ticketDetails={ticketDetails}
        reviewMode={triggeredDevice.device_ticket_status === 'Completed' && true}
      />
      {/* Not completed form */}
      <NotCompletedForm
        isTriggered={notCompleted}
        triggerHandler={() => triggerNotCompleted(false)}
        triggeredDevice={triggeredDevice}
        ticketDetails={ticketDetails}
        setTicketDevices={setTicketDevices}
        setTicketDevicesTableRows={setTicketDevicesTableRows}
        setTicketLogs={setTicketLogs}
        ticketDevicesDataCreator={dataCreator}
      />

      {/* Device ticket redirection */}
      <RedirectTicketDevice
        isTriggered={redirectDeviceTicket}
        triggerHandler={() => triggerRedirectTicketDevice(false)}
        triggeredDevice={triggeredDevice}
        ticketDetails={ticketDetails}
        reviewMode={triggeredDevice.device_ticket_status === 'Redirected' && true}
        ticketDeviceDataCreator={ticketDevicesDataCreator}
        setTicketDetails={setTicketDetails}
        setTicketDevices={setTicketDevices}
        setTicketLogs={setTicketLogs}
      />
    </>
  );
}

export default TicketDevices;
