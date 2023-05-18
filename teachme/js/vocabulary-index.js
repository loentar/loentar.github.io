
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
    // time # Время;; #
    // time # Время;; # kanji;kana;translation
    const container = id("buttons")
    let lines = response.split("\n")
    let innerHtml = "<table><body>"
    let index = 0
    let defaultHeaders = ['字', 'あ', 'A', '?Descr']
    for (let line of lines) {
        if (line === "") continue
        let [file, title, headers] = line.split('#')
        title = title.replace(/;.*/, "")
        innerHtml +=
            "<tr>"
            + `<td>${++index}. ${title}</td>`
            + `<td><input type="button" value="📒" onclick="go('vocabulary-learn.html?index=${file}')" /></td>`
            + `<td><input type="button" value="📄" onclick="go('vocabulary-list.html?index=${file}')" /></td>`
        let parts = headers.trim() !== "" ? headers.split(';') : defaultHeaders

        for (let i = 0; i < parts.length; ++i) {
            let part = parts[i]
            if (part.startsWith("?")) continue
            part = part.trim()
                .replace(/^Kanji$/, '字')
                .replace(/^Kana$/, 'あ')
                .replace(/^Onyomi$/, 'あ')
                .replace(/^Kunyomi$/, 'ア')
                .replace(/^Translation$/, '🔄')
            innerHtml += `<td><input type="button" value="${part.trim()}" `
                    + `onclick="go('vocabulary-check.html?index=${file.trim()}&part=${i}')" /></td>`
        }

        innerHtml += '</tr>'
    }
    innerHtml += "</body></table>"
    container.innerHTML = innerHtml
}

