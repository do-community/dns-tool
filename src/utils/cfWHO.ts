export default async (ip: string) => {
    return await fetch(
        `https://cfwho.com/get/${ip}`,
        {
            headers: {
                Accept: "application/json",
            },
        }
    )
}
