import React, { useState, useEffect, useContext } from 'react';
import { Icon } from '@iconify/react';
import { capitalCase } from 'change-case';
import { useParams } from 'react-router';
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
  Button,
  Alert,
  AlertTitle
} from '@material-ui/core';
// hooks
import useSettings from '../../../hooks/useSettings';
import useLocales from '../../../hooks/useLocales';
// utils
import { ticketDetailsDataCreator } from '../../../utils/mock-data/customerService/tickets';
import { ticketDevicesFetcher } from '../../../APIs/customerService/tickets';
import { ticketLogsFetcher } from '../../../APIs/systemUpdates';
/* import { closeTicketValidation } from '../../../utils/closeTicketValidation';
 */ // routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// context
import { TicketsContext } from '../../../contexts';
import { AuthContext } from '../../../contexts/AuthContext';
// components
import Page from '../../../components/Page';
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs';
import Stepper from '../../../components/Stepper';
import AgentStage from '../../../components/_tickets-pages/ticketDetails/AgentStage';
import TechniciansSupervisorStage from '../../../components/_tickets-pages/ticketDetails/TechniciansSupervisorStage';
import TechnicianStage from '../../../components/_tickets-pages/ticketDetails/TechnicianStage';
import FollowBackCall from '../../../components/_tickets-pages/ticketDetails/FollowBackCall';
import TicketInfo from '../../../components/_tickets-pages/ticketDetails/TicketInfo';
import Label from '../../../components/Label';
import TicketLogs from '../../../components/_tickets-pages/ticketDetails/TicketLogs';
import TicketActions from '../../../components/_tickets-pages/ticketDetails/TicketActions';

function TicketDetailsPage() {
  const { themeStretch } = useSettings();
  const [ticketLogs, setTicketLogs] = useState([]);
  const { translate } = useLocales();
  const [activeStep, setActiveStep] = useState(0);
  const userRole = useContext(AuthContext).userState[0].role;
  const [currentTab, setCurrentTab] = useState('timeline');
  const { ticketId } = useParams();
  const tickets = useContext(TicketsContext).ticketsState[0];
  const [ticketDetails, setTicketDetails] = useState({});
  const [ticketDevices, setTicketDevices] = useState([]);
  const [ticketCloseAlert, triggerTicketCloseAlert] = useState(false);

  const [ticketActions, triggerTicketActions] = useState(false);

  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  useEffect(() => {
    if (ticketDetails) {
      if (ticketDetails.current_stage === 'agent-stage') {
        setCurrentStep(0);
      } else if (ticketDetails.current_stage === 'technical-support-stage') {
        setCurrentStep(1);
      } else if (ticketDetails.current_stage === 'technicians-supervisor-stage') {
        setCurrentStep(2);
      } else if (ticketDetails.current_stage === 'technician-stage') {
        setCurrentStep(3);
      } else if (ticketDetails.current_stage === 'follow-up-stage') {
        setCurrentStep(4);
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
          currentStage={currentStep}
          steps={[
            {
              title: 'Agent Stage',
              id: 1,
              content: (
                <AgentStage
                  ticketDevicesState={[ticketDevices, setTicketDevices]}
                  ticketId={ticketId}
                  ticketState={[ticketDetails, setTicketDetails]}
                  setTicketLogs={setTicketLogs}
                  activeView={activeStep}
                />
              ),
              active: currentStep === 0 && true
            },
            {
              title: 'Technical support stage',
              active: currentStep === 1 && true,
              id: 2,
              content: (
                <AgentStage
                  ticketDevicesState={[ticketDevices, setTicketDevices]}
                  ticketId={ticketId}
                  ticketState={[ticketDetails, setTicketDetails]}
                  setTicketLogs={setTicketLogs}
                  activeView={activeStep}
                />
              )
            },
            {
              active: currentStep === 2 && true,
              title: 'Technicians supervisor stage',
              id: 3,
              content: !['admin', 'technicians_supervisor', 'customer_service_supervisor'].includes(userRole) ? (
                <Container>
                  <Alert severity="error">
                    <AlertTitle>Permission Denied</AlertTitle>
                    You do not have permission to view this screen
                  </Alert>
                </Container>
              ) : (
                <TechniciansSupervisorStage
                  setTicketLogs={setTicketLogs}
                  ticketDetailsState={[ticketDetails, setTicketDetails]}
                />
              )
            },
            {
              active: currentStep === 3 && true,
              title: 'Technician Stage',
              id: 4,
              content: (
                <TechnicianStage
                  setTicketLogs={setTicketLogs}
                  ticketState={[ticketDetails, setTicketDetails]}
                  ticketDevicesState={[ticketDevices, setTicketDevices]}
                  activeView={activeStep}
                />
              )
            }
          ]}
          finalStepComponent={
            !['admin', 'technicians_supervisor', 'customer_service_supervisor', 'customer_service_agent'].includes(
              userRole
            ) ? (
              <Container>
                <Alert severity="error">
                  <AlertTitle>Permission Denied</AlertTitle>
                  You do not have permission to view this screen
                </Alert>
              </Container>
            ) : (
              <FollowBackCall
                setTicketLogs={setTicketLogs}
                ticketDetailsState={[ticketDetails, setTicketDetails]}
                ticketDevices={ticketDevices}
              />
            )
          }
        />
      )
    },
    {
      value: 'Info',
      icon: <Icon icon="akar-icons:info" width={20} height={20} />,
      component: <TicketInfo ticketDetails={ticketDetails} ticketDevices={ticketDevices} />
    },

    {
      value: 'logs',
      icon: <Icon icon="cil:history" width={20} height={20} />,
      component: <TicketLogs ticketLogsState={[ticketLogs, setTicketLogs]} />
    }
  ];
  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue);
  };
  useEffect(() => {
    setTicketDetails(ticketDetailsDataCreator(tickets, ticketId));
    ticketLogsFetcher(ticketId)
      .then((logsResponse) => setTicketLogs(logsResponse))
      .catch((error) => console.log(error));
  }, [tickets, ticketId]);

  const handleTicketStatusLabel = () => {
    let labelColor;
    if (ticketDetails.ticket_status === 'Closed') {
      labelColor = 'error';
    } else if (ticketDetails.ticket_status === 'Pending') {
      labelColor = 'warning';
    } else {
      labelColor = 'info';
    }
    return labelColor;
  };

  return (
    <Page title="Tickets | Ticket Details">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading={
            ticketDetails && (
              <Stack direction="row" alignItems="center">
                {`${translate('ticketDetailsPage.headerBreadcrumb.header')} | ${ticketDetails.ticket_generated_id} `}
                <Label
                  style={{ marginLeft: '10px', marginRight: '10px' }}
                  variant="ghost"
                  color={handleTicketStatusLabel()}
                >
                  {ticketDetails.ticket_status}
                </Label>
                {ticketDetails.ticket_forced_status && (
                  <Label variant="ghost" color="primary">
                    {ticketDetails.ticket_forced_status}
                  </Label>
                )}
              </Stack>
            )
          }
          links={[
            { name: translate('ticketDetailsPage.headerBreadcrumb.links.root'), href: PATH_DASHBOARD.root },
            {
              name: translate('ticketDetailsPage.headerBreadcrumb.links.main'),
              href: PATH_DASHBOARD.customerService.tickets.root
            },
            { name: translate('ticketDetailsPage.headerBreadcrumb.links.root') }
          ]}
          action={
            userRole !== 'technician' && (
              <Button
                onClick={() => triggerTicketActions(true)}
                startIcon={<Icon icon="grommet-icons:trigger" />}
                variant="contained"
              >
                {translate('ticketDetailsPage.ticketActions.title')}
              </Button>
            )
          }
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
        {/* Ticket actions */}
        <TicketActions
          isTriggered={ticketActions}
          triggerHandler={() => triggerTicketActions(false)}
          ticketState={[ticketDetails, setTicketDetails]}
          setTicketLogs={setTicketLogs}
          setActiveStep={setActiveStep}
        />
      </Container>
    </Page>
  );
}

export default TicketDetailsPage;
