import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Stack, Tab, Tabs, Box, Button } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { clientDataFetcher, clientDevicesFetcher } from '../../../APIs/customerService/clients';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Label from '../../../components/Label';
import ClientInfo from '../../../components/_clients-pages/clientProfile/ClientInfo';
import ClientDevices from '../../../components/_clients-pages/clientProfile/ClientDevices';
import ClientTickets from '../../../components/_clients-pages/clientProfile/ClientTickets';
import AddClientDevice from '../../../components/_clients-pages/clientProfile/AddClientDevice';

function ClientProfilePage() {
  const { themeStretch } = useSettings();
  const { clientId } = useParams();
  const [currentTab, setCurrentTab] = useState('info');
  const [clientData, setClientData] = useState({});
  const [clientDevices, setClientDevices] = useState([]);
  const [addClientDevice, triggerAddClientDevice] = useState(false);
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  useEffect(() => {
    clientDataFetcher(clientId)
      .then((clientDataResponse) => setClientData(clientDataResponse))
      .catch((error) => console.log(error));
    clientDevicesFetcher(clientId)
      .then((clientDevicesResponse) => setClientDevices(clientDevicesResponse))
      .catch((error) => console.log(error));
  }, [clientId]);

  const TABS = [
    {
      value: 'info',
      icon: <Icon icon="akar-icons:info" width={20} height={20} />,
      component: <ClientInfo clientId={clientId} clientDataState={[clientData, setClientData]} />
    },
    {
      value: 'devices',
      icon: <Icon icon="carbon:block-storage-alt" width={20} height={20} />,
      component: <ClientDevices clientId={clientId} clientDevicesState={[clientDevices, setClientDevices]} />
    },
    {
      value: 'tickets',
      icon: <Icon icon="akar-icons:ticket" width={20} height={20} />,
      component: <ClientTickets clientId={clientId} />
    },
    { value: 'logs', icon: <Icon icon="cil:history" width={20} height={20} />, component: <>logs</> }
  ];

  return (
    <Page title="Clients | Client Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            <>
              Abdelrahman Essam
              <Label style={{ marginLeft: '10px' }} variant="ghost" color="info">
                {clientData.client_category_name}
              </Label>
            </>
          }
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clients', href: PATH_DASHBOARD.customerService.clients.root },
            { name: 'Client Profile' }
          ]}
          action={
            <Button
              startIcon={<Icon icon={plusFill} />}
              variant="contained"
              onClick={() => triggerAddClientDevice(true)}
            >
              Add New Device
            </Button>
          }
        />
        <Stack spacing={5}>
          <Tabs
            value={currentTab}
            scrollButtons="auto"
            variant="scrollable"
            allowScrollButtonsMobile
            onChange={handleChangeTab}
          >
            {TABS.map((tab) => (
              <Tab disableRipple key={tab.value} label={capitalCase(tab.value)} icon={tab.icon} value={tab.value} />
            ))}
          </Tabs>
          {TABS.map((tab) => {
            const isMatched = tab.value === currentTab;
            return isMatched && <Box key={tab.value}>{tab.component}</Box>;
          })}
        </Stack>

        {/* Add Client Device */}
        <AddClientDevice
          clientDevicesState={[clientDevices, setClientDevices]}
          clientId={clientId}
          open={addClientDevice}
          closeHandler={() => triggerAddClientDevice(false)}
        />
      </Container>
    </Page>
  );
}

export default ClientProfilePage;
