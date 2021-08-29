import React, { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link as RouterLink } from 'react-router-dom';
import plusFill from '@iconify/icons-eva/plus-fill';
import closeFill from '@iconify/icons-eva/close-fill';
import { useSnackbar } from 'notistack5';
// material
import { Button, Card, Container } from '@material-ui/core';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// context
import { ItemsContext } from '../../../contexts';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// utils
import { itemsDataCreator } from '../../../utils/mock-data/storage/items';
import { itemsDeleter } from '../../../APIs/storage/Items';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataTable from '../../../components/dataTable/DataTable';
import { MIconButton } from '../../../components/@material-extend';

// ----------------------------------------------------------------------

function ListItemsPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [items, setItems] = useContext(ItemsContext).itemsState;
  const [itemsTableRows, setItemsTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  useEffect(() => {
    setItemsTableRows(itemsDataCreator(items));
  }, [items]);
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
              { id: 'id', label: 'ID' },
              { id: 'modelNumber', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.modelNumber') },
              { id: 'img', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.image') },
              { id: 'brand', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.brand') },
              { id: 'category', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.category') },
              { id: 'createdAt', label: translate('itemsPages.listItemsPage.itemsTable.tableColumns.createdAt') },
              { id: '' }
            ]}
            rowsData={itemsTableRows}
            searchPlaceholder={translate('itemsPages.listItemsPage.itemsTable.searchPlaceholder')}
            filterBy="modelNumber"
            onSelectAllDelete={(selectedRows) => {
              const data = new FormData();
              data.append('itemsToBeDeleted', JSON.stringify(selectedRows));
              itemsDeleter(data)
                .then((itemsData) => {
                  setItems(itemsData);
                  enqueueSnackbar('Deleted Items', {
                    variant: 'success',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                })
                .catch(() => {
                  enqueueSnackbar('Couldnt delete warehouses at the moment', {
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

export default ListItemsPage;
