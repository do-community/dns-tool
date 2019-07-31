# DNS-Prototype
Prototyping stuff.

## User flow
The goal for this website is to allow users to lookup DNS records. For example, if a user wants to lookup a A record to check that users can access their droplet from their domain properly, they would go to the DNS lookup page, search the record, get the record and close the page. If the user wanted to share a record type with other people, they could click the link button next to the record type and then copy the URL to their current page. When someone was linked it, they would be pointed to that exact record type for that domain. 

When you visit the page, you should be directed to the page with the textbox active if the domain is not part of the URL query argument. This is so that you can easily just start typing:

![](https://i.imgur.com/ab9kZK7.png)

It should be clear to the user that it will only search the (sub-)domain they type in. It will not search other sub-domains. This is by design due to how DNS servers return results.

Pressing the "Search DNS Records" button or hitting ENTER in the text box will call a JavaScript function which will allow for the searching of records. If the user has a domain as part of the URL query, the textbox should not be focused, the textbox should be populated with the HTTP query and it should act like the "Search DNS Records" button has been clicked.

Currently, before the user searches, there is a skeleton of what the page will look like. This gets replaced with the actual values after a search:

![](https://freethewump.us/wwmwyktqe.png)

When searching, the button should go into a loading state. This makes it obvious to the user that the page is loading:

![](https://freethewump.us/mkioropyv.png)

If the domain is invalid, a error of some description should be displayed and stop the operation. This should be very visible for the user, for example by using an alert prompt:

![](https://i.imgur.com/vuu5Ch2.png)

When the user searches, results should feel instant. Since we are using Cloudflare DNS, the only bottleneck here should be the speed of the connection which the user is on. For parts which can be slower such as WHOIS, we should have it say `Loading <part>...` while it loads the information:

![](https://i.imgur.com/eFtiw5R.png)

This should **NOT** hold up the loading of the page.

The page should say near the top if the user is using DigitalOcean DNS. We could also use this space to show FAQ's.

The page will try and get the following records:
- A records
- AAAA records
- TXT records
- MX records
- NS records
- DMARC records
- CAA records
- SRV records

At the top of the page, it should allow users to jump to different parts. This means that users do not need to scroll:

![](https://freethewump.us/qagkyhgbn.png)

They should all be in a very standardised form. For IP addresses, we should show the owner underneath with a obvious hyperlink. Clicking the link expands/collapses more information about the host:

![](https://i.imgur.com/9l0kk9w.png)

![](https://i.imgur.com/PyGiRqo.png)

Hovering over the flag should return more information about the country and town (if applicable):

![](https://i.imgur.com/67QiiHt.png)

For hostnames, we should try and resolve them to IP addresses and then do the above.

For TXT records, they should be split in a reasonable place with a `Show more`/`Show less` hyperlink to expand/collapse it. Additionally, common TXT records should have a description under them and be grouped by the Name/TTL:

![](https://i.imgur.com/GIzLWNf.png)

There is a modal related to DNS propagation (located in `./src/templates/propagation_modal.vue`). This has a toggle function which should be executable by a link/button clickable by the end user:

![](https://freethewump.us/jrsbzmngj.png) 
![](https://freethewump.us/ovlqpsbfb.png)

At the bottom, it should credit the API's we use. There should also be a "Back to Top" button so that the user can easily jump to the top.

![](https://freethewump.us/xmcmwaqsx.png)

## Demo information
**Host:** https://gerwggwerhgreherhre.jakegealer.me/

**Username:** do

**Password:** 5bf0eb73
