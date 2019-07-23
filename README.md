# DNS-Prototype
Prototyping stuff.

## User flow
The goal for this website is to allow users to lookup DNS records.

When you visit the page, you should be directed to the page with the textbox active if the domain is not part of the URL query argument. This is so that you can easily just start typing:

![](https://i.imgur.com/ab9kZK7.png)

If the user has a domain as part of the URL query, the textbox should not be focused and it should act like the "Search DNS Records" button has been clicked. Clicking ENTER in the textbox should do the same thing.

If the user has not searched anything, we will have a lot of room underneath. We could use this for a large FAQ part (?) or something useful to the user that will take up a large amount of space. This will be removed when the user does a search:

![](https://i.imgur.com/l9PbwIR.png)

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

They should all be in a very standardised form. For IP addresses, we should show the owner underneath with a obvious hyperlink. Clicking the link expands/collapses more information about the host:

![](https://i.imgur.com/9l0kk9w.png)

![](https://i.imgur.com/PyGiRqo.png)

Hovering over the flag should return more information about the country and town (if applicable):

![](https://i.imgur.com/67QiiHt.png)

For hostnames, we should try and resolve them to IP addresses and then do the above.

For TXT records, they should be split in a reasonable place with a `Show more`/`Show less` hyperlink to expand/collapse it. Additionally, common TXT records should have a description under them and be grouped by the Name/TTL:

![](https://i.imgur.com/GIzLWNf.png)

## Demo information
**Host:** https://gerwggwerhgreherhre.jakegealer.me/

**Username:** do

**Password:** 5bf0eb73
