import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'data/positions.json')

export function getPointsData() {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    return data.map(p => ({ name: p.name, data: p.rankings.map(r => r.points) }));
}

export function getAccPointsData() {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const result = []
    data.forEach(p => {
        const cumulativeSum = (sum => value => sum += value.points)(0);
        result.push({
            name: p.name,
            data: p.rankings.map(cumulativeSum)
        })
    });
    return result;
}

export function getAccPointsDiffData() {
    const pointsData = getAccPointsData()
    const max = Array(pointsData[0].data.length).fill(0);
    pointsData.forEach(d => {
        for (let i = 0; i < d.data.length; i++) {
            if (max[i] < d.data[i]) {
                max[i] = d.data[i];
            }
        }
    })
    pointsData.forEach(d => {
        d.data = d.data.map((x, i) => x - max[i])
    })
    return pointsData;
}

export function getPositionsData() {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const result = [];
    data.forEach(p => {
        const positions = Array(data.length).fill(0)
        p.rankings.forEach(r => {
            positions[r.position - 1]++
        });
        result.push({
            name: p.name,
            data: positions
        })
    });
    return result;
}