import Layout from '../components/Layout'
import { getClausesData, getClausesGroupedByUser } from '../lib/clauses'
import SimpleTable from '../components/SimpleTable'
import Grid from '@material-ui/core/Grid'


export async function getStaticProps() {
  const clauses = getClausesData()
  const clausesGrouped = getClausesGroupedByUser()
  return {
    props: {
      clauses, clausesGrouped
    }
  }
}

export default function Clauses({ clauses, clausesGrouped }) {
  return (
    <Layout tab={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleTable rowsData={clauses} pagination={true}></SimpleTable>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable rowsData={clausesGrouped} pagination={false}></SimpleTable>
        </Grid>
      </Grid>
    </Layout>
  )
}
