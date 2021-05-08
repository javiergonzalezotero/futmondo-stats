import React from "react";
import { useTable, useSortBy, usePagination } from 'react-table'
import Numeral from "numeral";
import "numeral/locales/es-es";

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
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  style={{
                    borderBottom: 'solid 3px red',
                    background: 'aliceblue',
                    color: 'black',
                    fontWeight: 'bold',
                  }}
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rowsToShow.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      style={{
                        padding: '10px',
                        border: 'solid 1px gray',
                        background: 'papayawhip',
                      }}
                    >
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {pagination &&
        (<div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Página{' '}
            <strong>
              {pageIndex + 1} de {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Ir a página:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50, '*'].map(pageSize => (
              <option key={pageSize} value={pageSize == '*' ? rows.length : pageSize}>
                Mostrar {pageSize == '*' ? `todo (${rows.length})` : pageSize}
              </option>
            ))}
          </select>
        </div>)}
    </>
  )
}