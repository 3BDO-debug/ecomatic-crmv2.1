import React from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import { useParams } from 'react-router';
// material
import { Chip } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import {
  addClientDeviceFormDefaults,
  addClientDeviceFormValidationSchema
} from '../../../utils/formValidationSchemas/addClientDevice';
import { clientDevicesAdder } from '../../../APIs/customerService/clients';
import { clientLogs } from '../../../utils/systemUpdates';
// components
import FullScreenDialog from '../../FullScreenDialog';
import { MIconButton } from '../../@material-extend';
import AddClientDeviceForm from './AddClientDeviceForm';

AddClientDevice.propTypes = {
  open: PropTypes.bool,
  closeHandler: PropTypes.func,
  clientDevicesState: PropTypes.array,
  setClientLogs: PropTypes.func
};

function AddClientDevice({ open, closeHandler, clientDevicesState, setClientLogs }) {
  const { clientId } = useParams();
  const setClientDevices = clientDevicesState[1];
  const { translate } = useLocales();
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
          const clientDevice = clientDevicesData.find((device) => device.related_storage_item === values.device);
          enqueueSnackbar('Client device added', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          clientLogs(
            clientId,
            `Added new client device with model number - ${values.device_model_number} & ID - ${clientDevice.id}`,
            setClientLogs
          );
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
          {translate('clientProfilePage.addClientDeviceForm.title')}
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
          {translate('clientProfilePage.addClientDeviceForm.actionButton')}
        </LoadingButton>
      }
      dialogContent={<AddClientDeviceForm formik={formik} />}
    />
  );
}

export default AddClientDevice;
