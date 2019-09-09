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

const explanationMap = new Map<RegExp | (boolean | RegExp | string)[], string>()

explanationMap.set(/^v=spf1$/, i18n.data.explanations.v)
explanationMap.set([/^include:(.+)$/, true], i18n.data.explanations.include)
explanationMap.set(/^ip4:(.+)$/, i18n.data.explanations.ip4)
explanationMap.set(/^ip6:(.+)$/, i18n.data.explanations.ip6)
explanationMap.set([/^redirect[:=](.+)$/, true], i18n.data.explanations.redirect)
explanationMap.set(/^exists:%\{i\}\.(.+)$/, i18n.data.explanations.exists)
explanationMap.set(/^ptr:(.+)$/, i18n.data.explanations.ptrNotRoot)
explanationMap.set(/^ptr$/, i18n.data.explanations.ptrRoot)
explanationMap.set([/^a$/, false, "A"], i18n.data.explanations.aRoot)
explanationMap.set([/^a:(.+)$/, false, "A"], i18n.data.explanations.aNotRoot)
explanationMap.set([/^mx$/, false, "MX"], i18n.data.explanations.mxRoot)
explanationMap.set([/^mx:(.+)$/, false, "MX"], i18n.data.explanations.mxNotRoot)
explanationMap.set(/^~all$/, i18n.data.explanations.softFail)
explanationMap.set(/^-all$/, i18n.data.explanations.hardFail)
explanationMap.set(/^\+all$/, i18n.data.explanations.noFail)
explanationMap.set(/^\?all$/, i18n.data.explanations.neutral)

export default explanationMap
