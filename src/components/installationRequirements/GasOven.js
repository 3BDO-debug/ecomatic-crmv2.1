import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Grid, TextField, MenuItem } from '@material-ui/core';
// hooks
import useLocales from '../../hooks/useLocales';
// utils
import { gasOvenAdder, gasOvenFetcher } from '../../APIs/installationRequirements';
// components
import { MIconButton } from '../@material-extend';

GasOven.propTypes = {
  feedingSource: PropTypes.string,
  modelNumber: PropTypes.string,
  clientName: PropTypes.string,
  technicainName: PropTypes.string,
  reviewMode: PropTypes.bool,
  submitState: PropTypes.array,
  deviceId: PropTypes.number
};
function GasOven({ feedingSource, modelNumber, deviceId, technicainName, clientName, reviewMode, submitState }) {
  const { translate } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [installationRequirementsDetails, setInstallationRequirementsDetails] = useState({});
  const [submit, setSubmit] = submitState;

  const submitHandler = useCallback(() => {
    if (submit && !reviewMode) {
      gasOvenAdder(deviceId, values)
        .then((response) => {
          console.log(response);
          setSubmit(false);

          enqueueSnackbar('Done', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => console.log(error));
    }
  }, [closeSnackbar, enqueueSnackbar, deviceId, reviewMode, setSubmit, submit, values]);

  useEffect(() => {
    if (reviewMode) {
      gasOvenFetcher(deviceId)
        .then((response) => {
          setInstallationRequirementsDetails(response);
        })
        .catch((error) => console.log(error));
    }
  }, [submit, reviewMode, submitHandler, deviceId]);
  useEffect(() => {
    if (submit && !reviewMode) {
      submitHandler();
    }
  }, [submit, reviewMode, submitHandler]);

  const formik = useFormik({
    initialValues: {
      gasOvenModelNumber: modelNumber,
      gasType: feedingSource,
      gasPressure: '',
      ventillationOpeningBelowOvenIsAvailable: '',
      ventillationOpeningBelowOvenMeasurements: '',
      ventillationOpeningInFrontOfOvenIsAvailable: '',
      ventillationOpeningInFrontOfOvenMeasurements: '',
      stabilizerType: '',
      gasOvenFoniaNumber: '',
      grillFoniaNumber: '',
      whatsDoneByTechnician: '',
      gasOvenFinalCondition: '',
      clientSignature: clientName,
      technicianName: technicainName
    },
    onSubmit: async () => {
      await submitHandler();
    }
  });
  const { values, setFieldValue } = formik;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.modelNumber')}
          value={modelNumber}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.feedingSource')}
          value={feedingSource}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.gasPressure')}
          value={reviewMode ? installationRequirementsDetails.gas_pressure : values.gasPressure}
          onChange={(event) => setFieldValue('gasPressure', event.target.value)}
          focused={reviewMode}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        {reviewMode ? (
          <TextField
            label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.belowVentillation')}
            value={installationRequirementsDetails.ventillation_opening_below_oven_is_available ? 'Yes' : 'No'}
            fullWidth
            focused={reviewMode}
          />
        ) : (
          <TextField
            select
            label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.belowVentillation')}
            onChange={(event) => setFieldValue('ventillationOpeningBelowOvenIsAvailable', event.target.value)}
            fullWidth
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.belowVentillationMeasurements')}
          value={
            reviewMode
              ? installationRequirementsDetails.ventillation_opening_below_oven_measurements
              : values.ventillationOpeningBelowOvenMeasurements
          }
          onChange={(event) => setFieldValue('ventillationOpeningBelowOvenMeasurements', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        {reviewMode ? (
          <TextField
            label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.frontVentillation')}
            value={installationRequirementsDetails.ventillation_opening_in_front_of_oven_is_available ? 'yes' : 'no'}
            focused={reviewMode}
            fullWidth
          />
        ) : (
          <TextField
            select
            label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.frontVentillation')}
            value={values.ventillationOpeningInFrontOfOvenIsAvailable}
            onChange={(event) => setFieldValue('ventillationOpeningInFrontOfOvenIsAvailable', event.target.value)}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.frontVentillationMeasurements')}
          value={
            reviewMode
              ? installationRequirementsDetails.ventillation_opening_in_front_of_oven_measurements
              : values.ventillationOpeningInFrontOfOvenMeasurements
          }
          onChange={(event) => setFieldValue('ventillationOpeningInFrontOfOvenMeasurements', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {reviewMode ? (
          <TextField
            label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.stabillizerType')}
            value={installationRequirementsDetails.stabilizer_type}
            focused={reviewMode}
            fullWidth
          />
        ) : (
          <TextField
            select
            label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.stabillizerType')}
            value={values.stabilizerType}
            onChange={(event) => setFieldValue('stabilizerType', event.target.value)}
            fullWidth
          >
            <MenuItem value="with pulley">With pulley</MenuItem>
            <MenuItem value="without pulley">Without pulley</MenuItem>
          </TextField>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.ovenFoniaNumber')}
          value={reviewMode ? installationRequirementsDetails.gas_oven_fonia_number : values.gasOvenFoniaNumber}
          onChange={(event) => setFieldValue('gasOvenFoniaNumber', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.grillFoniaNumber')}
          value={reviewMode ? installationRequirementsDetails.grill_fonia_number : values.grillFoniaNumber}
          onChange={(event) => setFieldValue('grillFoniaNumber', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          multiline
          rows={3}
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.technicianAction')}
          value={
            reviewMode ? installationRequirementsDetails.whats_done_by_the_technician : values.whatsDoneByTechnician
          }
          onChange={(event) => setFieldValue('whatsDoneByTechnician', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          multiline
          rows={3}
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.deviceCondition')}
          value={reviewMode ? installationRequirementsDetails.notes : values.gasOvenFinalCondition}
          onChange={(event) => setFieldValue('gasOvenFinalCondition', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.clientSignature')}
          value={clientName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.gasOvenForm.technicianName')}
          value={technicainName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
    </Grid>
  );
}

export default GasOven;
