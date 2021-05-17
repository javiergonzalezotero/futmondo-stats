import React from 'react';
import Layout from '../components/Layout'
import { getPointsData, getPositionsData, getAccPointsData, getAccPointsDiffData, getTotalPoints } from '../lib/points'
import SimpleChart from '../components/SimpleChart'
import SimpleTable from '../components/SimpleTable'
import ToggleButtonGridLayout from '../components/ToggleButtonGridLayout'
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

  const [oneline, setOneline] = React.useState(true);

  const handleOneline = (event, newOneline) => {
    if (newOneline != null) {
      setOneline(newOneline);
    }
  };


  return (
    <Layout tab={0}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SimpleTable rowsData={totalPoints} pagination={false} tableTitle='Puntos totales'></SimpleTable>
        </Grid>
        <Grid item xs={12} container justify="flex-end">
          <ToggleButtonGridLayout oneline={oneline} onChange={handleOneline}></ToggleButtonGridLayout>
        </Grid>
        <Grid item xs={oneline ? 12 : 6}>
          <SimpleChart id="points" series={points} title="Puntos"></SimpleChart>
        </Grid>
        <Grid item xs={oneline ? 12 : 6}>
          <SimpleChart id="accPoints" series={accPoints} title="Puntos acumulados"></SimpleChart>
        </Grid>
        <Grid item xs={oneline ? 12 : 6}>
          <SimpleChart id="accPointsDiff" series={accPointsDiff} title="Distancia al líder"></SimpleChart>
        </Grid>
        <Grid item xs={oneline ? 12 : 6}>
          <SimpleChart id="positions" series={positions} title="Posiciones"></SimpleChart>
        </Grid>
      </Grid>

    </Layout>
  )
}
