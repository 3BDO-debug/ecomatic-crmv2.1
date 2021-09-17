import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// material
import { Card, Box, Button } from '@material-ui/core';
// utils
import { ticketsDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { ticketsDeleter } from '../../../APIs/customerService/tickets';
// hooks
import useLocales from '../../../hooks/useLocales';
// context
import { TicketsContext } from '../../../contexts';
// components
import { MIconButton } from '../../@material-extend';
import DataGridCustom from '../../DataGridCustom';
import Label from '../../Label';

ClientTickets.propTypes = {
  clientId: PropTypes.number
};

function ClientTickets({ clientId }) {
  const { translate } = useLocales();
  const [tickets, setTickets] = useContext(TicketsContext).ticketsState;
  const [ticketsTableRows, setTicketsTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const ticketsDeleterHandler = (selectedRows) => {
    const data = new FormData();
    data.append('ticketsToBeDeleted', JSON.stringify(selectedRows));
    ticketsDeleter(data)
      .then((ticketsData) => {
        setTickets(ticketsData);
        enqueueSnackbar('Deleted tickets', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt delete tickets at the moment ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };

  useEffect(() => {
    setTicketsTableRows(ticketsDataCreator(tickets));
  }, [tickets, clientId]);
  return (
    <Card>
      <Box component="div" height="600px" width="100%">
        <DataGridCustom
          rows={ticketsTableRows}
          columns={[
            {
              field: 'ticketNumber',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketNumber'),
              flex: 1,
              minWidth: 200
            },
            { field: 'id', headerName: 'ID', hide: true },
            {
              field: 'clientFullname',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.clientFullname'),
              flex: 1,
              minWidth: 200
            },
            {
              field: 'region',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.region'),
              flex: 1,
              minWidth: 200
            },
            {
              field: 'phoneNumber',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.phoneNumber'),
              flex: 1,
              minWidth: 200
            },
            {
              field: 'ticketStatus',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStatus'),
              flex: 1,
              minWidth: 200,
              renderCell: (cellValues) => {
                let labelColor;
                if (cellValues.value === 'Pending') {
                  labelColor = 'warning';
                } else if (cellValues.value === 'Closed') {
                  labelColor = 'error';
                } else {
                  labelColor = 'info';
                }
                return (
                  <Label variant="ghost" color={labelColor}>
                    {cellValues.value}
                  </Label>
                );
              }
            },
            {
              field: 'ticketStage',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStage'),
              flex: 1,
              minWidth: 200,
              renderCell: (cellValues) => (
                <Label variant="ghost" color="primary">
                  {cellValues.value}
                </Label>
              )
            },
            {
              field: 'action',
              headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.action'),
              flex: 1,
              minWidth: 200,
              renderCell: (cellValues) => (
                <Button
                  color="primary"
                  startIcon={<Icon icon="carbon:view" />}
                  component={Link}
                  to={`/dashboard/tickets/ticket-details/${cellValues.value}`}
                />
              )
            }
          ]}
          onSelectionModelChange={ticketsDeleterHandler}
        />
      </Box>
    </Card>
  );
}

export default ClientTickets;
