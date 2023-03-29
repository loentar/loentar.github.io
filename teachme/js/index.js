
onReady(() => {
    loadText("db/db.index",
        (response) => {
            parseIndex(response)
        },
        (error) => {
            console.error("can't load index: " + error)
        }
    )
})


function parseIndex(response) {
    let lines = response.split("\n")
    let innerHtml = ""
    for (let line of lines) {
        if (line === "") continue
        innerHtml += `<input type="button" value="${line.replace('.index', '')}" `
                + `onclick="go('vocabulary-index.html?index=${line}')" /><p></p>`
    }
    id("content").innerHTML = innerHtml
}

