import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import {
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Box,
  Grid,
  Button,
  TextField
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketDeviceUpdater } from '../../../APIs/customerService/tickets';
import { ticketLogs } from '../../../utils/systemUpdates';
// components
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';
import { UploadSingleFile } from '../../upload';

NotCompletedForm.propTypes = {
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func,
  ticketDetails: PropTypes.object,
  triggeredDevice: PropTypes.object,
  setTicketDevices: PropTypes.func,
  setTicketLogs: PropTypes.func,
  setTicketDevicesTableRows: PropTypes.func,
  ticketDevicesDataCreator: PropTypes.func
};

function NotCompletedForm({
  isTriggered,
  triggerHandler,
  ticketDetails,
  triggeredDevice,
  setTicketDevices,
  setTicketLogs
}) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [attachment, setAttachment] = useState({});

  const formik = useFormik({
    initialValues: { notCompletedNotes: '', attachment: null },
    validationSchema: Yup.object().shape({
      notCompletedNotes: Yup.string().required(
        'Please fill the box with why you would set this device as not completed'
      ),
      attachment: Yup.mixed().required('Attachment is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('ticketDeviceId', triggeredDevice.id);
      data.append('markNotCompleted', 'markNotCompleted');
      data.append('currentStage', 'technician-stage');
      data.append('notCompletedNotes', values.notCompletedNotes);
      data.append('notCompletedAttachment', values.attachment);
      await ticketDeviceUpdater(ticketDetails.id, data)
        .then((ticketDevicesData) => {
          setTicketDevices(ticketDevicesData);
          triggerHandler();
          enqueueSnackbar('Device marked not completed', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          ticketLogs(
            ticketDetails.id,
            `Device with ID - ${triggeredDevice.id} marked not completed`,
            ticketDetails.current_stage,
            setTicketLogs
          );
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt mark device as not completed ${error}`, {
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
    <Dialog open={isTriggered} onClose={triggerHandler} fullWidth maxWidth="sm">
      <DialogTitle>
        {triggeredDevice.device_model_number}
        <Label variant="ghost" color="error" style={{ marginLeft: '10px' }}>
          Not completed
        </Label>
      </DialogTitle>
      <DialogContentText sx={{ padding: '20px' }}>
        Please fill the box below with the reasons why the device is not completed
      </DialogContentText>
      <DialogContent>
        <Box component="form" marginTop="30px" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                {...getFieldProps('notCompletedNotes')}
                onChange={(event) => setFieldValue('notCompletedNotes', event.target.value)}
                value={values.notCompletedNotes}
                multiline
                rows={3}
                label="Why not completed ?"
                fullWidth
                error={Boolean(touched.notCompletedNotes && errors.notCompletedNotes)}
                helperText={touched.notCompletedNotes && errors.notCompletedNotes}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <UploadSingleFile
                maxSize={3145728}
                file={attachment}
                onDrop={handleDrop}
                error={Boolean(touched.attachment && errors.attachment)}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={triggerHandler} variant="outlined" color="secondary">
          Cancel
        </Button>
        <LoadingButton
          size="medium"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!dirty}
          onClick={handleSubmit}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default NotCompletedForm;
