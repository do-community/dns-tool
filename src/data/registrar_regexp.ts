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
