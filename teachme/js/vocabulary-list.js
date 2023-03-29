
onReady(() => {
    getDb(
        db => {
            showList(db)
            id("title").innerText = db.title
        },
        error => alert("can't load vocabulary: " + error)
    )
})


function showList(db) {
    let innerHtml = "<table id='vocabulary_list'>"
    if (db.headers) {
        innerHtml += "<thead>"
        innerHtml += "<tr>" + `<td>#</td>`
        for (let header of db.headers) {
            innerHtml += `<td>${header ?? ""}</td>`
        }
        innerHtml += '</tr>'
        innerHtml += "</head>"
    }

    innerHtml += "<tbody>"
    let index = 0
    for (let item of db.items) {
        innerHtml += "<tr>" + `<td>${++index}.</td>`
        for (let part of item) {
            innerHtml += `<td>${part ?? ""}</td>`
        }
        innerHtml += '</tr>'
    }
    innerHtml += "</tbody></table>"
    id("content").innerHTML = innerHtml
}

