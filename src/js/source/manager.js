import {Source} from "./source.js";

export class SourceManager {
    constructor(name) {
        this.name = name;
        this.sources = {};
        this.storageKey = "source_manager";
        this.autoUpdateInterval = 0;
    }

    // Class destructor
    release() {
        for (let id in this.sources) {
            this.sources[id].release();
        }
    }

    addSource(id) {
        this.log("addSource", id);
        if ( this.sources[id] !== undefined ) {
            this.sources[id].release();
        }
        this.sources[id] = new Source(id);
        if ( this.autoUpdateInterval > 0 ) {
            this.sources[id].enableAutoRetrieve(this.autoUpdateInterval);
        }
    }

    deleteSource(id) {
        if ( this.sources[id] !== undefined ) {
            this.sources[id].release();
            delete this.sources[id];
        }
    }

    getSource(id) {
        this.log("getSource", id);
        return this.sources[id];
    }

    listSources() {
        this.log("listSources");
        return Object.keys(this.sources);
    }

    searchService(query) {
        this.log("searchService", query);
        let result = undefined;
        for ( let id in this.sources ) {
            if ( query["address"] !== undefined ){
                result = this.sources[id].getByAddress(query["address"]);
            } else if ( query["id"] !== undefined ){
                result = this.sources[id].getByID(query["id"]);
            } else {
                // No query specified
                break;
            }
            if ( result !== undefined ) {
                break;
            }
        }
        return result;
    }

    searchServiceID(query) {
        this.log("searchServiceID", query);
        let result = undefined;
        for ( let id in this.sources ) {
            if ( query["address"] !== undefined ){
                result = this.sources[id].getIDByAddress(query["address"]);
            } else {
                // No query specified
                break;
            }
            if ( result !== undefined ) {
                break;
            }
        }
        return result;
    }

    updateSource(id) {
        this.log("updateSource", id);
        let my = this;
        return new Promise(function(resolve, reject){
            my.sources[id].retrieve().then(function(){
                my.commitToStorage().then(function(){
                    resolve();
                }).catch(function(err){
                    reject(err);
                });
            }).catch(function(err){
                reject(err);
            });
        });
    }

    commitToStorage() {
        this.log("commitToStorage");
        let my = this;
        return new Promise(function(resolve, reject){
            let commitData = {[my.storageKey]: {}};

            for ( let id in my.sources ) {
                commitData[my.storageKey][id] = my.sources[id].data;
            }

            my.log("commitToStorage", commitData);

            browser.storage.local.set(commitData).then(function(){
                resolve();
            }).catch(function(err){
                reject(err);
            });
        });
    }

    // loadFromStorage loads data from browser.storage.local and replaces previous sources in class' memory.
    loadFromStorage() {
        this.log("loadFromStorage");
        let my = this;
        return new Promise(function(resolve, reject){
            browser.storage.local.get(my.storageKey).then(function(loadData){
                my.log("loadFromStorage", loadData);
                for ( let id in my.sources ) {
                    my.deleteSource(id);
                }

                for ( let id in loadData[my.storageKey] ) {
                    my.addSource(id);
                    my.sources[id].data = loadData[my.storageKey][id];
                }
                resolve();
            }).catch(function(err){
                reject(err);
            });
        });
    }

    setAutoUpdate(interval) {
        this.log("setAutoUpdate", interval);
        this.autoUpdateInterval = interval;

        if (this.autoUpdateInterval > 0) {
            for (let id in this.sources) {
                this.sources[id].enableAutoRetrieve(this.autoUpdateInterval);
            }
        } else {
            for (let id in this.sources) {
                this.sources[id].disableAutoRetrieve();
            }
        }
    }

    enableReloadOnCommit() {
        this.log("enableReloadOnCommit");
        browser.storage.onChanged.addListener(this.eventOnCommitToStorage());
    }

    disableReloadOnCommit() {
        this.log("disableReloadOnCommit");
        browser.storage.onChanged.removeListener(this.eventOnCommitToStorage());
    }

    eventOnCommitToStorage() {
        let my = this;
        return async function(changes, area){
            my.log("handling onCommitToStorage");
            await my.loadFromStorage();
        };
    }

    log(message, data = "") {
        console.log(this.name, message, data);
    }
}
