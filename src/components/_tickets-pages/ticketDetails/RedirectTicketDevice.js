import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import { Icon } from '@iconify/react';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  DialogContentText,
  Box
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { ticketDeviceUpdater, ticketUpdater } from '../../../APIs/customerService/tickets';
import { ticketLogs } from '../../../utils/systemUpdates';
// components
import { MIconButton } from '../../@material-extend';

RedirectTicketDevice.propTypes = {
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func,
  triggeredDevice: PropTypes.object,
  ticketDetails: PropTypes.object,
  reviewMode: PropTypes.bool,
  setTicketDevices: PropTypes.func,
  ticketDeviceDataCreator: PropTypes.func,
  setTicketDevicesTableRows: PropTypes.func,
  setTicketDetails: PropTypes.func,
  setTicketLogs: PropTypes.func
};

function RedirectTicketDevice({
  isTriggered,
  triggerHandler,
  triggeredDevice,
  ticketDetails,
  reviewMode,
  setTicketDevices,
  ticketDeviceDataCreator,
  setTicketDevicesTableRows,
  setTicketDetails,
  setTicketLogs
}) {
  const { translate } = useLocales();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      redirectionNotes: ''
    },
    validationSchema: Yup.object().shape({
      redirectionNotes: Yup.string().required('Redirection notes is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('ticketDeviceId', triggeredDevice.id);
      data.append('redirectTicketDevice', 'redirectTicketDevice');
      data.append('currentStage', 'technician-stage');
      data.append('redirectionNotes', values.redirectionNotes);
      await ticketDeviceUpdater(ticketDetails.id, data)
        .then((ticketDevicesData) => {
          setTicketDevices(ticketDevicesData);
          setTicketDevicesTableRows(ticketDeviceDataCreator(ticketDevicesData));
          enqueueSnackbar('Device redirected', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          ticketLogs(
            ticketDetails.id,
            `Ticket device with ID - ${triggeredDevice.id} had been redirected to the supervisor`,
            ticketDetails.current_stage,
            setTicketLogs
          );
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt redirect device ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        });
      resetForm();
      triggerHandler();
    }
  });

  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  const handleAcceptRedirection = async () => {
    setLoading(true);
    const data = new FormData();
    data.append('currentStage', 'customer-service-stage');
    data.append('ticketDeviceId', triggeredDevice.id);
    await ticketDeviceUpdater(ticketDetails.id, data)
      .then((ticketDevicesData) => {
        setTicketDevices(ticketDevicesData);
        setTicketDevicesTableRows(ticketDeviceDataCreator(ticketDevicesData));
        enqueueSnackbar('Accepted redirection request', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        ticketLogs(
          ticketDetails.id,
          `Ticket device with ID - ${triggeredDevice.id} redirection request had been accepted by the supervisor`,
          ticketDetails.current_stage,
          setTicketLogs
        );
        setLoading(false);
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt accept redirection request ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setLoading(false);
      });
    const ticketFormData = new FormData();
    ticketFormData.append('currentStage', 'technician-stage');
    await ticketUpdater(ticketDetails.id, ticketFormData)
      .then((ticketDetailsData) => {
        setTicketDetails(ticketDetailsData);
        enqueueSnackbar('Ticket redirected to technician stage', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt redirect ticket to technician stage ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
    triggerHandler();
  };

  return (
    <Dialog open={isTriggered} onClose={triggerHandler} fullWidth maxWidth="sm">
      <DialogTitle>{translate('ticketDetailsPage.redirectionDialog.title')}</DialogTitle>
      <DialogContent>
        <DialogContentText>{translate('ticketDetailsPage.redirectionDialog.body')}</DialogContentText>
        <Box marginTop="30px" component="form" onSubmit={handleSubmit}>
          {reviewMode ? (
            <TextField
              label={translate('ticketDetailsPage.redirectionDialog.redirectionNotes')}
              value={triggeredDevice.customer_service_notes}
              multiline
              rows={3}
              fullWidth
            />
          ) : (
            <TextField
              label={translate('ticketDetailsPage.redirectionDialog.redirectionNotes')}
              value={values.redirectionNotes}
              onChange={(event) => setFieldValue('redirectionNotes', event.target.value)}
              {...getFieldProps('redirectionNotes')}
              error={Boolean(touched.redirectionNotes && errors.redirectionNotes)}
              helperText={touched.redirectionNotes && errors.redirectionNotes}
              multiline
              rows={3}
              fullWidth
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={triggerHandler} variant="text">
          {translate('ticketDetailsPage.redirectionDialog.cancelButton')}
        </Button>

        {reviewMode ? (
          <LoadingButton
            size="medium"
            loading={loading}
            disabled={loading}
            onClick={handleAcceptRedirection}
            variant="contained"
          >
            {translate('ticketDetailsPage.redirectionDialog.acceptButton')}
          </LoadingButton>
        ) : (
          <LoadingButton
            size="medium"
            type="submit"
            variant="contained"
            loading={isSubmitting}
            disabled={!dirty}
            onClick={handleSubmit}
          >
            {translate('ticketDetailsPage.redirectionDialog.actionButton')}
          </LoadingButton>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default RedirectTicketDevice;
