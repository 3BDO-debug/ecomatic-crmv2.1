import { Box, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Icon } from '@iconify/react';
// APIs
import { ticketDeviceServicesFetcher, ticketDeviceSparepartsFetcher } from '../../../APIs/customerService/tickets';
// components
import Label from '../../../components/Label';

export const ticketsDataCreator = (tickets) => {
  const ticketsData = [];
  tickets.map((ticket) =>
    ticketsData.push({
      id: ticket.id,
      clientName: ticket.client_name,
      technicianName:
        ticket.technician_name !== 'Technician Not Selected Yet' ? (
          ticket.technician_name
        ) : (
          <Label variant="ghost" color="error">
            Technician not yet selected
          </Label>
        ),
      intializedAt: ticket.created_at,
      currentStage: (
        <Label variant="ghost" color="info">
          {ticket.current_stage}
        </Label>
      ),
      status: (
        <Label variant="ghost" color={ticket.is_closed ? 'error' : 'info'}>
          {ticket.is_closed ? 'Closed' : 'Not yet closed'}
        </Label>
      ),
      action: (
        <Button
          component={Link}
          to={`/dashboard/tickets/ticket-details/${ticket.id}`}
          startIcon={<Icon icon="akar-icons:eye" />}
        />
      )
    })
  );
  return ticketsData;
};

async function ticketDeviceSparepartsServices(deviceId) {
  const deviceSparepartsServices = [];
  await ticketDeviceSparepartsFetcher(deviceId)
    .then((deviceSparepartsData) =>
      deviceSparepartsData.map((deviceSparepart) =>
        deviceSparepartsServices.push({
          description: (
            <Label variant="ghost" color="info">
              Sparepart {deviceSparepart.spare_part_model_number}
            </Label>
          ),
          qty: deviceSparepart.required_qty,
          price: deviceSparepart.spare_part_price,
          sum: deviceSparepart.required_qty * deviceSparepart.spare_part_price
        })
      )
    )
    .catch((error) => console.log(error));
  await ticketDeviceServicesFetcher(deviceId)
    .then((deviceServicesData) =>
      deviceServicesData.map((deviceService) =>
        deviceSparepartsServices.push({
          description: (
            <Label variant="ghost" color="info">
              Service {deviceService.service_name}
            </Label>
          ),
          qty: deviceService.required_qty,
          price: deviceService.service_price,
          sum: deviceService.required_qty * deviceService.service_price
        })
      )
    )
    .catch((error) => console.log(error));
  return deviceSparepartsServices;
}

export const ticketDevicesDataCreator = async (
  ticketDevices,
  triggerSparepartsServices,
  setTriggeredDevice,
  triggerDeviceDetails
) => {
  const ticketDevicesData = [];
  const mapper = ticketDevices.map((ticketDevice) =>
    ticketDeviceSparepartsServices(ticketDevice.id).then((deviceSparepartsServices) =>
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
          <Box component="div">
            <Button
              onClick={() => {
                triggerSparepartsServices(true);
                setTriggeredDevice(ticketDevice.id);
              }}
              variant="outlined"
            >
              Add spareparts &amp; services
            </Button>
            <Button
              sx={{ marginLeft: '10px' }}
              startIcon={<Icon icon="carbon:view" />}
              onClick={() => {
                setTriggeredDevice(ticketDevice.id);
                triggerDeviceDetails(true);
              }}
            />
          </Box>
        ),
        collapsibleRow: true,
        collapsibleContent: {
          title: 'Spareparts & services',
          collapsibleColumnsData: [
            { id: 'description', label: 'Description' },
            { id: 'qty', label: 'QTY' },
            { id: 'price', label: 'Price' },
            { id: 'sum', label: 'Sum' }
          ],
          collapsibleRowsData: deviceSparepartsServices
        }
      })
    )
  );
  await Promise.all(mapper);
  return ticketDevicesData;
};

export const ticketDetailsDataCreator = (tickets, ticketId) => {
  const ticket = tickets.find((ticket) => ticket.id === parseInt(ticketId, 10));
  return ticket;
};
