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
import { ticketFollowBackCallAdder, ticketFollowBackCallFetcher } from '../../../APIs/customerService/tickets';
// components
import { MIconButton } from '../../@material-extend';

FollowBackCall.propTypes = {
  ticketDetailsState: PropTypes.array
};

function FollowBackCall({ ticketDetailsState }) {
  const [ticketFollowBackCall, setTicketFollowBackCall] = useState({});
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [ticketDetails, setTicketDetails] = ticketDetailsState;
  const formik = useFormik({
    initialValues: {
      notes: ticketFollowBackCall.notes,
      rating: ticketFollowBackCall.rating
    },
    validationSchema: Yup.object().shape({
      notes: Yup.string().required('Notes is required'),
      rating: Yup.number().required('Rating is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('notes', values.notes);
      data.append('rating', values.rating);
      await ticketFollowBackCallAdder(ticketDetails.id, data)
        .then((followBackCallData) => {
          setTicketDetails(ticketDetails);
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
        <CardHeader title="Followback call" />
        <CardContent>
          <Grid container spacing={3} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                multiline
                rows={3}
                label="Notes"
                fullWidth
                value={values.notes}
                onChange={(event) => setFieldValue('notes', event.target.value)}
                {...getFieldProps('notes')}
                error={Boolean(touched.notes && errors.notes)}
                helperText={touched.notes && errors.notes}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <Rating value={values.rating} onChange={(event, newValue) => setFieldValue('rating', newValue)} />
              <FormHelperText sx={{ px: 2 }} error>
                {errors.rating}
              </FormHelperText>
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
                Save
              </LoadingButton>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

export default FollowBackCall;
