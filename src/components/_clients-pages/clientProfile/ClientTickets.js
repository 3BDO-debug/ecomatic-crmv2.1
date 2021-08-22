import React from 'react';
// material
import {
  DataGrid,
  GridToolbar,
  useGridSlotComponentProps,
  getGridNumericColumnOperators
} from '@material-ui/data-grid';
import { Card } from '@material-ui/core';
import { useDemoData } from '@material-ui/x-grid-data-generator';
// components
import DataTable from '../../dataTable/DataTable';
import DataGridCustom from '../../DataGridCustom';

function ClientTickets() {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6
  });
  return (
    <Card>
      <DataGrid {...data} />
    </Card>
  );
}

export default ClientTickets;
