
function getVocabulary(onSuccess, onError) {
    console.log(JSON.stringify(query))
    loadText("db/vocabulary/" + query.index,
        response => {
            onSuccess(parseVocabulary(response))
        },
        error => {
            console.error("can't load index: " + error)
            onError(error)
        }
    )
}


function parseVocabulary(response) {
    let lines = response.split("\n")
    let title = ""
    let words = []
    for (let line of lines) {
        if (line === "") continue
        if (line.startsWith("#")) {
            title = line.slice(1).trim()
            continue
        }

        try {
            let [kanji, kana, translation, description] = line.split(";")

            words.push({
                kanji: kanji,
                kana: kana,
                translation: translation,
                description: description,
            })
        } catch (e) {
            throw `Error parsing line: \n---\n${line}\n---\n`
        }
    }
    return { title: title, words: words }
}
