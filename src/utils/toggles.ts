// Handles toggles in the application.
export default (showTogglingSpanId: string, spanId2: string | undefined, handlerId: string | undefined) => {
    const showToggler = document.getElementById(showTogglingSpanId) as HTMLDivElement
    const show = showToggler!.style.display === "none"
    if (spanId2) {
        const spanInfo2 = document.getElementById(spanId2) as HTMLDivElement
        spanInfo2.style.display = show ? "none" : ""
    }
    showToggler.style.display = show ? "" : "none"
    if (handlerId) {
        document.getElementById(handlerId)!.textContent = show ? "Show less" : "Show more"
    }
}
