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
import { SparepartsContext } from '../../../contexts';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { sparepartsDataCreator } from '../../../utils/mock-data/storage/spareparts';
import { sparepartsDeleter } from '../../../APIs/storage/spareparts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import DataTable from '../../../components/dataTable/DataTable';
import { MIconButton } from '../../../components/@material-extend';

function ListSparepartPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [spareparts, setSpartparts] = useContext(SparepartsContext).sparepartsState;
  const [sparepartsTableRows, setSparepartsTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    setSparepartsTableRows(sparepartsDataCreator(spareparts));
  }, [spareparts]);
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
              { id: 'id', label: 'ID' },
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
            rowsData={sparepartsTableRows}
            filterBy="modelNumber"
            searchPlaceholder={translate('sparepartsPages.listSparepartsPage.sparepartsTable.searchPlaceholder')}
            onSelectAllDelete={(selectedRows) => {
              const data = new FormData();
              data.append('sparepartsToBeDeleted', JSON.stringify(selectedRows));
              sparepartsDeleter(data)
                .then((sparepartsData) => {
                  setSpartparts(sparepartsData);
                  enqueueSnackbar('Deleted Spareparts', {
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

export default ListSparepartPage;
