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

const ptrStart = "<b>PTR records are not a good way of looking up an IP address in a SPF record since they are slow and sometimes ignored.</b> This means that it will check the PTR record of "
const aStart = "This means that any IP address that is a A record of "
const mxStart = "This means that any IP address that is a MX record of "

export default {
    v: "This is the SPF record version.",
    unknown: "This part is unknown.",
    include: `This includes all SPF records at <code class="slim">{1}</code>:`,
    ip4: `This means that IPv4 addresses in the range??s?? of <code class="slim">{R}</code> are allowed to send e-mails from any domains using this record.`,
    ip6: `This means that IPv6 addresses in the range??s?? of <code class="slim">{R}</code> are allowed to send e-mails from any domains using this record.`,
    redirect: `This is used when 2 websites have the exact same infrastructure and the administrator wants all requests directed to one domain. In this case, that would be <code class="slim">{1}</code>.`,
    exists: `This is used to check if a IP address is allowed to send e-mails by checking if there is a NULL record at <code class="slim">&lt;IP address&gt;.{1}</code>.`,
    ptrRoot: ptrStart + "this domain to see if the IP address is allowed to send e-mails.",
    ptrNotRoot: ptrStart + `<code class="slim">{1}</code> to see if the IP address is allowed to send e-mails.`,
    aRoot: aStart + "this domain is allowed to send e-mails.",
    aNotRoot: aStart + `<code class="slim">{1}</code> is allowed to send e-mails.`,
    mxRoot: mxStart + "this domain is allowed to send e-mails.",
    mxNotRoot: mxStart + `<code class="slim">{1}</code> is allowed to send e-mails.`,
    hardFail: "This means only the IP's here or in inherited records are allowed to send e-mails.",
    softFail: "If the IP address sending the e-mail is not in this record, the e-mail should be accepted but marked with a warning. This means that the e-mail will likely be marked as spam.",
    noFail: "This tag allows any server to send e-mails from your domain.",
    neutral: "This will neither pass or fail emails, just act like the record is not there. Therefore, this doesn't affect the ability to send.",
} as {[key: string]: string}
