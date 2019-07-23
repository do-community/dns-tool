// Sanitizes the external input. Never trust external input!
export const sanitize = (data: any) => {
    const lt = /</g,
        gt = />/g,
        ap = /'/g,
        ic = /"/g

    return (data.toString() as string).replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;")
}
