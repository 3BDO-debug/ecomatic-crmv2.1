import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router';
// material
import { Container, Card, Box, Stack, Tabs, Tab } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Stepper from '../../../components/Stepper';
import AgentStage from '../../../components/_tickets-pages/ticketDetails/AgentStage';
import SupervisorStage from '../../../components/_tickets-pages/ticketDetails/SupervisorStage';
import TechnicianStage from '../../../components/_tickets-pages/ticketDetails/TechnicianStage';

function TicketDetailsPage() {
  const { themeStretch } = useSettings();
  const [currentTab, setCurrentTab] = useState('timeline');
  const { ticketId } = useParams();
  const TABS = [
    {
      value: 'timeline',
      icon: <Icon icon="clarity:timeline-line" width={20} height={20} />,
      component: (
        <Stepper
          steps={[
            { title: 'Agent Stage', id: 1, content: <AgentStage ticketId={ticketId} /> },
            { title: 'Supervisor Stage', id: 2, content: <SupervisorStage /> },
            { title: 'Technician Stage', id: 3, content: <TechnicianStage /> }
          ]}
          finalStepComponent={<h1>iam the final step component</h1>}
        />
      )
    },
    { value: 'logs', icon: <Icon icon="cil:history" width={20} height={20} />, component: <>logs</> }
  ];
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  return (
    <Page title="Tickets | Ticket Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Ticket Details | 21b2a"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'Tickets', href: PATH_DASHBOARD.customerService.tickets.root },
            { name: 'Ticket Details' }
          ]}
        />
        <Card>
          <Box padding="20px">
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
              })}{' '}
            </Stack>
          </Box>
        </Card>
      </Container>
    </Page>
  );
}

export default TicketDetailsPage;
