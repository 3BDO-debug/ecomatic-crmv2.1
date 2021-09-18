import React, { useCallback, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import '../../../index.css';
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
import { AuthContext } from '../../../contexts/AuthContext';
// utils
import { commonDiagnosticsFetcher } from '../../../APIs/configurations';
import { ticketLogs } from '../../../utils/systemUpdates';
import { ticketDeviceUpdater } from '../../../APIs/customerService/tickets';
// routes
import { mainUrl } from '../../../APIs/axios';
// components
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';

DeviceInfo.propTypes = {
  ticketDevicesState: PropTypes.array,
  triggeredDevice: PropTypes.number,
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func,
  ticketState: PropTypes.array,
  isEditable: PropTypes.bool,
  setTicketLogs: PropTypes.func
};

function DeviceInfo({
  ticketState,
  ticketDevicesState,
  triggeredDevice,
  isTriggered,
  triggerHandler,
  isEditable,
  setTicketLogs
}) {
  const ticketDetails = ticketState[0];
  const userRole = useContext(AuthContext).userState[0].role;
  const [ticketDevices, setTicketDevices] = ticketDevicesState;
  const ticketTypes = useContext(ConfigurationsContext).ticketTypesState[0];
  const [commonDiagnostics, setCommonDiagnostics] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const ticketDeviceFinder = useCallback(() => {
    const device = ticketDevices.find((device) => device.id === triggeredDevice);
    return device;
  }, [ticketDevices, triggeredDevice]);
  const formik = useFormik({
    initialValues: {
      ticketType: '',
      commonDiagnostics: '',
      extraNotes: ticketDeviceFinder() && ticketDeviceFinder().extra_notes
    },
    validationSchema: Yup.object().shape({
      ticketType: Yup.string().required('Ticket type should be selected')
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
      triggerHandler();
      ticketLogs(
        ticketDetails.id,
        `Ticket device with ID - ${triggeredDevice} updated`,
        ticketDetails.current_stage,
        setTicketLogs
      );
    }
  });

  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;
  useEffect(() => {
    if (ticketDeviceFinder()) {
      commonDiagnosticsFetcher(ticketDeviceFinder().device_category)
        .then((commonDiagnosticsData) => setCommonDiagnostics(commonDiagnosticsData))
        .catch((error) => console.log(error));
    }
  }, [ticketDeviceFinder]);

  const ticketTypesHandler = useCallback(() => {
    const ticketTypesData = [];
    if (ticketDeviceFinder().installation_status === 'Not installed') {
      const notInstalledTypes = ticketTypes.filter((ticketType) => ticketType.ticket_type === 'Installation');
      notInstalledTypes.map((type) => ticketTypesData.push({ label: type.ticket_type, id: type.id }));
    } else if (
      ticketDeviceFinder().installation_status === 'Not installed by the company' ||
      ticketDeviceFinder().installation_status === 'Installed by the company'
    ) {
      const installedTypes = ticketTypes.filter((ticketType) => ticketType.ticket_type !== 'Installation');
      installedTypes.map((type) => ticketTypesData.push({ label: type.ticket_type, id: type.id }));
    }
    return ticketTypesData;
  }, [ticketDeviceFinder, ticketTypes]);

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
                color={ticketDeviceFinder().installation_status !== 'Not installed' ? 'info' : 'error'}
              >
                {ticketDeviceFinder().installation_status}
              </Label>
              {ticketDeviceFinder().installation_status === 'Not installed by the company' && (
                <Label variant="ghost" color="error">
                  Out of warranty
                </Label>
              )}
              {ticketDeviceFinder().installation_date && (
                <Label
                  style={{ marginLeft: '10px' }}
                  variant="ghost"
                  color={ticketDeviceFinder().in_warranty ? 'primary' : 'error'}
                >
                  {ticketDeviceFinder().in_warranty ? 'In warranty' : 'Out of warranty'}
                </Label>
              )}

              <Box sx={{ marginLeft: 'auto', order: 2 }}>
                {ticketDeviceFinder().not_completed_attachment && (
                  <Tooltip title="Not completed attachment">
                    <IconButton
                      onClick={() => window.open(`${mainUrl}/${ticketDeviceFinder().not_completed_attachment}`)}
                      color="warning"
                      className="wobble"
                    >
                      <Icon icon="bx:bx-error" />
                    </IconButton>
                  </Tooltip>
                )}
                <Tooltip title="Download invoice">
                  <IconButton
                    onClick={() =>
                      window.open(`${mainUrl}/${ticketDeviceFinder().device_invoice_or_manufacturer_label}`)
                    }
                    color="primary"
                  >
                    <Icon icon="fe:download" width={20} height={20} />
                  </IconButton>
                </Tooltip>
              </Box>
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
                {ticketDeviceFinder().purchasing_date && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      type="date"
                      value={ticketDeviceFinder().purchasing_date}
                      label="Purchasing date"
                      fullWidth
                    />
                  </Grid>
                )}
                {ticketDeviceFinder().manufacturing_date && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      type="date"
                      value={ticketDeviceFinder().manufacturing_date}
                      label="Manufacturing date"
                      fullWidth
                    />
                  </Grid>
                )}

                {ticketDeviceFinder().expected_warranty_start_date && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      type="date"
                      value={ticketDeviceFinder().expected_warranty_start_date}
                      label="Expected warranty start date"
                      fullWidth
                    />
                  </Grid>
                )}
                {ticketDeviceFinder().installation_date && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      type="date"
                      value={ticketDeviceFinder().installation_date}
                      label="Installation date"
                      fullWidth
                    />
                  </Grid>
                )}
                {ticketDeviceFinder().warranty_start_date && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      type="date"
                      value={ticketDeviceFinder().warranty_start_date}
                      label="Warranty start date"
                      fullWidth
                    />
                  </Grid>
                )}
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <Autocomplete
                    fullWidth
                    options={ticketTypesHandler()}
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
                      defaultValue={{ label: ticketDeviceFinder().common_diagnostics, id: 1 }}
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
                    value={values.extraNotes !== '' ? ticketDeviceFinder().extra_notes : values.extraNotes}
                    onChange={(event) => setFieldValue('extraNotes', event.target.value)}
                    fullWidth
                  />
                </Grid>
                {ticketDeviceFinder().not_completed_notes && (
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextField
                      multiline
                      rows={3}
                      label="Not completed notes"
                      value={ticketDeviceFinder().not_completed_notes}
                      fullWidth
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={triggerHandler}>
              Cancel
            </Button>
            {isEditable && userRole !== 'technician' && (
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
            )}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}

export default DeviceInfo;
