export default {
    tutorial: `
                If you recently changed a DNS value, there is a good chance it will not have propagated to all your users yet.
                DNS propagation is the process of updating DNS values across all DNS servers and waiting for users caches to invalidate.
                <br><br>
                Due to various caches at user and DNS server levels, it may take some time for all your users to see the new records.
                <br><br>
                If you use a fast updating DNS such as <a href="https://1.1.1.1">Cloudflare DNS</a>, it may be possible to get the new values locally by flushing your DNS cache.
                Here is how you do it on several operating systems:
                <hr>
                <b>Windows:</b> Press the Windows Key and R together. You should get a "Run" box. Type <code>ipconfig /flushdns</code> in the box and press OK. You should see a brief flash of a black box. Your cache should then be invalidated.
                <br><br>
                <b>Linux:</b> Linux depends on the distribution. For Debian based distributions, run <code>sudo systemd-resolve --flush-caches</code>.
                <br><br>
                <b>macOS:</b> Open Terminal and run the command <code>sudo killall -HUP mDNSResponder</code>.
                <br><br>
                <b>iPadOS:</b> Turning off and on Airplane mode will flush your DNS cache.
                <hr>
                If you are still unable to get the correct results, you can check the propagation status using a <a href="https://dnschecker.org/">propagation checker</a>.
    `,
    title: "DNS Propagation",
} as {[key: string]: string}
