import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// utils
import { ticketLogs } from './systemUpdates';
// APIs
import { ticketDeviceUpdater } from '../APIs/customerService/tickets';
// components
import { MIconButton } from '../components/@material-extend';

export const completeTicketDeviceHandler = (
  ticketDeviceId,
  ticketDetails,
  setTicketDevices,

  enqueueSnackbar,
  closeSnackbar,
  setTicketLogs
) => {
  const data = new FormData();
  data.append('ticketDeviceId', ticketDeviceId);
  data.append('markCompleted', 'markCompleted');
  data.append('currentStage', 'technician-stage');
  ticketDeviceUpdater(ticketDetails.id, data)
    .then((ticketDevicesData) => {
      setTicketDevices(ticketDevicesData);

      enqueueSnackbar('Device marked  completed', {
        variant: 'success',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
      ticketLogs(
        ticketDetails.id,
        `Device with ID - ${ticketDeviceId} marked completed`,
        ticketDetails.current_stage,
        setTicketLogs
      );
    })
    .catch((error) => {
      enqueueSnackbar(`Couldnt mark device completed ${error}`, {
        variant: 'error',
        action: (key) => (
          <MIconButton size="small" onClick={() => closeSnackbar(key)}>
            <Icon icon={closeFill} />
          </MIconButton>
        )
      });
    });
};
