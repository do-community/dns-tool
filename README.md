# DNS-Prototype
Prototyping stuff.

## User flow
- User visits page.
- The domain bar should instantly be focused so the user can just start typing.
- The user types a domain:
    - If it is invalid, we should stop the user here until they enter a correct domain.
- User gets all records that are used by the DigitalOcean DNS on the domain. Additionally, it will have the following:
    - WHOIS information
    - PTR verificaion
    - MX blacklist lookups (domain/IP)
- Any information that is slow to get should have a `Loading X...` prompt. It should **NOT** hold up the loading of the page.

## Demo information
**Host:** https://gerwggwerhgreherhre.jakegealer.me/

**Username:** do

**Password:** 5bf0eb73
