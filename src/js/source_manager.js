import {Source} from "./source.js";

export class SourceManager {
    constructor() {
        this.sources = {};
        this.autoUpdateSlots = {};
        this.storageKey = "source_manager";
    }

    addSource(id) {
        this.sources[id] = new Source(id);
    }

    getSource(id) {
        return this.sources[id];
    }

    listSources() {
        return Object.keys(this.sources);
    }

    searchService(query) {
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

    updateSource(id) {
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
        let my = this;
        return new Promise(function(resolve, reject){
            let commitData = {[my.storageKey]: {}};

            for ( let id in my.sources ) {
                commitData[my.storageKey][id] = my.sources[id].data;
            }

            console.log("commitToStorage", commitData);

            browser.storage.local.set(commitData).then(function(){
                resolve();
            }).catch(function(err){
                reject(err);
            });
        });
    }

    loadFromStorage() {
        let my = this;
        return new Promise(function(resolve, reject){
            browser.storage.local.get(my.storageKey).then(function(loadData){
                console.log("loadFromStorage", loadData);

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
        let my = this;
        this.autoUpdateSlots[id] = setInterval(async function(){
            console.log("SourceManager", "auto-update", id);
            await my.updateSource(id);
        }, interval);
    }

    disableAutoUpdate(id) {
        clearInterval(this.autoUpdateSlots[id]);
        delete this.autoUpdateSlots[id];
    }

    enableReloadOnCommit() {
        console.log("enableReloadOnCommit");
        browser.storage.onChanged.addListener(this.eventOnCommitToStorage());
    }

    disableReloadOnCommit() {
        console.log("disableReloadOnCommit");
        browser.storage.onChanged.removeListener(this.eventOnCommitToStorage());
    }

    eventOnCommitToStorage() {
        let my = this;
        return async function(changes, area){
            console.log("eventOnCommitToStorage", my, changes, area);
            await my.loadFromStorage();
        };
    }
}
