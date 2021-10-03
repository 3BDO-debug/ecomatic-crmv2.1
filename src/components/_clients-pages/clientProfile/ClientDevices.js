import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router';
// material
import { Box, Fab, Slide, Tooltip, Badge, Button, Skeleton } from '@material-ui/core';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { clientDevicessDataCreator } from '../../../utils/mock-data/customerService/clients';
import { ticketIntializer as ticketIntializerAPI } from '../../../APIs/customerService/tickets';
import { clientLogs, ticketLogs } from '../../../utils/systemUpdates';
// context
import { TicketsContext } from '../../../contexts';
// components
import { MIconButton } from '../../@material-extend';
import ClientDeviceDetails from './ClientDeviceDetails';
import Label from '../../Label';
import MUIDataTable from '../../mui-datatable/MUIDataTable';

ClientDevices.propTypes = {
  clientDevicesState: PropTypes.array,
  setClientLogs: PropTypes.func
};

function ClientDevices({ clientDevicesState, setClientLogs }) {
  const { clientId } = useParams();
  const { translate } = useLocales();
  const clientDevices = clientDevicesState[0];
  const [tickets, setTickets] = useContext(TicketsContext).ticketsState;
  const [clientDevicesTableRows, setClientDevicesTableRows] = useState([]);
  const [ticketIntializerButton, triggerTicketIntializerButton] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [triggeredDevice, setTriggeredDevice] = useState({});
  const [deviceDetails, triggerDeviceDetails] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const ticketIntializerHandler = (selectedRows) => {
    const selectedDevicesIds = [];
    if (selectedRows.length > 0) {
      selectedRows.map((row) => selectedDevicesIds.push(clientDevices[row].id));
      setSelectedDevices(selectedDevicesIds);
      triggerTicketIntializerButton(true);
    } else {
      triggerTicketIntializerButton(false);
    }
  };

  useEffect(() => {
    setClientDevicesTableRows(clientDevicessDataCreator(clientDevices));
  }, [clientDevices]);

  const ticketIntializer = () => {
    const data = new FormData();
    data.append('clientId', clientId);
    data.append('ticketDevices', JSON.stringify(selectedDevices));
    enqueueSnackbar('Intializing tickets, please wait...', {
      variant: 'warning',
      action: (key) => (
        <MIconButton size="small" onClick={() => closeSnackbar(key)}>
          <Icon icon={closeFill} />
        </MIconButton>
      )
    });

    ticketIntializerAPI(data)
      .then((response) => {
        setTickets([...tickets, response]);
        clientLogs(clientId, `New ticket had been intialized with ID - ${response.ticket_generated_id}`, setClientLogs);
        navigate(`/dashboard/tickets/ticket-details/${response.id}`);
        enqueueSnackbar('Ticket intialized sucessfully', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        ticketLogs(response.id, 'Ticket had been intialized', response.current_stage);
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt intialize ticket ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };
  return (
    <Box>
      {clientDevicesTableRows ? (
        <MUIDataTable
          title={translate('clientProfilePage.navTabs.devices')}
          options={{
            onRowsSelect: (rowsSelected, allRows) => {
              const selected = allRows.map((row) => row.index);
              ticketIntializerHandler(selected);
            },
            customToolbarSelect: () => (
              <Slide direction="left" in={ticketIntializerButton}>
                <Box padding="10px">
                  <Tooltip title="Intialize ticket" placement="top">
                    <Badge
                      sx={{ float: 'right', marginRight: '20px' }}
                      badgeContent={selectedDevices.length}
                      color="primary"
                    >
                      <Fab onClick={ticketIntializer} sx={{ float: 'right' }}>
                        <Icon icon="akar-icons:ticket" width={20} height={20} />
                      </Fab>
                    </Badge>
                  </Tooltip>
                </Box>
              </Slide>
            )
          }}
          columns={[
            {
              name: 'id',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.id'),
              options: {
                filter: true
              }
            },
            {
              name: 'modelNumber',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.modelNumber'),
              options: {
                filter: true
              }
            },
            {
              name: 'purchasingDate',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.purchasingDate'),
              options: {
                filter: true,
                customBodyRender: (value) =>
                  <>{value}</> ? (
                    value
                  ) : (
                    <Label variant="ghost" color="error">
                      Not available
                    </Label>
                  )
              }
            },
            {
              name: 'manufacturingDate',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.manufacturingDate'),
              options: {
                filter: true,
                customBodyRender: (value) =>
                  value ? (
                    <>{value}</>
                  ) : (
                    <Label variant="ghost" color="error">
                      Not available
                    </Label>
                  )
              }
            },
            {
              name: 'installationDate',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.installationDate'),
              options: {
                filter: true,
                customBodyRender: (value) =>
                  value ? (
                    <>{value}</>
                  ) : (
                    <Label variant="ghost" color="error">
                      Not available
                    </Label>
                  )
              }
            },
            {
              name: 'warrantyStartDate',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.warrantyStartDate'),
              options: {
                filter: true,
                customBodyRender: (value) =>
                  value ? (
                    <>{value}</>
                  ) : (
                    <Label variant="ghost" color="error">
                      Not available
                    </Label>
                  )
              }
            },
            {
              name: 'warrantyStatus',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.warrantyStatus'),
              options: {
                filter: true,
                customBodyRender: (value) => (
                  <Label variant="ghost" color="primary">
                    {value.installation_status === 'Not installed' && 'Not available'}
                    {value.installation_status !== 'Not installed' && value.in_warranty && 'In warranty'}
                    {value.installation_status !== 'Not installed' && !value.in_warranty && 'Out of warranty'}
                  </Label>
                )
              }
            },
            {
              name: 'action',
              label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.action'),
              options: {
                filter: false,
                customBodyRender: (value) => (
                  <Button
                    onClick={() => {
                      setTriggeredDevice(value);
                      triggerDeviceDetails(true);
                    }}
                    startIcon={<Icon icon="akar-icons:eye" />}
                  />
                )
              }
            }
          ]}
          data={clientDevicesTableRows}
          rowSelectHandler={ticketIntializerHandler}
        />
      ) : (
        <Skeleton height="500px" />
      )}
      {/* Device details */}
      <ClientDeviceDetails
        deviceDetails={triggeredDevice}
        isTriggered={deviceDetails}
        triggerHandler={() => triggerDeviceDetails(false)}
      />
    </Box>
  );
}

export default ClientDevices;
