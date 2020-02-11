function getIcon(name) {
    return {
        "16": "icons/" + name + "_16px.png",
        "32": "icons/" + name + "_32px.png"
    };
}

function newListedPopup(tabInfo, serviceID, currentURL) {
    browser.browserAction.setIcon({
        "path": getIcon("bird_safe"),
        "tabId": tabInfo.id
    });
    browser.browserAction.setTitle({
        "title": "Yippee! This URL is listed in OnionTree!",
        "tabId": tabInfo.id
    });
    browser.browserAction.setPopup({
        "popup": "popup/service.html?id=" + encodeURIComponent(serviceID) + "&url=" + encodeURIComponent(currentURL),
        "tabId": tabInfo.id
    })
}

function newUnlistedPopup(tabInfo, currentURL) {
    browser.browserAction.setIcon({
        "path": getIcon("bird_dead"),
        "tabId": tabInfo.id
    });
    browser.browserAction.setTitle({
        "title": "CAUTION: This URL is not known!",
        "tabId": tabInfo.id
    });
    browser.browserAction.setPopup({
        "popup": "popup/unlisted.html?url=" + encodeURIComponent(currentURL),
        "tabId": tabInfo.id
    })
}

function newAboutPopup(tabInfo) {
    browser.browserAction.setIcon({
        "path": getIcon("bird_neutral"),
        "tabId": tabInfo.id
    });
    browser.browserAction.setTitle({
        "title": "",
        "tabId": tabInfo.id
    });
    browser.browserAction.setPopup({
        "popup": "popup/about.html",
        "tabId": tabInfo.id
    })
}

function verifyOrigin(originHash) {
    let serviceID = new Address().addresses[originHash];

    if ( serviceID === undefined ) {
        return undefined;
    }

    let serviceData = new Service().services[serviceID];

    if ( serviceData === undefined ) {
        return undefined;
    }
    return serviceID;
}

// Parses an URL and returns a string that resembles data in window.location.origin.
function parseOrigin(u) {
    let a = document.createElement('a');
    a.href = u;
    return a.protocol + "//" + a.host;
}

function verifyPage(tabInfo) {
    let origin = parseOrigin(tabInfo.url);

    if ( origin.endsWith(".onion") ) {
        let serviceID = verifyOrigin(origin);
        if ( serviceID !== undefined ) {
            newListedPopup(tabInfo, serviceID, origin);
        } else {
            newUnlistedPopup(tabInfo, origin);
        }
    } else {
        newAboutPopup(tabInfo);
    }
}

async function onTabActivated(activeInfo) {
    // TODO: handle exception?!
    let tabInfo = await browser.tabs.get(activeInfo.tabId);
    verifyPage(tabInfo);
}

function onTabUpdated(tabId, changeInfo, tabInfo) {
    if (changeInfo.url) {
        verifyPage(tabInfo);
    }
}

browser.tabs.onUpdated.addListener(onTabUpdated);
browser.tabs.onActivated.addListener(onTabActivated);
