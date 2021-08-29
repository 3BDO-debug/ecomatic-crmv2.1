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
          heading="List Clients"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clients', href: PATH_DASHBOARD.customerService.clients.root },
            { name: 'List Clients', href: PATH_DASHBOARD.customerService.clients.listClientPage }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.customerService.clients.createClientPage}
              startIcon={<Icon icon={plusFill} />}
            >
              Add Client
            </Button>
          }
        />
        <Card>
          <DataTable
            columnsData={[
              { id: 'id', label: 'ID' },
              { id: 'fullname', label: 'Full Name' },
              { id: 'category', label: 'Category' },
              { id: 'phoneNumber', label: 'Phone Number' },
              { id: 'landline', label: 'Landline' },
              { id: 'address', label: 'Address' },
              { id: 'createdAt', label: 'Created At' },
              { id: 'action', label: 'Action' },
              { id: '' }
            ]}
            rowsData={clientsTableRows}
            filterBy="phoneNumber"
            searchPlaceholder="Search clients.."
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
