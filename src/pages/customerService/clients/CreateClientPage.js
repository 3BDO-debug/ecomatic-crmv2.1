import React from 'react';
import { useFormik } from 'formik';
// material
import { Container, Box, Card, Grid, TextField, Autocomplete, FormHelperText } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useSettings from '../../../hooks/useSettings';
// form schema
import {
  createClientFormDefaults,
  createClientFormValidationSchema
} from '../../../utils/formValidationSchemas/createClientPage';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';

function CreateClientPage() {
  const { themeStretch } = useSettings();
  const formik = useFormik({
    initialValues: createClientFormDefaults,
    validationSchema: createClientFormValidationSchema,
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
  const { dirty, errors, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Page title="Clients | Create client">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new client"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clients', href: PATH_DASHBOARD.customerService.clients.root },
            { name: 'Create client' }
          ]}
        />
        <Card>
          <Box component="form" padding="30px">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label="Full Name"
                  {...getFieldProps('fullname')}
                  error={Boolean(touched.fullname && errors.fullname)}
                  helperText={touched.fullname && errors.fullname}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label="Phone Number 1"
                  {...getFieldProps('phoneNumber1')}
                  error={Boolean(touched.phoneNumber1 && errors.phoneNumber1)}
                  helperText={touched.phoneNumber1 && errors.phoneNumber1}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label="Phone Number 2"
                  {...getFieldProps('phoneNumber2')}
                  error={Boolean(touched.phoneNumber2 && errors.phoneNumber2)}
                  helperText={touched.phoneNumber2 && errors.phoneNumber2}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label="Landline"
                  {...getFieldProps('landline')}
                  error={Boolean(touched.landline && errors.landline)}
                  helperText={touched.landline && errors.landline}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  fullWidth
                  options={[{ label: 'hello', id: 1 }]}
                  getOptionLabel={(option) => option.label}
                  {...getFieldProps('city')}
                  onChange={(event) => {
                    setFieldValue('city', event.target.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="City"
                      margin="none"
                      error={Boolean(touched.city && errors.city)}
                      helperText={touched.city && errors.city}
                    />
                  )}
                />
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.city}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  fullWidth
                  options={[{ label: 'hello', id: 1 }]}
                  getOptionLabel={(option) => option.label}
                  {...getFieldProps('region')}
                  onChange={(event) => {
                    setFieldValue('region', event.target.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Region"
                      margin="none"
                      error={Boolean(touched.region && errors.region)}
                      helperText={touched.region && errors.region}
                    />
                  )}
                />
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.warehouse}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label="Address"
                  {...getFieldProps('address')}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label="Building no"
                  {...getFieldProps('buildingNo')}
                  error={Boolean(touched.buildingNo && errors.buildingNo)}
                  helperText={touched.buildingNo && errors.buildingNo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label="Floor no"
                  {...getFieldProps('floorNo')}
                  error={Boolean(touched.floorNo && errors.floorNo)}
                  helperText={touched.floorNo && errors.floorNo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label="Apartment no"
                  {...getFieldProps('apartmentNo')}
                  error={Boolean(touched.apartmentNo && errors.apartmentNo)}
                  helperText={touched.apartmentNo && errors.apartmentNo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label="Landmark"
                  {...getFieldProps('landmark')}
                  error={Boolean(touched.landmark && errors.landmark)}
                  helperText={touched.landmark && errors.landmark}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  fullWidth
                  options={[{ label: 'hello', id: 1 }]}
                  getOptionLabel={(option) => option.label}
                  {...getFieldProps('category')}
                  onChange={(event) => {
                    setFieldValue('category', event.target.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="category"
                      margin="none"
                      error={Boolean(touched.category && errors.category)}
                      helperText={touched.category && errors.category}
                    />
                  )}
                />
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.category}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <LoadingButton
                  size="large"
                  type="submit"
                  variant="contained"
                  loading={isSubmitting}
                  disabled={!dirty}
                  onClick={handleSubmit}
                  fullWidth
                >
                  Save
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export default CreateClientPage;
