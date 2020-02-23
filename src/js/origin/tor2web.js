import {OriginBase} from "./base.js";
import {Popup, Tor2WebPopup} from "../popup.js";

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
