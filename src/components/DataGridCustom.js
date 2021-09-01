import PropTypes from 'prop-types';
// material
import { Box, Rating, Pagination } from '@material-ui/core';
import {
  DataGrid,
  GridToolbar,
  useGridSlotComponentProps,
  getGridNumericColumnOperators
} from '@material-ui/data-grid';
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
      checkboxSelection
      rows={rows}
      columns={columns}
      pagination
      pageSize={10}
      components={{
        Toolbar: GridToolbar,
        Pagination: CustomPagination
      }}
    />
    /* <DataGridCustom
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
        /> */
  );
}
