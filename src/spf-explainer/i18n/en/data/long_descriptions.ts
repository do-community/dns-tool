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

export default {
    ip4: "This means that any IPv4 addresses specified in this mechanism will be accepted and not marked as spam.",
    ip6: "This means that any IPv6 addresses specified in this mechanism will be accepted and not marked as spam.",
    a: "This means that any A records specified in this mechanism (or the A records for the current record if none are specified) will be accepted and not marked as spam.",
    v: `This just defines the record version. This is commonly just <code class="slim">spf1</code>.`,
    mx: "This means that any MX records specified in this mechanism (or the MX records for the current record if none are specified) will be accepted and not marked as spam.",
    include: "This will include the records at the hostname given. This can be recursive so it can go down multiple levels. Anytime that a mechanism is used that would be bound to the domain in the included record, it will be bound to the domain of the included record.",
    ptr: "The PTR record is deprecated since it is slow and relies on the name servers inbetween the domains to work properly.",
} as {[key: string]: string}
