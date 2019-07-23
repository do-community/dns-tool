import cfWHO from './utils/cfWHO';
import geoJS from './utils/geoJS';
import getBlacklists from './blacklists';
import sanitize from './utils/sanitize';

// Runs a MX lookup.
export const mxLookup = async (spanId: string, domain: string, ip: string) => {
    const html: string[] = [];
    const blacklists = await getBlacklists(ip, domain);

    for (const domainBlacklist of blacklists.domain)
        html.push(`<p style="font-size: 11px"><b>Domain blacklisted by ${domainBlacklist}</b></p>`);
    for (const ipBlacklist of blacklists.ip)
        html.push(`<p style="font-size: 11px"><b>Domain blacklisted by ${ipBlacklist}</b></p>`);

    if (html.length === 0) html.push(`<p style="font-size: 11px"><b>Domain/IP is not blacklisted.</b></p>`);
    html.push(`<p style="font-size: 11px"><a href="https://www.techwalla.com/articles/what-does-it-mean-if-an-email-address-is-blacklisted">What does a mailing blacklist mean?</a></p>`);

    const setLoop = () => {
        const span = document.getElementById(spanId);
        if (span) {
            span.innerHTML = html.join('\n');
        } else {
            setTimeout(setLoop, 10)
        }
    };
    setLoop()
};

// Runs the WHOIS lookup.
export const whoisLookup = async (spanId: string, ip: string) => {
    const json = await (await cfWHO(ip)).json();
    const geoIpJson = await (await geoJS(ip)).json();
    const countryCode = geoIpJson.country_code ? geoIpJson.country_code.toLowerCase() : '';
    const countryInfo = geoIpJson.city ? `${geoIpJson.city}, ${geoIpJson.country}` : geoIpJson.country;

    const expandId = Math.random().toString();

    const html = `
        <p style="font-size: 11px">
            <b>Owner:</b> <a id="${expandId}-handler" href="javascript:toggleExtra('${expandId}')">${sanitize(json.results[0].netname)}</a>
            <span id="countryInfo" class="flag-icon flag-icon-${countryCode}"></span>
        </p>
        <span id="${expandId}" style="display: none">
            <p style="font-size: 11px"><b>ASN:</b> ${json.results[0].asn}</p>
            <p style="font-size: 11px"><b>CIDR:</b> ${json.results[0].cidr}</p>
            <p style="font-size: 11px"><b>Abuse Contact:</b> ${sanitize(json.results[0].services.abusix[0])}</p>
        </span>
    `;

    const setLoop = () => {
        const span = document.getElementById(spanId);
        if (span) {
            span.innerHTML = html
            // @ts-ignore
            tippy("#countryInfo", {
                content: countryInfo,
                animation: "scale",
                arrow: true,
                theme: "dark",
            })
        } else {
            setTimeout(setLoop, 10)
        }
    };
    setLoop()
};
