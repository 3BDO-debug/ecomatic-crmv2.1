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
import { cookerAdder, cookerFetcher } from '../../APIs/installationRequirements';
// components
import { MIconButton } from '../@material-extend';

Cooker.propTypes = {
  feedingSource: PropTypes.string,
  modelNumber: PropTypes.string,
  clientName: PropTypes.string,
  technicainName: PropTypes.string,
  reviewMode: PropTypes.bool,
  submitState: PropTypes.array,
  deviceId: PropTypes.number
};

function Cooker({ feedingSource, modelNumber, deviceId, technicainName, clientName, reviewMode, submitState }) {
  const { translate } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [installationRequirementsDetails, setInstallationRequirementsDetails] = useState({});
  const [submit, setSubmit] = submitState;

  const formik = useFormik({
    initialValues: {
      cookerModelNumber: modelNumber,
      gasType: feedingSource,
      gasPressure: '',
      cookerFoniaNumber: '',
      grillFoniaNumber: '',
      stabilizerType: '',
      whatsDoneByTechnician: '',
      cookerFinalCondition: '',
      clientSignature: clientName,
      technicianName: technicainName
    },
    onSubmit: async () => {
      await submitHandler();
    }
  });
  const { values, setFieldValue } = formik;

  const submitHandler = useCallback(() => {
    if (submit && !reviewMode) {
      cookerAdder(deviceId, values)
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
      cookerFetcher(deviceId)
        .then((response) => {
          setInstallationRequirementsDetails(response);
        })
        .catch((error) => console.log(error));
    }
  }, [deviceId, reviewMode]);

  useEffect(() => {
    if (submit && !reviewMode) {
      submitHandler();
    }
  }, [submit, reviewMode, submitHandler]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.modelNumber')}
          value={modelNumber}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.feedingSource')}
          value={feedingSource}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4} lg={4}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.gasPressure')}
          value={reviewMode ? installationRequirementsDetails.gas_pressure : values.gasPressure}
          onChange={(event) => setFieldValue('gasPressure', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      {feedingSource !== 'Natural Gas' && (
        <Grid item xs={12} sm={12} md={12} lg={12}>
          {reviewMode ? (
            <TextField
              label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.stabillizerType')}
              value={installationRequirementsDetails.stabilizer_type}
              fullWidth
              focused={reviewMode}
            />
          ) : (
            <TextField
              select
              label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.stabillizerType')}
              value={values.stabilizerType}
              onChange={(event) => setFieldValue('stabilizerType', event.target.value)}
              fullWidth
            >
              <MenuItem value="with pulley">With pulley</MenuItem>
              <MenuItem value="without pulley">Without pulley</MenuItem>
            </TextField>
          )}
        </Grid>
      )}
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.foniaNumber')}
          value={reviewMode ? installationRequirementsDetails.cooker_fonia_number : values.cookerFoniaNumber}
          onChange={(event) => setFieldValue('cookerFoniaNumber', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.grillFoniaNumber')}
          value={reviewMode ? installationRequirementsDetails.grill_fonia_number : values.grillFoniaNumber}
          onChange={(event) => setFieldValue('grillFoniaNumber', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.technicianAction')}
          value={
            reviewMode ? installationRequirementsDetails.whats_done_by_the_technician : values.whatsDoneByTechnician
          }
          onChange={(event) => setFieldValue('whatsDoneByTechnician', event.target.value)}
          fullWidth
          focused={reviewMode}
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.deviceCondition')}
          value={reviewMode ? installationRequirementsDetails.cooker_final_condition : values.cookerFinalCondition}
          onChange={(event) => setFieldValue('cookerFinalCondition', event.target.value)}
          fullWidth
          focused={reviewMode}
          multiline
          rows={3}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.clientSignature')}
          value={clientName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.cookerForm.technicianName')}
          value={technicainName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
    </Grid>
  );
}

export default Cooker;
