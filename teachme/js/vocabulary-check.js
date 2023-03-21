
const MAX_RESULTS = 4
let vocabulary = []
let remaining = []
let answeredCount = 0
let answeredCorrectly = true

onReady(() => {
    getVocabulary(
        result => {
            vocabulary = result.words
            remaining = clone(result.words)
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
    let wordIndex = randomInt(variants.length)
    let word = remaining[wordIndex]
    variants.splice(wordIndex, 1)

    let words = [word]
    for (let a = 0; a < MAX_RESULTS; ++a) {
        let variantIndex = randomInt(variants.length)
        let variant = variants[variantIndex]
        if (words.indexOf(variant) !== -1) {
            --a
            continue
        }
        words.push(variant)
        variants.splice(variantIndex, 1)
    }

    id("kanji").innerHTML = query.mode === "kanji"
        ? word.kanji
        : buttons(word, words, answer => answer.kanji)

    id("kana").innerHTML = query.mode === "kana"
        ? word.kana
        : buttons(word, words, answer => "「" + answer.kana + "」")

    id("translation").innerHTML = query.mode === "translation"
        ? word.translation
        : buttons(word, words, answer => answer.translation)

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
    let answers = possibleAnswers(words, word => {
        let index = remaining.indexOf(word)
        let isRightAnswer = rightAnswer === word
        return `<input type="button" value="${map(word)}" onclick="checkAnswer(this, ${isRightAnswer}, ${index})" />`
    })

    return answers.join("&nbsp;&nbsp;")
}

function checkAnswer(button, isRightAnswer, index) {
    button.value = (isRightAnswer ? " ✔ " : " ✘ ") + button.value
    button.classList.add(isRightAnswer ? "success" : "failure")
    for (let child of button.parentElement.children) {
        child.disabled = "disabled"
    }
    answeredCorrectly = answeredCorrectly && isRightAnswer

    ++answeredCount
    if (answeredCount === 2) {
        setTimeout(() => {
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
        updateButtons()
    }
}

function updateButtons() {
    let nextIsVisible = remaining.length !== 0

    id("btn_skip").style.display = nextIsVisible ? "" : "none"
    id("btn_finish").style.display = !nextIsVisible ? "" : "none"
}
