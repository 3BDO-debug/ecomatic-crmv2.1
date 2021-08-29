import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
// material
import { Card, Fab, Slide, Tooltip, Badge } from '@material-ui/core';
import DataTable from '../../dataTable/DataTable';
// utils
import { clientDevicessDataCreator } from '../../../utils/mock-data/customerService/clients';
import { clientDevicesDeleter } from '../../../APIs/customerService/clients';
import { ticketIntializer as ticketIntializerAPI } from '../../../APIs/customerService/tickets';
// components
import { MIconButton } from '../../@material-extend';

ClientDevices.propTypes = {
  clientId: PropTypes.number,
  clientDevicesState: PropTypes.array
};

function ClientDevices({ clientId, clientDevicesState }) {
  const [clientDevices, setClientDevices] = clientDevicesState;
  const [clientDevicesTableRows, setClientDevicesTableRows] = useState([]);
  const [ticketIntializerButton, triggerTicketIntializerButton] = useState(false);
  const [selectedDevices, setSelectedDevices] = useState([]);
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
          { id: 'id', label: 'ID' },
          { id: 'modelNumber', label: 'Model Number' },
          { id: 'purchasingDate', label: 'Purchasing Data' },
          { id: 'manufacturingDate', label: 'Manufacturing Date' },
          { id: 'installationDate', label: 'Installation Date' },
          { id: 'warrantyStartDate', label: 'Warranty Start Date' },
          { id: 'warrantyStatus', label: 'Warranty Status' },
          { id: 'action', label: 'Action' },
          { id: '' }
        ]}
        rowsData={clientDevicesTableRows}
        filterBy="modelNumber"
        searchPlaceholder="Search Client Devices.."
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
      {/* Ticket intializer */}
      <Slide direction="up" in={ticketIntializerButton}>
        <Tooltip title="Intialize ticket" placement="top">
          <Badge badgeContent={selectedDevices.length} color="primary">
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
