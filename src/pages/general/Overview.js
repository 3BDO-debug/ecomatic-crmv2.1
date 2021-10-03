import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
// material
import { Container, Grid, Box, Button, Rating } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
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
            <Box component="div" height="400px" width="100%" marginTop="30px">
              <MUIDataTable
                title={translate('overviewPage.ticketsOverview.title')}
                options={{ selectableRowsHideCheckboxes: true }}
                data={ticketsTableRows}
                columns={[
                  {
                    name: 'ticketNumber',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketNumber'),
                    options: { filter: true }
                  },
                  {
                    name: 'id',
                    label: 'ID',
                    options: {
                      filter: false,
                      display: false
                    }
                  },
                  {
                    name: 'clientFullname',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.clientFullname'),
                    options: {
                      filter: true
                    }
                  },
                  {
                    name: 'region',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.region'),
                    options: {
                      filter: true
                    }
                  },
                  {
                    name: 'phoneNumber',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.phoneNumber'),
                    options: {
                      filter: true
                    }
                  },
                  {
                    name: 'ticketStatus',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStatus'),
                    options: {
                      filter: true,
                      customBodyRender: (value) => {
                        let labelColor;
                        if (value === 'Pending') {
                          labelColor = 'warning';
                        } else if (value === 'Closed') {
                          labelColor = 'error';
                        } else {
                          labelColor = 'info';
                        }
                        return (
                          <Label variant="ghost" color={labelColor}>
                            {value}
                          </Label>
                        );
                      }
                    }
                  },
                  {
                    name: 'ticketStage',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.ticketStage'),
                    options: {
                      filter: true,
                      customBodyRender: (value) => (
                        <Label variant="ghost" color="primary">
                          {value}
                        </Label>
                      )
                    }
                  },
                  {
                    name: 'technicianName',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.technicianName'),
                    options: {
                      filter: true,
                      customBodyRender: (value) =>
                        value === 'Technician Not Selected Yet' ? (
                          <Label variant="ghost" color="error">
                            {value}
                          </Label>
                        ) : (
                          <Label variant="ghost" color="info">
                            {value}
                          </Label>
                        )
                    }
                  },
                  {
                    name: 'routeName',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.routeName'),
                    options: {
                      filter: true,
                      customBodyRender: (value) =>
                        value === 'Route not yet selected' ? (
                          <Label variant="ghost" color="error">
                            {value}
                          </Label>
                        ) : (
                          <Label variant="ghost" color="info">
                            {value}
                          </Label>
                        )
                    }
                  },
                  {
                    name: 'overallRating',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.overallRating'),
                    options: {
                      filter: true,
                      customBodyRender: (value) =>
                        value ? (
                          <Rating value={parseInt(value, 10)} max={10} readOnly />
                        ) : (
                          <Label variant="ghost" color="error">
                            Rating is not available yet
                          </Label>
                        )
                    }
                  },
                  {
                    name: 'action',
                    label: translate('ticketsPages.listTicketsPage.ticketsTable.tableColumns.action'),
                    options: {
                      filter: true,
                      customBodyRender: (value) => (
                        <Button
                          color="primary"
                          startIcon={<Icon icon="carbon:view" />}
                          component={Link}
                          to={`/dashboard/tickets/ticket-details/${value}`}
                        />
                      )
                    }
                  }
                ]}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Overview;
