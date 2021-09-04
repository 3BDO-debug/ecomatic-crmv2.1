import React, { useState, useEffect, useContext, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import {
  Container,
  Card,
  Box,
  Stack,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  DialogActions,
  Button
} from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// utils
import { ticketDetailsDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { ticketUpdater, ticketDevicesFetcher } from '../../../APIs/customerService/tickets';
/* import { closeTicketValidation } from '../../../utils/closeTicketValidation';
 */ // routes
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
import Label from '../../../components/Label';

function TicketDetailsPage() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [activeStep, setActiveStep] = useState(0);

  const [showNext, setShowNext] = useState(false);

  const [currentTab, setCurrentTab] = useState('timeline');
  const { ticketId } = useParams();
  const tickets = useContext(TicketsContext).ticketsState[0];
  const [ticketDetails, setTicketDetails] = useState({});
  const [ticketDevices, setTicketDevices] = useState([]);
  const [ticketCloseAlert, triggerTicketCloseAlert] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const updateStageHandler = () => {
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
      })
      .catch((error) => console.log(error));
  };

  const handleNext = () => {
    if (ticketDetails.current_stage !== 'customer-service-stage') {
      updateStageHandler();
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const showNextHandler = useCallback(() => {
    if (currentStep >= activeStep) {
      setShowNext(true);
    } else {
      setShowNext(false);
    }
  }, [activeStep, currentStep]);

  useEffect(() => {
    showNextHandler();
  }, [activeStep, showNextHandler]);
  console.log(showNext);
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
    }
  }, [ticketDetails]);

  useEffect(() => {
    ticketDevicesFetcher(ticketId)
      .then((ticketDevicesData) => {
        setTicketDevices(ticketDevicesData);
      })
      .catch((error) => console.log(error));
  }, [ticketId, ticketDetails]);
  const TABS = [
    {
      value: 'timeline',
      icon: <Icon icon="clarity:timeline-line" width={20} height={20} />,
      component: (
        <Stepper
          activeStepState={[activeStep, setActiveStep]}
          nextHandler={handleNext}
          backHandler={handleBack}
          resetHandler={handleReset}
          nextStageHandler={updateStageHandler}
          steps={[
            {
              title: 'Agent Stage',
              id: 1,
              content: (
                <AgentStage
                  ticketDevicesState={[ticketDevices, setTicketDevices]}
                  ticketId={ticketId}
                  ticketState={[ticketDetails, setTicketDetails]}
                />
              ),
              active: currentStep === 0 && true
            },
            {
              active: currentStep === 1 && true,
              title: 'Supervisor Stage',
              id: 2,
              content: <SupervisorStage ticketDetailsState={[ticketDetails, setTicketDetails]} />
            },
            {
              active: currentStep === 2 && true,
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
          heading={
            <>
              {`${translate('ticketDetailsPage.headerBreadcrumb.header')} | ${ticketDetails && ticketDetails.id} `}
              {ticketDetails && ticketDetails.is_closed && (
                <Label style={{ marginLeft: '10px' }} variant="ghost" color="error">
                  Closed
                </Label>
              )}
            </>
          }
          links={[
            { name: translate('ticketDetailsPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('ticketDetailsPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.customerService.tickets.root
            },
            { name: translate('ticketDetailsPage.headerBreadcrumb.links.root') }
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
              })}
            </Stack>
          </Box>
        </Card>
        {/* Ticket close alert */}
        <Dialog open={ticketCloseAlert} onClose={() => triggerTicketCloseAlert(false)}>
          <DialogTitle>
            <Button color="error" startIcon={<Icon icon="eva:alert-triangle-outline" width={30} height={30} />}>
              Alert
            </Button>
          </DialogTitle>
          <DialogContent>
            <Box marginTop="30px">
              <Typography variant="body2">
                You can't close the ticket since there's devices still in progress please wait till technicain to
                proceed them then try again
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => triggerTicketCloseAlert(false)}>Understood</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Page>
  );
}

export default TicketDetailsPage;
