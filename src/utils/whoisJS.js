module.exports = async name => {
    return await fetch(
        `https://whoisjs.com/api/v1/${encodeURIComponent(name)}`,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );
};
