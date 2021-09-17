import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import MaskedInput from 'react-text-mask';
// material
import { Container, Box, Card, Grid, TextField, Autocomplete, FormHelperText, Stack } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// context
import { WarehousesContext, ItemsContext, ConfigurationsContext } from '../../../contexts';
// utils
import { warehousesSelectDataCreator } from '../../../utils/mock-data/storage/warehouses';
import { brandsDataCreator, categoriesDataCreator } from '../../../utils/mock-data/configurations';
import { itemsAdder } from '../../../APIs/storage/Items';
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
import { MIconButton } from '../../../components/@material-extend';

// ----------------------------------------------------------------------

function TextMaskCustom(props) {
  const { ...other } = props;

  return <MaskedInput {...other} mask={[/\d/, /\d/, /\d/, 'x', /\d/, /\d/, /\d/, 'x', /\d/, /\d/, /\d/]} showMask />;
}

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired
};

TextMaskCustom.propTypes = {
  inputRef: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
// ----------------------------------------------------------------------

function CreateItemPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const setItems = useContext(ItemsContext).itemsState[1];
  const brands = useContext(ConfigurationsContext).brandsState[0];
  const categories = useContext(ConfigurationsContext).categoriesState[0];
  const [filteredCategories, setFilteredCategories] = useState([]);
  const warehouses = useContext(WarehousesContext).warehousesState[0];
  const formik = useFormik({
    initialValues: createItemFormDefaults,
    validationSchema: createItemFormValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      await itemsAdder(values)
        .then((itemsData) => {
          setItems(itemsData);
          enqueueSnackbar('Item added', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) =>
          enqueueSnackbar(`Couldnt add item ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          })
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

  useEffect(() => {
    const filteredCategoriesData = categories.filter((category) => category.related_brand === values.brand);
    setFilteredCategories(categoriesDataCreator(filteredCategoriesData));
  }, [values.brand, categories]);

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
                  options={warehousesSelectDataCreator(warehouses)}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('warehouse', value == null ? 'none' : value.id);
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
                  options={brandsDataCreator(brands)}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('brand', value == null ? 'none' : value.label);
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
                  options={values.brand === '' ? categoriesDataCreator(categories) : filteredCategories}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('category', value == null ? 'none' : value.label);
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
                  onChange={(event) => setFieldValue('modelNumber', event.target.value)}
                  value={values.modelNumber}
                  error={Boolean(touched.modelNumber && errors.modelNumber)}
                  helperText={touched.modelNumber && errors.modelNumber}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label={translate('itemsPages.createItemPage.createItemForm.mainDimensions')}
                  {...getFieldProps('mainDimensions')}
                  onChange={(event) => setFieldValue('mainDimensions', event.target.value)}
                  value={values.mainDimensions}
                  error={Boolean(touched.mainDimensions && errors.mainDimensions)}
                  helperText={touched.mainDimensions && errors.mainDimensions}
                  InputProps={{
                    inputComponent: TextMaskCustom
                  }}
                  focused
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  fullWidth
                  label={translate('itemsPages.createItemPage.createItemForm.cutOffDimensions')}
                  {...getFieldProps('cutOffDimensions')}
                  onChange={(event) => setFieldValue('cutOffDimensions', event.target.value)}
                  value={values.cutOffDimensions}
                  error={Boolean(touched.cutOffDimensions && errors.cutOffDimensions)}
                  helperText={touched.cutOffDimensions && errors.cutOffDimensions}
                  InputProps={{
                    inputComponent: TextMaskCustom
                  }}
                  focused
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  fullWidth
                  type="number"
                  label={translate('itemsPages.createItemPage.createItemForm.warrantyCoverage')}
                  {...getFieldProps('warrantyCoverage')}
                  onChange={(event) => setFieldValue('warrantyCoverage', event.target.value)}
                  value={values.warrantyCoverage}
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
