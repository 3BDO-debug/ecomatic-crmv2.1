import React, { useEffect, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Card, CardHeader, CardContent, Avatar, Button, Grid } from '@material-ui/core';
// context
import { AccountsContext, ConfigurationsContext } from '../../../contexts';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { ticketUpdater } from '../../../APIs/customerService/tickets';
import { ticketLogs } from '../../../utils/systemUpdates';
// routes
import { mainUrl } from '../../../APIs/axios';
// components
import DataTable from '../../dataTable/DataTable';
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';

TechniciansSupervisorStage.propTypes = {
  ticketDetailsState: PropTypes.object,
  setTicketLogs: PropTypes.func
};

function TechniciansSupervisorStage({ ticketDetailsState, setTicketLogs }) {
  const { translate } = useLocales();
  const [ticketDetails, setTicketDetails] = ticketDetailsState;
  const accounts = useContext(AccountsContext).accountsState[0];
  const setRequiredRole = useContext(AccountsContext).requiredRoleState[1];
  const [techniciansTableRows, setTechnicianTableRows] = useState([]);
  const routes = useContext(ConfigurationsContext).routesState[0];
  const [routesTableRows, setRoutesTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const assignTechnicianHandler = useCallback(
    (technicianId) => {
      const data = new FormData();
      data.append('currentStage', 'technicians-supervisor-stage');
      data.append('technicianId', technicianId);
      data.append('ticketStatus', 'In progress');
      ticketUpdater(ticketDetails.id, data)
        .then((ticketDetailsData) => {
          setTicketDetails(ticketDetailsData);

          enqueueSnackbar(
            ticketDetails.technician_name === 'Technician Not Selected Yet'
              ? 'Technician assigned'
              : 'Technician unassigned',
            {
              variant: 'success',
              action: (key) => (
                <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                  <Icon icon={closeFill} />
                </MIconButton>
              )
            }
          );
          ticketLogs(
            ticketDetails.id,
            ticketDetails.technician_name === 'Technician Not Selected Yet'
              ? 'Technician assigned'
              : 'Technician unassigned',
            ticketDetails.current_stage,
            setTicketLogs
          );
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt assign technicain ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        });
    },
    [closeSnackbar, enqueueSnackbar, setTicketDetails, ticketDetails, setTicketLogs]
  );

  const techniciansDataCreator = useCallback(() => {
    const techniciansData = [];
    if (accounts.map) {
      accounts.map((account) =>
        techniciansData.push({
          name: `${account.first_name} ${account.last_name}`,
          photo: <Avatar src={`${mainUrl}/${account.personal_pic}`} alt={account.first_name} />,
          role: (
            <Label variant="ghost" color="info">
              {account.role}
            </Label>
          ),
          action: (
            <Button
              onClick={() => assignTechnicianHandler(account.id)}
              variant="contained"
              color={ticketDetails.related_technician === account.id ? 'error' : 'primary'}
            >
              {ticketDetails.related_technician === account.id ? 'Technician assigned' : 'Assign technician'}
            </Button>
          )
        })
      );
    }
    return techniciansData;
  }, [accounts, assignTechnicianHandler, ticketDetails]);

  useEffect(() => {
    setRequiredRole('Technicians');
    setTechnicianTableRows(techniciansDataCreator());
  }, [accounts, ticketDetails, setRequiredRole, techniciansDataCreator, assignTechnicianHandler]);

  const assignRouteHandler = useCallback(
    (routeId) => {
      const data = new FormData();
      data.append('currentStage', 'technicians-supervisor-stage');
      data.append('routeId', routeId);
      data.append('ticketStatus', 'In progress');
      ticketUpdater(ticketDetails.id, data)
        .then((ticketDetailsData) => {
          setTicketDetails(ticketDetailsData);

          enqueueSnackbar(ticketDetails.route ? 'Route assigned' : 'Route unassigned', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
          ticketLogs(
            ticketDetails.id,
            ticketDetails.route ? 'Route assigned' : 'Route unassigned',
            ticketDetails.current_stage,
            setTicketLogs
          );
        })
        .catch((error) => {
          enqueueSnackbar(`Couldnt assign route ${error}`, {
            variant: 'error',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
        });
    },
    [closeSnackbar, enqueueSnackbar, setTicketDetails, setTicketLogs, ticketDetails]
  );

  useEffect(() => {
    if (routes) {
      const routesData = [];
      routes.map((route) =>
        routesData.push({
          routeName: route.route_name,
          createdAt: new Date(route.created_at).toLocaleString(),
          action: (
            <Button
              color={ticketDetails.related_route === route.id ? 'error' : 'primary'}
              onClick={() => assignRouteHandler(route.id)}
              variant="contained"
            >
              {ticketDetails.related_route === route.id ? 'Unassign' : 'Assign'}
            </Button>
          )
        })
      );
      setRoutesTableRows(routesData);
    }
  }, [routes, ticketDetails, assignRouteHandler]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader title="Pick a technician" />
          <CardContent>
            <DataTable
              columnsData={[
                {
                  id: 'name',
                  label: translate(
                    'ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.fullname'
                  )
                },
                {
                  id: 'photo',
                  label: translate(
                    'ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.photo'
                  )
                },
                {
                  id: 'role',
                  label: translate(
                    'ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.role'
                  )
                },
                {
                  id: 'action',
                  label: translate(
                    'ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.action'
                  )
                },
                { id: '' }
              ]}
              rowsData={techniciansTableRows}
              searchPlaceholder={translate(
                'ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.searchPlaceholder'
              )}
              filterBy="name"
              disableCheckbox
            />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card sx={{ boxShadow: 'none' }}>
          <CardHeader title="Pick a route" />
          <CardContent>
            <DataTable
              columnsData={[
                { id: 'routeName', label: 'Route name' },
                { id: 'createdAt', label: 'Created at' },
                { id: 'action', label: 'Action' }
              ]}
              rowsData={routesTableRows}
              searchPlaceholder="Search route.."
              filterBy="routeName"
              disableCheckbox
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default TechniciansSupervisorStage;
