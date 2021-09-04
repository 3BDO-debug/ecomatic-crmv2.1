import React, { useContext, useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import {
  Container,
  Button,
  Card,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  Box,
  Autocomplete,
  FormHelperText
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
import useLocales from '../../hooks/useLocales';
// utils
import { warehousesDataCreator } from '../../utils/mock-data/storage/warehouses';
import { accountsDataCreator } from '../../utils/mock-data/accounts';
import { warehousesAdder, warehousesDeleter } from '../../APIs/storage/warehouses';
// context
import { WarehousesContext, AccountsContext } from '../../contexts';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import DataTable from '../../components/dataTable/DataTable';
import { MIconButton } from '../../components/@material-extend';
// form schema
import {
  addWarehouseFormDefaults,
  addWarehouseFormVaildationSchema
} from '../../utils/formValidationSchemas/warehousesPage';

// ----------------------------------------------------------------------

function Warehouses() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const [addWarehouse, triggerAddWarehouse] = useState(false);
  const [warehouses, setWarehouses] = useContext(WarehousesContext).warehousesState;
  const [warehousesTableRows, setWarehousesTableRows] = useState([]);
  const accounts = useContext(AccountsContext).accountsState[0];
  const setRequiredRole = useContext(AccountsContext).requiredRoleState[1];
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: addWarehouseFormDefaults,
    validationSchema: addWarehouseFormVaildationSchema,
    onSubmit: async (values, { resetForm }) => {
      await warehousesAdder(values)
        .then((warehousesData) => {
          setWarehouses(warehousesData);
          enqueueSnackbar('Warehouse added', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => console.log(error));

      resetForm();
    }
  });
  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  useEffect(() => {
    setRequiredRole('Store-Keepers');
  });
  useEffect(() => {
    setWarehousesTableRows(warehousesDataCreator(warehouses));
  }, [warehouses]);
  return (
    <Page title="Storage | Warehouses">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('warehousesPage.headerBreadcrumb.header')}
          links={[
            { name: translate('warehousesPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('warehousesPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.storage.warehousesPage
            },
            { name: translate('warehousesPage.headerBreadcrumb.links.current') }
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Icon icon={plusFill} />}
              onClick={() => {
                triggerAddWarehouse(true);
              }}
            >
              {translate('warehousesPage.headerBreadcrumb.actionButton')}
            </Button>
          }
        />
        <Card>
          <DataTable
            columnsData={[
              { id: 'id', label: 'ID' },
              { id: 'warehouseName', label: translate('warehousesPage.warehousesTable.tableColumns.warehouseName') },
              { id: 'assignedTo', label: translate('warehousesPage.warehousesTable.tableColumns.assignedTo') },
              { id: 'createdAt', label: translate('warehousesPage.warehousesTable.tableColumns.createdAt') },
              { id: '' }
            ]}
            rowsData={warehousesTableRows}
            filterBy="warehouseName"
            searchPlaceholder={translate('warehousesPage.warehousesTable.searchPlaceholder')}
            onSelectAllDelete={(selectedRows) => {
              const data = new FormData();
              data.append('warehousesToBeDeleted', JSON.stringify(selectedRows));
              warehousesDeleter(data)
                .then((warehousesData) => {
                  setWarehouses(warehousesData);
                  enqueueSnackbar('Deleted Warehouses', {
                    variant: 'success',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  });
                })
                .catch(() =>
                  enqueueSnackbar('Couldnt delete warehouses at the moment', {
                    variant: 'error',
                    action: (key) => (
                      <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                        <Icon icon={closeFill} />
                      </MIconButton>
                    )
                  })
                );
            }}
            identifier="id"
          />
        </Card>
        {/* Add Warehouse Dialog */}
        <Dialog
          open={addWarehouse}
          onClose={() => {
            triggerAddWarehouse(false);
          }}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle>{translate('warehousesPage.addWarehouseForm.title')}</DialogTitle>
          <DialogContent>
            <Box
              component="form"
              onSubmit={(event) => {
                event.preventDefault();
                handleSubmit();
              }}
              marginTop="30px"
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    autoFocus
                    margin="dense"
                    onChange={(event) => setFieldValue('warehouseName', event.target.value)}
                    value={values.warehouseName}
                    label={translate('warehousesPage.addWarehouseForm.warehouseName')}
                    {...getFieldProps('warehouseName')}
                    error={Boolean(touched.warehouseName && errors.warehouseName)}
                    helperText={touched.warehouseName && errors.warehouseName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    options={accountsDataCreator(accounts)}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                      setFieldValue('assignedTo', value == null ? 'none' : value.id);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={translate('warehousesPage.addWarehouseForm.assignTo')}
                        margin="none"
                        error={Boolean(touched.assignedTo && errors.assignedTo)}
                        helperText={touched.assignedTo && errors.assignedTo}
                      />
                    )}
                  />
                  <FormHelperText sx={{ px: 2 }} error>
                    {errors.assignedTo}
                  </FormHelperText>
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                triggerAddWarehouse(false);
              }}
              color="inherit"
            >
              {translate('warehousesPage.addWarehouseForm.cancelButton')}
            </Button>

            <LoadingButton
              size="medium"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!dirty}
              onClick={handleSubmit}
            >
              {translate('warehousesPage.addWarehouseForm.actionButton')}
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}

export default Warehouses;
