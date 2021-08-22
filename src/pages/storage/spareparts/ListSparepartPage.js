import React from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Button, Card, Avatar } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataTable from '../../../components/dataTable/DataTable';

function ListSparepartPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  return (
    <Page title="Spareparts | List Spareparts">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('sparepartsPages.listSparepartsPage.headerBreadcrumb.header')}
          links={[
            {
              name: translate('sparepartsPages.listSparepartsPage.headerBreadcrumb.links.root'),
              href: PATH_DASHBOARD.root
            },
            {
              name: translate('sparepartsPages.listSparepartsPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.storage.spareparts.root
            },
            {
              name: translate('sparepartsPages.listSparepartsPage.headerBreadcrumb.links.current'),
              href: PATH_DASHBOARD.storage.spareparts.listSparepartPage
            }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.storage.spareparts.createSparepartPage}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('sparepartsPages.listSparepartsPage.headerBreadcrumb.actionButton')}
            </Button>
          }
        />
        <Card>
          <DataTable
            columnsData={[
              {
                id: 'modelNumber',
                label: translate('sparepartsPages.listSparepartsPage.sparepartsTable.tableColumns.modelNumber')
              },
              {
                id: 'img',
                label: translate('sparepartsPages.listSparepartsPage.sparepartsTable.tableColumns.image')
              },
              {
                id: 'createdAt',
                label: translate('sparepartsPages.listSparepartsPage.sparepartsTable.tableColumns.createdAt')
              },
              { id: '' }
            ]}
            rowsData={[{ modelNumber: '21xzxzc', img: <Avatar src="/ds" alt="image" />, createdAt: '21 may, 2021' }]}
            filterBy="modelNumber"
            searchPlaceholder={translate('sparepartsPages.listSparepartsPage.sparepartsTable.searchPlaceholder')}
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ListSparepartPage;
