import {SourceManager} from "../source/manager.js";

export class OriginBase {
    constructor(regexp) {
        this.regexp = new RegExp(regexp);
        this.sourceManager = new SourceManager("SM_OriginBase");
        this.sourceManager.enableReloadOnCommit();
        this.sourceManager.loadFromStorage().catch(function(err){
            console.error(err);
        });
    }

    eventOnTabUpdated() {
        return function(tabInfo) {
            console.log("eventOnTabUpdated not implemented in OriginBase", tabInfo);
        }
    }

    test(url) {
        let origin = OriginBase.parseOrigin(url);
        return this.regexp.test(origin);
    }

    // Parses an URL and returns a string in format protocol://host[:port]
    static parseOrigin(u) {
        let a = document.createElement('a');
        a.href = u;
        return a.protocol + "//" + a.host;
    }
}
