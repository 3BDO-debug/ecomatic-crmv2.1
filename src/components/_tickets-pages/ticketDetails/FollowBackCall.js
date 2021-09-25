import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { LoadingButton } from '@material-ui/lab';
// utils
import {
  ticketFollowUpCallAdder,
  ticketFollowUpCallFetcher,
  ticketUpdater
} from '../../../APIs/customerService/tickets';
import { ticketLogs } from '../../../utils/systemUpdates';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { MIconButton } from '../../@material-extend';

FollowBackCall.propTypes = {
  ticketDetailsState: PropTypes.array,
  setTicketLogs: PropTypes.func,
  ticketDevices: PropTypes.array
};

function FollowBackCall({ ticketDetailsState, setTicketLogs, ticketDevices }) {
  const { translate } = useLocales();
  const [ticketFollowUpCall, setTicketFollowUpCall] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ticketDetails, setTicketDetails] = ticketDetailsState;
  const [ticketDevicesFollowUp, setTicketDevicesFollowUp] = useState([]);

  const handleTicketDevicesFollowUpRating = (ratingValue, deviceId) => {
    setTicketDevicesFollowUp([...ticketDevicesFollowUp, { ticketDeviceId: deviceId, rating: ratingValue }]);
  };

  const updateTicketStageHandler = () => {
    const data = new FormData();
    data.append('currentStage', 'follow-up-stage');
    data.append('ticketStatus', 'Closed');
    ticketUpdater(ticketDetails.id, data)
      .then((ticketDetailsData) => {
        setTicketDetails(ticketDetailsData);
        enqueueSnackbar('Ticket proceeded to final stage', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        ticketLogs(
          ticketDetails.id,
          'Ticket followback call had been created',
          ticketDetails.current_stage,
          setTicketLogs
        );
        ticketLogs(ticketDetails.id, 'Ticket is closed.', ticketDetails.current_stage, setTicketLogs);
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt proceed ticket to the final stage ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };
  const formik = useFormik({
    initialValues: {
      agentStageRating: 0,
      technicialSupportStageRating: 0,
      technicianRating: 0,
      overallRating: 0,
      followUpNotes: ''
    },
    validationSchema: Yup.object().shape({
      agentStageRating: Yup.number().required('Agent stage rating is required'),
      technicialSupportStageRating: Yup.number().required('Technicial support rating is required'),
      technicianRating: Yup.number().required('Technician rating is required'),
      overallRating: Yup.number().required('Overall rating is required'),
      followUpNotes: Yup.string().required('Follow up notes is required')
    }),
    onSubmit: async (values) => {
      const data = new FormData();
      data.append('ticketFollowUpCallData', JSON.stringify(values));
      data.append('ticketFollowUpDevicesData', JSON.stringify(ticketDevicesFollowUp));
      await ticketFollowUpCallAdder(ticketDetails.id, data)
        .then((followBackCallData) => {
          setTicketFollowUpCall(followBackCallData.ticket_follow_up_call);
          setTicketDevicesFollowUp(followBackCallData.ticket_follow_up_devices_ratings);
          updateTicketStageHandler();
          enqueueSnackbar('Followback call created', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt create followback call created ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        });
    }
  });
  useEffect(() => {
    if (ticketDetails && ticketDetails.ticket_status === 'Closed') {
      ticketFollowUpCallFetcher(ticketDetails.id)
        .then((followUpCallResponse) => {
          setTicketFollowUpCall(followUpCallResponse.ticket_follow_up_call);
          setTicketDevicesFollowUp(followUpCallResponse.ticket_follow_up_devices_ratings);
        })
        .catch((error) => console.log(error));
    }
  }, [ticketDetails]);

  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Box component="form">
      <Card sx={{ boxShadow: 'none' }} variant="outlined">
        <CardHeader title={translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketFollowbackCall.title')} />
        <Divider variant="middle" sx={{ marginTop: '10px' }} textAlign="center">
          Stages ratings
        </Divider>
        <CardContent>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={12} md={6} lg={6} align="center">
              <Typography>Agent stage rating</Typography>

              {ticketFollowUpCall ? (
                <Rating value={parseInt(ticketFollowUpCall.agent_stage_rating, 10)} max={10} readOnly />
              ) : (
                <>
                  <Rating
                    max={10}
                    value={values.agentStageRating}
                    onChange={(event, newValue) => setFieldValue('agentStageRating', newValue)}
                  />
                  <FormHelperText sx={{ px: 2 }} error>
                    {errors.agentStageRating}
                  </FormHelperText>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} align="center">
              <Typography>Technicial support rating</Typography>
              {ticketFollowUpCall ? (
                <Rating value={parseInt(ticketFollowUpCall.technicial_support_stage_rating, 10)} max={10} readOnly />
              ) : (
                <>
                  <Rating
                    max={10}
                    value={values.technicialSupportStageRating}
                    onChange={(event, newValue) => setFieldValue('technicialSupportStageRating', newValue)}
                  />
                  <FormHelperText sx={{ px: 2 }} error>
                    {errors.technicialSupportStageRating}
                  </FormHelperText>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} align="center">
              <Typography>Technician rating</Typography>
              {ticketFollowUpCall ? (
                <Rating value={parseInt(ticketFollowUpCall.technician_rating, 10)} max={10} readOnly />
              ) : (
                <>
                  <Rating
                    max={10}
                    value={values.technicianRating}
                    onChange={(event, newValue) => setFieldValue('technicianRating', newValue)}
                  />
                  <FormHelperText sx={{ px: 2 }} error>
                    {errors.technicianRating}
                  </FormHelperText>
                </>
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} align="center">
              <Typography>Overall rating</Typography>
              {ticketFollowUpCall ? (
                <Rating value={parseInt(ticketFollowUpCall.overall_rating, 10)} max={10} readOnly />
              ) : (
                <>
                  <Rating
                    max={10}
                    value={values.overallRating}
                    onChange={(event, newValue) => setFieldValue('overallRating', newValue)}
                  />
                  <FormHelperText sx={{ px: 2 }} error>
                    {errors.overallRating}
                  </FormHelperText>
                </>
              )}
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Divider textAlign="center">Devices ratings</Divider>
            </Grid>
            {ticketFollowUpCall
              ? ticketDevicesFollowUp.map((ticketDeviceFollowUp) => (
                  <Grid item xs={12} sm={12} md={6} lg={6} key={ticketDeviceFollowUp.id} align="center">
                    <Typography>{ticketDeviceFollowUp.device_model_number} rating</Typography>
                    <Rating max={10} value={ticketDeviceFollowUp.rating} readOnly />
                  </Grid>
                ))
              : ticketDevices.map((ticketDevice) => (
                  <Grid item xs={12} sm={12} md={6} lg={6} key={ticketDevice.id} align="center">
                    <Typography>{ticketDevice.device_model_number} rating</Typography>
                    <Rating
                      max={10}
                      onChange={(event, newValue) => handleTicketDevicesFollowUpRating(newValue, ticketDevice.id)}
                    />
                  </Grid>
                ))}
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Divider textAlign="center">Follow up notes</Divider>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {ticketFollowUpCall ? (
                <TextField
                  value={ticketFollowUpCall.follow_up_notes}
                  label="Follow up notes"
                  multiline
                  rows={3}
                  fullWidth
                  focused
                />
              ) : (
                <TextField
                  multiline
                  rows={3}
                  label="Follow up notes"
                  value={values.followUpNotes}
                  fullWidth
                  {...getFieldProps('followUpNotes')}
                  onChange={(event) => setFieldValue('followUpNotes', event.target.value)}
                  error={Boolean(touched.followUpNotes && errors.followUpNotes)}
                  helperText={touched.followUpNotes && errors.followUpNotes}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <LoadingButton
                sx={{ float: 'right' }}
                size="medium"
                type="submit"
                variant="contained"
                loading={isSubmitting}
                disabled={!dirty}
                onClick={handleSubmit}
              >
                {translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketFollowbackCall.actionButton')}
              </LoadingButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FollowBackCall;
