import React, { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack5';
// material
import { Container, Button, Card } from '@material-ui/core';
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
import DataTable from '../../../components/dataTable/DataTable';
import { clientsDeleter } from '../../../APIs/customerService/clients';
import { MIconButton } from '../../../components/@material-extend';

function ListClientsPage() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const [clients, setClients] = useContext(ClientsContext).clientsState;
  const [clientsTableRows, setClientsTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
          <DataTable
            columnsData={[
              { id: 'id', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.id') },
              { id: 'fullname', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.fullname') },
              { id: 'category', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.category') },
              {
                id: 'phoneNumber',
                label: translate('clientsPages.listClientPage.clientsTable.tableColumns.phoneNumber')
              },
              { id: 'landline', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.landline') },
              { id: 'address', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.address') },
              { id: 'createdAt', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.createdAt') },
              { id: 'action', label: translate('clientsPages.listClientPage.clientsTable.tableColumns.action') },
              { id: '' }
            ]}
            rowsData={clientsTableRows}
            filterBy="phoneNumber"
            searchPlaceholder={translate('clientsPages.listClientPage.clientsTable.searchPlaceholder')}
            onSelectAllDelete={(selectedRows) => {
              const data = new FormData();
              data.append('clientsToBeDeleted', JSON.stringify(selectedRows));
              clientsDeleter(data)
                .then((clientsData) => {
                  setClients(clientsData);
                  enqueueSnackbar('Deleted Clients', {
                    variant: 'success',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                })
                .catch(() => {
                  enqueueSnackbar('Couldnt delete Clients at the moment', {
                    variant: 'error',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                });
            }}
            identifier="id"
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ListClientsPage;
