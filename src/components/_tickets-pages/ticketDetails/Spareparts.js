import React, { useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketDeviceSparepartsAdder, ticketDeviceSparepartsDeleter } from '../../../APIs/customerService/tickets';
// context
import { SparepartsContext } from '../../../contexts';
// routes
import { mainUrl } from '../../../APIs/axios';
// components
import DataTable from '../../dataTable/DataTable';
import { MIconButton } from '../../@material-extend';

Spareparts.propTypes = {
  deviceSpareparts: PropTypes.array,
  triggeredDeviceId: PropTypes.number,
  ticketState: PropTypes.object
};

function Spareparts({ deviceSparepartsState, triggeredDevice, ticketState }) {
  const setTicket = ticketState[1];
  const [deviceSpareparts, setDeviceSpareparts] = deviceSparepartsState;
  const spareparts = useContext(SparepartsContext).sparepartsState[0];
  const [sparepartsTableRows, setSparepartsTableRows] = useState([]);
  const [triggeredSparepart, setTriggeredSparepart] = useState(0);
  const [assignSparepart, triggerAssignSparepart] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: { requiredQty: 1 },
    validationSchema: Yup.object().shape({
      requiredQty: Yup.number().min(1, 'you cant assign negative value').required('Required qty is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('assignedSparepartId', triggeredSparepart);
      data.append('requiredQty', values.requiredQty);
      await ticketDeviceSparepartsAdder(triggeredDevice, data)
        .then((deviceSparepartsData) => {
          setDeviceSpareparts(deviceSparepartsData.ticket_device_spareparts);
          setTicket(deviceSparepartsData.ticket_details);
          enqueueSnackbar('Sparepart assigned', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt assign sparepart ${error}`, {
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

  const deviceSparepartsMatcher = (sparepartId) => {
    const deviceSparepart = deviceSpareparts.find(
      (deviceSparepart) => deviceSparepart.assigned_sparepart === parseInt(sparepartId, 10)
    );
    return deviceSparepart;
  };

  const deviceSparepartAssignHandler = (sparepartId) => {
    if (deviceSparepartsMatcher(sparepartId)) {
      const data = new FormData();
      data.append('assignedSparepartId', sparepartId);
      ticketDeviceSparepartsDeleter(triggeredDevice, data)
        .then((deviceSparepartsData) => {
          setDeviceSpareparts(deviceSparepartsData.ticket_device_spareparts);
          setTicket(deviceSparepartsData.ticket_details);
          enqueueSnackbar('Sparepart unassigned', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt unassign sparepart ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        });
    } else {
      setTriggeredSparepart(sparepartId);
      triggerAssignSparepart(true);
    }
  };

  const sparepartsDataCreator = () => {
    const sparepartsData = [];
    spareparts.map((sparepart) =>
      sparepartsData.push({
        id: sparepart.id,
        modelNumber: sparepart.spare_part_model_number,
        img: <Avatar src={`${mainUrl}/${sparepart.spare_part_img}`} alt={sparepart.spare_part_model_number} />,
        createdAt: sparepart.added_at,
        action: (
          <Button
            onClick={() => deviceSparepartAssignHandler(sparepart.id)}
            variant="outlined"
            color={deviceSparepartsMatcher(sparepart.id) ? 'error' : 'primary'}
          >
            {deviceSparepartsMatcher(sparepart.id) ? 'Unassign' : 'Assign'}
          </Button>
        )
      })
    );
    return sparepartsData;
  };

  useEffect(() => {
    setSparepartsTableRows(sparepartsDataCreator());
  }, [spareparts, deviceSpareparts]);
  return (
    <>
      <DataTable
        columnsData={[
          { id: 'id', label: 'ID' },
          { id: 'modelNumber', label: 'Model Number' },
          { id: 'img', label: 'Image' },
          { id: 'createdAt', label: 'Created at' },
          { id: 'action', label: 'Action' },
          { id: '' }
        ]}
        rowsData={sparepartsTableRows}
        searchPlaceholder="Search spareparts.."
        filterBy="modelNumber"
      />
      {/* Assign sparepart modal */}
      <Dialog fullWidth maxWidth="sm" open={assignSparepart} onClose={() => triggerAssignSparepart(false)}>
        <DialogTitle>Assign sparepart</DialogTitle>
        <DialogContent>
          <Box component="form" marginTop="30px" onSubmit={handleSubmit}>
            <Grid container>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  onChange={(event) => setFieldValue('requiredQty', event.target.value)}
                  value={values.requiredQty}
                  {...getFieldProps('requiredQty')}
                  error={Boolean(touched.requiredQty && errors.requiredQty)}
                  helperText={touched.requiredQty && errors.requiredQty}
                  fullWidth
                  label="Required QTY"
                  type="number"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
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
    </>
  );
}

export default Spareparts;
