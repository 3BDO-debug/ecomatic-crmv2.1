import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
// material
import { Container, Stack, Tab, Tabs, Box } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Label from '../../../components/Label';
import ClientInfo from '../../../components/_clients-pages/clientProfile/ClientInfo';
import ClientDevices from '../../../components/_clients-pages/clientProfile/ClientDevices';
import ClientTickets from '../../../components/_clients-pages/clientProfile/ClientTickets';

function ClientProfilePage() {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('info');

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };

  const TABS = [
    { value: 'info', icon: <Icon icon="akar-icons:info" width={20} height={20} />, component: <ClientInfo /> },
    {
      value: 'devices',
      icon: <Icon icon="carbon:block-storage-alt" width={20} height={20} />,
      component: <ClientDevices />
    },
    { value: 'tickets', icon: <Icon icon="akar-icons:ticket" width={20} height={20} />, component: <ClientTickets /> },
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
                VIP
              </Label>
            </>
          }
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Clients', href: PATH_DASHBOARD.customerService.clients.root },
            { name: 'Client Profile' }
          ]}
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
      </Container>
    </Page>
  );
}

export default ClientProfilePage;
