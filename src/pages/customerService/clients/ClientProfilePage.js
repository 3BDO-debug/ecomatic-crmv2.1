import React, { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useParams } from 'react-router';
import plusFill from '@iconify/icons-eva/plus-fill';
// material
import { Container, Stack, Tab, Tabs, Box, Button } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
import { clientDataFetcher, clientDevicesFetcher } from '../../../APIs/customerService/clients';
import { clientLogsFetcher } from '../../../APIs/systemUpdates';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Label from '../../../components/Label';
import ClientInfo from '../../../components/_clients-pages/clientProfile/ClientInfo';
import ClientDevices from '../../../components/_clients-pages/clientProfile/ClientDevices';
import ClientTickets from '../../../components/_clients-pages/clientProfile/ClientTickets';
import AddClientDevice from '../../../components/_clients-pages/clientProfile/AddClientDevice';
import ClientLogs from '../../../components/_clients-pages/clientProfile/ClientLogs';

function ClientProfilePage() {
  const { translate } = useLocales();
  const { themeStretch } = useSettings();
  const { clientId } = useParams();
  const [clientLogs, setClientLogs] = useState([]);
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
    clientLogsFetcher(clientId)
      .then((logsResponse) => setClientLogs(logsResponse))
      .catch((error) => console.log(error));
  }, [clientId]);

  const TABS = [
    {
      label: translate('clientProfilePage.navTabs.info'),
      value: 'info',
      icon: <Icon icon="akar-icons:info" width={20} height={20} />,
      component: (
        <ClientInfo setClientLogs={setClientLogs} clientId={clientId} clientDataState={[clientData, setClientData]} />
      )
    },
    {
      label: translate('clientProfilePage.navTabs.devices'),
      value: 'devices',
      icon: <Icon icon="carbon:block-storage-alt" width={20} height={20} />,
      component: (
        <ClientDevices
          setClientLogs={setClientLogs}
          clientId={clientId}
          clientDevicesState={[clientDevices, setClientDevices]}
        />
      )
    },
    {
      label: translate('clientProfilePage.navTabs.tickets'),
      value: 'tickets',
      icon: <Icon icon="akar-icons:ticket" width={20} height={20} />,
      component: <ClientTickets clientId={clientId} />
    },
    {
      label: translate('clientProfilePage.navTabs.logs'),
      value: 'logs',
      icon: <Icon icon="cil:history" width={20} height={20} />,
      component: <ClientLogs clientLogsState={[clientLogs, setClientLogs]} />
    }
  ];

  return (
    <Page title="Clients | Client Profile">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            <>
              {clientData.client_full_name}
              <Label style={{ marginLeft: '10px' }} variant="ghost" color="info">
                {clientData.client_category_name}
              </Label>
            </>
          }
          links={[
            { name: translate('clientProfilePage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('clientProfilePage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.customerService.clients.root
            },
            { name: translate('clientProfilePage.headerBreadcrumb.links.current') }
          ]}
          action={
            <Button
              startIcon={<Icon icon={plusFill} />}
              variant="contained"
              onClick={() => triggerAddClientDevice(true)}
            >
              {translate('clientProfilePage.headerBreadcrumb.actionButton')}
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
              <Tab disableRipple key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
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
          setClientLogs={setClientLogs}
        />
      </Container>
    </Page>
  );
}

export default ClientProfilePage;
