# Community DNS Tools

A set of browser-based DNS tools for DigitalOcean Community.

## Development/Building

To setup the build/develop environment, you will need to run `npm i` with Node 12+ installed. This will install the dependencies to allow you to build the project.

To develop for the DNS tool run `npm run dev:tools:dns-tool`, and to develop for the SPF explainer run `npm run dev:tools:spf-explainer`. This will start a development server that will automatically reload the codebase when changes occur.

If you wish to host these tools on a service, simply run `npm run build`. You can then take the `dist` folder and put it on your web server/bucket. The `dist` folder will contain the folders `dns-tool` and `spf-explainer` which will each have their respective tools inside. Travis CI does this automatically for this repository.

## Contributing

If you are contributing, please read the [contributing file](CONTRIBUTING.md) before submitting your pull requests.

## Thanks

Thanks to [Cloudflare](https://cloudflare.com) for their great WHOIS/DNS-over-HTTPS APIs.
You can learn more about the importance of DNS-over-HTTPS and how to use it [here](https://developers.cloudflare.com/1.1.1.1/dns-over-https/).

Thanks to [Matthew Gall](https://twitter.com/matthewgall) for his wonderful [WHOIS API.](https://whoisjs.com/)
