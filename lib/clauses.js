import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'data/clauses.json')

export function getClausesData() {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
}

export function getClausesGroupedByUser() {
    const clauses = getClausesData();
    const map = new Map();
    clauses.forEach(c => {
        let group = map.get(c.payer);
        if (!group) {
            group = { player: c.payer, paid: 0, received: 0, diff: 0, nPaid: 0, nReceived: 0 };
            map.set(c.payer, group);
        }
        group.paid += c.amount;
        group.diff -= c.amount;
        group.nPaid++;

        let groupSeller = map.get(c.seller);
        if (!groupSeller) {
            groupSeller = { player: c.seller, paid: 0, received: 0, diff: 0, nPaid: 0, nReceived: 0 };
            map.set(c.seller, groupSeller);
        }
        groupSeller.received += c.amount;
        groupSeller.diff += c.amount;
        groupSeller.nReceived++;
    });

    return [...map].map(([name, obj]) => (obj));
}