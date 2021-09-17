import React, { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Button, Card, Box } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// context
import { ClientsContext } from '../../../contexts';
// utils
import { clientsDataCreator } from '../../../utils/mock-data/customerService/clients';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataGridCustom from '../../../components/DataGridCustom';
import Label from '../../../components/Label';

function ListClientsPage() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const clients = useContext(ClientsContext).clientsState[0];
  const [clientsTableRows, setClientsTableRows] = useState([]);

  useEffect(() => {
    setClientsTableRows(clientsDataCreator(clients));
  }, [clients]);
  return (
    <Page title="Clients | List Clients">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('clientsPages.listClientPage.headerBreadcrumb.header')}
          links={[
            { name: translate('clientsPages.listClientPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('clientsPages.listClientPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.customerService.clients.root
            },
            {
              name: translate('clientsPages.listClientPage.headerBreadcrumb.links.current'),
              href: PATH_DASHBOARD.customerService.clients.listClientPage
            }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.customerService.clients.createClientPage}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('clientsPages.listClientPage.headerBreadcrumb.actionButton')}
            </Button>
          }
        />
        <Card>
          <Box component="div" width="100%" height="600px">
            <DataGridCustom
              columns={[
                { field: 'id', headerName: 'ID', hide: true },
                {
                  field: 'fullName',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.fullName'),
                  flex: 1,
                  minWidth: 200
                },
                {
                  field: 'phoneNumber1',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.phoneNumber1'),
                  flex: 1,
                  minWidth: 200
                },
                {
                  field: 'phoneNumber2',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.phoneNumber2'),
                  flex: 1,
                  minWidth: 200
                },
                {
                  field: 'region',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.region'),
                  minWidth: 100,
                  flex: 1
                },
                {
                  field: 'category',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.category'),
                  minWidth: 100,
                  flex: 1,
                  renderCell: (cellValues) => (
                    <Label variant="ghost" color="info">
                      {cellValues.value}
                    </Label>
                  )
                },
                {
                  field: 'createdAt',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.createdAt'),
                  minWidth: 200,
                  flex: 1
                },
                {
                  field: 'action',
                  headerName: translate('clientsPages.listClientPage.clientsTable.tableColumns.action'),
                  minWidth: 100,
                  flex: 1,
                  renderCell: (cellValues) => (
                    <Button
                      component={RouterLink}
                      to={`/dashboard/clients/client-profile/${cellValues.value}`}
                      startIcon={<Icon icon="carbon:view" />}
                    />
                  )
                }
              ]}
              rows={clientsTableRows}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export default ListClientsPage;
