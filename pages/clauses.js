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
    <Layout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleTable param={clauses} pagination={true}></SimpleTable>
        </Grid>
        <Grid item xs={12}>
          <SimpleTable param={clausesGrouped} pagination={false}></SimpleTable>
        </Grid>
      </Grid>
    </Layout>
  )
}
