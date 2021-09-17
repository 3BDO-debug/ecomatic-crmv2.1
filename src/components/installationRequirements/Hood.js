import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Grid, TextField, MenuItem, Button } from '@material-ui/core';
// hooks
import useLocales from '../../hooks/useLocales';
// utils
import { hoodAdder, hoodFetcher } from '../../APIs/installationRequirements';
import { mainUrl } from '../../APIs/axios';
// components
import { MIconButton } from '../@material-extend';
import { UploadSingleFile } from '../upload';

Hood.propTypes = {
  feedingSource: PropTypes.string,
  modelNumber: PropTypes.string,
  clientName: PropTypes.string,
  technicainName: PropTypes.string,
  reviewMode: PropTypes.bool,
  submitState: PropTypes.array,
  deviceId: PropTypes.number
};
function Hood({ feedingSource, modelNumber, deviceId, technicainName, clientName, reviewMode, submitState }) {
  const { translate } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [installationRequirementsDetails, setInstallationRequirementsDetails] = useState({});
  const [submit, setSubmit] = submitState;
  const [attachment, setAttachment] = useState({});

  const formik = useFormik({
    initialValues: {
      hoodModelNumber: modelNumber,
      hoodHeight: '',
      hoodExhaustHeight: '',
      hoodExhaustIsStraight: '',
      whatsDoneByTechnician: '',
      hoodFinalCondition: '',
      clientSignature: clientName,
      technicianName: technicainName,
      attachment: null
    }
  });

  const { values, setFieldValue } = formik;

  const submitHandler = useCallback(async () => {
    if (submit && !reviewMode) {
      const data = new FormData();
      data.append('formikValues', values);
      data.append('attachment', values.attachment);
      await hoodAdder(deviceId, data)
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
      hoodFetcher(deviceId)
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

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        setAttachment({
          ...file,
          preview: URL.createObjectURL(file)
        });
        setFieldValue('attachment', file);
      }
    },
    [setFieldValue]
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.modelNumber')}
          value={modelNumber}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.feedingSource')}
          value={feedingSource}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.hoodHeight')}
          value={reviewMode ? installationRequirementsDetails.hood_height : values.hoodHeight}
          onChange={(event) => setFieldValue('hoodHeight', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.exhaustHeight')}
          value={reviewMode ? installationRequirementsDetails.hood_exhaust_height : values.hoodExhaustHeight}
          onChange={(event) => setFieldValue('hoodExhaustHeight', event.target.value)}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {reviewMode ? (
          <TextField
            label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.hoodExhaustIsStraight')}
            value={installationRequirementsDetails.hood_exhaust_is_straight ? 'Yes' : 'No'}
            fullWidth
            focused={reviewMode}
          />
        ) : (
          <TextField
            select
            label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.hoodExhaustIsStraight')}
            value={values.hoodExhaustIsStraight}
            onChange={(event) => setFieldValue('hoodExhaustIsStraight', event.target.value)}
            fullWidth
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
          </TextField>
        )}
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.technicainAction')}
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
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.deviceCondition')}
          value={reviewMode ? installationRequirementsDetails.hood_final_condition : values.hoodFinalCondition}
          onChange={(event) => setFieldValue('hoodFinalCondition', event.target.value)}
          fullWidth
          focused={reviewMode}
          multiline
          rows={3}
        />
      </Grid>

      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.clientSignature')}
          value={clientName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={6} lg={6}>
        <TextField
          label={translate('ticketDetailsPage.installationRequirementsForms.hoodForm.technicianName')}
          value={technicainName}
          fullWidth
          focused={reviewMode}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        {reviewMode ? (
          <Button
            startIcon={<Icon icon="teenyicons:attachment-outline" />}
            onClick={() => window.open(`${mainUrl}/${installationRequirementsDetails.attachment}`)}
            fullWidth
          >
            View attachment
          </Button>
        ) : (
          <UploadSingleFile
            file={reviewMode ? installationRequirementsDetails.attachment : attachment}
            onDrop={handleDrop}
          />
        )}
      </Grid>
    </Grid>
  );
}

export default Hood;
