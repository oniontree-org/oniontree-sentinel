document.getElementById("report_url").addEventListener("click", function(){
    let title = "Phishing site " + new URL(window.location.href).searchParams.get("url");
    window.open("https://github.com/onionltd/oniontree/issues/new?labels=report-phishing&title=" + encodeURIComponent(title),
        '_blank').focus();
});

document.getElementById("add_url").addEventListener("click", function(){
    let title = "New service " + new URL(window.location.href).searchParams.get("url");
    window.open("https://github.com/onionltd/oniontree/issues/new?labels=new-service&title=" + encodeURIComponent(title),
        '_blank').focus();
});
