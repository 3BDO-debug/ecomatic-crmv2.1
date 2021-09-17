import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
// material
import { Card, Container, Box, Button } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { ticketsDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { ticketsDeleter } from '../../../APIs/customerService/tickets';
// context
import { TicketsContext } from '../../../contexts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataGridCustom from '../../../components/DataGridCustom';
import { MIconButton } from '../../../components/@material-extend';
import Label from '../../../components/Label';

function ListTicketsPage() {
  const { themeStretch } = useSettings();
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
  }, [tickets]);
  return (
    <Page title="Tickets | List Tickets">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('ticketsPages.listTicketsPage.headerBreadcrumb.header')}
          links={[
            { name: translate('ticketsPages.listTicketsPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('ticketsPages.listTicketsPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.customerService.tickets.root
            },
            { name: translate('ticketsPages.listTicketsPage.headerBreadcrumb.links.current') }
          ]}
        />
        <Card>
          <Box component="div" height="600px" width="100%">
            <DataGridCustom
              rows={ticketsTableRows}
              columns={[
                { field: 'ticketNumber', headerName: 'Ticket number', flex: 1, minWidth: 200 },
                { field: 'id', headerName: 'ID', hide: true },
                { field: 'clientFullname', headerName: 'Client Fullname', flex: 1, minWidth: 200 },
                { field: 'region', headerName: 'Region', flex: 1, minWidth: 200 },
                { field: 'phoneNumber', headerName: 'Phone number', flex: 1, minWidth: 200 },
                {
                  field: 'ticketStatus',
                  headerName: 'Ticket status',
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
                  headerName: 'Ticket stage',
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
                  headerName: 'Action',
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
      </Container>
    </Page>
  );
}

export default ListTicketsPage;
