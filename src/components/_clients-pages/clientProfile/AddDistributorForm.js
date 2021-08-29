import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Dialog, DialogTitle, DialogContent, Box, Grid, TextField, DialogActions, Button } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
import { missingDataRequestHandler } from '../../../APIs/systemUpdates';

AddDistributorForm.propTypes = {
  formik: PropTypes.object,
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func
};

function AddDistributorForm({ formik, isTriggered, triggerHandler }) {
  const submitHandler = () => {
    const data = new FormData();
    data.append('dataType', 'Distributors');
    data.append('dataToBeAdded', values.distributor);
    missingDataRequestHandler(data)
      .then((response) => {
        console.log(response);
        triggerHandler();
      })
      .catch((error) => console.log(error));
    return triggerHandler;
  };
  const [distributor, setDistributor] = useState('');
  const { touched, errors, setFieldValue, values, getFieldProps, dirty, isSubmitting } = formik;
  return (
    <Dialog open={isTriggered} onClose={triggerHandler} fullWidth maxWidth="sm">
      <DialogTitle>Please fill out in the box below the distributor name</DialogTitle>
      <DialogContent>
        <Box marginTop="30px" component="form" onSubmit={submitHandler}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <TextField
                fullWidth
                autoFocus
                margin="dense"
                onChange={(event) => {
                  setFieldValue('distributor', event.target.value);
                  setDistributor(event.target.value);
                }}
                value={distributor}
                label="Distributor Name"
                {...getFieldProps('distributor')}
                error={Boolean(touched.distributor && errors.distributor)}
                helperText={touched.distributor && errors.distributor}
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={triggerHandler}>
          Cancel
        </Button>
        <LoadingButton
          size="medium"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          disabled={!dirty}
          onClick={submitHandler}
        >
          Save
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

export default AddDistributorForm;
