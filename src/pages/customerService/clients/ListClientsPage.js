import React from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Button, Card } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataTable from '../../../components/dataTable/DataTable';

function ListClientsPage() {
  const { themeStretch } = useSettings();

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
              { id: 'fullname', label: 'Full Name' },
              { id: 'category', label: 'Category' },
              { id: 'phoneNumber', label: 'Phone Number' },
              { id: 'landline', label: 'Landline' },
              { id: 'address', label: 'Address' },
              { id: 'createdAt', label: 'Created At' },
              { id: '' }
            ]}
            rowsData={[]}
            filterBy="phoneNumber"
            searchPlaceholder="Search clients.."
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ListClientsPage;
