import { Button } from '@material-ui/core';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import Label from '../../../components/Label';

export const clientsDataCreator = (clients) => {
  const clientsData = [];
  clients.map((client) =>
    clientsData.push({
      id: client.id,
      fullName: client.client_full_name,
      phoneNumber1: client.client_phone_number_1,
      phoneNumber2: client.client_phone_number_2,
      region: client.client_region_name,
      category: client.client_category_name,
      createdAt: new Date(client.added_at).toLocaleString(),
      action: client.id
    })
  );
  return clientsData;
};

export const clientDevicessDataCreator = (clientDevices) => {
  const clientDevicesData = [];
  clientDevices.map((clientDevice) =>
    clientDevicesData.push({
      id: clientDevice.id,
      modelNumber: clientDevice.device_model_number,
      purchasingDate: clientDevice.purchasing_date,
      manufacturingDate: clientDevice.manufacturing_date,
      installationDate: clientDevice.installation_date,
      warrantyStartDate: clientDevice.warranty_start_date,
      warrantyStatus: clientDevice,
      action: clientDevice
    })
  );
  return clientDevicesData;
};

export const clientTicketsDataCreator = (tickets, clientId) => {
  const ticketsData = [];
  tickets.map(
    (ticket) =>
      ticket.related_client === parseInt(clientId, 10) &&
      ticketsData.push({
        ticketNumber: ticket.ticket_generated_id,
        id: ticket.id,
        clientName: ticket.client_name,
        technicianName:
          ticket.technician_name !== 'Technician not selected yet' ? (
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

export const feedingSourcesDataCreator = (deviceCategory) => {
  const feedingSourcesData = [];
  const nonHoodFeedingSources = ['Natural Gas', 'Gas Cylinder'];
  const hoodFeedingSources = ['Internal Expulsion', 'External Expulsion'];
  if (deviceCategory !== 'hood') {
    nonHoodFeedingSources.map((feedingSource, index) => feedingSourcesData.push({ label: feedingSource, id: index }));
  } else if (deviceCategory === 'hood') {
    hoodFeedingSources.map((feedingSource, index) => feedingSourcesData.push({ label: feedingSource, id: index }));
  }
  return feedingSourcesData;
};
