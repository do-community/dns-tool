import txt from "./txt"
import dmarc from "./dmarc"
import records from "./records"
import recordKeyHelp from "./record_key_help"

export default {
    txt, records, recordKeyHelp, dmarc,
} as {[key: string]: {[key: string]: string}}
