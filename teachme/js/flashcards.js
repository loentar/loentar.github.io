
const rows = 2
const maxWords = 5

onReady(() => {
    function getVocabulary(kanji) {
        loadText("db/" + query.index.replace(/\.csv/, "_vocabulary.csv"),
            response => {
                let cards = joinDbs(kanji, parseDb(response))
                fillCards(cards)
            },
            error => alert("can't load vocabulary: " + error)
        )
    }


    getDb(
        result => {
//            id("title").innerText = result.title
            getVocabulary(result)
        },
        error => alert("can't load vocabulary: " + error)
    )
})

function joinDbs(kanjis, vocabulary) {
    let cards = []

    for (let item of kanjis.items) {
        let [kanji, onjyomi, kunyomi, meaning] = item
        let card = {
            kanji: kanji,
            onjyomi: onjyomi,
            kunyomi: kunyomi,
            meaning: meaning || "",
            words: []
        }

        let filteredVocabulary = vocabulary.items.filter(item => item[0].match(kanji))
        let wordIndex = 0
        for (let word of filteredVocabulary) {
            let [term, reading, translation] = word
            card.words.push({
                term: term,
                reading: reading,
                translation: translation
            })
            if (++wordIndex >= maxWords) break
        }

        cards.push(card)
    }

    return cards
}

function fillCards(cards) {
    let html = renderCards(cards)
    html += '<div class="pagebreak"> </div>'
    html += renderCards(cards, true)
    id("content").innerHTML = html
}


function renderCards(cards, isBack) {
    let html = "<table class='cards'>"
    html += "<tbody>"
    for (let index = 0; index < cards.length; ++index) {
        let cardIndex = isBack ? (index - index % rows + 1 - index % rows) : index
        let card = cards[cardIndex]
        if ((index % rows) == 0) {
            html += "<tr>"
        }
        html += "<td class='flashcard_outer'>"
        html += renderCard(card, isBack)
        html += "</td>"
        if ((index % rows) == (rows - 1)) {
            html += "</tr>"
        }
    }
    html += "</tbody></table>"
    return html
}


function renderCard(card, isBack) {
    let html = "<div class='flashcard'><table class='card_header'><tbody>"

    html += "<tr>"
    html += `<td class='flashcard_kanji'>${card.kanji}</td>`
    html += "<td class='flashcard_reading' colspan='2'>"
    if (!isBack) {
        html += `<div class='flashcard_kana'>${softwrap(card.onjyomi)}</div>`
        html += `<div class='flashcard_kana top1'>${softwrap(card.kunyomi)}</div>`
        html += `<div class='flashcard_translation top1'>${card.meaning}</div>`
    }
    html += "</td>"
    html += "</tr>"
    html += "</tbody></table>"

    html += renderWords(card.words, isBack)

    html += "</div>"
    return html
}

function renderWords(words, isBack) {
    let html = "<table class='card_words'><tbody>"
    for (let word of words) {
        html += "<tr>"
        html += `<td class='flashcard_vocabulary'>${word.term}</td>`
        if (!isBack) {
            html += `<td class='flashcard_vocabulary'>${softwrap(word.reading)}</td>`
            html += `<td class='flashcard_translation'>${word.translation}</td>`
        }

        html += "</tr>"
    }
    html += "</tbody></table>"
    return html
}

function softwrap(text) {
    return text.replace(/、/g, "、 ")
}
