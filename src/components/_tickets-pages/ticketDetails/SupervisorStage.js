import React, { useEffect, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
// material
import { Card, CardHeader, CardContent, Avatar, Button } from '@material-ui/core';
// context
import { AccountsContext } from '../../../contexts';
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

  const assignedTechnicianFinder = useCallback(() => {
    const assignedTechnician = accounts.find((account) => account.id === ticketDetails.related_technician);
    console.log('xxx', assignedTechnician);
    return assignedTechnician;
  }, [accounts, ticketDetails.related_technician]);

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
              color={assignedTechnicianFinder() ? 'error' : 'primary'}
            >
              {assignedTechnicianFinder() ? 'Technician assigned' : 'Assign technician'}
            </Button>
          )
        })
      );
    }
    return techniciansData;
  }, [accounts, assignTechnicianHandler, assignedTechnicianFinder]);
  useEffect(() => {
    setRequiredRole('Technicians');
    setTechnicianTableRows(techniciansDataCreator());
  }, [accounts, ticketDetails, setRequiredRole, techniciansDataCreator]);
  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardHeader title="Pick a technician" />
      <CardContent>
        <DataTable
          columnsData={[
            { id: 'name', label: 'Full name' },
            { id: 'photo', label: 'Photo' },
            { id: 'role', label: 'Role' },
            { id: 'action', label: 'Action' },
            { id: '' }
          ]}
          rowsData={techniciansTableRows}
          searchPlaceholder="Search technicains.."
          filterBy="name"
          disableCheckbox
        />
      </CardContent>
    </Card>
  );
}

export default SupervisorStage;
