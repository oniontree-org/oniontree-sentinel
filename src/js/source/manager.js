import {Source} from "./source.js";

export class SourceManager {
    constructor(name) {
        this.name = name;
        this.sources = {};
        this.autoUpdateSlots = {};
        this.storageKey = "source_manager";
    }

    addSource(id) {
        this.log("addSource", id);
        this.sources[id] = new Source(id);
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

    loadFromStorage() {
        this.log("loadFromStorage");
        let my = this;
        return new Promise(function(resolve, reject){
            browser.storage.local.get(my.storageKey).then(function(loadData){
                my.log("loadFromStorage", loadData);

                for ( let id in loadData[my.storageKey] ) {
                    if ( my.sources[id] === undefined ){
                        my.sources[id] = new Source(id);
                    }
                    my.sources[id].data = loadData[my.storageKey][id];
                }
                resolve();
            }).catch(function(err){
                reject(err);
            });
        });
    }

    enableAutoUpdate(id, interval) {
        this.log("enableAutoUpdate", {"id": id, "interval": interval});
        let my = this;
        this.autoUpdateSlots[id] = setInterval(async function(){
            my.log("auto-update", id);
            await my.updateSource(id);
        }, interval);
    }

    disableAutoUpdate(id) {
        this.log("disableAutoUpdate", id);
        clearInterval(this.autoUpdateSlots[id]);
        delete this.autoUpdateSlots[id];
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
