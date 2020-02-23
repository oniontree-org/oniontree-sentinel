import {OriginOnion} from "./origin/onion.js";
import {SourceManager} from "./source_manager.js";

const DefaultSources = [
    "https://raw.githubusercontent.com/oniontree-org/dist/master/public/oniontree/all.json"
];
const autoUpdateInterval = 300000;

class Application {
    constructor() {
        // Register handler for origin matching a certain pattern.
        this.originActions = [
            new OriginOnion(),
        ];
        this.sourceManager = initSourceManager();

        // Register event handlers
        browser.tabs.onUpdated.addListener(this.eventOnUpdateTab());
        browser.tabs.onActivated.addListener(this.eventOnActivateTab());
    }

    tabUpdated(tabInfo) {
        for ( let i in this.originActions ) {
            if ( !this.originActions[i].test(tabInfo.url) ){
                continue;
            }
            (this.originActions[i].eventOnTabUpdated())(tabInfo);
        }
    }

    // Event handler that triggers when a tab is updated.
    eventOnUpdateTab() {
        let my = this;
        return function(tabId, changeInfo, tabInfo){
            // If url is not empty there was a change in tab's url panel.
            // We are only interested in url change events.
            if (changeInfo.url) {
                my.tabUpdated(tabInfo);
            }
        };
    }

    // Event handler that triggers when a tab is activated.
    eventOnActivateTab() {
        let my = this;
        return async function(activeInfo){
            let tabInfo = await browser.tabs.get(activeInfo.tabId);
            my.tabUpdated(tabInfo);
        };
    }
}

function initSourceManager() {
    let sm = new SourceManager();
    sm.enableReloadOnCommit();
    sm.loadFromStorage().catch(function(err){
        console.error(err);
    });

    // Register default sources
    for ( let i in DefaultSources ) {
        sm.addSource(DefaultSources[i]);
        sm.enableAutoUpdate(DefaultSources[i], autoUpdateInterval);
    }
    return sm;
}

// Initialize the application object.
new Application();