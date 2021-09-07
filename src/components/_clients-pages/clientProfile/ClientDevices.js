import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useNavigate, useParams } from 'react-router';
// material
import { Card, Fab, Slide, Tooltip, Badge } from '@material-ui/core';
import DataTable from '../../dataTable/DataTable';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { clientDevicessDataCreator } from '../../../utils/mock-data/customerService/clients';
import { clientDevicesDeleter } from '../../../APIs/customerService/clients';
import { ticketIntializer as ticketIntializerAPI } from '../../../APIs/customerService/tickets';
// context
import { TicketsContext } from '../../../contexts';
// components
import { MIconButton } from '../../@material-extend';
import ClientDeviceDetails from './ClientDeviceDetails';

ClientDevices.propTypes = {
  clientDevicesState: PropTypes.array
};

function ClientDevices({ clientDevicesState }) {
  const { clientId } = useParams();
  const { translate } = useLocales();
  const [clientDevices, setClientDevices] = clientDevicesState;
  const [tickets, setTickets] = useContext(TicketsContext).ticketsState;
  const [clientDevicesTableRows, setClientDevicesTableRows] = useState([]);
  const [ticketIntializerButton, triggerTicketIntializerButton] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [triggeredDevice, setTriggeredDevice] = useState({});
  const [deviceDetails, triggerDeviceDetails] = useState(false);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const ticketIntializerHandler = (selectedRows) => {
    if (selectedRows.length > 0) {
      setSelectedDevices(selectedRows);
      triggerTicketIntializerButton(true);
    } else {
      triggerTicketIntializerButton(false);
    }
  };
  useEffect(() => {
    setClientDevicesTableRows(clientDevicessDataCreator(clientDevices, triggerDeviceDetails, setTriggeredDevice));
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
        navigate(`/dashboard/tickets/ticket-details/${response.id}`);
        enqueueSnackbar('Ticket intialized sucessfully', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
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
    <Card>
      <DataTable
        columnsData={[
          {
            id: 'id',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.id')
          },
          {
            id: 'modelNumber',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.modelNumber')
          },
          {
            id: 'purchasingDate',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.purchasingDate')
          },
          {
            id: 'manufacturingDate',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.manufacturingDate')
          },
          {
            id: 'installationDate',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.installationDate')
          },
          {
            id: 'warrantyStartDate',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.warrantyStartDate')
          },
          {
            id: 'warrantyStatus',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.warrantyStatus')
          },
          {
            id: 'action',
            label: translate('clientProfilePage.clientDevicesTab.clientDevicesTable.tableColumns.action')
          },
          { id: '' }
        ]}
        rowsData={clientDevicesTableRows}
        filterBy="modelNumber"
        searchPlaceholder={translate('clientProfilePage.clientDevicesTab.clientDevicesTable.searchPlaceholder')}
        onSelectAllDelete={(selectedRows) => {
          const data = new FormData();
          data.append('clientDevicesToBeDeleted', JSON.stringify(selectedRows));
          clientDevicesDeleter(clientId, data)
            .then((devicesData) => {
              setClientDevices(devicesData);
              enqueueSnackbar('Deleted client devices', {
                variant: 'success',
                action: (key) => (
                  <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                  </MIconButton>
                )
              });
            })
            .catch(() =>
              enqueueSnackbar('Couldnt delete client device at the moment', {
                variant: 'error',
                action: (key) => (
                  <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                    <Icon icon={closeFill} />
                  </MIconButton>
                )
              })
            );
        }}
        identifier="id"
        rowSelectHandler={ticketIntializerHandler}
      />
      {/* Device details */}
      <ClientDeviceDetails
        deviceDetails={triggeredDevice}
        isTriggered={deviceDetails}
        triggerHandler={() => triggerDeviceDetails(false)}
      />
      {/* Ticket intializer */}
      <Slide direction="up" in={ticketIntializerButton}>
        <Tooltip title="Intialize ticket" placement="top">
          <Badge sx={{ float: 'right', marginRight: '20px' }} badgeContent={selectedDevices.length} color="primary">
            <Fab onClick={ticketIntializer} sx={{ float: 'right' }}>
              <Icon icon="akar-icons:ticket" width={20} height={20} />
            </Fab>
          </Badge>
        </Tooltip>
      </Slide>
    </Card>
  );
}

export default ClientDevices;
