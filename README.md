# Community DNS Tools

A set of browser-based DNS tools for DigitalOcean Community.

## Development/Building

To setup the build/develop environment, you will need to run `npm i` with Node 12+ installed. This will install the
 dependencies to allow you to build the project.

To develop for the DNS tool run `npm run dev:tools:dns-tool`, and to develop for the SPF explainer run
 `npm run dev:tools:spf-explainer`.\
This will start a development server that will automatically reload the codebase when changes occur.

If you wish to host these tools on a service, simply run `npm run build`. This will run all the necessary build scripts
 automatically to build all the tools present in the source folder.\
You can then take the `dist` folder and put it on your web server/bucket. The `dist` folder will contain the folders
 `dns-tool` and `spf-explainer` which will each have their respective tools inside.\
Travis CI does this automatically for this repository to deploy to gh-pages.

## Source Structure

### [`src`](./src)

All the source for the tools is located within the [`src`](./src) directory.

In this directory, there is the [`src/shared`](./src/shared) directory which contains centralised assets and source for
 the tools, such as the main Community styling which is located in [`src/shared/scss`](./src/shared/scss) and the
 generic templates used by all tools in [`src/shared/templates`](./src/shared/templates).
 
Within this directory are also the main tool source directories ([`src/dns-tool`](./src/dns-tool) &
 [`src/spf-explainer`](./src/spf-explainer)).\
These directories contain the specific source for that tool, which includes custom templates and style inheritance from
 the centralised styles.
 
### [`build`](./build)

The [`build`](./build) directory contains all the scripts needed to successfully build the tools into a minimal number
 of assets.
 
[`build/cleanDist.js`](./build/cleanDist.js) is a simple script that creates the `dist` directory if it does not exist
 and then ensures that it is completely empty so that the build script has a fresh beginning.

[`build/fetchTemplate.js`](./build/fetchTemplate.js) handles pulling down the blank DigitalOcean Community template
 page, converting it to be a PostHTML-Extend template and save it to `build/base.html`.

[`build/buildSVGs.js`](./build/buildSVGs.js) takes all SVG files located in [`src/shared/assets`](./src/shared/assets)
 and converts them to JS strings (saved to `build/svg/<name>.svg.js`) that allow Vue/Parcel to include the SVGs inline.

[`build/buildTool.js`](./build/buildTool.js) is the main script file for the build process a tool in [`src`](./src).
This builds out the `mount.js` file first, then compiles the `scss/style.scss` file to `style.css`, both using Parcel.
Finally, the script uses PostHTML to bundle the `index.html` file, making use of the generate DigitalOcean Community
 template at `build/base.html`.

## Contributing

If you are contributing, please read the [contributing file](CONTRIBUTING.md) before submitting your pull requests.

## Thanks

Thanks to [Cloudflare](https://cloudflare.com) for their great WHOIS/DNS-over-HTTPS APIs.
You can learn more about the importance of DNS-over-HTTPS and how to use it [here](https://developers.cloudflare.com/1.1.1.1/dns-over-https/).

Thanks to [Matthew Gall](https://twitter.com/matthewgall) for his wonderful [WHOIS API.](https://whoisjs.com/)
