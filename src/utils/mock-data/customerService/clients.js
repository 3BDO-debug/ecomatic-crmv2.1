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
      warrantyStatus: clientDevice.in_warranty,
      action: (
        <Button
          component={Link}
          to="/dashboard/clients/client-profile/client-device-data"
          startIcon={<Icon icon="akar-icons:eye" />}
        />
      )
    })
  );
  return clientDevicesData;
};

export const feedingSourcesDataCreator = (deviceCategory) => {
  const feedingSourcesData = [];
  const nonHoodFeedingSources = ['Natural Gas', 'Gas Cylinder'];
  const hoodFeedingSources = ['Internal Expulsion', 'External Expulsion'];
  if (deviceCategory !== 'hoods') {
    nonHoodFeedingSources.map((feedingSource, index) => feedingSourcesData.push({ label: feedingSource, id: index }));
  } else if (deviceCategory === 'hoods') {
    hoodFeedingSources.map((feedingSource, index) => feedingSourcesData.push({ label: feedingSource, id: index }));
  }
  return feedingSourcesData;
};
