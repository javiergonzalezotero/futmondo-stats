import Layout from '../components/Layout'
import { getPointsData, getPositionsData, getAccPointsData, getAccPointsDiffData, getTotalPoints } from '../lib/points'
import SimpleChart from '../components/SimpleChart'
import SimpleTable from '../components/SimpleTable'
import Grid from '@material-ui/core/Grid'


export async function getStaticProps() {
  const points = getPointsData()
  const accPoints = getAccPointsData()
  const accPointsDiff = getAccPointsDiffData()
  const positions = getPositionsData()
  const totalPoints = getTotalPoints()
  return {
    props: {
      points, accPoints, accPointsDiff, positions, totalPoints
    }
  }
}

export default function Home({ points, accPoints, accPointsDiff, positions, totalPoints }) {
  return (
    <Layout tab={0}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleTable rowsData={totalPoints} pagination={false}></SimpleTable>
        </Grid>
      </Grid>

      <SimpleChart id="points" series={points} title="Puntos"></SimpleChart>

      <SimpleChart id="accPoints" series={accPoints} title="Puntos acumulados"></SimpleChart>

      <SimpleChart id="accPointsDiff" series={accPointsDiff} title="Distancia al líder"></SimpleChart>

      <SimpleChart id="positions" series={positions} title="Posiciones"></SimpleChart>

    </Layout>
  )
}
