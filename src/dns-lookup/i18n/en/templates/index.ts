import app from "./app"
import dodns from "./dodns"
import records from "./records"
import truncatedRecord from "./truncated_record"
import whois from "./whois"
import propagationModal from "./propagation_modal"
import recordSelectionModal from "./record_selection_modal"
import dnsDiff from "./dns_diff"
import clipboardModal from "./clipboard_modal"
import dmarcExplainer from "./dmarc_explainer"

export default {
    app, dodns, records, truncatedRecord,
    whois, propagationModal, recordSelectionModal,
    dnsDiff, clipboardModal, dmarcExplainer,
} as {[key: string]: {[key: string]: any}}
