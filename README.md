# OnionTree Sentinel

![Mozilla Add-on](https://img.shields.io/amo/v/oniontree-sentinel?label=version)
![Mozilla Add-on](https://img.shields.io/amo/dw/oniontree-sentinel)
![Mozilla Add-on](https://img.shields.io/amo/users/oniontree-sentinel)
![Mozilla Add-on](https://img.shields.io/amo/rating/oniontree-sentinel)

A privacy oriented, anti-phishing add-on for Tor Browser that protects you from bad .onion sites.

### NOTICE

This is an *experimental software*. The add-on is fully functional
but somewhat rough around the edges. Feedback and code contributions are
welcomed.

### Features

* Protects against phishing onion sites by utilizing a whitelist of verified links.

* Provides alternative mirrors, if current one does not work.

* Warns when accessing an onion site using a Tor2Web proxy.

### How it works?

The add-on imports databases of well-known, verified addresses. By default,
the add-on imports [OnionTree](https://github.com/onionltd/oniontree).
Every time you visit a website, website's URL is looked up in a database.
URL lookups are done on your machine only.
**OnionTree Sentinel never sends out addresses that you visit.**

If URL is found in a database, the canary icon
turns green and a pop up becomes available which displays the name of the site
and alternative mirrors.

![Image](https://linx.li/s/listed.png)

If URL is not found in a database, the canary icon
turns red and a pop up becomes available, warning a user
to be aware that this site may be a phishing site. Optionally
a user can report the URL as a phishing site. At the moment, this works
by opening a new issue in OnionTree GitHub repository.

![Image](https://linx.li/s/unlisted.png)

### Installation

The add-on is available via [Mozilla's Addons](https://addons.mozilla.org/en-US/firefox/addon/oniontree-sentinel/).

### Hacking

In order to test the add-on locally.

```
$ git clone https://github.com/onionltd/oniontree-sentinel
```

Open Tor Browser and navigate to `about:debugging`. Click `Load Temporary Add-on...`
and load the add-on's manifest in `src/manifest.json`.

### Future works

* Improve UI

* Make the add-on persistent on Tails

### Why "sentinel"?

See [sentinel species](https://en.wikipedia.org/wiki/Animal_sentinel). Icons are an edited
version of canary made by Freepik from www.flaticon.com.
