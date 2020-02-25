import mustache from "../../vendor/mustache.mjs";

class PageFunctions {
    static urlencode() {
        return function(text, render){
            console.log(text, render);
            return encodeURIComponent(render(text));
        }
    }

    inject(data) {
        data["urlencode"] = PageFunctions.urlencode;
        return data;
    }
}

export class PageBase {
    constructor(data = {}) {
        this.data = new PageFunctions().inject(data);
    }

    render() {
        let body = document.getElementsByTagName("body")[0];
        body.innerHTML = mustache.render(body.innerHTML, this.data);
    }

    static setButtonAction(select, action) {
        if ( select["id"] ) {
            let dom = document.getElementById(select["id"]);
            if ( dom !== undefined ) {
                dom.addEventListener("click", action);
            }
        } else if ( select["class"] ) {
            let doms = document.getElementsByClassName(select["class"]);
            for ( let i = 0; i < doms.length; i++ ) {
                doms[i].addEventListener("click", action);
            }
        }
    }
}
