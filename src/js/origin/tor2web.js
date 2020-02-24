import {OriginBase} from "./base.js";
import {Popup} from "../popup.js";

const Tor2WebPopup = {
    "title": "CAUTION: Using Tor2Web Proxy!",
    "icon": Popup.icon("bird_dead"),
    "file": "popup/tor2web.html",
    "data": {}
};

export class OriginTor2Web extends OriginBase {
    constructor() {
        super(".*\\.onion\\..+$");
    }

    eventOnTabUpdated() {
        let my = this;
        return function(tabInfo) {
            Popup.set(tabInfo, Tor2WebPopup);
        }
    }
}
