import React from "react";

import TableFooter from '@material-ui/core/TableFooter'
import MuiTablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TablePaginationActions from './TablePaginationActions'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { esES } from '@material-ui/core/locale';


export default function TablePagination({ count, rowsPerPage, page, gotoPage, setPageSize }) {

    const handleChangePage = (event, newPage) => {
        gotoPage(newPage)
    }

    const handleChangeRowsPerPage = event => {
        setPageSize(Number(event.target.value))
    }

    return (
        <ThemeProvider theme={createMuiTheme({
            palette: {
                primary: { main: '#1976d2' },
            },
        }, esES)}>
            <TableFooter>
                <TableRow>
                    <MuiTablePagination
                        rowsPerPageOptions={[
                            10, 20, 30, 50,
                            { label: 'Mostrar todo', value: count },
                        ]}

                        count={count}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        SelectProps={{
                            inputProps: { 'aria-label': 'filas por página' },
                            native: true,
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                    />
                </TableRow>
            </TableFooter>
        </ThemeProvider>
    )
}