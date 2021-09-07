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
      category: (
        <Label variant="outlined" color="primary">
          {client.client_category_name}
        </Label>
      ),
      phoneNumber: client.client_phone_number_1,
      landline: client.client_landline_number,
      address: client.client_address,
      createdAt: client.added_at,
      action: (
        <Button
          component={Link}
          to={`/dashboard/clients/client-profile/${client.id}`}
          startIcon={<Icon icon="akar-icons:eye" />}
        />
      )
    })
  );
  return clientsData;
};

export const clientDevicessDataCreator = (clientDevices, triggerDeviceDetails, setTriggeredDevice) => {
  const clientDevicesData = [];
  clientDevices.map((clientDevice) =>
    clientDevicesData.push({
      id: clientDevice.id,
      modelNumber: clientDevice.device_model_number,
      purchasingDate: clientDevice.purchasing_date ? (
        clientDevice.purchasing_date
      ) : (
        <Label variant="ghost" color="error">
          Not available
        </Label>
      ),
      manufacturingDate: clientDevice.manufacturing_date ? (
        clientDevice.manufacturing_date
      ) : (
        <Label variant="ghost" color="error">
          Not available
        </Label>
      ),
      installationDate: clientDevice.installation_date ? (
        clientDevice.installation_date
      ) : (
        <Label variant="ghost" color="error">
          Not available
        </Label>
      ),
      warrantyStartDate: clientDevice.warranty_start_date ? (
        clientDevice.warranty_start_date
      ) : (
        <Label variant="ghost" color="error">
          Not available
        </Label>
      ),
      warrantyStatus: (
        <Label variant="ghost" color="primary">
          {clientDevice.installation_status === 'Not installed' && 'Not available'}
          {clientDevice.installation_status !== 'Not installed' && clientDevice.in_warranty && 'In warranty'}
          {clientDevice.installation_status !== 'Not installed' && !clientDevice.in_warranty && 'Out of warranty'}
        </Label>
      ),
      action: (
        <Button
          onClick={() => {
            setTriggeredDevice(clientDevice);
            triggerDeviceDetails(true);
          }}
          startIcon={<Icon icon="akar-icons:eye" />}
        />
      )
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
        id: ticket.ticket_generated_id,
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
