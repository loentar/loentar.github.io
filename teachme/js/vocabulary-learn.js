
let db
let vocabulary = []
let index = 0

onReady(() => {
    getDb(
        result => {
            db = result
            showWord()
            updateButtons()
            id("title").innerText = result.title
        },
        error => alert("can't load vocabulary: " + error)
    )

    id("btn_prev").onclick = () => {
        if (index !== 0) {
            --index
            showWord()
            updateButtons()
        }
    }
    id("btn_next").onclick = () => {
        if (index !== db.items.length - 1) {
            ++index
            showWord()
            updateButtons()
        }
    }
})

function showWord() {
    let item = db.items[index]
    let mapping = tagMapping[db.headers.length]
    if (!mapping) {
        alert("Invalid mapping: line: " + JSON.stringify(item))
        return
    }

    for (let i = 0; i < mapping.length; ++i) {
        let text = item[i] ?? ""
        let field = mapping[i]
        if (field.startsWith("kana")) {
            text = "「" + text + "」"
        }
        id(field).innerText = text
    }
    id("progress").innerText = `[${index + 1} / ${db.items.length}]`
}

function updateButtons() {
    let prevIsVisible = index !== 0
    let nextIsVisible = index !== (db.items.length - 1)

    id("btn_prev").disabled = prevIsVisible ? "" : "disabled"
    id("btn_next").style.display = nextIsVisible ? "" : "none"
    id("btn_finish").style.display = !nextIsVisible ? "" : "none"
}
