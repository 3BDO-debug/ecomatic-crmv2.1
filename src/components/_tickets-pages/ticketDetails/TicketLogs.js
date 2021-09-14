import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Grid, Card, Box } from '@material-ui/core';
// components
import DataTable from '../../dataTable/DataTable';
import Label from '../../Label';

TicketLogs.propTypes = {
  ticketLogsState: PropTypes.array
};

function TicketLogs({ ticketLogsState }) {
  const ticketLogs = ticketLogsState[0];
  const [ticketLogsTableRows, setTicketLogsTableRows] = useState([]);
  const ticketLogsDataCreator = (ticketLogsResponse) => {
    const ticketLogsData = [];
    ticketLogsResponse.map((log) =>
      ticketLogsData.push({
        id: log.id,
        action: log.action,
        stage: (
          <Label variant="ghost" color="info">
            {log.stage}
          </Label>
        ),
        createdBy: (
          <Label variant="ghost" color="primary">
            {log.created_by_name}
          </Label>
        ),
        role: (
          <Label variant="ghost" color="primary">
            {log.created_by_role}
          </Label>
        ),
        createdAt: new Date(log.created_at).toLocaleString()
      })
    );
    return ticketLogsData;
  };
  useEffect(() => {
    setTicketLogsTableRows(ticketLogsDataCreator(ticketLogs));
  }, [ticketLogs]);
  return (
    <Card sx={{ boxShadow: 'none' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Box component="div" marginBottom="10%">
            <DataTable
              columnsData={[
                { id: 'id', label: 'ID' },
                { id: 'action', label: 'Action' },
                { id: 'stage', label: 'Stage' },
                { id: 'createdBy', label: 'Created by' },
                { id: 'role', label: 'Role' },
                { id: 'createdAt', label: 'Created at' },
                { id: '' }
              ]}
              rowsData={ticketLogsTableRows}
              disableCheckbox
              searchPlaceholder="Search logs..."
              filterBy="createdBy"
            />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}

export default TicketLogs;
