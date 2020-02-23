import {Popup, ServiceURLPopup} from "../popup.js";
import {OriginBase} from "./base.js";

export class OriginOnion extends OriginBase {
    constructor() {
        super(".*\.onion$");
    }

    eventOnTabUpdated() {
        let my = this;
        return function(tabInfo) {
            let origin = OriginBase.parseOrigin(tabInfo.url);
            let serviceID = my.sourceManager.searchServiceID({
                "address": origin
            });
            if ( serviceID === undefined ) {
                // TODO!!
                //Popup.set(tabInfo, ServiceURLPopup, {"url": origin});
            } else {
                Popup.set(tabInfo, ServiceURLPopup, {"id": serviceID, "url": origin});
            }
        }
    }
}
