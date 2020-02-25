import {PageBase} from "./page/base.js";
import {SourceManager} from "./source/manager.js";
import mustache from "../vendor/mustache.mjs";

class InputSource {
    constructor(input) {
        this.text = input.trim();
        this.error = "";
    }

    validate() {
        return this.isSecure();
    }

    isSecure() {
        let val = new RegExp("^https:\/\/").test(this.text);
        if ( !val ){
            this.error = "Source URL must start with https://";
        }
        return val;
    }
}

class Page extends PageBase {
    constructor() {
        super();
        this.sourceManager = new SourceManager("SM_PageDashboard");
        this.sourceManager.enableReloadOnCommit();
    }

    renderSources() {
        let template = document.getElementById("template_sources_table_row").innerHTML;
        this.data["sources"] = this.sourceManager.listSources();
        document.getElementById("sources_body").innerHTML = mustache.render(template, this.data);
    }

    async render() {
        await this.sourceManager.loadFromStorage().catch(function(err){
            console.error(err);
        });
        this.renderSources();
    }
}

let page = new Page();
page.render().then(function() {
    Page.setButtonAction({ "id": "add_source" }, function(){
        let input = new InputSource(prompt("Add source https://"));
        if ( !input.validate() ) {
            alert(input.error);
        }
        page.sourceManager.addSource(input.text);
        page.sourceManager.updateSource(input.text).then(function(){
            page.renderSources();
        }).catch(function (err) {
            console.error(err);
        });
    });

    Page.setButtonAction({ "class": "delete_source" }, function(event){
        let sourceID = event.target.getAttribute("data-source-id");
        if ( !confirm("Really delete " + sourceID + "?") ) {
            return;
        }
        page.sourceManager.deleteSource(sourceID);
        page.sourceManager.commitToStorage().then(function(){
            page.renderSources();
        });
    });
});
