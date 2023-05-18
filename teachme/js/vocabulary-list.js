
let db
let showHints = false

onReady(() => {
    getDb(
        result => {
            db = result
            showList()
            id("title").innerText = db.title
        },
        error => alert("can't load vocabulary: " + error)
    )

    let btnHints = id("btn_hints")
    btnHints.onclick = () => {
        showHints = !showHints
        if (showHints) {
            btnHints.classList.add("checked")
        } else {
            btnHints.classList.remove("checked")
        }
        showList()
    }
})


function showList() {
    let innerHtml = "<table id='vocabulary_list'>"
    if (db.headers) {
        innerHtml += "<thead>"
        innerHtml += "<tr>" + `<td>#</td>`
        for (let i = 0; i < db.headers.length; ++i) {
            if (!showHints && !db.req[i]) continue
            let header = db.headers[i]
            innerHtml += `<td>${header ?? ""}</td>`
        }
        innerHtml += '</tr>'
        innerHtml += "</head>"
    }

    innerHtml += "<tbody>"
    let index = 0
    for (let item of db.items) {
        innerHtml += "<tr>" + `<td>${++index}.</td>`
        for (i = 0; i < db.headers.length; ++i) {
            if (!showHints && !db.req[i]) continue
            let part = item[i]
            innerHtml += `<td>${part ?? ""}</td>`
        }
        innerHtml += '</tr>'
    }
    innerHtml += "</tbody></table>"
    id("content").innerHTML = innerHtml
}

