export default {
    A: {
        info: "A records are the most basic type of DNS record and are used to point a domain or subdomain to an IPv4 address.\n<b>These do NOT act as MX records, to receive e-mail, you need to set a MX record.</b>",
        url: "https://kb.pressable.com/article/dns-record-types-explained/",
        expectsHost: true,
    },
    TXT: {
        info: "TXT records are a type of DNS record that contains text information for sources outside of your domain.",
        url: "https://support.google.com/a/answer/2716800?hl=en",
        additionalDataParsing: (data: string) => data.startsWith("\"") ? data.substr(1).slice(0, -1) : data,
    },
    MX: {
        info: "A mail exchanger record (MX record) specifies the mail server responsible for accepting email messages on behalf of a domain name.",
        url: "https://en.wikipedia.org/wiki/MX_record",
        additionalDataParsing: (data: string) => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    AAAA: {
        info: "AAAA records behave the same as A records but for IPv6.\nThey are used to point a domain or subdomain to a IPv6 address.",
        url: "https://help.fasthosts.co.uk/app/answers/detail/a_id/1548/~/dns-aaaa-records",
        expectsHost: true,
    },
    CAA: {
        info: "CAA records allow domain owners to specify which Certificate Authorities (CAs) are permitted to issue certificates.",
        url: "https://www.digitalocean.com/docs/networking/dns/how-to/caa/",
    },
    NS: {
        info: "NS stands for \"name server\" and this record indicates which DNS server is authoritative for that domain (which server contains the actual DNS records).\nA domain will often have multiple NS records which can indicate primary and backup name servers for that domain.",
        url: "https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/",
        additionalDataParsing: (data: string) => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    SRV: {
        info: "A Service record (SRV record) is a specification of data in the Domain Name System defining the location, i.e. the hostname and port number, of servers for specified services.",
        url: "https://en.wikipedia.org/wiki/SRV_record",
    },
    DMARC: {
        info: "The goal of DMARC is to build on the system of senders and receivers collaborating to improve mail authentication practices of senders and enable receivers to reject unauthenticated messages.",
        url: "https://dmarc.org/overview/",
    },
}
