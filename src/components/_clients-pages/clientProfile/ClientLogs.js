import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Card, Grid, Box } from '@material-ui/core';
import DataTable from '../../dataTable/DataTable';
import Label from '../../Label';

ClientLogs.propTypes = {
  clientLogsState: PropTypes.array
};

function ClientLogs({ clientLogsState }) {
  const clientLogs = clientLogsState[0];
  const [clientLogsTableRows, setClientLogsTableRows] = useState([]);

  const logsDataCreator = (logsDataResponse) => {
    const logsData = [];
    logsDataResponse.map((logResponse) =>
      logsData.push({
        id: logResponse.id,
        action: logResponse.action,
        createdBy: (
          <Label variant="ghost" color="info">
            {logResponse.created_by}
          </Label>
        ),
        createdAt: logResponse.created_at
      })
    );
    return logsData;
  };

  useEffect(() => {
    setClientLogsTableRows(logsDataCreator(clientLogs));
  }, [clientLogs]);
  return (
    <Card>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box component="div" marginBottom="10%">
            <DataTable
              columnsData={[
                { id: 'id', label: 'ID' },
                { id: 'action', label: 'Action' },
                { id: 'createdBy', label: 'Created by' },
                { id: 'createdAt', label: 'Created at' },
                { id: '' }
              ]}
              rowsData={clientLogsTableRows}
              disableCheckbox
              searchPlaceholder="Search logs.."
              filterBy="createdBy"
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default ClientLogs;
