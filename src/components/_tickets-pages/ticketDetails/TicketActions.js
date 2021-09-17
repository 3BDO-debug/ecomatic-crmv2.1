import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
// material
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Box,
  List,
  Button,
  Divider,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@material-ui/core';
import { LoadingButton } from '@material-ui/lab';
// utils
import { ticketLogs } from '../../../utils/systemUpdates';
import { ticketUpdater } from '../../../APIs/customerService/tickets';
// context
import { AuthContext } from '../../../contexts';
// component
import { MIconButton } from '../../@material-extend';

TicketActions.propTypes = {
  triggerHandler: PropTypes.func,
  isTriggered: PropTypes.bool,
  ticketState: PropTypes.array,
  setTicketLogs: PropTypes.func,
  setActiveStep: PropTypes.func
};

function TicketActions({ triggerHandler, isTriggered, ticketState, setTicketLogs, setActiveStep }) {
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const userRole = useContext(AuthContext).userState[0].role;
  const [ticketDetails, setTicketDetails] = ticketState;

  const updateStageHandler = () => {
    setLoading(true);
    let currentStage;
    const data = new FormData();
    data.append('ticketStatus', 'In progress');
    if (ticketDetails.current_stage === 'agent-stage') {
      data.append('currentStage', 'technical-support-stage');
      currentStage = 'technical-support-stage';
      setActiveStep(1);
    } else if (ticketDetails.current_stage === 'technical-support-stage') {
      data.append('currentStage', 'technicians-supervisor-stage');
      currentStage = 'technicians-supervisor-stage';
      setActiveStep(2);
    } else if (ticketDetails.current_stage === 'technicians-supervisor-stage') {
      data.append('currentStage', 'technician-stage');
      currentStage = 'technician-stage';
      setActiveStep(3);
    } else if (ticketDetails.current_stage === 'technician-stage') {
      data.append('currentStage', 'follow-up-stage');
      currentStage = 'follow-up-stage';
      setActiveStep(4);
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
        ticketLogs(
          ticketDetails.id,
          `Ticket had been proceeded to next stage - ${currentStage}`,
          ticketDetails.current_stage,
          setTicketLogs
        );
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt proceed the ticket to next stage - ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
    setLoading(false);
  };

  const handlePushToFollowUp = () => {
    const data = new FormData();
    setLoading(true);
    data.append('currentStage', 'follow-up-stage');
    data.append('ticketStatus', 'In progress');
    data.append('forcedStatus', 'Forced to follow up stage');
    ticketUpdater(ticketDetails.id, data)
      .then((ticketDetailsResponse) => {
        setTicketDetails(ticketDetailsResponse);
        enqueueSnackbar('Ticket proceeded to the follow up stage', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        ticketLogs(
          ticketDetails.id,
          'Ticket had been proceeded to the follow up stage',
          ticketDetails.current_stage,
          setTicketLogs
        );
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt proceed the ticket to the follow up stage - ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
    setLoading(false);
  };

  const handleMarkTicketPending = () => {
    const data = new FormData();
    setLoading(true);
    data.append('currentStage', ticketDetails.current_stage);
    data.append('ticketStatus', ticketDetails.ticket_status === 'Pending' ? 'In progress' : 'Pending');
    ticketUpdater(ticketDetails.id, data)
      .then((ticketDetailsResponse) => {
        setTicketDetails(ticketDetailsResponse);
        enqueueSnackbar('Ticket marked as pending', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
        ticketLogs(ticketDetails.id, 'Ticket had been maked as pending', ticketDetails.current_stage, setTicketLogs);
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt mark the ticket as pending - ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
    setLoading(false);
  };

  return (
    <Dialog open={isTriggered} onClose={triggerHandler} fullWidth maxWidth="sm">
      <DialogTitle>Ticket Actions</DialogTitle>
      <DialogContent>
        <Box marginTop="30px" component="div">
          <List>
            <ListItem alignItems="center">
              <ListItemText> Proceed the ticket to the next stage</ListItemText>
              <ListItemAvatar>
                <LoadingButton
                  loading={loading}
                  disabled={
                    loading ||
                    (ticketDetails && ticketDetails.ticket_status === 'Pending') ||
                    (ticketDetails && ticketDetails.ticket_status === 'Closed')
                  }
                  onClick={updateStageHandler}
                  endIcon={<Icon icon="fluent:next-16-filled" />}
                />
              </ListItemAvatar>
            </ListItem>

            <Divider variant="middle" />
            {['admin', 'technical_support'].includes(userRole) && (
              <>
                <ListItem alignItems="center">
                  <ListItemText> Proceed the ticket to the follow up stage</ListItemText>
                  <ListItemAvatar>
                    <LoadingButton
                      onClick={handlePushToFollowUp}
                      loading={loading}
                      disabled={
                        loading ||
                        (ticketDetails && ticketDetails.ticket_status === 'Pending') ||
                        (ticketDetails && ticketDetails.ticket_status === 'Closed')
                      }
                      endIcon={<Icon icon="fluent:next-16-filled" />}
                    />
                  </ListItemAvatar>
                </ListItem>
                <Divider variant="middle" />
              </>
            )}
            <ListItem alignItems="center">
              <ListItemText>
                {ticketDetails && ticketDetails.ticket_status === 'Pending'
                  ? 'Remove ticket from pending status'
                  : 'Mark ticket as pending'}
              </ListItemText>
              <ListItemAvatar>
                <LoadingButton
                  onClick={handleMarkTicketPending}
                  loading={loading}
                  disabled={loading || (ticketDetails && ticketDetails.ticket_status === 'Closed')}
                  endIcon={<Icon icon="fluent:next-16-filled" />}
                />
              </ListItemAvatar>
            </ListItem>
            <Divider variant="middle" />
          </List>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={triggerHandler}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TicketActions;
