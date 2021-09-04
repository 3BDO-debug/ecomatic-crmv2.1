import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Box, Card, CardContent, CardHeader, FormHelperText, Grid, TextField } from '@material-ui/core';
import Rating from '@material-ui/lab/Rating';
import { LoadingButton } from '@material-ui/lab';
// utils
import {
  ticketFollowBackCallAdder,
  ticketFollowBackCallFetcher,
  ticketUpdater
} from '../../../APIs/customerService/tickets';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import { MIconButton } from '../../@material-extend';

FollowBackCall.propTypes = {
  ticketDetailsState: PropTypes.array
};

function FollowBackCall({ ticketDetailsState }) {
  const { translate } = useLocales();
  const [ticketFollowBackCall, setTicketFollowBackCall] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ticketDetails, setTicketDetails] = ticketDetailsState;
  const updateTicketStageHandler = () => {
    const data = new FormData();
    data.append('currentStage', 'customer-service-stage');
    data.append('isClosed', true);
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
      notes: ticketFollowBackCall ? ticketFollowBackCall.notes : '',
      rating: ticketFollowBackCall ? ticketFollowBackCall.rating : 0
    },
    validationSchema: Yup.object().shape({
      notes: Yup.string().required('Notes is required'),
      rating: Yup.number().required('Rating is required')
    }),
    onSubmit: async (values) => {
      const data = new FormData();
      data.append('notes', values.notes);
      data.append('rating', values.rating);
      await ticketFollowBackCallAdder(ticketDetails.id, data)
        .then((followBackCallData) => {
          setTicketFollowBackCall(followBackCallData);
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
    ticketFollowBackCallFetcher(ticketDetails.id)
      .then((followBackCallResponse) => setTicketFollowBackCall(followBackCallResponse))
      .catch((error) => console.log(error));
  }, [ticketDetails]);

  const { dirty, errors, values, touched, isSubmitting, handleSubmit, setFieldValue, getFieldProps } = formik;

  return (
    <Box component="form">
      <Card sx={{ boxShadow: 'none' }} variant="outlined">
        <CardHeader title={translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketFollowbackCall.title')} />
        <CardContent>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {ticketFollowBackCall ? (
                <TextField
                  label={translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketFollowbackCall.notes')}
                  value={ticketFollowBackCall.notes}
                  multiline
                  rows={3}
                  fullWidth
                  focused
                />
              ) : (
                <TextField
                  multiline
                  rows={3}
                  label={translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.ticketFollowbackCall.notes')}
                  fullWidth
                  value={values.notes}
                  onChange={(event) => setFieldValue('notes', event.target.value)}
                  {...getFieldProps('notes')}
                  error={Boolean(touched.notes && errors.notes)}
                  helperText={touched.notes && errors.notes}
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              {ticketFollowBackCall ? (
                <Rating name="rating" value={parseInt(ticketFollowBackCall.rating, 10)} readOnly />
              ) : (
                <>
                  <Rating value={values.rating} onChange={(event, newValue) => setFieldValue('rating', newValue)} />
                  <FormHelperText sx={{ px: 2 }} error>
                    {errors.rating}
                  </FormHelperText>
                </>
              )}
            </Grid>
            {!ticketFollowBackCall && (
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
            )}
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FollowBackCall;
