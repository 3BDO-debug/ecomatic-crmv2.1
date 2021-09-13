import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
// material
import {
  Container,
  Box,
  Card,
  Grid,
  TextField,
  Autocomplete,
  FormHelperText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// form schema
import {
  createClientFormDefaults,
  createClientFormValidationSchema
} from '../../../utils/formValidationSchemas/createClientPage';
// utils
import {
  citiesDataCreator,
  regionsDataCreator,
  clientsCategoriesDataCreator
} from '../../../utils/mock-data/configurations';
import { clientsAdder, clientLookup } from '../../../APIs/customerService/clients';
// context
import { ClientsContext, ConfigurationsContext } from '../../../contexts';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { MIconButton } from '../../../components/@material-extend';

function CreateClientPage() {
  const { translate } = useLocales();
  const navigate = useNavigate();
  const { themeStretch } = useSettings();
  const [clientExistAlert, triggerClientExistAlert] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const setClients = useContext(ClientsContext).clientsState[1];
  const cities = useContext(ConfigurationsContext).citiesState[0];
  const regions = useContext(ConfigurationsContext).regionsState[0];
  const [filteredRegions, setFilteredRegions] = useState([]);
  const clientsCategories = useContext(ConfigurationsContext).clientsCategoriesState[0];
  const [lookedUpClient, setLookedUpClient] = useState(0);
  const formik = useFormik({
    initialValues: createClientFormDefaults,
    validationSchema: createClientFormValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      await clientsAdder(values).then((clientsData) => {
        setClients(clientsData);
        const client = clientsData.find((client) => client.client_phone_number_1 === values.phoneNumber1);
        navigate(`/dashboard/clients/client-profile/${client.id}`);

        enqueueSnackbar('Client added', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
      resetForm();
    }
  });
  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    setFilteredRegions(regions.filter((region) => region.related_city === values.city));
  }, [values.city, regions]);
  useEffect(() => {
    const data = new FormData();

    data.append('clientPhoneNumberOrLandline', values.phoneNumber1);
    clientLookup(data)
      .then((response) => {
        if (response.client_exist) {
          setLookedUpClient(response.client_id);
          triggerClientExistAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [values.phoneNumber1]);

  useEffect(() => {
    const data = new FormData();

    data.append('clientPhoneNumberOrLandline', values.phoneNumber2);
    clientLookup(data)
      .then((response) => {
        if (response.client_exist) {
          setLookedUpClient(response.client_id);
          triggerClientExistAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [values.phoneNumber2]);

  useEffect(() => {
    const data = new FormData();

    data.append('clientPhoneNumberOrLandline', values.landline);
    clientLookup(data)
      .then((response) => {
        if (response.client_exist) {
          setLookedUpClient(response.client_id);
          triggerClientExistAlert(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [values.landline]);
  return (
    <Page title="Clients | Create client">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('clientsPages.createClientPage.headerBreadcrumb.header')}
          links={[
            { name: translate('clientsPages.createClientPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('clientsPages.createClientPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.customerService.clients.root
            },
            { name: translate('clientsPages.createClientPage.headerBreadcrumb.links.current') }
          ]}
        />
        <Card>
          <Box component="form" padding="30px">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  autoFocus
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.fullname')}
                  {...getFieldProps('fullname')}
                  onChange={(event) => setFieldValue('fullname', event.target.value)}
                  value={values.fullname}
                  error={Boolean(touched.fullname && errors.fullname)}
                  helperText={touched.fullname && errors.fullname}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.phoneNumber1')}
                  {...getFieldProps('phoneNumber1')}
                  onChange={(event) => setFieldValue('phoneNumber1', event.target.value)}
                  value={values.phoneNumber1}
                  error={Boolean(touched.phoneNumber1 && errors.phoneNumber1)}
                  helperText={touched.phoneNumber1 && errors.phoneNumber1}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.phoneNumber2')}
                  {...getFieldProps('phoneNumber2')}
                  onChange={(event) => setFieldValue('phoneNumber2', event.target.value)}
                  value={values.phoneNumber2}
                  error={Boolean(touched.phoneNumber2 && errors.phoneNumber2)}
                  helperText={touched.phoneNumber2 && errors.phoneNumber2}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.landline')}
                  {...getFieldProps('landline')}
                  onChange={(event) => setFieldValue('landline', event.target.value)}
                  value={values.landline}
                  error={Boolean(touched.landline && errors.landline)}
                  helperText={touched.landline && errors.landline}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  fullWidth
                  options={citiesDataCreator(cities)}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('city', value == null ? 'none' : value.id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={translate('clientsPages.createClientPage.createClientForm.city')}
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
                  options={
                    filteredRegions.length !== 0 ? regionsDataCreator(filteredRegions) : regionsDataCreator(regions)
                  }
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('region', value == null ? 'none' : value.id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={translate('clientsPages.createClientPage.createClientForm.region')}
                      margin="none"
                      error={Boolean(touched.region && errors.region)}
                      helperText={touched.region && errors.region}
                    />
                  )}
                />
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.region}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.address')}
                  {...getFieldProps('address')}
                  onChange={(event) => setFieldValue('address', event.target.value)}
                  value={values.address}
                  error={Boolean(touched.address && errors.address)}
                  helperText={touched.address && errors.address}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.buildingNo')}
                  {...getFieldProps('buildingNo')}
                  onChange={(event) => setFieldValue('buildingNo', event.target.value)}
                  value={values.buildingNo}
                  error={Boolean(touched.buildingNo && errors.buildingNo)}
                  helperText={touched.buildingNo && errors.buildingNo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.floorNo')}
                  {...getFieldProps('floorNo')}
                  onChange={(event) => setFieldValue('floorNo', event.target.value)}
                  value={values.floorNo}
                  error={Boolean(touched.floorNo && errors.floorNo)}
                  helperText={touched.floorNo && errors.floorNo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={4} lg={4}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.apartmentNo')}
                  {...getFieldProps('apartmentNo')}
                  onChange={(event) => setFieldValue('apartmentNo', event.target.value)}
                  value={values.apartmentNo}
                  error={Boolean(touched.apartmentNo && errors.apartmentNo)}
                  helperText={touched.apartmentNo && errors.apartmentNo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label={translate('clientsPages.createClientPage.createClientForm.landmark')}
                  {...getFieldProps('landmark')}
                  onChange={(event) => setFieldValue('landmark', event.target.value)}
                  value={values.landmark}
                  error={Boolean(touched.landmark && errors.landmark)}
                  helperText={touched.landmark && errors.landmark}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  fullWidth
                  options={clientsCategoriesDataCreator(clientsCategories)}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('category', value == null ? 'none' : value.id);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={translate('clientsPages.createClientPage.createClientForm.category')}
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
                  {translate('clientsPages.createClientPage.createClientForm.actionButton')}
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Card>
        {/* Client exist alert */}
        <Dialog open={clientExistAlert} onClose={() => triggerClientExistAlert(false)}>
          <DialogTitle>{translate('clientsPages.createClientPage.clientExistAlert.title')}</DialogTitle>
          <DialogContent>
            <DialogContentText>{translate('clientsPages.createClientPage.clientExistAlert.body')}</DialogContentText>
            <DialogActions>
              <Button color="error" onClose={() => triggerClientExistAlert(false)}>
                {translate('clientsPages.createClientPage.clientExistAlert.cancelButton')}
              </Button>
              <Button
                variant="text"
                onClick={() => navigate(`/dashboard/clients/client-profile/${lookedUpClient}`)}
                autoFocus
              >
                {translate('clientsPages.createClientPage.clientExistAlert.actionButton')}
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </Container>
    </Page>
  );
}

export default CreateClientPage;
