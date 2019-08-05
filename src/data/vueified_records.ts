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

import recordsDataset from "./records"

const setRecords = []
for (const recordKey in recordsDataset) {
    const record = (recordsDataset as any)[recordKey]
    setRecords.push({
        name: recordKey,
        description: record.info,
        url: record.url,
        expectsHost: Boolean(record.expectsHost),
    })
}
export default setRecords
