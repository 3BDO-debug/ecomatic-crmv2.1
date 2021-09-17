import React, { useContext, useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
// material
import { Container, Grid, Card, CardHeader, Box, Button } from '@material-ui/core';
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
  useEffect(() => {
    if (user) {
      if (user.role === 'technician') {
        const userTickets = tickets.filter((ticket) => ticket.related_technician === user.id);
        setTicketsTableRows(ticketsDataCreator(userTickets));
      } else {
        setTicketsTableRows(ticketsDataCreator(tickets));
      }
    }
  }, [user, tickets]);
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
                    { field: 'ticketNumber', headerName: 'Ticket number', flex: 1, minWidth: 200 },
                    { field: 'id', headerName: 'ID', hide: true },
                    { field: 'clientFullname', headerName: 'Client Fullname', flex: 1, minWidth: 200 },
                    { field: 'region', headerName: 'Region', flex: 1, minWidth: 200 },
                    { field: 'phoneNumber', headerName: 'Phone number', flex: 1, minWidth: 200 },
                    {
                      field: 'ticketStatus',
                      headerName: 'Ticket status',
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
                      headerName: 'Ticket stage',
                      flex: 1,
                      minWidth: 200,
                      renderCell: (cellValues) => (
                        <Label variant="ghost" color="primary">
                          {cellValues.value}
                        </Label>
                      )
                    },
                    {
                      field: 'action',
                      headerName: 'Action',
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
