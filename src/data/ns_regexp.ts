const digitalOceanRegex = /.*digitalocean\.com\.*/
const cloudflareRegex = /.*cloudflare\.com\.*/
const namecheapRegex = /.*registrar-servers\.com.*/
const goDaddyRegex = /.*godaddy\.com.*/

// Defines regex checks for providers and then ways to change records with that provider.
const records = new Map<RegExp, any>()
records.set(digitalOceanRegex, "digitalocean")
records.set(cloudflareRegex, "cloudflare")
records.set(namecheapRegex, "namecheap")
records.set(goDaddyRegex, "godaddy")
export default records
