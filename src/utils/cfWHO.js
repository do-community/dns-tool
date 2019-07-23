module.exports = async ip => {
    return await fetch(
        `https://cfwho.com/get/${ip}`,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );
};
