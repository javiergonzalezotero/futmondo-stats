import Layout from '../components/Layout'
import { getClausesData, getClausesGroupedByUser } from '../lib/clauses'
import { getTransfersData, getTransfersGroupedByUser } from '../lib/transfers'
import SimpleTable from '../components/SimpleTable'
import Grid from '@material-ui/core/Grid'



export async function getStaticProps() {
  const clauses = getClausesData()
  const clausesGrouped = getClausesGroupedByUser()
  const transfers = getTransfersData()
  const transfersGrouped = getTransfersGroupedByUser()
  return {
    props: {
      clauses, clausesGrouped, transfers, transfersGrouped
    }
  }
}

export default function Clauses({ clauses, clausesGrouped, transfers, transfersGrouped }) {
  return (
    <Layout tab={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleTable rowsData={clauses} pagination={true} tableTitle={'Cláusulas'}></SimpleTable>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable rowsData={clausesGrouped} pagination={false} tableTitle={'Resumen de cláusulas por jugador'}></SimpleTable>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable rowsData={transfers} pagination={true} tableTitle={'Fichajes'}></SimpleTable>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable rowsData={transfersGrouped} pagination={false} tableTitle={'Resumen de fichajes por jugador'}></SimpleTable>
        </Grid>
      </Grid>
    </Layout>
  )
}
