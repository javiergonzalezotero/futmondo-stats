import fs from 'fs'
import path from 'path'

const file = path.join(process.cwd(), 'data/transfers.json')

export function getTransfersData() {
    const transfers = JSON.parse(fs.readFileSync(file, 'utf8'))
    transfers.forEach(t => {
        t.payer = t.payer || "";
        t.seller = t.seller || "";
        t.direct = t.payer && t.seller ? "Directa" : "";
    });
    return transfers;
}

export function getTransfersGroupedByUser() {
    const transfers = JSON.parse(fs.readFileSync(file, 'utf8'))
    const map = new Map();
    transfers.forEach(t => {
        if (t.payer) {
            let group = map.get(t.payer);
            if (!group) {
                group = { player: t.payer, paid: 0, received: 0, nPaid: 0, nReceived: 0, diff: 0 };
                map.set(t.payer, group);
            }
            group.paid += t.amount;
            group.diff -= t.amount;
            group.nPaid++;
        }

        if (t.seller) {
            let groupSeller = map.get(t.seller);
            if (!groupSeller) {
                groupSeller = { player: t.seller, paid: 0, received: 0, nPaid: 0, nReceived: 0, diff: 0 };
                map.set(t.seller, groupSeller);
            }
            groupSeller.received += t.amount;
            groupSeller.diff += t.amount;
            groupSeller.nReceived++;
        }
    });

    return [...map].map(([name, obj]) => (obj));
}