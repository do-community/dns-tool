const fs = require("fs")
const svg = fs.readFileSync(`${__dirname}/dns.svg`)
fs.writeFileSync(`${__dirname}/inner_svg.js`, `// This file was automatically generated.
export default \`
${svg}
\`
`)
console.log("Template generated.")
