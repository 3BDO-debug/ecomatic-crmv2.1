import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { useFormik } from 'formik';
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
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import DataTable from '../../components/dataTable/DataTable';
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
  const formik = useFormik({
    initialValues: addWarehouseFormDefaults,
    validationSchema: addWarehouseFormVaildationSchema,
    onSubmit: async (values, { resetForm }) => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      alert(
        JSON.stringify(
          {
            ...values
          },
          null,
          2
        )
      );
      resetForm();
    }
  });
  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

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
              { id: 'warehouseName', label: translate('warehousesPage.warehousesTable.tableColumns.warehouseName') },
              { id: 'assignedTo', label: translate('warehousesPage.warehousesTable.tableColumns.assignedTo') },
              { id: 'createdAt', label: translate('warehousesPage.warehousesTable.tableColumns.createdAt') },
              { id: '' }
            ]}
            rowsData={[{ warehouseName: 'Dummy Warehouse', assignedTo: 'Dummy Employee', createdAt: '21 may, 2021' }]}
            filterBy="warehouseName"
            searchPlaceholder="Search Warehouses.."
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
          <DialogTitle>Add Warehouse</DialogTitle>
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
                    value={values.warehouseName}
                    label="Warehouse Name"
                    {...getFieldProps('warehouseName')}
                    error={Boolean(touched.warehouseName && errors.warehouseName)}
                    helperText={touched.warehouseName && errors.warehouseName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    options={[{ label: 'hello', id: 1 }]}
                    getOptionLabel={(option) => option.label}
                    {...getFieldProps('assignedTo')}
                    onChange={(event) => {
                      setFieldValue('assignedTo', event.target.value);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Assign to"
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
              Cancel
            </Button>

            <LoadingButton
              size="medium"
              type="submit"
              variant="contained"
              loading={isSubmitting}
              disabled={!dirty}
              onClick={handleSubmit}
            >
              Save
            </LoadingButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}

export default Warehouses;
