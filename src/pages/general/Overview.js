import React, { useContext, useEffect, useState } from 'react';
// material
import { Container, Grid, Card, CardHeader } from '@material-ui/core';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// context
import { AuthContext, TicketsContext } from '../../contexts';
// utils
import { ticketsDataCreator } from '../../utils/mock-data/overview';
// components
import Page from '../../components/Page';
import AppWelcome from '../../components/_overview-page/AppWelcome';
import OverviewCard from '../../components/_overview-page/OverviewCard';
import DataTable from '../../components/dataTable/DataTable';
// ----------------------------------------------------------------------

function Overview() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();
  const user = useContext(AuthContext).userState[0];
  const tickets = useContext(TicketsContext).ticketsState[0];

  const [ticketsTableRows, setTicketsTableRows] = useState([]);
  useEffect(() => {
    if (user.role === 'technician') {
      const userTickets = tickets.filter((ticket) => ticket.related_technician === user.id);
      setTicketsTableRows(ticketsDataCreator(userTickets));
    } else {
      setTicketsTableRows(ticketsDataCreator(tickets));
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
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <OverviewCard title={translate('overviewPage.overviewCard.activeTickets')} colorVariant="main" />
          </Grid>
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <OverviewCard title={translate('overviewPage.overviewCard.closedTickets')} colorVariant="secondary" />
          </Grid>
          <Grid item xs={12} md={4} lg={4} xl={4}>
            <OverviewCard title={translate('overviewPage.overviewCard.reopenedTickets')} colorVariant="info" />
          </Grid>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <Card>
              <CardHeader title={translate('overviewPage.ticketsOverview.title')} />
              <DataTable
                columnsData={[
                  { id: 'id', label: translate('overviewPage.ticketsOverview.tableColumns.id') },
                  {
                    id: 'technician',
                    label: translate('overviewPage.ticketsOverview.tableColumns.technician')
                  },
                  {
                    id: 'clientName',
                    label: translate('overviewPage.ticketsOverview.tableColumns.clientName')
                  },
                  {
                    id: 'currentStage',
                    label: translate('overviewPage.ticketsOverview.tableColumns.currentStage')
                  },
                  {
                    id: 'intializedAt',
                    label: translate('overviewPage.ticketsOverview.tableColumns.intializedAt')
                  },
                  {
                    id: 'action',
                    label: translate('overviewPage.ticketsOverview.tableColumns.action')
                  },
                  { id: '' }
                ]}
                rowsData={ticketsTableRows}
                searchPlaceholder={translate('overviewPage.ticketsOverview.searchPlaceholder')}
                filterBy="id"
                disableCheckbox
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Overview;
