class LootTable {
    /** Constructs the loot table, input is an array with elements that have {id: any, amt: number}, the amt is the weight of the element. ids can be duplicated */
    constructor(table) {
        this.table = table;
    }

    /** returns a weighted random id, optional flag to decrement weight by one after returning it */
    get(decrement) {
        // returns a random item from the loot table
        const total = this.table.reduce((tot,e)=>tot + e.amt, 0);
        if (total < 1) {
            // cannot do anything
            return null;
        }
        let rand = Math.floor(Math.random() * total);
        let iter = 0;
        while (iter < this.table.length && rand >= 0) {
            rand -= this.table[iter].amt;
            iter++;
        }
        const picked = this.table[iter - 1].id;

        if (decrement) {
            this.table[iter].amt--;
            if (this.table[iter].amt === 0) {
                // remove
                this.table.splice(iter, 1);
            }
        }
        return picked;
    }
}

function testLootTable() {
    const lt = new LootTable([{
        id: 'apple',
        amt: 3
    }, {
        id: 'orange',
        amt: 3
    }, {
        id: 'banana',
        amt: 3
    }])

    const numIter = 2000000
    const counter = {};
    for (let i = 0; i < numIter; i++) {
        const k = lt.get();
        if (!counter[k]) {
            counter[k] = 0
        }
        counter[k]++;
    }

    // should be roughly the same
    const counts = Object.keys(counter).map(k=>Math.floor(counter[k] / numIter * 100));
    const allSame = counts.every(c=>c === counts[0]);
    return allSame;
}
