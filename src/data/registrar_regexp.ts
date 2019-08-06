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

const googleDomainsRegex = /.*domains\.google\.com.*/
const porkbunRegex = /.*porkbun\.com.*/
const networkSolutionsRegex = /.*networksolutions\.com.*/
const namecheapRegex = /.*namecheap\.com.*/

// Defines regex checks for providers and then ways to change records with that provider.
const records = new Map<RegExp, any>()
records.set(googleDomainsRegex, "googledomains")
records.set(porkbunRegex, "porkbun")
records.set(networkSolutionsRegex, "networksolutions")
records.set(namecheapRegex, "namecheapregistrar")

export default records
