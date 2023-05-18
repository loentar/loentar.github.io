
const MAX_RESULTS = 5
const SPLIT_INDEX = 3
let db
let mapping
let remaining = []
let answeredCount = 0
let answeredCorrectly = true
let hasWrongAnswers = false
let requiredAnswerCount = -1

onReady(() => {
    getDb(
        result => {
            db = result
            remaining = clone(db.items)
            initContent()
            showNextWord()
            updateButtons()
            id("title").innerText = result.title
        },
        error => alert("can't load vocabulary: " + error)
    )

    id("btn_shuffle").onclick = () => {
        id("btn_shuffle").style.display = "none"
        shuffleArray(remaining)
        showNextWord()
    }
    id("btn_skip").onclick = () => {
        skip()
    }
    id("btn_restart").onclick = () => {
        document.location.reload()
    }
})

function initContent() {
    mapping = clone(tagMapping[db.headers.length])
    for (let i = db.headers.length - 1; i >= 0; --i) {
        if (!db.req[i]) {
            mapping.splice(i, 1)
        }
    }

    let part = mapping.splice(query.part, 1)[0]
    mapping.unshift(part)

    let content = ""
    for (let mode of mapping) {
        content += `<div id="${mode}"></div><p></p>`
    }
    id("content").innerHTML = content
}

function showNextWord() {
    answeredCount = 0
    answeredCorrectly = true
    hasWrongAnswers = false

    let variants = clone(db.items)
    let word = remaining[0]
    // remove same translations
    for (let i = 0; i < variants.length; ++i) {
        for (let j = 0; j < word.length; ++j) {
            if (db.req[j] && (variants[i][j] === word[j] || variants[i][j] === "")) {
                variants.splice(i, 1)
                --i
                break
            }
        }
    }
    shuffleArray(variants)

    let words = [word]
    for (let a = 0; a < MAX_RESULTS && a < variants.length; ++a) {
        words.push(variants[a])
    }

    let tags = tagMapping[db.headers.length]
    const queryPart = parseInt(query.part)
    requiredAnswerCount = -1
    for (i = 0; i < db.req.length; ++i) {
        if (!db.req[i]) continue
        if (word[i] !== "") {
            ++requiredAnswerCount
            let text = (queryPart === i) ? word[queryPart] : buttons(word, words, answer => answer[i])
            id(tags[i]).innerHTML = text + "<hr/>"
        } else {
            id(tags[i]).innerHTML = ""
        }
    }

    id("progress").innerHTML = `[${db.items.length - remaining.length + 1} / ${db.items.length}]`
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
        let index = remaining.findIndex(it => equals(it, word))
        let isRightAnswer = equals(rightAnswer, word)
        let mapped = map(word)
        if (mapped) {
            return `<input type="button" value="${mapped}" onclick="checkAnswer(this, ${isRightAnswer}, ${index})" />`
        }
    })

    if (answers.length > SPLIT_INDEX) {
        answers.splice(SPLIT_INDEX, 0, "<p></p>")
    }

    return divider + answers.join(divider) + divider
}

function checkAnswer(button, isRightAnswer, index) {
    button.value = (isRightAnswer ? " ✔ " : " ✘ ") + button.value
    button.classList.add(isRightAnswer ? "success" : "failure")
    if (isRightAnswer) {
        for (let child of button.parentElement.children) {
            child.disabled = "disabled"
        }
        ++answeredCount
    } else {
        hasWrongAnswers = true
    }

    answeredCorrectly = answeredCorrectly && isRightAnswer

    if (answeredCount === requiredAnswerCount) {
        id("btn_skip").disabled = "disabled"
        setTimeout(() => {
            id("btn_skip").disabled = ""
            if (answeredCorrectly) {
                remaining.splice(index, 1)
            }
            next()
        }, answeredCorrectly && !hasWrongAnswers ? 500 : 3000)
    }
}

function skip() {
    if (remaining.length > 1) {
        let skipped = remaining.splice(0, 1)
        remaining.push(skipped)
        showNextWord()
    }
    updateButtons()
}

function next() {
    if (remaining.length !== 0) {
        showNextWord()
    }
    updateButtons()
}

function updateButtons() {
    let nextIsVisible = remaining.length !== 0

    id("btn_skip").style.display = (remaining.length > 1) ? "" : "none"
    id("btn_restart").style.display = !nextIsVisible ? "" : "none"
    id("btn_finish").style.display = !nextIsVisible ? "" : "none"
}
