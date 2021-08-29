import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import arrowIosUpwardFill from '@iconify/icons-eva/arrow-ios-upward-fill';
import arrowIosDownwardFill from '@iconify/icons-eva/arrow-ios-downward-fill';
// material
import {
  Box,
  Table,
  Collapse,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  IconButton
} from '@material-ui/core';

// ----------------------------------------------------------------------

CollapsibleTable.propTypes = {
  row: PropTypes.object
};

export default function CollapsibleTable({ row }) {
  const [open, setOpen] = useState(false);
  const rowData = Object.entries(row);
  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <Icon icon={open ? arrowIosUpwardFill : arrowIosDownwardFill} />
          </IconButton>
        </TableCell>
        {rowData.map(
          (cell, index) =>
            cell[0] !== 'collapsibleContent' &&
            cell[0] !== 'collapsibleRow' && (
              <TableCell component={index === 0 && 'th'} scope={index === 0 && 'row'}>
                {cell[1]}
              </TableCell>
            )
        )}
      </TableRow>
      {row.collapsibleRow && (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  {row.collapsibleContent.title}
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      {row.collapsibleContent.collapsibleColumnsData.map((cell, index) => (
                        <TableCell key={index}>{cell.label}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.collapsibleContent.collapsibleRowsData.map((collapsibleRow, index) => (
                      <TableRow key={index}>
                        {Object.values(collapsibleRow).map((cell, index) => (
                          <TableCell key={index}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      )}{' '}
    </>
  );
}
