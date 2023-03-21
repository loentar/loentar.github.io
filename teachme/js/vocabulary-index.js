
onReady(() => {
    loadText(learnUrl + "/_content",
        (response) => {
            parseIndex(response)
        },
        (error) => {
            console.error("can't load index: " + error)
        }
    )
})


function parseIndex(response) {
    // time # Время
    const container = document.getElementById("buttons")
    let lines = response.split("\n")
    let innerHtml = "<table><body>"
    let index = 0
    for (let line of lines) {
        if (line === "") continue
        let [file, title] = line.split(" # ")
        innerHtml +=
            "<tr>"
            + `<td>${++index}. ${title}</td>`
            + `<td><input type="button" value="📝" onclick="go('vocabulary-learn.html?index=${file}')" /></td>`
            + `<td><input type="button" value="字" onclick="go('vocabulary-check.html?index=${file}&mode=kanji')" /></td>`
            + `<td><input type="button" value="あ" onclick="go('vocabulary-check.html?index=${file}&mode=kana')" /></td>`
            + `<td><input type="button" value="A" onclick="go('vocabulary-check.html?index=${file}&mode=translation')" /></td>`
            + '</tr>'
    }
    innerHtml += "</body></table>"
    container.innerHTML = innerHtml
}

