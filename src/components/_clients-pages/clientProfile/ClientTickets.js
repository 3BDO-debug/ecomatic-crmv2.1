import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// material
import { Box, Button, Rating } from '@material-ui/core';
// utils
import { ticketsDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { ticketsDeleter } from '../../../APIs/customerService/tickets';
// hooks
import useLocales from '../../../hooks/useLocales';
// context
import { TicketsContext } from '../../../contexts';
// components
import { MIconButton } from '../../@material-extend';
import MUIDataTable from '../../mui-datatable/MUIDataTable';
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
    setTicketsTableRows(
      ticketsDataCreator(tickets.filter((ticket) => ticket.related_client === parseInt(clientId, 10)))
    );
  }, [tickets, clientId]);
  return (
    <Box component="div" height="600px" width="100%">
      <MUIDataTable
        title={translate('ticketsPages.listTicketsPage.headerBreadcrumb.header')}
        options={{ selectableRowsHideCheckboxes: true }}
        data={ticketsTableRows}
        columns={[
          {
            name: 'ticketNumber',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketNumber'),
            options: { filter: true }
          },
          {
            name: 'id',
            label: 'ID',
            options: {
              filter: false,
              display: false
            }
          },
          {
            name: 'clientFullname',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.clientFullname'),
            options: {
              filter: true
            }
          },
          {
            name: 'region',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.region'),
            options: {
              filter: true
            }
          },
          {
            name: 'phoneNumber',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.phoneNumber'),
            options: {
              filter: true
            }
          },
          {
            name: 'ticketStatus',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStatus'),
            options: {
              filter: true,
              customBodyRender: (value) => {
                let labelColor;
                if (value === 'Pending') {
                  labelColor = 'warning';
                } else if (value === 'Closed') {
                  labelColor = 'error';
                } else {
                  labelColor = 'info';
                }
                return (
                  <Label variant="ghost" color={labelColor}>
                    {value}
                  </Label>
                );
              }
            }
          },
          {
            name: 'ticketStage',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStage'),
            options: {
              filter: true,
              customBodyRender: (value) => (
                <Label variant="ghost" color="primary">
                  {value}
                </Label>
              )
            }
          },
          {
            name: 'technicianName',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.technicianName'),
            options: {
              filter: true,
              customBodyRender: (value) =>
                value === 'Technician Not Selected Yet' ? (
                  <Label variant="ghost" color="error">
                    {value}
                  </Label>
                ) : (
                  <Label variant="ghost" color="info">
                    {value}
                  </Label>
                )
            }
          },
          {
            name: 'routeName',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.routeName'),
            options: {
              filter: true,
              customBodyRender: (value) =>
                value === 'Route not yet selected' ? (
                  <Label variant="ghost" color="error">
                    {value}
                  </Label>
                ) : (
                  <Label variant="ghost" color="info">
                    {value}
                  </Label>
                )
            }
          },
          {
            name: 'overallRating',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.overallRating'),
            options: {
              filter: true,
              customBodyRender: (value) =>
                value ? (
                  <Rating value={parseInt(value, 10)} max={10} readOnly />
                ) : (
                  <Label variant="ghost" color="error">
                    Rating is not available yet
                  </Label>
                )
            }
          },
          {
            name: 'action',
            label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.action'),
            options: {
              filter: true,
              customBodyRender: (value) => (
                <Button
                  color="primary"
                  startIcon={<Icon icon="carbon:view" />}
                  component={Link}
                  to={`/dashboard/tickets/ticket-details/${value}`}
                />
              )
            }
          }
        ]}
        onSelectionModelChange={ticketsDeleterHandler}
      />
    </Box>
  );
}

export default ClientTickets;
