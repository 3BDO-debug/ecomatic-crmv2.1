import React from 'react';
// material
import { Box, Card } from '@material-ui/core';
// components
import DataGridCustom from '../../DataGridCustom';

function ClientTickets() {
  return (
    <Card>
      <Box height={500} width="100%">
        <DataGridCustom
          rows={[
            { id: 21, firstName: 'Ahmed', lastName: 'Moahmed', age: 21 },
            { id: 21, firstName: 'Ahmed', lastName: 'Moahmed', age: 21 },
            { id: 21, firstName: 'Ahmed', lastName: 'Moahmed', age: 21 },
            { id: 21, firstName: 'Ahmed', lastName: 'Moahmed', age: 21 },
            { id: 21, firstName: 'Ahmed', lastName: 'Moahmed', age: 21 }
          ]}
          columns={[
            {
              field: 'id',
              headerName: 'ID',
              width: 120
            },
            {
              field: 'firstName',
              headerName: 'First name',
              width: 160,
              editable: true
            },
            {
              field: 'lastName',
              headerName: 'Last name',
              width: 160,
              editable: true
            },
            {
              field: 'age',
              headerName: 'Age',
              type: 'number',
              width: 120,
              editable: true,
              align: 'center',
              headerAlign: 'center'
            }
          ]}
        />
      </Box>
    </Card>
  );
}

export default ClientTickets;
