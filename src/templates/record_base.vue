<template>
    <span>
        <span v-for="record in records">
            <Record :recordType="record.name" :recordUrl="record.url" :recordDescription="record.description" :data="$props.data" :expectsHost="record.expectsHost"></Record>
        </span>
    </span>
</template>

<script>
import Record from "./record"
import recordsDataset from "../data/records"

export default {
    name: "RecordBase",
    props: {
        data: String,
    },
    data() {
        const setRecords = []
        for (const recordKey in recordsDataset) {
            const record = recordsDataset[recordKey]
            setRecords.push({
                name: recordKey,
                description: record.info,
                url: record.url,
                expectsHost: Boolean(record.expectsHost),
            })
        }
        return {
            records: setRecords,
        }
    },
    components: {
        Record,
    },
}
</script>
