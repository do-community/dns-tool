export default {
    title: "Evaluation Result",
    goThrough: "E-mails will be able to send from {{IP}} successfully, as this domain.",
    ignored: "E-mails sent from {{IP}}, as this domain, should be ignored.",
    softFail: "E-mails sent from {{IP}}, as this domain, will be accepted but will likely be marked as spam since they will be flagged.",
    neutral: "The SPF record will neither pass or fail emails, just act as if the record is not there. Therefore, this won't affect the ability to send.",
} as {[key: string]: string}
