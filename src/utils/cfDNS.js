module.exports = async (name, type) => {
    return await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
        {
            headers: {
                Accept: 'application/dns-json',
            },
        }
    );
};
