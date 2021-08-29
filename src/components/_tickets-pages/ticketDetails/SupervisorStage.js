import React from 'react';
// material
import { Card, CardHeader, CardContent } from '@material-ui/core';
// components
import DataTable from '../../dataTable/DataTable';

function SupervisorStage() {
  return (
    <Card sx={{ boxShadow: 'none' }}>
      <CardHeader title="Pick a technician" />
      <CardContent>
        <DataTable columnsData={[]} rowsData={[]} />
      </CardContent>
    </Card>
  );
}

export default SupervisorStage;
