import recordsDataset from "./records"

const setRecords = []
for (const recordKey in recordsDataset) {
    const record = (recordsDataset as any)[recordKey]
    setRecords.push({
        name: recordKey,
        description: record.info,
        url: record.url,
        expectsHost: Boolean(record.expectsHost),
    })
}
export default setRecords
