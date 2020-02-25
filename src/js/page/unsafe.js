import {PageBase} from "./base.js";

class Page extends PageBase {
    constructor(url) {
        super();
        this.url = url;
    }
}

new Page(new URL(window.location.href).searchParams.get("url")).render();

Page.setButtonAction({ "id": "report" }, function(){
    let title = "Phishing site " + new URL(window.location.href).searchParams.get("url");
    window.open("https://github.com/onionltd/oniontree/issues/new?labels=report-phishing&title=" + encodeURIComponent(title),
        '_blank').focus();
});
Page.setButtonAction({ "id": "recommend" }, function(){
    let title = "New service " + new URL(window.location.href).searchParams.get("url");
    window.open("https://github.com/onionltd/oniontree/issues/new?labels=new-service&title=" + encodeURIComponent(title),
        '_blank').focus();
});
