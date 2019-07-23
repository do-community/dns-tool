// Join TXT records based on their Host/TTL.
export default (recordsJoined: any, txtRecordFragments: any) => {
    for (const fragmentKey of Object.keys(txtRecordFragments)) {
        const fragSplit = fragmentKey.split(/%/g)
        const name = fragSplit[1]
        const ttl = fragSplit[2]
        const fullRecord = txtRecordFragments[fragmentKey]
        const recordObject = {
            Name: name,
            TTL: ttl,
            Data: fullRecord,
        }
        for (const recordKey of Object.keys(recordObject)) {
            if (recordsJoined[recordKey]) {
                recordsJoined[recordKey].push((recordObject as any)[recordKey])
            } else {
                recordsJoined[recordKey] = [(recordObject as any)[recordKey]]
            }
        }
    }
}
