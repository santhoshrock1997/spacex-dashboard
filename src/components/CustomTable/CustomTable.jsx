import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';

import './CustomTable.scss';

export default (props) => {
  const { headCells, rowData, handleOnClick, loading } = props;

  return (
    <TableContainer component={Paper} className="tableContainer">
      <Table sx={{ minWidth: 600 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headCells.map((headCell) => (
              <TableCell
                size="small"
                align={headCell.align}
                key={headCell.id}
                className="tableHeadCell"
              >
                {headCell.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        {loading && <CircularProgress className="loader" />}
        {!loading ? (
          rowData?.length > 0 ? (
            <TableBody>
              {rowData.map((row, index) => (
                <TableRow
                  key={index}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  onClick={() => {
                    handleOnClick(row);
                  }}
                >
                  {headCells.map((headCell) => (
                    <TableCell
                      size="medium"
                      align={headCell.align}
                      key={headCell.id}
                      className="tableBodyCell"
                    >
                      {row[headCell.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          ) : (
            <div className="noFilter">
              No results found for the specified filter
            </div>
          )
        ) : null}
      </Table>
    </TableContainer>
  );
};
