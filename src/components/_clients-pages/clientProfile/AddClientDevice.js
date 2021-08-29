import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
// material
import { Chip } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import {
  addClientDeviceFormDefaults,
  addClientDeviceFormValidationSchema
} from '../../../utils/formValidationSchemas/addClientDevice';
import { clientDevicesAdder } from '../../../APIs/customerService/clients';
// components
import FullScreenDialog from '../../FullScreenDialog';
import { MIconButton } from '../../@material-extend';
import AddClientDeviceForm from './AddClientDeviceForm';

AddClientDevice.propTypes = {
  open: PropTypes.bool,
  closeHandler: PropTypes.func,
  clientDevicesState: PropTypes.array,
  clientId: PropTypes.number
};

function AddClientDevice({ open, closeHandler, clientDevicesState, clientId }) {
  const setClientDevices = clientDevicesState[1];
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const formik = useFormik({
    initialValues: addClientDeviceFormDefaults,
    validationSchema: addClientDeviceFormValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('formikValues', JSON.stringify(values));
      data.append('deviceInvoiceOrManufacturingLabel', values.deviceInvoiceOrManufacturingLabel);
      await clientDevicesAdder(clientId, data)
        .then((clientDevicesData) => {
          setClientDevices(clientDevicesData);

          enqueueSnackbar('Client device added', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          closeHandler();
        })
        .catch((error) =>
          enqueueSnackbar(`Couldnt add client device ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          })
        );
      resetForm();
    }
  });
  const { dirty, values, isSubmitting, handleSubmit, setFieldValue } = formik;

  return (
    <FullScreenDialog
      open={open}
      closeHandler={() => {
        setFieldValue('warrantyStatus', null);
        closeHandler();
      }}
      dialogTitle={
        <>
          Add client device
          {values.warrantyStatus !== null && (
            <Chip
              sx={{ marginLeft: '10px' }}
              variant="contained"
              color={values.warrantyStatus ? 'success' : 'error'}
              label={values.warrantyStatus ? 'In warranty' : 'Out of warranty'}
            />
          )}
        </>
      }
      saveButton
      saveButtonComponent={
        <LoadingButton loading={isSubmitting} disabled={!dirty} onClick={handleSubmit} color="inherit">
          Save
        </LoadingButton>
      }
      dialogContent={<AddClientDeviceForm formik={formik} />}
    />
  );
}

export default AddClientDevice;
