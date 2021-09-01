import React, { useContext, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack5';
import closeFill from '@iconify/icons-eva/close-fill';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
// material
import { Card } from '@material-ui/core';
// utils
import { clientTicketsDataCreator } from '../../../utils/mock-data/customerService/clients';
import { ticketsDeleter } from '../../../APIs/customerService/tickets';
// context
import { TicketsContext } from '../../../contexts';
// components
import DataTable from '../../dataTable/DataTable';
import { MIconButton } from '../../@material-extend';

ClientTickets.propTypes = {
  clientId: PropTypes.number
};

function ClientTickets({ clientId }) {
  const [tickets, setTickets] = useContext(TicketsContext).ticketsState;
  const [ticketsTableRows, setTicketsTableRows] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const ticketsDeleterHandler = (selectedRows) => {
    const data = new FormData();
    data.append('ticketsToBeDeleted', JSON.stringify(selectedRows));
    ticketsDeleter(data)
      .then((ticketsData) => {
        setTickets(ticketsData);
        enqueueSnackbar('Deleted tickets', {
          variant: 'success',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      })
      .catch((error) => {
        enqueueSnackbar(`Couldnt delete tickets at the moment ${error}`, {
          variant: 'error',
          action: (key) => (
            <MIconButton size="small" onClick={() => closeSnackbar(key)}>
              <Icon icon={closeFill} />
            </MIconButton>
          )
        });
      });
  };

  useEffect(() => {
    setTicketsTableRows(clientTicketsDataCreator(tickets, clientId));
  }, [tickets, clientId]);
  return (
    <Card>
      <DataTable
        columnsData={[
          { id: 'id', label: 'ID' },
          { id: 'clientName', label: 'Client name' },
          { id: 'technicianName', label: 'Technician name' },
          { id: 'intializedAt', label: 'Intialized at' },
          { id: 'currentStage', label: 'Current stage' },
          { id: 'action', label: 'Action' },
          { id: '' }
        ]}
        filterBy="id"
        identifier="id"
        rowsData={ticketsTableRows}
        searchPlaceholder="Search tickets..."
        onSelectAllDelete={ticketsDeleterHandler}
      />
    </Card>
  );
}

export default ClientTickets;
