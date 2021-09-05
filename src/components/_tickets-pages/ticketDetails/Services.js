import React, { useContext, useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketDeviceServicesAdder, ticketDeviceServicesDeleter } from '../../../APIs/customerService/tickets';
// context
import { ConfigurationsContext } from '../../../contexts';
// components
import DataTable from '../../dataTable/DataTable';
import { MIconButton } from '../../@material-extend';

Spareparts.propTypes = {
  deviceServicesState: PropTypes.array,
  triggeredDevice: PropTypes.number,
  ticketState: PropTypes.object
};

function Spareparts({ deviceServicesState, triggeredDevice, ticketState }) {
  const setTicket = ticketState[1];
  const [deviceServices, setDeviceServices] = deviceServicesState;
  const services = useContext(ConfigurationsContext).servicesState[0];
  const [servicesTableRows, setServicesTableRows] = useState([]);
  const [triggeredService, setTriggeredService] = useState(0);
  const [assignService, triggerAssignService] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: { requiredQty: 0 },
    validationSchema: Yup.object().shape({
      requiredQty: Yup.number().min(0, 'you cant assign negative value').required('Required qty is required')
    }),
    onSubmit: async (values, { resetForm }) => {
      const data = new FormData();
      data.append('assignedServiceId', triggeredService);
      data.append('requiredQty', values.requiredQty);
      await ticketDeviceServicesAdder(triggeredDevice, data)
        .then((deviceServicesData) => {
          setDeviceServices(deviceServicesData.ticket_device_services);
          setTicket(deviceServicesData.ticket_details);
          enqueueSnackbar('Service assigned', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt assign service ${error}`, {
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

  const deviceServicesMatcher = useCallback(
    (serviceId) => {
      const deviceService = deviceServices.find(
        (deviceService) => deviceService.assigned_service === parseInt(serviceId, 10)
      );
      return deviceService;
    },
    [deviceServices]
  );

  const deviceServiceAssignHandler = useCallback(
    (serviceId) => {
      if (deviceServicesMatcher(serviceId)) {
        const data = new FormData();
        data.append('assignedServiceId', serviceId);
        ticketDeviceServicesDeleter(triggeredDevice, data)
          .then((deviceServicesData) => {
            setDeviceServices(deviceServicesData.ticket_device_services);
            setTicket(deviceServicesData.ticket_details);
            enqueueSnackbar('Service unassigned', {
              variant: 'success',
              action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </MIconButton>
              )
            });
          })
          .catch((error) => {
            enqueueSnackbar(`Couldnt unassign service ${error}`, {
              variant: 'error',
              action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </MIconButton>
              )
            });
          });
      } else {
        setTriggeredService(serviceId);
        triggerAssignService(true);
      }
    },
    [closeSnackbar, deviceServicesMatcher, enqueueSnackbar, setDeviceServices, setTicket, triggeredDevice]
  );

  const servicesDataCreator = useCallback(() => {
    const servicesData = [];
    services.map((service) =>
      servicesData.push({
        id: service.id,
        serviceName: service.service_name,
        price: service.service_price,
        action: (
          <Button
            onClick={() => deviceServiceAssignHandler(service.id)}
            variant="outlined"
            color={deviceServicesMatcher(service.id) ? 'error' : 'primary'}
          >
            {deviceServicesMatcher(service.id) ? 'Unassign' : 'Assign'}
          </Button>
        )
      })
    );
    return servicesData;
  }, [deviceServiceAssignHandler, deviceServicesMatcher, services]);

  useEffect(() => {
    setServicesTableRows(servicesDataCreator());
  }, [services, deviceServices, servicesDataCreator]);
  return (
    <>
      <DataTable
        columnsData={[
          { id: 'id', label: 'ID' },
          { id: 'serviceName', label: 'Service name' },
          { id: 'price', label: 'Price' },
          { id: 'action', label: 'Action' },
          { id: '' }
        ]}
        rowsData={servicesTableRows}
        searchPlaceholder="Search services.."
        filterBy="serviceName"
      />
      {/* Assign sparepart modal */}
      <Dialog fullWidth maxWidth="sm" open={assignService} onClose={() => triggerAssignService(false)}>
        <DialogTitle>Assign service</DialogTitle>
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
