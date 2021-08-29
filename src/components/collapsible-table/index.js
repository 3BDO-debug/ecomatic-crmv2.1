import PropTypes from 'prop-types';
// material
import { Table, TableRow, TableHead, TableBody, TableCell, TableContainer } from '@material-ui/core';
// components
import Scrollbar from '../Scrollbar';
//
import CollapsibleTableRow from './CollapsibleTableRow';

// ----------------------------------------------------------------------

CollapsibleTable.propTypes = {
  columnsData: PropTypes.array,
  rowsData: PropTypes.array
};

export default function CollapsibleTable({ columnsData, rowsData }) {
  return (
    <Scrollbar>
      <TableContainer sx={{ minWidth: 800, mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              {columnsData.map((column, index) => (
                <TableCell key={index}>{column.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsData.map((row, index) => (
              <CollapsibleTableRow key={index} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Scrollbar>
  );
}
