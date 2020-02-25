import {PageBase} from "./base.js";
import {SourceManager} from "../source/manager.js";

class Page extends PageBase {
    constructor(serviceID, url) {
        super();
        this.serviceID = serviceID;
        this.url = url;
        this.sourceManager = new SourceManager("SM_PageService");
        this.sourceManager.enableReloadOnCommit();
    }

    async render() {
        await this.sourceManager.loadFromStorage().catch(function (err) {
            console.error(err);
        });
        let service = this.sourceManager.searchService({"id": this.serviceID});
        this.data["name"] = service["name"];
        this.data["urls"] = [];
        for ( let i in service["urls"] ) {
            if ( service["urls"][i] === this.url ) {
                continue;
            }
            this.data["urls"].push(service["urls"][i]);
        }
        super.render();
    }
}

new Page(new URL(window.location.href).searchParams.get("id"),
    new URL(window.location.href).searchParams.get("url"))
    .render().then(function(){
    Page.setButtonAction({ "id": "about" }, function(){
        let id = new URL(window.location.href).searchParams.get("id");
        window.open("http://onions53ehmf4q75.onion/services/" + id + ".html", '_blank').focus();
    });
});
