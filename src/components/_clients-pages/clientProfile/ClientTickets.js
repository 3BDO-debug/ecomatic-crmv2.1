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
// hooks
import useLocales from '../../../hooks/useLocales';
// context
import { TicketsContext } from '../../../contexts';
// components
import DataTable from '../../dataTable/DataTable';
import { MIconButton } from '../../@material-extend';

ClientTickets.propTypes = {
  clientId: PropTypes.number
};

function ClientTickets({ clientId }) {
  const { translate } = useLocales();
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
          { id: 'id', label: translate('clientProfilePage.clientTicketsTab.clientTickesTable.tableColumns.id') },
          {
            id: 'clientName',
            label: translate('clientProfilePage.clientTicketsTab.clientTickesTable.tableColumns.clientName')
          },
          {
            id: 'technicianName',
            label: translate('clientProfilePage.clientTicketsTab.clientTickesTable.tableColumns.technicianName')
          },
          {
            id: 'intializedAt',
            label: translate('clientProfilePage.clientTicketsTab.clientTickesTable.tableColumns.intializedAt')
          },
          {
            id: 'currentStage',
            label: translate('clientProfilePage.clientTicketsTab.clientTickesTable.tableColumns.currentStage')
          },
          {
            id: 'action',
            label: translate('clientProfilePage.clientTicketsTab.clientTickesTable.tableColumns.action')
          },
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
