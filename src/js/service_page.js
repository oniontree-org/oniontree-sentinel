function renderPage(serviceID, url){
    console.log(serviceID, url);
    let data = new Service().services[serviceID];

    if ( data === undefined ){
        console.log("serviceID", serviceID, "not found");
        return;
    }

    data["urlencode"] = function() {
        return function(text, render){
            return encodeURIComponent(render(text));
        }
    };

    // Remove current URL from the list of other mirrors
    for ( let i = 0; i < data["urls"].length; i++ ) {
        if ( data["urls"][i] === url ) {
            data["urls"].splice(i, 1);
            break;
        }
    }

    let body = document.getElementsByTagName("body")[0];
    body.innerHTML = Mustache.render(body.innerHTML, data);

}

renderPage(
    new URL(window.location.href).searchParams.get("id"),
    new URL(window.location.href).searchParams.get("url")
);

document.getElementById("about").addEventListener("click", function(){
    let id = new URL(window.location.href).searchParams.get("id");
    window.open("http://onions53ehmf4q75.onion/services/" + id + ".html", '_blank').focus();
});
