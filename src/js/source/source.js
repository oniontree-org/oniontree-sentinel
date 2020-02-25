export class Source {
    constructor(id) {
        this.id = id;
        this.data = undefined;
        this.timer = undefined;
    }

    // Class destructor
    release() {
        this.disableAutoRetrieve();
    }

    retrieve() {
        let my = this;
        return new Promise(function(resolve, reject){
            my.getRemoteContents(my.id).then(function(xhr){
                if ( xhr.status !== 200 ){
                    reject("invalid status code" + xhr.status);
                }

                try {
                    my.data = JSON.parse(xhr.responseText);
                } catch(err) {
                    reject(err);
                }

                resolve();
            }).catch(function(xhr){
                reject("network error");
            });
        });
    }

    enableAutoRetrieve(interval) {
        if ( this.timer !== undefined ) {
            this.disableAutoRetrieve();
        }
        let my = this;
        this.timer = setInterval(async function(){
            await my.retrieve();
        }, interval);
    }

    disableAutoRetrieve() {
        if ( this.timer !== undefined ) {
            clearInterval(this.timer);
            this.timer = undefined;
        }
    }

    getIDByAddress(address) {
        return this.data["addresses"][address];
    }

    getByAddress(address) {
        return this.getByID(this.data["addresses"][address]);
    }

    getByID(id) {
        return this.data["unsorted"][id];
    }

    getRemoteContents(url) {
        return new Promise(function(resolve, reject){
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if ( xhr.readyState !== XMLHttpRequest.DONE ) {
                    return;
                }
                resolve(xhr);
            };
            xhr.onerror = function() {
                reject(xhr);
            };
            xhr.open("GET", url, true); // true for asynchronous
            xhr.send(null);
        })
    }
}
