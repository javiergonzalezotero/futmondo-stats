import Head from 'next/head'
import { getClausesData, getClausesGroupedByUser } from '../lib/clauses'
import { getPointsData, getPositionsData, getAccPointsData, getAccPointsDiffData, getTotalPoints } from '../lib/points'
import SimpleChart from '../components/SimpleChart'
import SimpleTable from '../components/SimpleTable'
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


export async function getStaticProps() {
  const clauses = getClausesData()
  const clausesGrouped = getClausesGroupedByUser()
  const points = getPointsData()
  const accPoints = getAccPointsData()
  const accPointsDiff = getAccPointsDiffData()
  const positions = getPositionsData()
  const totalPoints = getTotalPoints()
  return {
    props: {
      clauses, clausesGrouped, points, accPoints, accPointsDiff, positions, totalPoints
    }
  }
}

export default function Home({ clauses, clausesGrouped, points, accPoints, accPointsDiff, positions, totalPoints }) {
  return (
    <div>
      <Head>
        <title>Futmondo Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <SimpleTable param={clauses} pagination={true}></SimpleTable>
          </Grid>
          <Grid item xs={12}>
            <SimpleTable param={clausesGrouped} pagination={false}></SimpleTable>
          </Grid>
          <Grid item xs={12}>
            <SimpleTable param={totalPoints} pagination={false}></SimpleTable>
          </Grid>
        </Grid>

        <SimpleChart id="points" series={points} title="Puntos"></SimpleChart>

        <SimpleChart id="accPoints" series={accPoints} title="Puntos acumulados"></SimpleChart>

        <SimpleChart id="accPointsDiff" series={accPointsDiff} title="Distancia al líder"></SimpleChart>

        <SimpleChart id="positions" series={positions} title="Posiciones"></SimpleChart>
      </Container>

    </div>
  )
}
