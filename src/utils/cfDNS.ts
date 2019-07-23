export default async(name: string, type: string) => {
    return await fetch(
        `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(name)}&type=${encodeURIComponent(type)}`,
        {
            headers: {
                Accept: 'application/dns-json',
            },
        }
    );
};
