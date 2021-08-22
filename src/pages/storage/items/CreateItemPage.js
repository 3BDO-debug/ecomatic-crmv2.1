import React, { useCallback } from 'react';
import { useFormik } from 'formik';
// material
import { Container, Box, Card, Grid, TextField, Autocomplete, FormHelperText, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// form schema
import {
  createItemFormDefaults,
  createItemFormValidationSchema
} from '../../../utils/formValidationSchemas/createItemPage';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import StyledLabel from '../../../components/@material-extend/StyledLabel';
import { UploadSingleFile } from '../../../components/upload';

// ----------------------------------------------------------------------

function CreateItemPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const formik = useFormik({
    initialValues: createItemFormDefaults,
    validationSchema: createItemFormValidationSchema,
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
    <Page title="Items | Create Item">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={translate('itemsPages.createItemPage.headerBreadcrumb.header')}
          links={[
            { name: translate('itemsPages.createItemPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('itemsPages.createItemPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.storage.items.root
            },
            { name: translate('itemsPages.createItemPage.headerBreadcrumb.links.current') }
          ]}
        />
        <Card>
          <Box
            component="form"
            padding="30px"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit();
            }}
          >
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
                      label={translate('itemsPages.createItemPage.createItemForm.warehouse')}
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
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <Autocomplete
                  fullWidth
                  options={[{ label: 'hello', id: 1 }]}
                  getOptionLabel={(option) => option.label}
                  {...getFieldProps('brand')}
                  onChange={(event) => {
                    setFieldValue('brand', event.target.value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={translate('itemsPages.createItemPage.createItemForm.brand')}
                      margin="none"
                      error={Boolean(touched.brand && errors.brand)}
                      helperText={touched.brand && errors.brand}
                    />
                  )}
                />
                <FormHelperText sx={{ px: 2 }} error>
                  {errors.brand}
                </FormHelperText>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
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
                      label={translate('itemsPages.createItemPage.createItemForm.category')}
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
                <TextField
                  fullWidth
                  label={translate('itemsPages.createItemPage.createItemForm.modelNumber')}
                  {...getFieldProps('modelNumber')}
                  error={Boolean(touched.modelNumber && errors.modelNumber)}
                  helperText={touched.modelNumber && errors.modelNumber}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label={translate('itemsPages.createItemPage.createItemForm.mainDimensions')}
                  {...getFieldProps('mainDimensions')}
                  error={Boolean(touched.mainDimensions && errors.mainDimensions)}
                  helperText={touched.mainDimensions && errors.mainDimensions}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label={translate('itemsPages.createItemPage.createItemForm.cutOffDimensions')}
                  {...getFieldProps('cutOffDimensions')}
                  error={Boolean(touched.cutOffDimensions && errors.cutOffDimensions)}
                  helperText={touched.cutOffDimensions && errors.cutOffDimensions}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  label={translate('itemsPages.createItemPage.createItemForm.warrantyCoverage')}
                  {...getFieldProps('warrantyCoverage')}
                  error={Boolean(touched.warrantyCoverage && errors.warrantyCoverage)}
                  helperText={touched.warrantyCoverage && errors.warrantyCoverage}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Box component="div">
                  <StyledLabel>{translate('itemsPages.createItemPage.createItemForm.image')}</StyledLabel>
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
                </Box>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack row>
                  <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    disabled={!dirty}
                    onClick={handleSubmit}
                  >
                    {translate('itemsPages.createItemPage.createItemForm.actionButton')}
                  </LoadingButton>
                </Stack>
              </Grid>
            </Grid>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export default CreateItemPage;
