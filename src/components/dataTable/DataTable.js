import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { Table, Checkbox, TableRow, TableBody, TableCell, TableContainer, TablePagination } from '@material-ui/core';
// components
import TableListHead from './TableListHead';
import TableListToolbar from './TableListToolbar';
import TableMoreMenu from './TableMoreMenu';
import Scrollbar from '../Scrollbar';
import SearchNotFound from '../SearchNotFound';
// utils
import getComparator from './utils/getComparator';
import applySortFilter from './utils/applySortFilter';
// ----------------------------------------------------------------------

DataTable.propTypes = {
  filterBy: PropTypes.string,
  columnsData: PropTypes.array,
  rowsData: PropTypes.array,
  searchPlaceholder: PropTypes.string,
  rowIsEditable: PropTypes.bool,
  rowEditUrl: PropTypes.string
};

function DataTable({ columnsData, rowsData, filterBy, searchPlaceholder, rowIsEditable, rowEditUrl }) {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rowsData.map((n) => n[filterBy]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, selectBy) => {
    const selectedIndex = selected.indexOf(selectBy);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, selectBy);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const handleDeleteUser = (userId) => {
    console.log('user to be deleted', userId);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rowsData.length) : 0;

  const filteredData = applySortFilter(rowsData, getComparator(order, orderBy), filterName, filterBy);

  const dataNotFound = filteredData.length === 0;
  return (
    <>
      <TableListToolbar
        searchPlaceholder={searchPlaceholder}
        numSelected={selected.length}
        filterName={filterName}
        onFilterName={handleFilterByName}
        columnsData={columnsData}
        rowsData={rowsData}
      />
      <Scrollbar>
        <TableContainer sx={{ minWidth: 800 }}>
          <Table>
            <TableListHead
              order={order}
              orderBy={orderBy}
              headLabel={columnsData}
              rowCount={rowsData.length}
              numSelected={selected.length}
              onRequestSort={handleRequestSort}
              onSelectAllClick={handleSelectAllClick}
            />
            <TableBody>
              {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                const cellsData = Object.values(row);
                const isItemSelected = selected.indexOf(row[filterBy]) !== -1;
                return (
                  <TableRow
                    hover
                    key={index}
                    tabIndex={-1}
                    role="checkbox"
                    selected={isItemSelected}
                    aria-checked={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox checked={isItemSelected} onChange={(event) => handleClick(event, row[filterBy])} />
                    </TableCell>
                    {cellsData.map((cell, index) => (
                      <TableCell key={index} component="th" scope="row" padding="none">
                        {cell}
                      </TableCell>
                    ))}
                    <TableCell align="right">
                      <TableMoreMenu
                        isEditable={rowIsEditable}
                        onDelete={() => handleDeleteUser(row[filterBy])}
                        editUrl={`${rowEditUrl}/${row[filterBy]}`}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            {dataNotFound && (
              <TableBody>
                <TableRow>
                  <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                    <SearchNotFound searchQuery={filterName} />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rowsData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}

export default DataTable;
