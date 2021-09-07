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
import { slimHobAdder, slimHobFetcher } from '../../APIs/installationRequirements';
// components
import { MIconButton } from '../@material-extend';

SlimHob.propTypes = {
  feedingSource: PropTypes.string,
  modelNumber: PropTypes.string,
  clientName: PropTypes.string,
  technicainName: PropTypes.string,
  reviewMode: PropTypes.bool,
  submitState: PropTypes.array,
  deviceId: PropTypes.number
};

function SlimHob({ feedingSource, modelNumber, deviceId, technicainName, clientName, reviewMode, submitState }) {
  const { translate } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [installationRequirementsDetails, setInstallationRequirementsDetails] = useState({});
  const [submit, setSubmit] = submitState;

  const formik = useFormik({
    initialValues: {
      slimHobModelNumber: modelNumber,
      gasType: feedingSource,
      gasPressure: '',
      marbleOpeningHoleIsAvailable: '',
      marbleOpeningHoleMeasurements: '',
      stabilizerType: '',
      whatsDoneByTechnician: '',
      slimHobFinalCondition: '',
      clientSignature: clientName,
      technicianName: technicainName
    },
    onSubmit: async () => {
      await submitHandler();
    }
  });
  const { setFieldValue, values } = formik;

  const submitHandler = useCallback(() => {
    if (submit && !reviewMode) {
      slimHobAdder(deviceId, values)
        .then(() => {
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
  }, [closeSnackbar, deviceId, enqueueSnackbar, reviewMode, setSubmit, submit, values]);

  useEffect(() => {
    if (reviewMode) {
      slimHobFetcher(deviceId)
        .then((response) => {
          setInstallationRequirementsDetails(response);
        })
        .catch((error) => console.log(error));
    }
  }, [deviceId, reviewMode]);

  useEffect(() => {
    if (submit && !reviewMode) {
      console.log('fdsf');
      submitHandler();
    }
  }, [submit, reviewMode, submitHandler]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.clientSignature')}
          value={modelNumber}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.feedingSource')}
          value={feedingSource}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.gasPressure')}
          value={reviewMode ? installationRequirementsDetails.gas_pressure : values.gasPressure}
          onChange={(event) => setFieldValue('gasPressure', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        {reviewMode ? (
          <TextField
            label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.marbelOpeningAvailabilty')}
            value={installationRequirementsDetails.marble_opening_hole_is_available ? 'Yes' : 'No'}
            fullWidth
            focused={reviewMode}
          />
        ) : (
          <TextField
            select
            label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.marbelOpeningAvailabilty')}
            value={values.marbleOpeningHoleIsAvailable}
            onChange={(event) => setFieldValue('marbleOpeningHoleIsAvailable', event.target.value)}
            fullWidth
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.openingMeasurements')}
          value={
            reviewMode
              ? installationRequirementsDetails.marble_opening_hole_measurements
              : values.marbleOpeningHoleMeasurements
          }
          onChange={(event) => setFieldValue('marbleOpeningHoleMeasurements', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {reviewMode ? (
          <TextField
            label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.stabillizerType')}
            value={installationRequirementsDetails.stabilizer_type}
            fullWidth
            focused={reviewMode}
          />
        ) : (
          <TextField
            select
            label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.stabillizerType')}
            value={values.stabilizerType}
            onChange={(event) => setFieldValue('stabilizerType', event.target.value)}
            fullWidth
          >
            <MenuItem value="with pulley">With pulley</MenuItem>
            <MenuItem value="without pulley">Without pulley</MenuItem>
          </TextField>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          multiline
          rows={3}
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.technicianAction')}
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
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.deviceCondition')}
          value={reviewMode ? installationRequirementsDetails.slim_hob_final_condition : values.slimHobFinalCondition}
          onChange={(event) => setFieldValue('slimHobFinalCondition', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.clientSignature')}
          value={clientName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.slimHobForm.technicianName')}
          value={technicainName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
    </Grid>
  );
}

export default SlimHob;
