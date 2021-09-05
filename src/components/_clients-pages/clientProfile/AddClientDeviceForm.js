import React, { useState, useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
// material
import { Grid, Box, TextField, Autocomplete, FormHelperText } from '@material-ui/core';
import { MobileDatePicker } from '@material-ui/lab';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { expectedWarrantyStartDateCalc, warrantyStatusChecker } from '../../../APIs/helpers';
import { feedingSourcesDataCreator } from '../../../utils/mock-data/customerService/clients';
// context
import { ItemsContext, ConfigurationsContext } from '../../../contexts';
// components
import Question from './Question';
import AnimatedSection from './AnimatedSection';
import { UploadSingleFile } from '../../upload';
import StyledLabel from '../../@material-extend/StyledLabel';
import AddDistributorForm from './AddDistributorForm';
import DeviceNotice from './DeviceNotice';
import FeedingSourceNotice from './FeedingSourceNotice';

AddClientDeviceForm.propTypes = {
  formik: PropTypes.object
};

function AddClientDeviceForm({ formik }) {
  const { translate } = useLocales();
  const { errors, values, touched, handleSubmit, setFieldValue, getFieldProps } = formik;
  const items = useContext(ItemsContext).itemsState[0];
  const branches = useContext(ConfigurationsContext).branchesState[0];
  const distributors = useContext(ConfigurationsContext).distributorsState[0];
  const [feedingSources, setFeedingSources] = useState([]);
  const [itemWarrantyCoverage, setItemWarrantyCoverage] = useState('');
  const [purchasingInvoiceQuestion, triggerPurchasingInvoiceQuestion] = useState(false);
  const [purchasingDateSection, triggerPurchasingDateSection] = useState(false);
  const [deviceInstallationQuestion, triggerDeviceInstallationQuestion] = useState(false);
  const [expectedWarrantyStartDateSection, triggerExpectedWarrantyStartDateSection] = useState(false);
  const [deviceInstallationThroughCompanyQuestion, triggerDeviceInstallationThroughCompanyQuestion] = useState(false);
  const [installationDateSection, triggerInstallationDateSection] = useState(false);
  const [resetOfForm, triggerResetOfForm] = useState(false);
  const [distributorForm, triggerDistributorForm] = useState(false);
  const [deviceNotice, triggerDeviceNotice] = useState(false);
  const [feedingSourceNotice, triggerFeedingSourceNotice] = useState(false);
  const [deviceInvoiceOrManufacturingLabel, setDeviceInvoiceOrManufacturingLabel] = useState({});
  const handleFileDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setDeviceInvoiceOrManufacturingLabel({
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFieldValue('deviceInvoiceOrManufacturingLabel', file);
      }
    },
    [setFieldValue]
  );
  const deviceInstallationQuestionNoHandler = () => {
    triggerDeviceInstallationQuestion(!deviceInstallationQuestion);
    if (
      values.purchasingInvoice &&
      Math.ceil(Math.abs(new Date() - values.purchasingDate) / (1000 * 60 * 60 * 24)) > 60
    ) {
      const data = new FormData();
      data.append('invoiceAvailabe', 'true');
      data.append(
        'date',
        [
          values.purchasingDate.getFullYear(),
          `0 ${values.purchasingDate.getMonth() + 1}`.slice(-2),
          `0 ${values.purchasingDate.getDate()}`.slice(-2)
        ].join('-')
      );
      expectedWarrantyStartDateCalc(data)
        .then((calcResponse) => {
          setFieldValue('expectedWarrantyStartDate', calcResponse.expected_warranty_start_date);
          triggerExpectedWarrantyStartDateSection(true);
        })
        .catch((error) => console.log(error));
    } else if (
      !values.purchasingInvoice &&
      Math.ceil(Math.abs(new Date() - values.manufacturingDate) / (1000 * 60 * 60 * 24)) > 90
    ) {
      const data = new FormData();
      data.append('invoiceAvailabe', '');
      data.append(
        'date',
        [
          values.manufacturingDate.getFullYear(),
          `0 ${values.manufacturingDate.getMonth() + 1}`.slice(-2),
          `0 ${values.manufacturingDate.getDate()}`.slice(-2)
        ].join('-')
      );
      expectedWarrantyStartDateCalc(data)
        .then((calcResponse) => {
          setFieldValue('expectedWarrantyStartDate', calcResponse.expected_warranty_start_date);
          triggerExpectedWarrantyStartDateSection(true);
        })
        .catch((error) => console.log(error));
    }
    triggerResetOfForm(true);
  };

  const installationDateHandler = (newValue) => {
    setFieldValue('installationDate', newValue);
    const data = new FormData();
    data.append(
      'installationDate',
      [newValue.getFullYear(), `0 ${newValue.getMonth() + 1}`.slice(-2), `0 ${newValue.getDate()}`.slice(-2)].join('-')
    );
    data.append('itemWarrantyCoverage', itemWarrantyCoverage);
    warrantyStatusChecker(data)
      .then((warrantyStatusResponse) => {
        setFieldValue('warrantyStatus', warrantyStatusResponse.in_warranty);
        triggerResetOfForm(true);
      })
      .catch((error) => console.log(error));
  };

  return (
    <Box component="form" onSubmit={handleSubmit} padding="30px">
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Autocomplete
            fullWidth
            options={items.map((item) => ({ label: item.item_model_number, id: item.id }))}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => {
              if (value !== null) {
                setFieldValue('device', value.id);
                triggerDeviceNotice(true);
                setItemWarrantyCoverage(items.find((item) => item.id === value.id).warranty_coverage);
                setFeedingSources(feedingSourcesDataCreator(items.find((item) => item.id === value.id).category));
              }
            }}
            renderInput={(params) => (
              <TextField
                autoFocus
                {...params}
                {...getFieldProps('device')}
                label={translate('clientProfilePage.addClientDeviceForm.deviceModelNumber')}
                margin="none"
                error={Boolean(touched.device && errors.device)}
                helperText={touched.device && errors.device}
              />
            )}
          />
          <DeviceNotice formik={formik} isTriggered={deviceNotice} triggerHandler={() => triggerDeviceNotice(false)} />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6}>
          <Autocomplete
            fullWidth
            options={feedingSources}
            getOptionLabel={(option) => option.label}
            onChange={(event, value) => {
              setFieldValue('feedingSource', value == null ? 'none' : value.label);
              triggerFeedingSourceNotice(true);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                {...getFieldProps('feedingSource')}
                label={translate('clientProfilePage.addClientDeviceForm.feedingSource')}
                margin="none"
                error={Boolean(touched.feedingSource && errors.feedingSource)}
                helperText={touched.feedingSource && errors.feedingSource}
              />
            )}
          />
          <FeedingSourceNotice
            isTriggered={feedingSourceNotice}
            triggerHandler={() => triggerFeedingSourceNotice(false)}
            formik={formik}
          />
        </Grid>
        {!purchasingInvoiceQuestion && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Question
              isTriggered={purchasingInvoiceQuestion}
              onYesHandler={() => {
                triggerPurchasingInvoiceQuestion(true);
                setFieldValue('purchasingInvoice', true);
                triggerPurchasingDateSection(true);
              }}
              quesiton={translate('clientProfilePage.addClientDeviceForm.purchasingInvoiceQuestion.question')}
              onNoHandler={() => {
                triggerPurchasingInvoiceQuestion(true);
                setFieldValue('purchasingInvoice', false);
                triggerPurchasingDateSection(true);
              }}
            />
          </Grid>
        )}
        {purchasingDateSection && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <AnimatedSection isTriggered={purchasingDateSection}>
              {values.purchasingInvoice ? (
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.addClientDeviceForm.purchasingDate')}
                  value={values.purchasingDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    setFieldValue('purchasingDate', newValue);
                    triggerDeviceInstallationQuestion(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label="Purchasing Date"
                      margin="normal"
                      helperText={touched.purchasingDate && errors.purchasingDate}
                    />
                  )}
                />
              ) : (
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.addClientDeviceForm.manufacturingDate')}
                  value={values.manufacturingDate}
                  inputFormat="dd/MM/yyyy"
                  onChange={(newValue) => {
                    setFieldValue('manufacturingDate', newValue);
                    triggerDeviceInstallationQuestion(true);
                  }}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.addClientDeviceForm.manufacturingDate')}
                      margin="normal"
                      helperText={touched.manufacturingDate && errors.manufacturingDate}
                    />
                  )}
                />
              )}
            </AnimatedSection>
          </Grid>
        )}
        {deviceInstallationQuestion && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Question
              quesiton={translate('clientProfilePage.addClientDeviceForm.deviceInstallationQuestion.question')}
              isTriggered={!deviceInstallationQuestion}
              onYesHandler={() => {
                triggerDeviceInstallationQuestion(!deviceInstallationQuestion);
                triggerDeviceInstallationThroughCompanyQuestion(true);
              }}
              onNoHandler={deviceInstallationQuestionNoHandler}
            />
          </Grid>
        )}
        {expectedWarrantyStartDateSection && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <AnimatedSection isTriggered={expectedWarrantyStartDateSection}>
              <MobileDatePicker
                orientation="portrait"
                label={translate('clientProfilePage.addClientDeviceForm.expectedWarrantyStartDate')}
                inputFormat="dd/MM/yyyy"
                value={values.expectedWarrantyStartDate}
                renderInput={(params) => (
                  <TextField
                    fullWidth
                    {...params}
                    label={translate('clientProfilePage.addClientDeviceForm.expectedWarrantyStartDate')}
                    margin="normal"
                  />
                )}
              />
            </AnimatedSection>
          </Grid>
        )}
        {deviceInstallationThroughCompanyQuestion && (
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Question
              quesiton={translate(
                'clientProfilePage.addClientDeviceForm.deviceIntallationThroughCompanyQuestion.question'
              )}
              isTriggered={!deviceInstallationThroughCompanyQuestion}
              onYesHandler={() => {
                triggerDeviceInstallationThroughCompanyQuestion(!deviceInstallationThroughCompanyQuestion);
                triggerInstallationDateSection(true);
                setFieldValue('installedThroughTheCompany', true);
              }}
              onNoHandler={() => {
                triggerDeviceInstallationThroughCompanyQuestion(!deviceInstallationThroughCompanyQuestion);
                setFieldValue('warrantyStatus', false);
                triggerResetOfForm(true);
                setFieldValue('installedThroughTheCompany', '');
              }}
            />
          </Grid>
        )}
        {installationDateSection && (
          <>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <AnimatedSection isTriggered={installationDateSection}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.addClientDeviceForm.installationDate')}
                  inputFormat="dd/MM/yyyy"
                  value={values.installationDate}
                  onChange={installationDateHandler}
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.addClientDeviceForm.installationDate')}
                      margin="normal"
                      helperText={touched.installationDate && errors.installationDate}
                    />
                  )}
                />
              </AnimatedSection>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <AnimatedSection isTriggered={installationDateSection}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.addClientDeviceForm.warrantyStartDate')}
                  value={values.installationDate}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.addClientDeviceForm.warrantyStartDate')}
                      margin="normal"
                      helperText={touched.installationDate && errors.installationDate}
                    />
                  )}
                />
              </AnimatedSection>
            </Grid>
          </>
        )}
        {resetOfForm && (
          <>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <AnimatedSection isTriggered={resetOfForm}>
                <Autocomplete
                  fullWidth
                  options={branches.map((branch) => ({ label: branch.branch_name, id: branch.id }))}
                  getOptionLabel={(option) => option.label}
                  onChange={(event, value) => {
                    setFieldValue('branch', value == null ? 'none' : value.label);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...getFieldProps('branch')}
                      label={translate('clientProfilePage.addClientDeviceForm.branch')}
                      margin="none"
                      error={Boolean(touched.branch && errors.branch)}
                      helperText={touched.branch && errors.branch}
                    />
                  )}
                />
              </AnimatedSection>
            </Grid>
            {values.branch === 'other' && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <AnimatedSection isTriggered={resetOfForm}>
                  <Autocomplete
                    fullWidth
                    options={distributors.map((distributor) => ({
                      label: distributor.distributor_name,
                      id: distributor.id
                    }))}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, value) => {
                      setFieldValue('distributor', value == null ? 'none' : value.label);
                      if (value.label === 'other') {
                        triggerDistributorForm(true);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        {...getFieldProps('distributor')}
                        label={translate('clientProfilePage.addClientDeviceForm.distributor')}
                        margin="none"
                        error={Boolean(touched.distributor && errors.distributor)}
                        helperText={touched.distributor && errors.distributor}
                      />
                    )}
                  />
                </AnimatedSection>
                <AddDistributorForm
                  isTriggered={distributorForm}
                  triggerHandler={() => triggerDistributorForm(false)}
                  formik={formik}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <AnimatedSection isTriggered={resetOfForm}>
                <StyledLabel>Device invoice or manufacturing label</StyledLabel>
                <UploadSingleFile file={deviceInvoiceOrManufacturingLabel} onDrop={handleFileDrop} />
                <FormHelperText error sx={{ px: 2 }}>
                  {touched.deviceInvoiceOrManufacturingLabel && errors.deviceInvoiceOrManufacturingLabel}
                </FormHelperText>
              </AnimatedSection>
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}

export default AddClientDeviceForm;
