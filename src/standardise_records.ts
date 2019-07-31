export default (key: string, json: any, txtRecordFragments: any, recordsJoined: any, txtSplit: RegExp) => {
    // Handle edgecases for different record types.
    if (key === "MX") {
        for (const record of json.Answer) {
            const dataSplit = record.data.split(" ")
            if (dataSplit.length === 2) {
                record.data = dataSplit[1]
                record.priority = Number(dataSplit[0])
            }
        }
    } else if (key === "DMARC") {
        const newRecords = []
        for (const record of json.Answer) {
            const recordData = record.data.startsWith("\"") ? record.data.substr(1).slice(0, -1) : record.data
            const dataSplit =  recordData.split(";")
            for (const newSplit of dataSplit) {
                if (newSplit === "") {
                    continue
                }

                if (!newSplit.startsWith("v")) {
                    newRecords.push({
                        name: record.name,
                        data: newSplit,
                        TTL: record.TTL,
                        type: undefined,
                    })
                }
            }
        }
        json.Answer = newRecords
    } else if (key === "TXT") {
        for (const record of json.Answer) {
            const recordDataSplit = record.data.split(txtSplit)
            if (recordDataSplit.length > 1) {
                const consumableRecord = `${recordDataSplit[0].substr(1).startsWith("_") ? recordDataSplit[0].substr(2) : recordDataSplit[0].substr(1)}%${record.name}%${record.TTL}`
                if (txtRecordFragments[consumableRecord]) {
                    (txtRecordFragments as any)[consumableRecord] += `\n${record.data}`
                } else {
                    txtRecordFragments[consumableRecord] = record.data
                }
                delete json.Answer[record]
                continue
            }
        }
    }

    // Sorts them by either priority or TTL.
    json.Answer.sort((a: any, b: any) => {
        if (a.priority) {
            return a.priority - b.priority
        }
        if (a.TTL) {
            return b.TTL - a.TTL
        }
    })

    // Capitalise the keys.
    for (const record of json.Answer) {
        delete record.type
        const recordKeys = Object.keys(record)
        for (const recordKeyOrigin of recordKeys) {
            const recordKey = `${recordKeyOrigin[0].toUpperCase()}${recordKeyOrigin.substr(1)}`
            if (recordsJoined[recordKey]) {
                recordsJoined[recordKey].push(record[recordKeyOrigin])
            } else {
                recordsJoined[recordKey] = [record[recordKeyOrigin]]
            }
        }
    }
}
