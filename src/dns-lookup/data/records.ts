/*
Copyright 2019 DigitalOcean

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import i18n from "../i18n"

export default {
    A: {
        info: i18n.data.records.A,
        url: "https://kb.pressable.com/article/dns-record-types-explained/",
        expectsHost: true,
    },
    TXT: {
        info: i18n.data.records.TXT,
        url: "https://support.google.com/a/answer/2716800?hl=en",
        additionalDataParsing: (data: string) => data.startsWith("\"") ? data.substr(1).slice(0, -1) : data,
    },
    MX: {
        info: i18n.data.records.MX,
        url: "https://en.wikipedia.org/wiki/MX_record",
        additionalDataParsing: (data: string) => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    AAAA: {
        info: i18n.data.records.AAAA,
        url: "https://help.fasthosts.co.uk/app/answers/detail/a_id/1548/~/dns-aaaa-records",
        expectsHost: true,
    },
    CAA: {
        info: i18n.data.records.CAA,
        url: "https://www.digitalocean.com/docs/networking/dns/how-to/caa/",
    },
    NS: {
        info: i18n.data.records.NS,
        url: "https://www.cloudflare.com/learning/dns/dns-records/dns-ns-record/",
        additionalDataParsing: (data: string) => data.endsWith(".") ? data.slice(0, -1) : data,
        expectsHost: true,
    },
    SRV: {
        info: i18n.data.records.SRV,
        url: "https://en.wikipedia.org/wiki/SRV_record",
    },
    DMARC: {
        info: i18n.data.records.DMARC,
        url: "https://dmarc.org/overview/",
    },
    SSHFP: {
        info: i18n.data.records.SSHFP,
        url: "https://en.wikipedia.org/wiki/SSHFP_record",   
    },
    TLSA: {
        info: i18n.data.records.TLSA,
        url: "https://simpledns.com/help/tlsa-records",
    },
}
