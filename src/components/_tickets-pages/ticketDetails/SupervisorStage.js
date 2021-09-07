import React, { useEffect, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Card, CardHeader, CardContent, Avatar, Button } from '@material-ui/core';
// context
import { AccountsContext } from '../../../contexts';
// hooks
import useLocales from '../../../hooks/useLocales';
// utils
import { ticketUpdater } from '../../../APIs/customerService/tickets';
// routes
import { mainUrl } from '../../../APIs/axios';
// components
import DataTable from '../../dataTable/DataTable';
import Label from '../../Label';
import { MIconButton } from '../../@material-extend';

SupervisorStage.propTypes = {
  ticketDetailsState: PropTypes.object
};

function SupervisorStage({ ticketDetailsState }) {
  const { translate } = useLocales();
  const [ticketDetails, setTicketDetails] = ticketDetailsState;
  const accounts = useContext(AccountsContext).accountsState[0];
  const setRequiredRole = useContext(AccountsContext).requiredRoleState[1];
  const [techniciansTableRows, setTechnicianTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const assignTechnicianHandler = useCallback(
    (technicianId) => {
      const data = new FormData();
      data.append('currentStage', 'supervisor-stage');
      data.append('technicianId', technicianId);
      ticketUpdater(ticketDetails.id, data)
        .then((ticketDetailsData) => {
          setTicketDetails(ticketDetailsData);

          enqueueSnackbar('Technician assigned', {
            variant: 'success',
            action: (key) => (
              <MIconButton size="small" onClick={() => closeSnackbar(key)}>
                <Icon icon={closeFill} />
              </MIconButton>
            )
          });
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
    [closeSnackbar, enqueueSnackbar, setTicketDetails, ticketDetails.id]
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
  }, [accounts, assignTechnicianHandler, ticketDetails.related_technician]);
  useEffect(() => {
    setRequiredRole('Technicians');
    setTechnicianTableRows(techniciansDataCreator());
  }, [accounts, ticketDetails, setRequiredRole, techniciansDataCreator, assignTechnicianHandler]);
  return (
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
              label: translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.photo')
            },
            {
              id: 'role',
              label: translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.role')
            },
            {
              id: 'action',
              label: translate('ticketDetailsPage.ticketTimelineTab.ticketStepper.techniciansTable.tableColumns.action')
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
  );
}

export default SupervisorStage;
