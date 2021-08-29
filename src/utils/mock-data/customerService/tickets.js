import { Button } from '@material-ui/core';
import Label from '../../../components/Label';

export const ticketDevicesDataCreator = (ticketDevices, sparepartsServicesState, triggeredDeviceState) => {
  const triggerSparepartsServices = sparepartsServicesState[1];
  const setTriggeredDevice = triggeredDeviceState[1];
  const ticketDevicesData = [];
  ticketDevices.map((ticketDevice) =>
    ticketDevicesData.push({
      modelNumber: ticketDevice.device_model_number,
      ticketType: (
        <Label variant="ghost" color="primary">
          {ticketDevice.device_ticket_type}
        </Label>
      ),
      ticketStatus: (
        <Label variant="ghost" color="info">
          {ticketDevice.device_ticket_status}
        </Label>
      ),
      action: (
        <Button
          onClick={() => {
            triggerSparepartsServices(true);
            setTriggeredDevice(ticketDevice.id);
          }}
          variant="outlined"
        >
          Add spareparts &amp; services
        </Button>
      )
    })
  );
  return ticketDevicesData;
};
