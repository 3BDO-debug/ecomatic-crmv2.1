import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// material
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketDevicesFetcher, ticketDeviceUpdater } from '../../../APIs/customerService/tickets';
// hooks
import useLocales from '../../../hooks/useLocales';
// component
import DataTable from '../../dataTable/DataTable';
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';
import DeviceInfo from './DeviceInfo';
import InstallationRequirements from '../../installationRequirements/InstallationRequirements';

TechnicianStage.propTypes = {
  ticketState: PropTypes.array
};

const completeTicketDeviceHandler = (
  ticketDeviceId,
  ticketDetails,
  setTicketDevices,
  setTicketDevicesTableRows,
  ticketDevicesDataCreator,
  enqueueSnackbar,
  closeSnackbar
) => {
  const data = new FormData();
  data.append('ticketDeviceId', ticketDeviceId);
  data.append('markCompleted', 'markCompleted');
  data.append('currentStage', 'technician-stage');
  ticketDeviceUpdater(ticketDetails.id, data)
    .then((ticketDevicesData) => {
      setTicketDevices(ticketDevicesData);
      setTicketDevicesTableRows(ticketDevicesDataCreator(ticketDevicesData));

      enqueueSnackbar('Device marked  completed', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    })
    .catch((error) => {
      enqueueSnackbar(`Couldnt mark device completed ${error}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    });
};

function TechnicianStage({ ticketState }) {
  const { translate } = useLocales();
  const [ticketDetails, setTicketDetails] = ticketState;
  const [ticketDevices, setTicketDevices] = useState([]);
  const [ticketDevicesTableRows, setTicketDevicesTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [deviceInfo, triggerDeviceInfo] = useState(false);
  const [triggerdDevice, setTriggeredDevice] = useState({});
  const [completed, triggerCompleted] = useState(false);
  const [notCompleted, triggerNotCompleted] = useState(false);
  const formik = useFormik({
    initialValues: { notCompletedNotes: '' },
    validationSchema: Yup.object().shape({
      notCompletedNotes: Yup.string().required(
        'Please fill the box with why you would set this device as not completed'
      )
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('ticketDeviceId', triggerdDevice.id);
      data.append('markNotCompleted', 'markNotCompleted');
      data.append('currentStage', 'technician-stage');
      data.append('notCompletedNotes', values.notCompletedNotes);
      await ticketDeviceUpdater(ticketDetails.id, data)
        .then((ticketDevicesData) => {
          setTicketDevices(ticketDevicesData);
          setTicketDevicesTableRows(ticketDevicesDataCreator(ticketDevicesData));
          triggerNotCompleted(false);
          enqueueSnackbar('Device marked not completed', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
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

  const ticketDevicesDataCreator = useCallback(
    (ticketDevices) => {
      const ticketDevicesData = [];
      ticketDevices.map((ticketDevice) =>
        ticketDevicesData.push({
          modelNumber: ticketDevice.device_model_number,
          ticketType: (
            <Label variant="ghost" color="primary">
              {ticketDevice.device_ticket_type}
            </Label>
          ),
          ticketStatus: (
            <Label variant="ghost" color="info">
              {ticketDevice.device_ticket_status}
            </Label>
          ),
          actions: (
            <>
              {ticketDevice.device_ticket_status === 'Under Processing' ? (
                <>
                  <Button
                    onClick={() => {
                      setTriggeredDevice(ticketDevice);
                      triggerNotCompleted(true);
                    }}
                    sx={{ marginRight: '10px' }}
                    variant="outlined"
                    color="error"
                  >
                    Not completed
                  </Button>
                  <Button
                    onClick={() => {
                      setTriggeredDevice(ticketDevice);
                      triggerCompleted(true);
                    }}
                    variant="contained"
                    color="primary"
                  >
                    Completed
                  </Button>
                </>
              ) : (
                ticketDevice.device_ticket_status === 'Completed' && (
                  <Button
                    onClick={() => {
                      setTriggeredDevice(ticketDevice);
                      triggerCompleted(true);
                    }}
                    color="info"
                    startIcon={<Icon icon="carbon:document" width={20} height={20} />}
                  />
                )
              )}
              <Button
                onClick={() => {
                  console.log('dsfsdfs', ticketDevices);
                  setTriggeredDevice(ticketDevice.id);
                  triggerDeviceInfo(true);
                }}
                color="primary"
                startIcon={<Icon icon="carbon:view" />}
              />
            </>
          )
        })
      );
      return ticketDevicesData;
    },
    [closeSnackbar, enqueueSnackbar, ticketDetails]
  );

  useEffect(() => {
    ticketDevicesFetcher(ticketDetails.id)
      .then((ticketDevicesData) => {
        setTicketDevices(ticketDevicesData);
        setTicketDevicesTableRows(ticketDevicesDataCreator(ticketDevicesData));
      })
      .catch((error) => console.log(error));
  }, [ticketDetails, ticketDevicesDataCreator]);
  return (
    <Box>
      <Card sx={{ boxShadow: 'none' }}>
        <CardHeader title="Ticket devices" />
        <CardContent>
          <DataTable
            columnsData={[
              {
                id: 'modelNumber',
                label: translate(
                  'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.modelNumber'
                )
              },
              {
                id: 'ticketType',
                label: translate(
                  'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.ticketType'
                )
              },
              {
                id: 'ticketStatus',
                label: translate(
                  'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.ticketStatus'
                )
              },
              {
                id: 'actions',
                label: translate(
                  'ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketDevicesTable.tableColumns.actions'
                )
              }
            ]}
            rowsData={ticketDevicesTableRows}
            searchPlaceholder="Search devices.."
            identifier="modelNumber"
            disableCheckbox
          />

          {/* Device info */}
          <DeviceInfo
            isTriggered={deviceInfo}
            triggerHandler={() => triggerDeviceInfo(false)}
            isEditable={false}
            ticketDevicesState={[ticketDevices, setTicketDevices]}
            triggeredDevice={triggerdDevice}
            ticketState={[ticketDetails, setTicketDetails]}
          />

          {/* Completed form */}
          <InstallationRequirements
            saveHandler={() =>
              completeTicketDeviceHandler(
                triggerdDevice.id,
                ticketDetails,
                setTicketDevices,
                setTicketDevicesTableRows,
                ticketDevicesDataCreator,
                enqueueSnackbar,
                closeSnackbar
              )
            }
            triggerHandler={() => triggerCompleted(false)}
            isTriggered={completed}
            triggeredDevice={triggerdDevice}
            ticketDetails={ticketDetails}
            reviewMode={triggerdDevice.device_ticket_status === 'Completed' && true}
          />
          {/* Not completed form */}

          {triggerdDevice && (
            <Dialog open={notCompleted} onClose={() => triggerNotCompleted(false)} fullWidth maxWidth="sm">
              <DialogTitle>
                {triggerdDevice.device_model_number}
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
                  </Grid>
                </Box>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => triggerNotCompleted(false)} variant="outlined" color="secondary">
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
          )}
        </CardContent>
      </Card>
    </Box>
  );
}

export default TechnicianStage;
