import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
// material
import { Container, Grid, Card, CardHeader, Box, Button, Rating } from '@material-ui/core';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// context
import { AuthContext, TicketsContext } from '../../contexts';
// utils
import { ticketsDataCreator } from '../../utils/mock-data/customerService/tickets';
// components
import Page from '../../components/Page';
import AppWelcome from '../../components/_overview-page/AppWelcome';
import OverviewCard from '../../components/_overview-page/OverviewCard';
import DataGridCustom from '../../components/DataGridCustom';
import Label from '../../components/Label';
// ----------------------------------------------------------------------

function Overview() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const user = useContext(AuthContext).userState[0];
  const tickets = useContext(TicketsContext).ticketsState[0];

  const [ticketsTableRows, setTicketsTableRows] = useState([]);

  const ticketsFilter = useCallback(() => {
    if (user.role === 'technician') {
      const userTickets = tickets.filter((ticket) => ticket.related_technician === user.id);
      return userTickets;
    }
    if (user.role === 'technical_support') {
      const userTickets = tickets.filter((ticket) => ticket.current_stage === 'technical-support-stage');
      return userTickets;
    }
    if (user.role === 'customer_service_agent') {
      const userTickets = tickets.filter((ticket) => ticket.current_stage === 'agent-stage');
      return userTickets;
    }
    if (user.role === 'follow_up_agent') {
      const userTickets = tickets.filter((ticket) => ticket.current_stage === 'follow-up-stage');
      return userTickets;
    }
    if (user.role === 'technician_supervisor') {
      const userTickets = tickets.filter((ticket) => ticket.current_stage === 'technicians-supervisor-stage');
      return userTickets;
    }

    return tickets;
  }, [tickets, user]);

  useEffect(() => {
    if (tickets && tickets.length !== 0) {
      setTicketsTableRows(ticketsDataCreator(ticketsFilter()));
    } else {
      setTicketsTableRows([]);
    }
  }, [tickets, ticketsFilter]);
  return (
    <Page title="Overview">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <AppWelcome
              displayName={`${user.first_name} ${user.last_name}`}
              header={translate('overviewPage.appWelcome.welcomeHeader')}
              body={translate('overviewPage.appWelcome.welcomeBody')}
            />
          </Grid>

          {user.role !== 'technician' && (
            <>
              <Grid item xs={12} md={4} lg={4} xl={4}>
                <OverviewCard title={translate('overviewPage.overviewCard.activeTickets')} colorVariant="main" />
              </Grid>
              <Grid item xs={12} md={4} lg={4} xl={4}>
                <OverviewCard title={translate('overviewPage.overviewCard.closedTickets')} colorVariant="secondary" />
              </Grid>
              <Grid item xs={12} md={4} lg={4} xl={4}>
                <OverviewCard title={translate('overviewPage.overviewCard.reopenedTickets')} colorVariant="info" />
              </Grid>
            </>
          )}

          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title={translate('overviewPage.ticketsOverview.title')} />
              <Box component="div" height="600px" width="100%" marginTop="30px">
                <DataGridCustom
                  rows={ticketsTableRows}
                  columns={[
                    {
                      field: 'ticketNumber',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketNumber'),
                      flex: 1,
                      minWidth: 200
                    },
                    { field: 'id', headerName: 'ID', hide: true },
                    {
                      field: 'clientFullname',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.clientFullname'),
                      flex: 1,
                      minWidth: 200
                    },
                    {
                      field: 'region',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.region'),
                      flex: 1,
                      minWidth: 200
                    },
                    {
                      field: 'phoneNumber',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.phoneNumber'),
                      flex: 1,
                      minWidth: 200
                    },
                    {
                      field: 'ticketStatus',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStatus'),
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) => {
                        let labelColor;
                        if (cellValues.value === 'Pending') {
                          labelColor = 'warning';
                        } else if (cellValues.value === 'Closed') {
                          labelColor = 'error';
                        } else {
                          labelColor = 'info';
                        }
                        return (
                          <Label variant="ghost" color={labelColor}>
                            {cellValues.value}
                          </Label>
                        );
                      }
                    },
                    {
                      field: 'ticketStage',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStage'),
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) => (
                        <Label variant="ghost" color="primary">
                          {cellValues.value}
                        </Label>
                      )
                    },
                    {
                      field: 'technicianName',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.technicianName'),
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) =>
                        cellValues.value === 'Technician Not Selected Yet' ? (
                          <Label variant="ghost" color="error">
                            {cellValues.value}
                          </Label>
                        ) : (
                          <Label variant="ghost" color="info">
                            {cellValues.value}
                          </Label>
                        )
                    },
                    {
                      field: 'routeName',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.routeName'),
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) =>
                        cellValues.value === 'Route not yet selected' ? (
                          <Label variant="ghost" color="error">
                            {cellValues.value}
                          </Label>
                        ) : (
                          <Label variant="ghost" color="info">
                            {cellValues.value}
                          </Label>
                        )
                    },
                    {
                      field: 'overallRating',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.overallRating'),
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) =>
                        cellValues.value ? (
                          <Rating value={parseInt(cellValues.value, 10)} max={10} readOnly />
                        ) : (
                          <Label variant="ghost" color="error">
                            Rating is not available yet
                          </Label>
                        )
                    },
                    {
                      field: 'action',
                      headerName: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.action'),
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) => (
                        <Button
                          color="primary"
                          startIcon={<Icon icon="carbon:view" />}
                          component={Link}
                          to={`/dashboard/tickets/ticket-details/${cellValues.value}`}
                        />
                      )
                    }
                  ]}
                  checkboxSelection={false}
                />
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Overview;
