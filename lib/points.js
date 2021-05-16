import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'data/positions.json')

const calcPoints = function (r, detailedKey) {
    return detailedKey ? (r.detailed[detailedKey] ? r.detailed[detailedKey] : 0) : r.points;
}

export function getPointsData(detailedKey) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data.map(p => ({ name: p.name, data: p.rankings.map(r => calcPoints(r, detailedKey)) }));
}

export function getAccPointsData(detailedKey) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'))
    const result = []
    data.forEach(p => {
        const cumulativeSum = (sum => value => sum += calcPoints(value, detailedKey))(0);
        result.push({
            name: p.name,
            data: p.rankings.map(cumulativeSum)
        })
    });
    return result;
}

export function getAccPointsDiffData(detailedKey) {
    const pointsData = getAccPointsData(detailedKey)
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

export function getTotalPoints() {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    return data.map(p => {
        const sumDetailed = p.rankings.map(r => r.detailed).reduce((sum, det) => {
            for (const [key, points] of Object.entries(det)) {
                if (!sum[key]) {
                    sum[key] = 0;
                }
                sum[key] += points;
            }
            return sum;
        }, {});
        return { player: p.name, points: p.rankings.reduce((a, b) => a + b.points, 0),...sumDetailed };
    }).sort((a,b) => b.points - a.points);
}