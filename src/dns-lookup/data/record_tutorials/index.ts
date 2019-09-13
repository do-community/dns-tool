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

import digitalocean from "./digitalocean"
import cloudflare from "./cloudflare"
import namecheap from "./namecheap"
import godaddy from "./godaddy"
import googledomains from "./googledomains"
import porkbun from "./porkbun"
import networksolutions from "./network_solutions"
import namecheapregistrar from "./namecheap_registrar"

export default {
    cloudflare, digitalocean, namecheap, godaddy, googledomains, porkbun, networksolutions, namecheapregistrar,
}
