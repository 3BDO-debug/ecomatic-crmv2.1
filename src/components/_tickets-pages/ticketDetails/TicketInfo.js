import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { Card, CardContent, CardHeader, Grid, IconButton, Stack, TextField, Tooltip } from '@material-ui/core';
// components

TicketInfo.propTypes = {
  ticketDetails: PropTypes.object
};

function TicketInfo({ ticketDetails }) {
  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardHeader
        title={
          <Stack direction="row" rowGap={3} alignItems="center">
            Ticket details
            <Tooltip title="Print ticket info">
              <IconButton color="primary" sx={{ marginLeft: 'auto', order: '2' }}>
                <Icon icon="ci:download" width={20} height={20} />
              </IconButton>
            </Tooltip>
          </Stack>
        }
      />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField label="Client fullname" value={ticketDetails.client_name} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField label="Client phone number 1" value={ticketDetails.client_phone_number_1} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField label="Client phone number 2" value={ticketDetails.client_phone_number_2} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField label="Client city" value={ticketDetails.client_city} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <TextField label="City region" value={ticketDetails.client_region} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField label="Client address" value={ticketDetails.client_address} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField label="Building no" value={ticketDetails.client_building_no} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField label="Apartment no" value={ticketDetails.client_apartment_no} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <TextField label="Floor no" value={ticketDetails.client_floor_no} fullWidth />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <TextField label="Landmark" value={ticketDetails.client_landmark} fullWidth />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default TicketInfo;
