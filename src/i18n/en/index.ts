import app from "./app"
import dodns from "./dodns"
import mxBlacklist from "./mx_blacklist"
import records from "./records"
import truncatedRecord from "./truncated_record"
import whois from "./whois"
import propagationModal from "./propagation_modal"
import recordSelectionModal from "./record_selection_modal"
import github from "./github"
import txt from "./txt"
import common from "./common"

export default {
    app, dodns, mxBlacklist, records, truncatedRecord,
    whois, propagationModal, recordSelectionModal, github, txt,
    common,
} as {[key: string]: {[key: string]: string}}
