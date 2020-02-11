# OnionTree Sentinel

A Tor Browser extension that protects you from phishing onion sites.

### NOTICE

This is a *proof of concept* work. The extension is fully functional
but somewhat rough around the edges. I am looking for your feedback.

**I am also looking for an individual who's willing to help with graphical side
of things. Icons and UI. But mostly icons.** Get in touch, if you are interested.

### How it works?

The extension contains exported [OnionTree](https://github.com/onionltd/oniontree) data which is queried
on each URL visit.

If an URL is listed in OnionTree, the canary icon
turns green and a pop up becomes available which displays the name of the site
and other mirrors listed in OnionTree.

![Image](https://linx.li/s/listed.png)

If an URL is not listed in OnionTree, the canary icon
turns red and a pop up becomes available, warning a user
to be aware that this site may be a phishing site. Optionally
a user can report the URL as a phishing site. At the moment, this works
by opening a new issue in OnionTree GitHub repository.

![Image](https://linx.li/s/unlisted.png)

### Installation

Wait for it to become available via Mozilla's Addons.

### Hacking

In order to try the extension locally, first clone the OnionTree repository:

```
$ git clone https://github.com/onionltd/oniontree
```

Download and build `oniontree-generate` from [oniontree-tools](https://github.com/onionltd/oniontree-tools):

```
$ git clone https://github.com/onionltd/oniontree-tools
$ cd oniontree-tools/cmd/oniontree-generate
$ make
# Copy the binary somewhere where it's accessible via PATH
$ cp ./oniontree-generate ~/go/bin
```

Finally, clone this repository:

```
$ git clone https://github.com/onionltd/oniontree-sentinel
$ cd oniontree-sentinel
```

Generate javascript files:

```
$ ONIONTREE_PATH=path/to/oniontree/dir make
```

Open Tor Browser and navigate to `about:debugging`. Click `Load Temporary Add-on...`
and load the extension's manifest in `src/manifest.json`.

### Future works

* Improve UI

* Load OnionTree data from a remote source, allow users to add unofficial sources

* Warn when accessing a site through Tor gateway (onion.pet, onion.ly,...).

* Make the extension persistent on Tails

### Why "sentinel"?

See [sentinel species](https://en.wikipedia.org/wiki/Animal_sentinel). Icons are an edited
version of canary made by Freepik from www.flaticon.com.
