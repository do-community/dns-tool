export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getSkeletonStyle = (min: number, max: number, size = 1) => {
    return {
        height: `${size}em`,
        margin: `${size * .35}em 0`,
        background: `hsl(0, 0%, ${getRandomInt(80, 90)}%)`,
        borderRadius: `${size * .5}em`,
        border: "none",
        width: `${getRandomInt(min, max)}px`,
        maxWidth: "100%",
        opacity: "0.7",
        animation: `skeleton-loading ${getRandomInt(900, 1200)}ms linear ${getRandomInt(0, 600)}ms infinite`,
        animationPlayState: "paused",
    }
}
