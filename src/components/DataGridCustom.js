import { useContext, useState } from 'react';
import { Icon } from '@iconify/react';
import PropTypes from 'prop-types';
// material
import { Box, Rating, Pagination, IconButton } from '@material-ui/core';
import {
  DataGrid,
  useGridSlotComponentProps,
  getGridNumericColumnOperators,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport
} from '@material-ui/data-grid';
// context
import { AuthContext } from '../contexts';

// ----------------------------------------------------------------------

function CustomPagination() {
  const { state, apiRef } = useGridSlotComponentProps();

  return (
    <Pagination
      color="primary"
      count={state.pagination.pageCount}
      page={state.pagination.page + 1}
      onChange={(event, value) => apiRef.current.setPage(value - 1)}
    />
  );
}

RatingInputValue.propTypes = {
  applyValue: PropTypes.func.isRequired,
  item: PropTypes.shape({
    columnField: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    operatorValue: PropTypes.string,
    value: PropTypes.any
  }).isRequired
};

function RatingInputValue({ item, applyValue }) {
  return (
    <Box sx={{ p: 1, height: 1, alignItems: 'flex-end', display: 'flex' }}>
      <Rating
        size="small"
        precision={0.5}
        placeholder="Filter value"
        value={Number(item.value)}
        onChange={(event, newValue) => {
          applyValue({ ...item, value: newValue });
        }}
      />
    </Box>
  );
}

CustomToolbar.propTypes = {
  selectedRowsData: PropTypes.array,
  selectedRowsHandler: PropTypes.func
};

function CustomToolbar({ selectedRowsData, selectedRowsHandler }) {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      {selectedRowsData.length > 0 && (
        <IconButton onClick={() => selectedRowsHandler(selectedRowsData)} sx={{ marginLeft: 'auto' }}>
          <Icon icon="fluent:delete-20-filled" />
        </IconButton>
      )}
    </GridToolbarContainer>
  );
}

DataGridCustom.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  onSelectionModelChange: PropTypes.func
};

export default function DataGridCustom({ rows, columns, onSelectionModelChange }) {
  const userRole = useContext(AuthContext).userState[0].role;
  const [selectedRows, setSelectedRows] = useState([]);
  if (columns.length > 0) {
    const ratingColumn = columns.find((column) => column.field === 'rating');
    const ratingColIndex = columns.findIndex((col) => col.field === 'rating');

    const ratingFilterOperators = getGridNumericColumnOperators().map((operator) => ({
      ...operator,
      InputComponent: RatingInputValue
    }));

    columns[ratingColIndex] = {
      ...ratingColumn,
      filterOperators: ratingFilterOperators
    };
  }

  return (
    <DataGrid
      checkboxSelection={userRole === 'admin' && true}
      disableSelectionOnClick
      rows={rows}
      columns={columns}
      pagination
      pageSize={10}
      components={{
        Toolbar: CustomToolbar,
        Pagination: CustomPagination
      }}
      componentsProps={{ toolbar: { selectedRowsData: selectedRows, selectedRowsHandler: onSelectionModelChange } }}
      onSelectionModelChange={(newSelectionModel) => {
        setSelectedRows(newSelectionModel);
      }}
    />
  );
}
