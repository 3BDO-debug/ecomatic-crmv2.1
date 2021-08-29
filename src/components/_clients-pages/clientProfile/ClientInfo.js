import React, { useContext, useEffect, useState } from 'react';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
// material
import { Box, Card, Grid, FormHelperText, Autocomplete, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// form schema
import {
  clientInfoFormDefaults,
  clientInfoFormValidationSchema
} from '../../../utils/formValidationSchemas/clientInfo';
// context
import { ConfigurationsContext } from '../../../contexts';
// utils
import {
  citiesDataCreator,
  regionsDataCreator,
  clientsCategoriesDataCreator
} from '../../../utils/mock-data/configurations';
import { clientDataUpdater } from '../../../APIs/customerService/clients';
// components
import { MIconButton } from '../../@material-extend';

ClientInfo.propTypes = {
  clientDataState: PropTypes.array,
  clientId: PropTypes.number
};

function ClientInfo({ clientDataState, clientId }) {
  const [clientData, setClientData] = clientDataState;

  const cities = useContext(ConfigurationsContext).citiesState[0];
  const regions = useContext(ConfigurationsContext).regionsState[0];
  const [filteredRegions, setFilteredRegions] = useState([]);
  const clientsCategories = useContext(ConfigurationsContext).clientsCategoriesState[0];
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: clientInfoFormDefaults(clientData),
    validationSchema: clientInfoFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { resetForm }) => {
      await clientDataUpdater(clientId, values)
        .then((clientDataResponse) => {
          setClientData(clientDataResponse);
          enqueueSnackbar('Client updated', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Client couldnt be updated ${error}`, {
            variant: 'error',
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
  return (
    <Card>
      <Box component="form" padding="30px">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              focused
              label="Full Name"
              {...getFieldProps('fullname')}
              onChange={(event) => setFieldValue('fullname', event.target.value)}
              error={Boolean(touched.fullname && errors.fullname)}
              helperText={touched.fullname && errors.fullname}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              focused
              label="Phone Number 1"
              {...getFieldProps('phoneNumber1')}
              error={Boolean(touched.phoneNumber1 && errors.phoneNumber1)}
              helperText={touched.phoneNumber1 && errors.phoneNumber1}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              focused
              label="Phone Number 2"
              {...getFieldProps('phoneNumber2')}
              error={Boolean(touched.phoneNumber2 && errors.phoneNumber2)}
              helperText={touched.phoneNumber2 && errors.phoneNumber2}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              focused
              label="Landline"
              {...getFieldProps('landline')}
              error={Boolean(touched.landline && errors.landline)}
              helperText={touched.landline && errors.landline}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <Autocomplete
              fullWidth
              focused
              options={citiesDataCreator(cities)}
              defaultValue={citiesDataCreator(cities).find((city) => city.id === values.city)}
              getOptionLabel={(option) => option.label}
              onChange={(event, value) => {
                setFieldValue('city', value == null ? 'none' : value.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  margin="none"
                  focused
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
              focused
              options={filteredRegions.length !== 0 ? regionsDataCreator(filteredRegions) : regionsDataCreator(regions)}
              getOptionLabel={(option) => option.label}
              defaultValue={regionsDataCreator(regions).find((region) => region.id === values.region)}
              onChange={(event, value) => {
                setFieldValue('region', value == null ? 'none' : value.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Region"
                  focused
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
              focused
              label="Address"
              {...getFieldProps('address')}
              error={Boolean(touched.address && errors.address)}
              helperText={touched.address && errors.address}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              focused
              label="Building no"
              {...getFieldProps('buildingNo')}
              error={Boolean(touched.buildingNo && errors.buildingNo)}
              helperText={touched.buildingNo && errors.buildingNo}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              focused
              label="Floor no"
              {...getFieldProps('floorNo')}
              error={Boolean(touched.floorNo && errors.floorNo)}
              helperText={touched.floorNo && errors.floorNo}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              fullWidth
              focused
              label="Apartment no"
              {...getFieldProps('apartmentNo')}
              error={Boolean(touched.apartmentNo && errors.apartmentNo)}
              helperText={touched.apartmentNo && errors.apartmentNo}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              fullWidth
              focused
              label="Landmark"
              {...getFieldProps('landmark')}
              error={Boolean(touched.landmark && errors.landmark)}
              helperText={touched.landmark && errors.landmark}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Autocomplete
              fullWidth
              focused
              options={clientsCategoriesDataCreator(clientsCategories)}
              getOptionLabel={(option) => option.label}
              defaultValue={clientsCategoriesDataCreator(clientsCategories).find(
                (clientCategory) => clientCategory.id === values.category
              )}
              onChange={(event, value) => {
                setFieldValue('category', value == null ? 'none' : value.id);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="category"
                  margin="none"
                  focused
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
              Update
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
}

export default ClientInfo;
