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

// Defines all pending methods.
const pendingMethods: (() => void)[] = []

// Defines the maximum backoff.
const maxBackoff = 512

// Cancels all pending requests.
export const cancel = () => {
    for (const m of pendingMethods) m()
    pendingMethods.length = 0
}

// A fetch client that will behave exactly like fetch except it will backoff for 429/5XX errors.
export default (input: RequestInfo, init?: RequestInit): Promise<Response> => new Promise(async (res, rej) => {
    // Defines if it is active.
    let active = true

    // Defines the promise.
    pendingMethods.push(() => active = false)

    // Defines the current backoff.
    let currentBackoff = 1    

    // Loop until the promise is resolved/rejected or it is inactive.
    while (active) {
        // Get the fetch response.
        let r
        try {
            r = await fetch(input, init)
        } catch (e) {
            // Something really bad with the network/CORS has happened. Pass through this exception.
            return rej(e)
        }

        // If it is not a 429/5XX, let the function deal with this.
        if (r.status !== 429 && 500 > r.status) return res(r)

        // Defines the amount of time to backoff.
        let backoff: number
        const createBackoffTime = () => {
            currentBackoff *= 2
            if (currentBackoff > maxBackoff) currentBackoff = maxBackoff
            return currentBackoff 
        }
        if (r.headers.get("Retry-After")) {
            const header = Number(r.headers.get("Retry-After"))
            if (header === NaN) backoff = createBackoffTime()
            else backoff = header
        } else {
            backoff = createBackoffTime()
        }

        // Create the console warning.
        console.warn(`${input} has returned a status ${r.status}. Backing off for ${backoff} second(s).`)

        // Wait for the backoff period.
        await new Promise(x => setTimeout(x, backoff * 1000))
    }

    // Breaking out the loop here means that it is cancelled.
    rej("Request cancelled.")
})
