import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// utils
import { ticketLogs } from './systemUpdates';
// APIs
import {
  ticketDeviceServicesFetcher,
  ticketDeviceSparepartsFetcher,
  ticketDeviceUpdater
} from '../APIs/customerService/tickets';
// components
import { MIconButton } from '../components/@material-extend';

export const completeTicketDeviceHandler = async (
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
  await ticketDeviceUpdater(ticketDetails.id, data)
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

const ticketDeviceSparepartsServicesReport = async (ticketDeviceId) => {
  const ticketDeviceSparepartsServices = [];
  await ticketDeviceSparepartsFetcher(ticketDeviceId)
    .then((ticketDeviceSparepartsData) =>
      ticketDeviceSparepartsData.map((ticketDeviceSparepart) =>
        ticketDeviceSparepartsServices.push({
          description: `Sparepart - ${ticketDeviceSparepart.spare_part_model_number}`,
          qty: ticketDeviceSparepart.required_qty,
          price: ticketDeviceSparepart.spare_part_price,
          sum: ticketDeviceSparepart.required_qty * ticketDeviceSparepart.spare_part_price
        })
      )
    )
    .catch((error) => console.log(error));

  await ticketDeviceServicesFetcher(ticketDeviceId)
    .then((ticketDeviceServicesData) =>
      ticketDeviceServicesData.map((ticketDeviceService) =>
        ticketDeviceSparepartsServices.push({
          description: `Service - ${ticketDeviceService.service_name}`,
          qty: ticketDeviceService.required_qty,
          price: ticketDeviceService.service_price,
          sum: ticketDeviceService.required_qty * ticketDeviceService.service_price
        })
      )
    )
    .catch((error) => console.log(error));

  return ticketDeviceSparepartsServices;
};

export const ticketDevicesReport = async (ticketDevices) => {
  const ticketDevicesData = [];
  const mapper = ticketDevices.map((ticketDevice) =>
    ticketDeviceSparepartsServicesReport(ticketDevice.id).then((sparepartsServicesData) =>
      ticketDevicesData.push({
        id: ticketDevice.device_model_number,
        issue: ticketDevice.extra_notes,
        ticketType: ticketDevice.device_ticket_type,
        collapsibleData: sparepartsServicesData
      })
    )
  );
  await Promise.all(mapper);
  return ticketDevicesData;
};
