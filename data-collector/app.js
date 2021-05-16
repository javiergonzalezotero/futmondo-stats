const axios = require('axios');
const fs = require('fs');
const config = require('./config');

const endpointRounds = "http://www.futmondo.com/1/userteam/rounds";
const endpointRound = "http://www.futmondo.com/1/ranking/round";
const endpointLocker = "http://www.futmondo.com/2/locker/news";
const endpointLineUp = "http://www.futmondo.com/1/userteam/roundlineup";
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

function getRoundLineUp(userId, roundNumber) {
    return axios.post(endpointLineUp, {
        header: '',
        answer: "",
        query: {
            "championshipId": championshipId,
            "userteamId": userId,
            "round": roundNumber
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
    for (const r of allRounds) {
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
            data[p.id].rankings[round - 1] = { "points": p.points, "position": p.position, "detailed": {} };
        });
        let requestLineUps = r.data.answer.ranking.map(p => getRoundLineUp(p.id, r.data.query.roundNumber));
        let allLineUps = await Promise.all(requestLineUps);
        allLineUps.forEach(l => {
            let roundRanking = data[l.data.query.userteamId].rankings[round - 1];
            l.data.answer.players.filter(p => p.detailedPoints).forEach(p => {
                if (!p.zeroPointsReason) {
                    p.detailedPoints.po.filter(po => p.role === po.r).forEach(po => {
                        roundRanking.detailed[po.mode] = po.p + (roundRanking.detailed[po.mode] || 0);
                    });
                }
            });
            if (l.data.answer.players.length < 11 && !l.data.answer.negative) {
                let sub = 5 * (11 - l.data.answer.players.length);
                roundRanking.detailed.press -= sub;
                roundRanking.detailed.presstats -= sub;
                roundRanking.detailed.picas -= sub;
                roundRanking.detailed.stats -= sub;
            }
        });
        console.log("finished round " + round)
        await new Promise(r => setTimeout(r, 2000)); //wait 2 seconds
    }
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