export class Source {
    constructor(id) {
        this.id = id;
        this.data = undefined;
    }

    retrieve() {
        let my = this;
        return new Promise(function(resolve, reject){
            my.getRemoteContents(my.id).then(function(xhr){
                if ( xhr.status !== 200 ){
                    console.log(my.id, "invalid status code", xhr.status);
                    reject("invalid status code" + xhr.status);
                }

                try {
                    my.data = JSON.parse(xhr.responseText);
                } catch(err) {
                    console.log(err);
                    reject(err);
                }

                console.log(my.data);
                resolve();
            }).catch(function(xhr){
                console.log("ERROR", my.id, xhr);
                reject("network error");
            });
        });
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
