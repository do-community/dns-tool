const googleDomainsRegex = /.*domains\.google\.com.*/
const porkbunRegex = /.*porkbun\.com.*/
const networkSolutionsRegex = /.*networksolutions\.com.*/

// Defines regex checks for providers and then ways to change records with that provider.
const records = new Map<RegExp, any>()
records.set(googleDomainsRegex, "googledomains")
records.set(porkbunRegex, "porkbun")
records.set(networkSolutionsRegex, "networksolutions")

export default records
