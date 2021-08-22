import React from 'react';
import { sentenceCase } from 'change-case';
// material
import { Container, Grid, Card, Stack, Typography, Avatar, CardHeader } from '@material-ui/core';
// hooks
import useLocales from '../../hooks/useLocales';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import AppWelcome from '../../components/_overview-page/AppWelcome';
import OverviewCard from '../../components/_overview-page/OverviewCard';
import DataTable from '../../components/dataTable/DataTable';
import Label from '../../components/Label';
// ----------------------------------------------------------------------

function Overview() {
  const { themeStretch } = useSettings();
  const { translate } = useLocales();

  return (
    <Page title="Overview">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12} xl={12}>
            <AppWelcome
              displayName="Abdelrahman"
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
                  { id: 'id', label: translate('overviewPage.ticketsOverview.tableColumns.id'), alignRight: false },
                  {
                    id: 'technician',
                    label: translate('overviewPage.ticketsOverview.tableColumns.technician'),
                    alignRight: false
                  },
                  {
                    id: 'clientName',
                    label: translate('overviewPage.ticketsOverview.tableColumns.clientName'),
                    alignRight: false
                  },
                  {
                    id: 'currentStage',
                    label: translate('overviewPage.ticketsOverview.tableColumns.currentStage'),
                    alignRight: false
                  },
                  {
                    id: 'intializedAt',
                    label: translate('overviewPage.ticketsOverview.tableColumns.intializedAt'),
                    alignRight: false
                  },
                  {
                    id: 'status',
                    label: translate('overviewPage.ticketsOverview.tableColumns.status'),
                    alignRight: false
                  },
                  { id: '' }
                ]}
                rowsData={[
                  {
                    id: '21b21',
                    technician: (
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar alt="Dummy Client" src="" />
                        <Typography variant="subtitle2" noWrap>
                          Dummy Technician
                        </Typography>
                      </Stack>
                    ),
                    clientName: (
                      <Typography variant="subtitle2" noWrap>
                        Dummy Client
                      </Typography>
                    ),
                    currentStage: (
                      <Label variant="ghost" color="info">
                        {sentenceCase('Supervisor Stage')}
                      </Label>
                    ),

                    intializedAt: '21 may, 2021',
                    status: (
                      <Label variant="ghost" color="info">
                        {sentenceCase(' Closed')}
                      </Label>
                    )
                  }
                ]}
                searchPlaceholder={translate('overviewPage.ticketsOverview.searchPlaceholder')}
                filterBy="id"
                rowIsEditable
                rowEditUrl="/"
              />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}

export default Overview;
