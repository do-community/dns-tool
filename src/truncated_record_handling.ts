// Handles truncated records.
export default (tSplit: undefined | string | string[], part: string, txtSplit: RegExp) => {
    const truncateId = Math.random().toString()
    tSplit = part.split(txtSplit)
    let truncated
    if (tSplit.length > 1) {
        if (tSplit[0] === "v" && tSplit[1] === "spf1") {
            truncated = `${tSplit[0]}=${tSplit[1]}`
        } else {
            truncated = tSplit[0]
        }
    } else {
        truncated = part.substr(0, 30)
    }
    part = `
        <span id="${truncateId}-trunc">
            ${truncated}
        </span>
        <span id="${truncateId}-untrunc" style="display: none">
            ${part}
        </span>
        <a href="javascript:toggleExtra('${truncateId}-untrunc', '${truncateId}-trunc', '${truncateId}-handler')" id="${truncateId}-handler">Show more</a>
    `
    return [tSplit, part]
}
