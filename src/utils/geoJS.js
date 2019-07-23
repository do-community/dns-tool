module.exports = async ip => {
    return await fetch(
        `https://get.geojs.io/v1/ip/geo/${ip}.json`,
        {
            headers: {
                Accept: 'application/json',
            },
        }
    );
};
