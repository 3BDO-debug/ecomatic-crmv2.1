import React from 'react';
// material
import { Card } from '@material-ui/core';
import DataTable from '../../dataTable/DataTable';
// components

function ClientDevices() {
  return (
    <Card>
      <DataTable columnsData={[]} rowsData={[]} />
    </Card>
  );
}

export default ClientDevices;
