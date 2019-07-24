export default async (name: string) => {
    const nameSplit = name.split(".")
    const ending = nameSplit.pop()!
    const domain = nameSplit.pop()!
    const domainFull = `${domain}.${ending}`
    return await fetch(
        `https://whoisjs.com/api/v1/${encodeURIComponent(domainFull)}`,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );
};
