import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import { Container, Card, Box, Stack, Tabs, Tab } from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
// utils
import { ticketDetailsDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { ticketUpdater } from '../../../APIs/customerService/tickets';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// context
import { TicketsContext } from '../../../contexts';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Stepper from '../../../components/Stepper';
import AgentStage from '../../../components/_tickets-pages/ticketDetails/AgentStage';
import SupervisorStage from '../../../components/_tickets-pages/ticketDetails/SupervisorStage';
import TechnicianStage from '../../../components/_tickets-pages/ticketDetails/TechnicianStage';
import FollowBackCall from '../../../components/_tickets-pages/ticketDetails/FollowBackCall';
import TicketInfo from '../../../components/_tickets-pages/ticketDetails/TicketInfo';
import { MIconButton } from '../../../components/@material-extend';

function TicketDetailsPage() {
  const { themeStretch } = useSettings();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [currentTab, setCurrentTab] = useState('timeline');
  const { ticketId } = useParams();
  const [tickets, setTickets] = useContext(TicketsContext).ticketsState;
  const [ticketDetails, setTicketDetails] = useState({});

  const [activeStep, setActiveStep] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [showNext, setShowNext] = useState(false);
  const [nextIsLoading, setNextIsLoading] = useState(false);

  const nextHandler = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    stageChecker();
  };

  const backHandler = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const resetHandler = () => {
    setActiveStep(0);
  };

  const showNextHandler = () => {
    if (currentStep >= activeStep) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  };

  const ticketStageUpdater = () => {
    setNextIsLoading(true);
    const data = new FormData();
    if (ticketDetails.current_stage === 'agent-stage') {
      data.append('currentStage', 'supervisor-stage');
    } else if (ticketDetails.current_stage === 'supervisor-stage') {
      data.append('currentStage', 'technician-stage');
    } else if (ticketDetails.current_stage === 'technician-stage') {
      data.append('currentStage', 'customer-service-stage');
    }
    ticketUpdater(ticketDetails.id, data)
      .then((ticketDetailsData) => {
        setTicketDetails(ticketDetailsData);
        enqueueSnackbar('Ticket proceeded to next stage', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        setNextIsLoading(false);
      })
      .catch((error) => console.log(error));
  };

  const stageChecker = () => {
    if (activeStep === currentStep) {
      ticketStageUpdater();
    }
    showNextHandler();
  };
  useEffect(() => {
    showNextHandler();
  }, [activeStep]);

  useEffect(() => {
    if (ticketDetails) {
      if (ticketDetails.current_stage === 'agent-stage') {
        setActiveStep(0);
        setCurrentStep(0);
      } else if (ticketDetails.current_stage === 'supervisor-stage') {
        setActiveStep(1);
        setCurrentStep(1);
      } else if (ticketDetails.current_stage === 'technician-stage') {
        setActiveStep(2);
        setCurrentStep(2);
      } else if (ticketDetails.current_stage === 'customer-service-stage') {
        setActiveStep(3);
        setCurrentStep(3);
      }
      showNextHandler();
    }
  }, [ticketDetails]);

  const TABS = [
    {
      value: 'timeline',
      icon: <Icon icon="clarity:timeline-line" width={20} height={20} />,
      component: (
        <Stepper
          showNext={showNext}
          activeStepState={[activeStep, setActiveStep]}
          skippedState={[skipped, setSkipped]}
          nextHandler={nextHandler}
          backHandler={backHandler}
          resetHandler={resetHandler}
          currentStep={currentStep}
          nextIsLoading={nextIsLoading}
          steps={[
            {
              title: 'Agent Stage',
              id: 1,
              content: <AgentStage ticketId={ticketId} ticketState={[ticketDetails, setTicketDetails]} />
            },
            {
              title: 'Supervisor Stage',
              id: 2,
              content: <SupervisorStage ticketDetailsState={[ticketDetails, setTicketDetails]} />
            },
            {
              title: 'Technician Stage',
              id: 3,
              content: <TechnicianStage ticketState={[ticketDetails, setTicketDetails]} />
            }
          ]}
          finalStepComponent={<FollowBackCall ticketDetailsState={[ticketDetails, setTicketDetails]} />}
        />
      )
    },
    {
      value: 'Info',
      icon: <Icon icon="akar-icons:info" width={20} height={20} />,
      component: <TicketInfo ticketDetails={ticketDetails} />
    },

    { value: 'logs', icon: <Icon icon="cil:history" width={20} height={20} />, component: <>logs</> }
  ];
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    setTicketDetails(ticketDetailsDataCreator(tickets, ticketId));
  }, [tickets, ticketId]);
  return (
    <Page title="Tickets | Ticket Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={`Ticket Details | ${ticketDetails && ticketDetails.id}`}
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
