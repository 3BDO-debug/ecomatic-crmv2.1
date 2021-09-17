import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useFormik } from 'formik';
// material
import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, Box, Button, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// context
import { AuthContext } from '../../../contexts/AuthContext';
// utils
import { ticketDevicesUpdater } from '../../../APIs/customerService/tickets';
// components
import { MIconButton } from '../../@material-extend';

DeviceNotes.propTypes = {
  triggerHandler: PropTypes.func,
  isTriggered: PropTypes.bool,
  triggeredDevice: PropTypes.object,
  ticketDetails: PropTypes.object,
  setTicketDevices: PropTypes.func
};

function DeviceNotes({ triggerHandler, isTriggered, triggeredDevice, ticketDetails, setTicketDevices }) {
  const userRole = useContext(AuthContext).userState[0];

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      agentNotes: '',
      technicalSupportNotes: '',
      techniciansSupervisorNotes: ''
    },
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();

      data.append('ticketDeviceId', triggeredDevice.id);
      data.append('agentNotes', values.agentNotes);
      data.append('technicalSupportNotes', values.technicalSupportNotes);
      data.append('techniciansSupervisorNotes', values.techniciansSupervisorNotes);

      await ticketDevicesUpdater(ticketDetails.id, data)
        .then((ticketDevicesResponse) => {
          setTicketDevices(ticketDevicesResponse);
          enqueueSnackbar('Notes had been created', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Notes couldnt be created - ${error}`, {
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

  const { values, setFieldValue, isSubmitting, handleSubmit } = formik;

  console.log('hello', triggeredDevice);

  return (
    <Dialog onClose={triggerHandler} open={isTriggered} fullWidth maxWidth="sm">
      <DialogTitle>Device notes</DialogTitle>
      <DialogContent>
        <Box marginTop="30px">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                label="Customer service agent notes"
                value={triggeredDevice.agent_notes ? triggeredDevice.agent_notes : values.agentNotes}
                onChange={(event) => setFieldValue('agentNotes', event.target.value)}
                multiline
                rows={3}
                fullWidth
                disabled={triggeredDevice.agent_notes && true}
              />
            </Grid>
            {ticketDetails &&
              [
                'technical-support-stage',
                'technicians-supervisor-stage',
                'technician-stage',
                'follow-up-stage'
              ].includes(ticketDetails.current_stage) && (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Technical support notes"
                    value={
                      triggeredDevice.technical_support_notes
                        ? triggeredDevice.technical_support_notes
                        : values.technicalSupportNotes
                    }
                    onChange={(event) => setFieldValue('technicalSupportNotes', event.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    disabled={triggeredDevice.technical_support_notes && true}
                  />
                </Grid>
              )}
            {ticketDetails &&
              ['technicians-supervisor-stage', 'technician-stage', 'follow-up-stage'].includes(
                ticketDetails.current_stage
              ) && (
                <Grid item xs={12} sm={12} md={12} lg={12}>
                  <TextField
                    label="Technicians supervisor notes"
                    value={
                      triggeredDevice.technicans_supervisor_notes
                        ? triggeredDevice.technicans_supervisor_notes
                        : values.techniciansSupervisorNotes
                    }
                    onChange={(event) => setFieldValue('techniciansSupervisorNotes', event.target.value)}
                    multiline
                    rows={3}
                    fullWidth
                    disabled={triggeredDevice.technicans_supervisor_notes && true}
                  />
                </Grid>
              )}
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        {userRole === 'technician' ? (
          <Button variant="contained" onClick={triggerHandler}>
            Okay
          </Button>
        ) : (
          <>
            <Button variant="outlined" color="error" onClick={triggerHandler}>
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              color="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              Save
            </LoadingButton>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default DeviceNotes;
