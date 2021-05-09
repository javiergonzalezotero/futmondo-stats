import React from "react";
import { useTable, useSortBy, usePagination } from 'react-table'
import Numeral from "numeral";
import "numeral/locales/es-es";
import MaUTable from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import TablePagination from './TablePagination'

Numeral.locale('es-es');

const getColumns = function (data) {
  if (data && data[0]) {
    const column =
      Object.keys(data[0]).map(key => {
        let colConfig = {
          Header: key,
          accessor: key
        };
        if (Number.isInteger(data[0][key])) {
          colConfig.Cell = row => <div style={{ textAlign: "right" }}>{Numeral(row.value).format('0,0')}</div>;
        }
        return colConfig;
      });
    return column;
  } else {
    return [];
  }
}

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
    state: { pageIndex, pageSize },
  } = useTable({ columns, data }, useSortBy, usePagination)

  const rowsToShow = pagination ? page : rows;

  return (
    <>
      <MaUTable {...getTableProps()}>
        <TableHead>
          {headerGroups.map(headerGroup => (
            <TableRow {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <TableCell {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <TableSortLabel
                    active={column.isSorted}
                    direction={column.isSortedDesc ? 'desc' : 'asc'}
                  />
                </TableCell>
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