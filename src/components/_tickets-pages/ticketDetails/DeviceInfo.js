import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Autocomplete,
  Grid,
  TextField,
  Button,
  Stack,
  IconButton,
  Tooltip
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// context
import { ConfigurationsContext } from '../../../contexts';
import { ticketDeviceUpdater } from '../../../APIs/customerService/tickets';
// utils
import { commonDiagnosticsFetcher } from '../../../APIs/configurations';
// components
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';

DeviceInfo.propTypes = {
  ticketDevicesState: PropTypes.array,
  triggeredDevice: PropTypes.number,
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func,
  ticketState: PropTypes.array
};

function DeviceInfo({ ticketState, ticketDevicesState, triggeredDevice, isTriggered, triggerHandler }) {
  const ticketDetails = ticketState[0];
  const [ticketDevices, setTicketDevices] = ticketDevicesState;
  const ticketTypes = useContext(ConfigurationsContext).ticketTypesState[0];
  const [commonDiagnostics, setCommonDiagnostics] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const ticketDeviceFinder = () => {
    const device = ticketDevices.find((device) => device.id === triggeredDevice);
    return device;
  };
  const formik = useFormik({
    initialValues: {
      ticketType: '',
      commonDiagnostics: '',
      extraNotes: ticketDeviceFinder() && ticketDeviceFinder().extra_notes
    },
    validationSchema: Yup.object().shape({
      ticketType: Yup.string().required('Ticket type should be selected'),
      commonDiagnostics: Yup.string().required('Please choose common diagnostics')
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('currentStage', ticketDetails.current_stage);
      data.append('deviceTicketType', values.ticketType);
      data.append('commonDiagnostic', values.commonDiagnostics);
      data.append('extraNotes', values.extraNotes);
      data.append('ticketDeviceId', ticketDeviceFinder().id);
      ticketDeviceUpdater(ticketDetails.id, data)
        .then((ticketDevicesData) => {
          setTicketDevices(ticketDevicesData);
          enqueueSnackbar('Device updated', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Device couldnt be updated ${error}`, {
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
  useEffect(() => {
    if (ticketDeviceFinder()) {
      commonDiagnosticsFetcher(ticketDeviceFinder().device_category)
        .then((commonDiagnosticsData) => setCommonDiagnostics(commonDiagnosticsData))
        .catch((error) => console.log(error));
    }
  }, [ticketDeviceFinder()]);
  return (
    <>
      {ticketDeviceFinder() && (
        <Dialog open={isTriggered} onClose={triggerHandler} fullWidth maxWidth="sm">
          <DialogTitle>
            <Stack direction="row" rowGap={3} alignItems="center" flexBasis flex={1}>
              {ticketDeviceFinder().device_model_number}
              <Label
                style={{ marginLeft: '10px' }}
                variant="ghost"
                color={ticketDeviceFinder().installed_through_the_company ? 'info' : 'error'}
              >
                {ticketDeviceFinder().installed_through_the_company ? 'Installed' : 'Not installed'}
              </Label>
              <Tooltip title="Download invoice">
                <IconButton sx={{ marginLeft: 'auto', order: 2 }} color="primary">
                  <Icon icon="fe:download" width={20} height={20} />
                </IconButton>
              </Tooltip>
            </Stack>
          </DialogTitle>
          <DialogContent>
            <Box component="form" marginTop="30px" onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Device feeding source"
                    fullWidth
                    value={ticketDeviceFinder().device_feeding_source}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    fullWidth
                    options={ticketTypes.map((ticketType) => ({ label: ticketType.ticket_type, id: ticketType.id }))}
                    getOptionLabel={(option) => option.label}
                    defaultValue={{ label: ticketDeviceFinder().device_ticket_type, id: 1 }}
                    onChange={(event, value) => {
                      setFieldValue('ticketType', value == null ? 'none' : value.label);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...getFieldProps('ticketType')}
                        {...params}
                        label="Ticket type"
                        margin="none"
                        error={Boolean(touched.ticketType && errors.ticketType)}
                        helperText={touched.ticketType && errors.ticketType}
                      />
                    )}
                  />
                </Grid>
                {values.ticketType !== 'Installation' && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <Autocomplete
                      fullWidth
                      options={commonDiagnostics.map((issue) => ({ label: issue.issue_type, id: issue.id }))}
                      getOptionLabel={(option) => option.label}
                      onChange={(event, value) => {
                        setFieldValue('commonDiagnostics', value == null ? 'none' : value.label);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Common diagnostics"
                          margin="none"
                          error={Boolean(touched.commonDiagnostics && errors.commonDiagnostics)}
                          helperText={touched.commonDiagnostics && errors.commonDiagnostics}
                        />
                      )}
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    multiline
                    rows={5}
                    label="Extra notes"
                    value={values.extraNotes}
                    onChange={(event) => setFieldValue('extraNotes', event.target.value)}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={triggerHandler}>
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
              Update
            </LoadingButton>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default DeviceInfo;
