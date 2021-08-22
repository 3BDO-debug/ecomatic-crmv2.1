import React from 'react';
// material
import { Card, Container } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataTable from '../../../components/dataTable/DataTable';

function ListTicketsPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

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
              { id: 'id', label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.id') },
              {
                id: 'clientName',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.clientName')
              },
              {
                id: 'technicianPhoto',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.technicianPhoto')
              },
              {
                id: 'technicianName',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.technicianName')
              },
              {
                id: 'intializedAt',
                label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.intializedAt')
              },
              { id: '' }
            ]}
            rowsData={[]}
            searchPlaceholder={translate('ticketsPages.listTicketsPage.ticketsTable.searchPlaceHolder')}
            filterBy="id"
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ListTicketsPage;
