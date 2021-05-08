const axios = require('axios');
const fs = require('fs');
const config = require('./config');

const endpointRounds = "http://www.futmondo.com/1/userteam/rounds";
const endpointRound = "http://www.futmondo.com/1/ranking/round";
const endpointLocker = "http://www.futmondo.com/2/locker/news";
const championshipId = config.championshipId;
const userteamId = config.userteamId;
const requestConfig = {
    headers: {
        Cookie: config.cookie
    }
}

function getRound(roundNumber) {
    return axios.post(endpointRound, {
        header: '',
        answer: "",
        query: {
            "championshipId": championshipId,
            "userteamId": userteamId,
            "roundNumber": roundNumber
        }
    }, requestConfig);
}

function writeFile(file, content) {
    fs.writeFile(file, content, err => {
        if (err) {
            console.error(err)
            return
        }
        //file written successfully
    });
}

async function loadRankings() {
    let postData = {
        header: '',
        answer: "",
        query: {
            "championshipId": championshipId,
            "userteamId": userteamId
        }
    };
    let res = await axios.post(endpointRounds, postData, requestConfig);
    let requestsRounds = res.data.answer.map(a => getRound(a.id));
    let rounds = res.data.answer.reduce((obj, round) => (obj[round.id] = round.number, obj), {});
    let allRounds = await Promise.all(requestsRounds);
    let data = [];
    allRounds.forEach(r => {
        let round = rounds[r.data.query.roundNumber];
        r.data.answer.ranking.forEach(p => {
            if (p.name == "fredsan90" && round == 31) {
                p.points += 4;
            } else if (p.name == "dgonzalezrodal" && round == 33) {
                p.points += 4;
            } else if (p.name == "La Cajina" && round == 33) {
                p.points += 2;
            }
            data[p.id] = data[p.id] || {};
            data[p.id].name = p.name;
            data[p.id].rankings = data[p.id].rankings || [];
            data[p.id].rankings[round - 1] = { "points": p.points, "position": p.position };
        });
    });
    let dataPositions = "User";
    for (let i = 1; i <= Object.keys(rounds).length; i++) {
        dataPositions += "," + i;
    }
    dataPositions += "\n";
    let dataPoints = dataPositions;
    let dataPointsAcc = dataPositions;
    let dataArray = [];
    for (let id in data) {
        let pointsAcc = data[id].rankings.map((sum => value => sum.points += value.points)({ points: 0 }));
        dataPointsAcc += data[id].name + "," + pointsAcc.join(",") + "\n";
        dataPoints += data[id].name + "," + data[id].rankings.map(r => r.points).join(",") + "\n";
        dataPositions += data[id].name + "," + data[id].rankings.map(r => r.position).join(",") + "\n";
        dataArray.push({
            id: id,
            name: data[id].name,
            rankings: data[id].rankings
        });
    }
    writeFile('csv/points.csv', dataPoints);
    writeFile('csv/pointsAcc.csv', dataPointsAcc);
    writeFile('csv/positions.csv', dataPositions);
    writeFile('db/positions.json', JSON.stringify(dataArray, null, 2));
}
async function loadClauses(from) {
    let postData = {
        header: '',
        answer: "",
        query: {
            "championshipId": championshipId
        }
    };
    let regexClause = /<strong>[^<]*/g;
    if (from) {
        postData.query.from = from;
    }
    let res = await axios.post(endpointLocker, postData, requestConfig);
    res.data.answer.news.filter(n => n.styp === "clause").forEach(n => {
        let parts = n.txt.match(regexClause).map(p => p.substring(8));
        let amount = parseInt(parts[1].replace(/\./g, ""))
        let player = parts[3].replace(/\"/g, "");
        let clause = { payer: parts[0], seller: parts[2], amount: amount, player: player, date: n.created };
        clauses.push(clause);
    });
    if (res.data.answer.news.length == 200) {
        loadClauses(res.data.answer.news[199]._id);
    } else {
        let dataClauses = "Payer,Seller,Amount,Player\n";
        dataClauses += clauses.map(c => `${c.payer},${c.seller},${c.amount},${c.player}`).join("\n");
        writeFile('csv/clauses.csv', dataClauses);
        writeFile('db/clauses.json', JSON.stringify(clauses, null, 2));
    }
}



loadRankings().catch(error => {
    console.error(error)
});

let clauses = [];
loadClauses().catch(error => {
    console.error(error)
});