import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { ticketDeviceServicesFetcher, ticketDeviceSparepartsFetcher } from '../../../APIs/customerService/tickets';
// components
import FullScreenDialog from '../../FullScreenDialog';
import Spareparts from './Spareparts';
import Services from './Services';

SparepartsServices.propTypes = {
  open: PropTypes.bool,
  closeHandler: PropTypes.func,
  triggeredDevice: PropTypes.number,
  ticketState: PropTypes.object
};

function SparepartsServices({ open, closeHandler, triggeredDevice, ticketState }) {
  const [deviceSpareparts, setDeviceSpareparts] = useState([]);
  const [deviceServices, setDeviceServices] = useState([]);
  useEffect(() => {
    ticketDeviceSparepartsFetcher(parseInt(triggeredDevice, 10))
      .then((deviceSparepartsData) => setDeviceSpareparts(deviceSparepartsData))
      .catch((error) => console.log(error));
    ticketDeviceServicesFetcher(parseInt(triggeredDevice, 10))
      .then((deviceServicesData) => setDeviceServices(deviceServicesData))
      .catch((error) => console.log(error));
  }, [triggeredDevice]);
  return (
    <FullScreenDialog
      open={open}
      closeHandler={closeHandler}
      dialogTitle="Add spareparts &amp; services"
      dialogContent={
        <Box padding="30px">
          <Card>
            <CardHeader title="Spareparts" />
            <Spareparts
              deviceSparepartsState={[deviceSpareparts, setDeviceSpareparts]}
              triggeredDevice={triggeredDevice}
              ticketState={ticketState}
            />
          </Card>
          <Card sx={{ marginTop: '20px' }}>
            <CardHeader title="Services" />
            <Services
              deviceServicesState={[deviceServices, setDeviceServices]}
              triggeredDevice={triggeredDevice}
              ticketState={ticketState}
            />
          </Card>
        </Box>
      }
    />
  );
}

export default SparepartsServices;
