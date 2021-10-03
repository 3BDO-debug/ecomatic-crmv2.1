import React, { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Button, Box } from '@material-ui/core';
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
import Label from '../../../components/Label';
import MUIDataTable from '../../../components/mui-datatable/MUIDataTable';

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
        <Box component="div" width="100%" height="600px">
          <MUIDataTable
            title={translate('clientsPages.listClientPage.headerBreadcrumb.header')}
            options={{ selectableRowsHideCheckboxes: true }}
            columns={[
              { name: 'id', label: 'ID', options: { display: false, filter: true } },
              {
                name: 'fullName',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.fullName'),
                options: {
                  filter: true
                }
              },
              {
                name: 'phoneNumber1',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.phoneNumber1'),
                options: {
                  filter: true
                }
              },
              {
                name: 'phoneNumber2',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.phoneNumber2'),
                options: {
                  filter: true
                }
              },
              {
                name: 'region',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.region'),

                options: {
                  filter: true
                }
              },
              {
                name: 'category',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.category'),
                minWidth: 100,
                options: {
                  filter: true,
                  customBodyRender: (value) => (
                    <Label variant="ghost" color="info">
                      {value}
                    </Label>
                  )
                }
              },
              {
                name: 'createdAt',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.createdAt')
              },
              {
                name: 'action',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.action'),
                minWidth: 100,
                options: {
                  filter: true,
                  customBodyRender: (value) => (
                    <Button
                      component={RouterLink}
                      to={`/dashboard/clients/client-profile/${value}`}
                      startIcon={<Icon icon="carbon:view" />}
                    />
                  )
                }
              }
            ]}
            data={clientsTableRows}
          />
        </Box>
      </Container>
    </Page>
  );
}

export default ListClientsPage;
