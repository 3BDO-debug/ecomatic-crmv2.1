import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { usePDF } from '@react-pdf/renderer';
// material
import { Card, CardContent, CardHeader, Grid, IconButton, Stack, TextField, Tooltip } from '@material-ui/core';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
// components
import Label from '../../Label';
import TicketDoc from './ticketPDF/TicketDoc';

TicketInfo.propTypes = {
  ticketDetails: PropTypes.object,
  ticketDevices: PropTypes.array
};

function TicketInfo({ ticketDetails, ticketDevices }) {
  const { translate } = useLocales();
  const [instance] = usePDF({ document: <TicketDoc ticketDetails={ticketDetails} ticketDevices={ticketDevices} /> });
  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardHeader
        title={
          <Stack direction="row" rowGap={3} alignItems="center">
            {translate('ticketDetailsPage.ticketInfo.title')} | {ticketDetails.ticket_generated_id}
            <Label style={{ marginLeft: '10px' }} variant="ghost" color="info">
              {ticketDetails.current_stage}
            </Label>
            <Tooltip title="Print ticket info">
              <IconButton
                onClick={() => window.open(instance.url)}
                color="primary"
                sx={{ marginLeft: 'auto', order: '2' }}
              >
                <Icon icon="ci:download" width={20} height={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <CardContent>
        <Grid container spacing={3} id="ticket">
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.clientFullname')}
              value={ticketDetails.client_name}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.clientPhonenumber1')}
              value={ticketDetails.client_phone_number_1}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.clientPhonenumber2')}
              value={ticketDetails.client_phone_number_2}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.clientCity')}
              value={ticketDetails.client_city}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.clientRegion')}
              value={ticketDetails.client_region}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.clientAddress')}
              value={ticketDetails.client_address}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.buildingNo')}
              value={ticketDetails.client_building_no}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.apartmentNo')}
              value={ticketDetails.client_apartment_no}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.floorNo')}
              value={ticketDetails.client_floor_no}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField
              label={translate('ticketDetailsPage.ticketInfo.landmark')}
              value={ticketDetails.client_landmark}
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default TicketInfo;
