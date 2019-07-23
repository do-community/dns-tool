const { ipBlacklists, domainBlacklists } = require('./data/blacklists');
const cfDNS = require('./utils/cfDNS');

// Reverses the IP address for DNSBL lookups.
const reverseIp = ip => ip.split(".").reverse().join(".");

// Get the result of a blacklist check
const checkBlacklist = async (name, blacklist, type) => {
    const res = await cfDNS(`${name}.${blacklist}`, 'A');
    if (!res.ok) return;
    if ((await res.json()).Answer) {
        const resp = {};
        resp[type] = blacklist;
        return resp;
    }
};

const checkIpBlacklists = ip => {
    const promises = [];
    for (const blacklist of ipBlacklists) {
        promises.push(checkBlacklist(reverseIp(ip), blacklist, 'ip'));
    }
    return promises;
};

const checkDomainBlacklists = domain => {
    const promises = [];
    for (const blacklist of domainBlacklists) {
        promises.push(checkBlacklist(domain, blacklist, 'domain'));
    }
    return promises;
};

// Gets any blacklists that the IP/domain is in.
const getBlacklists = async (ip, domain) => {
    const blacklists = {
        ip: [],
        domain: [],
    };

    const promises = [...checkIpBlacklists(ip)];
    if (domain) promises.push(...checkDomainBlacklists(domain));

    const data = await Promise.all(promises);
    data.forEach(item => {
        if (!item) return;
        if (item.ip) blacklists.domain.push(item.ip);
        if (item.domain) blacklists.domain.push(item.domain);
    });

    return blacklists
};

module.exports = getBlacklists;
