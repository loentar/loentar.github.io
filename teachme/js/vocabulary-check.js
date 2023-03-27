
const MAX_RESULTS = 5
const SPLIT_INDEX = 3
let vocabulary = []
let remaining = []
let answeredCount = 0
let answeredCorrectly = true
let notranslation = false

onReady(() => {
    getVocabulary(
        result => {
            vocabulary = result.words
            if (vocabulary[0].kanji === '*') {
                notranslation = vocabulary[0].translation === '*notranslation'
                vocabulary.splice(0, 1)
            }
            remaining = clone(vocabulary)
            shuffleArray(remaining)
            initContent()
            showNextWord()
            updateButtons()
            id("title").innerText = result.title
        },
        error => alert("can't load vocabulary: " + error)
    )

    id("btn_skip").onclick = () => {
        next()
    }
    id("btn_restart").onclick = () => {
        document.location.reload()
    }
    id("btn_finish").onclick = () => {
        go("vocabulary-index.html")
    }
})

function initContent() {
    let modes = ["kanji", "kana", "translation"]

    let index = modes.indexOf(query.mode)
    modes.splice(index, 1)
    modes.unshift(query.mode)

    let content = ""
    for (let mode of modes) {
        content += `<div id="${mode}"></div><p/><p/>`
    }
    id("content").innerHTML = content
}

function showNextWord() {
    answeredCount = 0
    answeredCorrectly = true

    let variants = clone(vocabulary)
    let word = remaining[0]
    // remove same translations
    for (let i = 0; i < variants.length; ++i) {
        if (variants[i].translation === word.translation) {
            variants.splice(i, 1)
        }
    }
    shuffleArray(variants)

    let words = [word]
    for (let a = 0; a < MAX_RESULTS && a < variants.length; ++a) {
        words.push(variants[a])
    }

    id("kanji").innerHTML = (query.mode === "kanji"
        ? word.kanji
        : buttons(word, words, answer => answer.kanji)) + "<hr/>"

    id("kana").innerHTML = (query.mode === "kana"
        ? word.kana
        : buttons(word, words, answer => "「" + answer.kana + "」")) + "<hr/>"

    if (!notranslation) {
        id("translation").innerHTML = (query.mode === "translation"
            ? word.translation
            : buttons(word, words, answer => answer.translation)) + "<hr/>"
    }

    id("progress").innerHTML = `[${vocabulary.length - remaining.length + 1} / ${vocabulary.length}]`
}

function possibleAnswers(words, map) {
    let result = []
    for (let word of words) {
        result.push(map(word))
    }
    return shuffleArray(result)
}

function buttons(rightAnswer, words, map) {
    const divider = "&nbsp;&nbsp;"
    let answers = possibleAnswers(words, word => {
        let index = remaining.indexOf(word)
        let isRightAnswer = rightAnswer === word
        return `<input type="button" value="${map(word)}" onclick="checkAnswer(this, ${isRightAnswer}, ${index})" />`
    })

    if (answers.length > SPLIT_INDEX) {
        answers.splice(SPLIT_INDEX, 0, "<p></p>")
    }

    return divider + answers.join(divider) + divider
}

function checkAnswer(button, isRightAnswer, index) {
    button.value = (isRightAnswer ? " ✔ " : " ✘ ") + button.value
    button.classList.add(isRightAnswer ? "success" : "failure")
    for (let child of button.parentElement.children) {
        child.disabled = "disabled"
    }
    answeredCorrectly = answeredCorrectly && isRightAnswer

    ++answeredCount
    let maxAnsweredCount = notranslation ? 1 : 2
    if (answeredCount === maxAnsweredCount) {
        id("btn_skip").disabled = "disabled"
        setTimeout(() => {
            id("btn_skip").disabled = ""
            if (answeredCorrectly) {
                remaining.splice(index, 1)
            }
            next()
        }, answeredCorrectly ? 500 : 3000)
    }
}

function next() {
    if (remaining.length !== 0) {
        showNextWord()
    }
    updateButtons()
}

function updateButtons() {
    let nextIsVisible = remaining.length !== 0

    id("btn_skip").style.display = nextIsVisible ? "" : "none"
    id("btn_restart").style.display = !nextIsVisible ? "" : "none"
    id("btn_finish").style.display = !nextIsVisible ? "" : "none"
}
