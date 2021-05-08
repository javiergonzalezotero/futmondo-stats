import Head from 'next/head'
import { getClausesData, getClausesGroupedByUser } from '../lib/clauses'
import { getPointsData, getPositionsData, getAccPointsData, getAccPointsDiffData } from '../lib/points'
import SimpleChart from '../components/SimpleChart'
import SimpleTable from '../components/SimpleTable'

export async function getStaticProps() {
  const clauses = getClausesData()
  const clausesGrouped = getClausesGroupedByUser()
  const points = getPointsData()
  const accPoints = getAccPointsData()
  const accPointsDiff = getAccPointsDiffData()
  const positions = getPositionsData()
  return {
    props: {
      clauses, clausesGrouped, points, accPoints, accPointsDiff, positions
    }
  }
}

export default function Home({ clauses, clausesGrouped, points, accPoints, accPointsDiff, positions }) {
  return (
    <div>
      <Head>
        <title>Futmondo Stats</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SimpleTable param={clauses} pagination={true}></SimpleTable>
      <SimpleTable param={clausesGrouped} pagination={false}></SimpleTable>
      <SimpleChart id="points" series={points} title="Puntos"></SimpleChart>

      <SimpleChart id="accPoints" series={accPoints} title="Puntos acumulados"></SimpleChart>

      <SimpleChart id="accPointsDiff" series={accPointsDiff} title="Distancia al líder"></SimpleChart>

      <SimpleChart id="positions" series={positions} title="Posiciones"></SimpleChart>


    </div>
  )
}
