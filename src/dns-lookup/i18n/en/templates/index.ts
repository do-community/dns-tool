import app from "./app"
import dodns from "./dodns"
import mxBlacklist from "./mx_blacklist"
import records from "./records"
import truncatedRecord from "./truncated_record"
import whois from "./whois"
import propagationModal from "./propagation_modal"
import recordSelectionModal from "./record_selection_modal"
import dnsDiff from "./dns_diff"
import clipboardModal from "./clipboard_modal"
import dmarcExplainer from "./dmarc_explainer"
import errorModal from "./error_modal"

export default {
    app, dodns, mxBlacklist, records, truncatedRecord,
    whois, propagationModal, recordSelectionModal,
    dnsDiff, clipboardModal, dmarcExplainer, errorModal,
} as {[key: string]: {[key: string]: any}}
