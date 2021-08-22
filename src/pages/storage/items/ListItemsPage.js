import React from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Avatar, Button, Card, Container } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataTable from '../../../components/dataTable/DataTable';

// ----------------------------------------------------------------------

function ListItemsPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  return (
    <Page title="Items | List Items">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('itemsPages.listItemsPage.headerBreadcrumb.header')}
          links={[
            { name: translate('itemsPages.listItemsPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('itemsPages.listItemsPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.storage.items.root
            },
            { name: translate('itemsPages.listItemsPage.headerBreadcrumb.links.current') }
          ]}
          action={
            <Button
              variant="contained"
              component={RouterLink}
              to={PATH_DASHBOARD.storage.items.createItemPage}
              startIcon={<Icon icon={plusFill} />}
            >
              {translate('itemsPages.listItemsPage.headerBreadcrumb.actionButton')}
            </Button>
          }
        />
        <Card>
          <DataTable
            columnsData={[
              { id: 'modelNumber', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.modelNumber') },
              { id: 'img', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.image') },
              { id: 'brand', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.brand') },
              { id: 'category', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.category') },
              { id: 'createdAt', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.createdAt') },
              { id: '' }
            ]}
            rowsData={[
              {
                modelNumber: '21xcxzcv',
                img: <Avatar src="/ds" alt="item" />,
                brand: 'dummy brand',
                category: 'hoods',
                createdAt: '21 may, 2021'
              }
            ]}
            searchPlaceholder={translate('itemsPages.listItemsPage.itemsTable.searchPlaceholder')}
            filterBy="modelNumber"
          />
        </Card>
      </Container>
    </Page>
  );
}

export default ListItemsPage;
