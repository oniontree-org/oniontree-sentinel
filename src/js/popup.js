export class Popup {
    static serializeURLParams(params) {
        let serialized = [];
        for ( const key in params ) {
            serialized.push(key + "=" + encodeURIComponent(params[key]));
        }
        return serialized.join("&");
    }

    static set(tabInfo, popup, data = {}) {
        browser.browserAction.setIcon({
            "path": popup["icon"],
            "tabId": tabInfo.id
        });
        browser.browserAction.setTitle({
            "title": popup["title"],
            "tabId": tabInfo.id
        });
        /* TODO
            Popup.data may already contain default data, make sure to merge `data` with `popup.data`, where content in `data` takes precedence.
         */
        let popupURL = popup["file"] + (data ? ("?" + Popup.serializeURLParams(data)) : "");
        browser.browserAction.setPopup({
            "popup": popupURL,
            "tabId": tabInfo.id
        })
    }
}

function getIcon(name) {
    return {
        "16": "icons/" + name + "_16px.png",
        "32": "icons/" + name + "_32px.png"
    };
}

export const ServiceURLPopup = {
    "title": "Yippee! This URL is listed in OnionTree!",
    "icon": getIcon("bird_safe"),
    "file": "popup/service.html",
    "data": {}
};

export const UnsafeURLPopup = {
    "title": "CAUTION: This URL is NOT listed in OnionTree!",
    "icon": getIcon("bird_dead"),
    "file": "popup/unsafe.html",
    "data": {}
};

export const AboutPopup = {
    "title": "",
    "icon": getIcon("bird_neutral"),
    "file": "popup/about.html",
    "data": {}
};
