import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Card, Container } from '@material-ui/core';
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
import DataTable from '../../../components/dataTable/DataTable';
import { MIconButton } from '../../../components/@material-extend';

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
          <DataTable
            columnsData={[
              {
                id: 'ticketNumber',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketNumber')
              },
              { id: 'id', label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.id') },
              {
                id: 'clientName',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.clientName')
              },
              {
                id: 'technicianName',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.technicianName')
              },
              {
                id: 'intializedAt',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.intializedAt')
              },
              {
                id: 'currentStage',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.currentStage')
              },
              { id: 'status', label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.status') },
              { id: 'action', label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.action') },
              { id: '' }
            ]}
            filterBy="ticketNumber"
            identifier="id"
            rowsData={ticketsTableRows}
            searchPlaceholder={translate('ticketsPages.listTicketsPage.ticketsTable.searchPlaceholder')}
            onSelectAllDelete={ticketsDeleterHandler}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ListTicketsPage;
