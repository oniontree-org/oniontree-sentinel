import {Popup} from "../popup.js";
import {OriginBase} from "./base.js";

const ServiceURLPopup = {
    "title": "Yippee! This URL is listed in OnionTree!",
    "icon": Popup.icon("bird_safe"),
    "file": "popup/service.html",
    "data": {}
};

const UnsafeURLPopup = {
    "title": "CAUTION: This URL is NOT listed in OnionTree!",
    "icon": Popup.icon("bird_dead"),
    "file": "popup/unsafe.html",
    "data": {}
};

export class OriginOnion extends OriginBase {
    constructor() {
        super(".*\\.onion$");
    }

    eventOnTabUpdated() {
        let my = this;
        return function(tabInfo) {
            let origin = OriginBase.parseOrigin(tabInfo.url);
            let serviceID = my.sourceManager.searchServiceID({
                "address": origin
            });
            if ( serviceID === undefined ) {
                Popup.set(tabInfo, UnsafeURLPopup, {"url": origin});
            } else {
                Popup.set(tabInfo, ServiceURLPopup, {"id": serviceID, "url": origin});
            }
        }
    }
}
