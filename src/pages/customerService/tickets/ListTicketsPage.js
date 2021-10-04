import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
// material
import { Container, Button, Rating, Skeleton } from '@material-ui/core';
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
import { MIconButton } from '../../../components/@material-extend';
import Label from '../../../components/Label';
import MUIDataTable from '../../../components/mui-datatable/MUIDataTable';

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
        {ticketsTableRows.length !== 0 ? (
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
        ) : (
          <Skeleton height={500} />
        )}
      </Container>
    </Page>
  );
}

export default ListTicketsPage;
