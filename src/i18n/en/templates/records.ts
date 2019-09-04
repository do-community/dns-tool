export default {
    learnMore: "Learn more",
    noRecords: "Could not find any records of this type.",
    propagation: "Why do I get different values on my local system?",
    learnHow: "Learn how to set {record} records with your DNS/registrar.",
    propagationNote: "Google DNS is reporting different values. This potentially means that your values have not propagated fully yet.",
    srvTlsaFormat: `Expecting to see {a} {record} record here? Make sure you're looking at the right sub-domain.
    <br/>{record} record names are normally formatted as follows: <code>_&lt;{sub}&gt;._&lt;protocol&gt;.name.</code>`,
    dmarcMechanisms: "What are the mechanisms supported in DMARC records?",
} as {[key: string]: string}
