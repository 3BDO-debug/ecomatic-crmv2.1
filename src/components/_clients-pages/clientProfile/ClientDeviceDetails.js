import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
// material
import { Dialog, DialogTitle, DialogContent, Box, Grid, TextField, Stack, IconButton } from '@material-ui/core';
import { MobileDatePicker } from '@material-ui/lab';
// hooks
import useLocales from '../../../hooks/useLocales';
// components
import Label from '../../Label';

ClientDeviceDetails.propTypes = {
  deviceDetails: PropTypes.object,
  isTriggered: PropTypes.bool,
  triggerHandler: PropTypes.func
};

function ClientDeviceDetails({ deviceDetails, isTriggered, triggerHandler }) {
  const { translate } = useLocales();
  return (
    <Dialog open={isTriggered} onClose={triggerHandler} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack direction="row" rowGap={3} alignItems="center">
          {deviceDetails.device_model_number}
          <Label
            style={{ marginLeft: '10px' }}
            variant="ghost"
            color={deviceDetails.installation_status !== 'Not installed' ? 'info' : 'error'}
          >
            {deviceDetails.installation_status}
          </Label>
          {deviceDetails.installation_status === 'Not installed by the company' && (
            <Label variant="ghost" color="error">
              Out of warranty
            </Label>
          )}
          {deviceDetails.installation_date && (
            <Label
              style={{ marginLeft: '10px' }}
              variant="ghost"
              color={deviceDetails.in_warranty ? 'primary' : 'error'}
            >
              {deviceDetails.in_warranty ? 'In warranty' : 'Out of warranty'}
            </Label>
          )}
          <IconButton onClick={triggerHandler} color="primary" sx={{ marginLeft: 'auto', order: '2' }}>
            <Icon icon="bi:x-circle" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Box marginTop="30px">
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                value={deviceDetails.device_model_number}
                label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.modelNumber')}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>
              <TextField
                value={deviceDetails.device_feeding_source}
                label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.feedingSource')}
                fullWidth
              />
            </Grid>
            {deviceDetails.related_branch && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.branch')}
                  value={deviceDetails.related_branch}
                  fullWidth
                />
              </Grid>
            )}
            {deviceDetails.related_distributor && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.distributor')}
                  value={deviceDetails.related_distributor}
                  fullWidth
                />
              </Grid>
            )}
            {deviceDetails.manufacturing_date && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.manufacturingDate')}
                  value={deviceDetails.manufacturing_date}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.manufacturingDate')}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            )}
            {deviceDetails.purchasing_date && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.purchasingDate')}
                  value={deviceDetails.purchasing_date}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.purchasingDate')}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            )}
            {deviceDetails.expected_warranty_start_date && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.expectedWarrantyStartDate')}
                  value={deviceDetails.expected_warranty_start_date}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate(
                        'clientProfilePage.clientDevicesTab.clientDeviceDetails.expectedWarrantyStartDate'
                      )}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            )}
            {deviceDetails.installation_date && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.installationDate')}
                  value={deviceDetails.installation_date}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.installationDate')}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            )}
            {deviceDetails.warranty_start_date && (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <MobileDatePicker
                  orientation="portrait"
                  label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.warrantyStartDate')}
                  value={deviceDetails.warranty_start_date}
                  inputFormat="dd/MM/yyyy"
                  renderInput={(params) => (
                    <TextField
                      fullWidth
                      {...params}
                      label={translate('clientProfilePage.clientDevicesTab.clientDeviceDetails.warrantyStartDate')}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default ClientDeviceDetails;
