import React from "react";
import { useTable, useGlobalFilter, useSortBy, usePagination } from 'react-table'
import Numeral from "numeral";
import "numeral/locales/es-es";
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from './TablePagination'
import GlobalFilter from './GlobalFilter'
import Date from './Date'
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { messages } from '../lib/messages'


Numeral.locale('es-es');

const getColumns = function (data) {
  if (data && data[0]) {
    const column =
      Object.keys(data[0]).map(key => {
        let colConfig = {
          Header: messages[key] || key,
          accessor: key,
          align: 'left',
        };
        if (Number.isInteger(data[0][key])) {
          colConfig.Cell = row => <div style={{ textAlign: "right" }}>{Numeral(row.value).format('0,0')}</div>
          colConfig.align = 'right'
          colConfig.sortType = (rowA, rowB, columnId) => {
            return rowA.original[columnId] - rowB.original[columnId];
          }
        } else if (key === 'date') {
          colConfig.Cell = row => <Date dateString={row.value}></Date>
        }
        return colConfig;
      });
    return column;
  } else {
    return [];
  }
}

const StyledTableCell = withStyles((theme) => ({
  head: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
  }
}))(TableCell);

export default function SimpleTable({ param, pagination }) {

  const data = React.useMemo(
    () => param, []
  )

  const columns = React.useMemo(() => getColumns(param), [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable({ columns, data }, useGlobalFilter, useSortBy, usePagination)

  const rowsToShow = pagination ? page : rows;

  return (
    <>
      {pagination && <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={globalFilter}
        setGlobalFilter={setGlobalFilter}
      />
      }
      <MaUTable size="small" {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <StyledTableCell align={column.align} {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <TableSortLabel
                    active={column.isSorted}
                    direction={column.isSortedDesc ? 'desc' : 'asc'}
                  />
                </StyledTableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody {...getTableBodyProps()}>
          {rowsToShow.map(row => {
            prepareRow(row)
            return (
              <TableRow {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <TableCell {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </TableCell>
                  )
                })}
              </TableRow>
            )
          })}
        </TableBody>
        {pagination &&
          <TablePagination
            count={data.length}
            rowsPerPage={pageSize}
            page={pageIndex}
            gotoPage={gotoPage}
            setPageSize={setPageSize}>
          </TablePagination>
        }
      </MaUTable>
    </>
  )
}