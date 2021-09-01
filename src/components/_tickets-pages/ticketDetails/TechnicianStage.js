import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Box, Button, Card, CardContent, CardHeader } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketDevicesFetcher, ticketDeviceUpdater } from '../../../APIs/customerService/tickets';
// component
import DataTable from '../../dataTable/DataTable';
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';

TechnicianStage.propTypes = {
  ticketState: PropTypes.array
};

function TechnicianStage({ ticketState }) {
  const [ticketDetails, setTicketDetails] = ticketState;
  const [ticketDevices, setTicketDevices] = useState([]);
  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const completeTicketDeviceHandler = (ticketDeviceId) => {
    const data = new FormData();
    data.append('ticketDeviceId', ticketDeviceId);
    data.append('markCompleted', 'markCompleted');
    data.append('currentStage', 'technician-stage');
    ticketDeviceUpdater(ticketDetails.id, data)
      .then((ticketDevicesData) => {
        setTicketDevices(ticketDevicesData);
        setTicketDevicesTableRows(ticketDevicesDataCreator(ticketDevicesData));

        enqueueSnackbar('Device marked completed', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt mark device completed ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };

  const ticketDevicesDataCreator = (ticketDevices) => {
    const ticketDevicesData = [];
    ticketDevices.map((ticketDevice) =>
      ticketDevicesData.push({
        modelNumber: ticketDevice.device_model_number,
        ticketType: (
          <Label variant="ghost" color="primary">
            {ticketDevice.device_ticket_type}
          </Label>
        ),
        ticketStatus: (
          <Label variant="ghost" color="info">
            {ticketDevice.device_ticket_status}
          </Label>
        ),
        actions: (
          <>
            {ticketDevice.device_ticket_status === 'Under Processing' ? (
              <>
                <Button sx={{ marginRight: '10px' }} variant="outlined" color="error">
                  Not completed
                </Button>
                <LoadingButton
                  onClick={() => completeTicketDeviceHandler(ticketDevice.id)}
                  variant="contained"
                  color="primary"
                >
                  Completed
                </LoadingButton>
              </>
            ) : (
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Icon icon="carbon:document" width={20} height={20} />}
              >
                View installation requirements
              </Button>
            )}
          </>
        )
      })
    );
    return ticketDevicesData;
  };

  useEffect(() => {
    ticketDevicesFetcher(ticketDetails.id)
      .then((ticketDevicesData) => {
        setTicketDevices(ticketDevicesData);
        setTicketDevicesTableRows(ticketDevicesDataCreator(ticketDevicesData));
      })
      .catch((error) => console.log(error));
  }, [ticketDetails]);
  return (
    <Box>
      <Card sx={{ boxShadow: 'none' }}>
        <CardHeader title="Ticket devices" />
        <CardContent>
          <DataTable
            columnsData={[
              { id: 'modelNumber', label: 'Model number' },
              { id: 'ticketType', label: 'Ticket type' },
              { id: 'ticketStatus', label: 'Ticket status' },
              { id: 'actions', label: 'Actions' }
            ]}
            rowsData={ticketDevicesTableRows}
            searchPlaceholder="Search devices.."
            identifier="modelNumber"
            disableCheckbox
          />
        </CardContent>
      </Card>
    </Box>
  );
}

export default TechnicianStage;
