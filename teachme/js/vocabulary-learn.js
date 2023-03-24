
let vocabulary = []
let index = 0

onReady(() => {
    getVocabulary(
        result => {
            vocabulary = result.words
            if (vocabulary[0].kanji === '*') {
                vocabulary.splice(0, 1)
            }
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
        if (index !== vocabulary.length - 1) {
            ++index
            showWord()
            updateButtons()
        }
    }
    id("btn_finish").onclick = () => {
        go("vocabulary-index.html")
    }
})

function showWord() {
    let word = vocabulary[index]

    id("kanji").innerText = word.kanji
    id("kana").innerText = "「" + word.kana + "」"
    id("translation").innerText = word.translation
    id("description").innerText = word.description ?? ""
    id("progress").innerText = `[${index + 1} / ${vocabulary.length}]`
}

function updateButtons() {
    let prevIsVisible = index !== 0
    let nextIsVisible = index !== (vocabulary.length - 1)

    id("btn_prev").style.display = prevIsVisible ? "" : "none"
    id("btn_next").style.display = nextIsVisible ? "" : "none"
    id("btn_finish").style.display = !nextIsVisible ? "" : "none"
}
