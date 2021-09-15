import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
// material
import { Box, Card, CardHeader } from '@material-ui/core';
// utils
import { ticketDeviceServicesFetcher, ticketDeviceSparepartsFetcher } from '../../../APIs/customerService/tickets';
// context
import { AuthContext } from '../../../contexts';
// components
import FullScreenDialog from '../../FullScreenDialog';
import Spareparts from './Spareparts';
import Services from './Services';

SparepartsServices.propTypes = {
  open: PropTypes.bool,
  closeHandler: PropTypes.func,
  triggeredDevice: PropTypes.number,
  ticketState: PropTypes.object,
  setTicketLogs: PropTypes.func
};

function SparepartsServices({ open, closeHandler, triggeredDevice, ticketState, setTicketLogs }) {
  const [deviceSpareparts, setDeviceSpareparts] = useState([]);
  const [deviceServices, setDeviceServices] = useState([]);
  const userRole = useContext(AuthContext).userState[0].role;

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
          {userRole !== 'customer_service_agent' && (
            <Card>
              <CardHeader title="Spareparts" />
              <Spareparts
                deviceSparepartsState={[deviceSpareparts, setDeviceSpareparts]}
                triggeredDevice={triggeredDevice}
                ticketState={ticketState}
                setTicketLogs={setTicketLogs}
              />
            </Card>
          )}
          <Card sx={{ marginTop: '20px' }}>
            <CardHeader title="Services" />
            <Services
              deviceServicesState={[deviceServices, setDeviceServices]}
              triggeredDevice={triggeredDevice}
              ticketState={ticketState}
              setTicketLogs={setTicketLogs}
            />
          </Card>
        </Box>
      }
    />
  );
}

export default SparepartsServices;
