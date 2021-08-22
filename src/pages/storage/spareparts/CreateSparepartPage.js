import React, { useCallback } from 'react';
import { useFormik } from 'formik';
// material
import { Card, Container, Box, Grid, Autocomplete, TextField, FormHelperText } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// form schema
import {
  createSparepartFormDefaults,
  createSparepartFormValidationSchema
} from '../../../utils/formValidationSchemas/createSparepartPage';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import { UploadSingleFile } from '../../../components/upload';
import StyledLabel from '../../../components/@material-extend/StyledLabel';

function CreateSparepartPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const formik = useFormik({
    initialValues: createSparepartFormDefaults,
    validationSchema: createSparepartFormValidationSchema,
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
  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setFieldValue('image', {
          ...file,
          preview: URL.createObjectURL(file)
        });
      }
    },
    [setFieldValue]
  );
  return (
    <Page title="Spareparts | Create sparepart">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('sparepartsPages.createSparepartPage.headerBreadcrumb.header')}
          links={[
            {
              name: translate('sparepartsPages.createSparepartPage.headerBreadcrumb.links.root'),
              href: PATH_DASHBOARD.root
            },
            {
              name: translate('sparepartsPages.createSparepartPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.storage.spareparts.root
            },
            { name: translate('sparepartsPages.createSparepartPage.headerBreadcrumb.links.current') }
          ]}
        />
        <Card>
          <Box component="form" padding="30px">
            <Grid container spacing={3}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  fullWidth
                  autoFocus
                  options={[{ label: 'hello', id: 1 }]}
                  getOptionLabel={(option) => option.label}
                  {...getFieldProps('warehouse')}
                  onChange={(event) => {
                    setFieldValue('warehouse', event.target.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={translate('sparepartsPages.createSparepartPage.createSparepartForm.warehouse')}
                      margin="none"
                      autoFocus
                      error={Boolean(touched.warehouse && errors.warehouse)}
                      helperText={touched.warehouse && errors.warehouse}
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
                  label={translate('sparepartsPages.createSparepartPage.createSparepartForm.modelNumber')}
                  {...getFieldProps('modelNumber')}
                  error={Boolean(touched.modelNumber && errors.modelNumber)}
                  helperText={touched.modelNumber && errors.modelNumber}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label={translate('sparepartsPages.createSparepartPage.createSparepartForm.pricePerUnit')}
                  {...getFieldProps('pricePerUnit')}
                  error={Boolean(touched.pricePerUnit && errors.pricePerUnit)}
                  helperText={touched.pricePerUnit && errors.pricePerUnit}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label={translate('sparepartsPages.createSparepartPage.createSparepartForm.availableQTY')}
                  {...getFieldProps('availableQTY')}
                  error={Boolean(touched.availableQTY && errors.availableQTY)}
                  helperText={touched.availableQTY && errors.availableQTY}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <StyledLabel>{translate('sparepartsPages.createSparepartPage.createSparepartForm.image')}</StyledLabel>
                <UploadSingleFile
                  maxSize={3145728}
                  accept="image/*"
                  file={values.image}
                  onDrop={handleDrop}
                  error={Boolean(touched.image && errors.image)}
                />
                <FormHelperText error sx={{ px: 2 }}>
                  {touched.image && errors.image}
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
                  {translate('sparepartsPages.createSparepartPage.createSparepartForm.actionButton')}
                </LoadingButton>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export default CreateSparepartPage;
