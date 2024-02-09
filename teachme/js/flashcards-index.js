
onReady(() => {
    loadText("db/" + query.index,
        (response) => {
            parseIndex(response)
        },
        (error) => {
            console.error("can't load index: " + error)
        }
    )
})


function parseIndex(response) {
    const container = id("content")
    let lines = response.split("\n").filter(it => it.match("kanji.csv"))
    let innerHtml = "<table><body>"
    let index = 0
    for (let line of lines) {
        let [file, title, headers] = line.split('#')
        title = title.replace(/;.*/, "")
        if ((index % 3) == 0) {
            innerHtml += "<tr>"
        }
        innerHtml += `<td><input type="button" value="${title}" onclick="go('flashcards.html?index=${file}')" /></td>`
        if ((index % 3) == 2) {
            innerHtml += '</tr>'
        }
        ++index
    }
    innerHtml += "</body></table>"
    container.innerHTML = innerHtml
}

