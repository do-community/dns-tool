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

const globalsign = "This TXT record is used so that GlobalSign can verify that they are issuing certificates to the domain owner."
export default {
    "google-site-verification": "This TXT record is used so that Google can verify the domain owner.",
    "mailru-verification": "This TXT record is used so that mail.ru can verify the domain owner.",
    "MS": "This TXT record is used for Office 365 domain verification.",
    "keybase-site-verification": "This TXT record is commonly used to verify that a Keybase user is in ownership of a domain.",
    "_globalsign-domain-verification": globalsign,
    "globalsign-domain-verification": globalsign,
    "bugcrowd-verification": "This TXT record is used so that Bugcrowd can verify the domain owner.",
    "status-page-domain-verification": "This is used so that Statuspage.io can verify the domain owner.",
    "segment-site-verification": "This is used so that Segment.com can verify the domain owner.",
    "logmein-verification-code": "This is used so that LogMeIn can verify the domain owner.",
    "facebook-domain-verification": "This is used so that Facebook can verify the domain owner.",
    "yandex-verification": "This is used so that Yandex can verify the domain owner.",
    "loaderio": "This is used so that Loader.io can verify the domain owner.",
    "v=spf1": "This is a SPF record which is used to identify trusted sources for transmitted e-mail.\nThis makes it easier for receivers to tell if a e-mail is spam.",
}
