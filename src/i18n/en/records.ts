export default {
    learnMore: "Learn more",
    noRecords: "Could not find any records of this type.",
    propagation: "Why do I get different values on my local system?",
    learnHow: "Learn how to set {record} records with your DNS/registrar.",
    A: "A records are the most basic type of DNS record and are used to point a domain or subdomain to an IPv4 address.\n<b>These do NOT act as MX records, to receive e-mail, you need to set a MX record.</b>",
    TXT: "TXT records are a type of DNS record that contains text information for sources outside of your domain.",
    MX: "A mail exchanger record (MX record) specifies the mail server responsible for accepting email messages on behalf of a domain name.",
    AAAA: "AAAA records behave the same as A records but for IPv6.\nThey are used to point a domain or subdomain to a IPv6 address.",
    CAA: "CAA records allow domain owners to specify which Certificate Authorities (CAs) are permitted to issue certificates.",
    NS: "NS stands for \"name server\" and this record indicates which DNS server is authoritative for that domain (which server contains the actual DNS records).\nA domain will often have multiple NS records which can indicate primary and backup name servers for that domain.",
    SRV: "A Service record (SRV record) is a specification of data in the Domain Name System defining the location, i.e. the hostname and port number, of servers for specified services.",
    DMARC: "The goal of DMARC is to build on the system of senders and receivers collaborating to improve mail authentication practices of senders and enable receivers to reject unauthenticated messages.",
} as {[key: string]: string}
