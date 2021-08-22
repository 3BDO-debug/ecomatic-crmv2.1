import PropTypes from 'prop-types';
// material
import { Box, Rating, Pagination } from '@material-ui/core';
import {
  DataGrid,
  GridToolbar,
  useGridSlotComponentProps,
  getGridNumericColumnOperators
} from '@material-ui/data-grid';
import { useDemoData } from '@material-ui/x-grid-data-generator';
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

DataGridCustom.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array
};

export default function DataGridCustom({ rows, columns }) {
  const { data } = useDemoData({
    dataSet: 'Commodity',
    rowLength: 10,
    maxColumns: 6
  });
  if (data.columns.length > 0) {
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
      checkboxSelection
      disableSelectionOnClick
      {...data}
      pagination
      pageSize={10}
      components={{
        Toolbar: GridToolbar,
        Pagination: CustomPagination
      }}
    />
  );
}
