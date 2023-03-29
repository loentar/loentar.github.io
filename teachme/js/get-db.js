
function getDb(onSuccess, onError) {
    loadText("db/" + query.index,
        response => {
            onSuccess(parseDb(response))
        },
        error => {
            console.error("can't load index: " + error)
            onError(error)
        }
    )
}

function parseDb(response) {
    let lines = response.split("\n")
    let headers = ['字', 'あ', 'A', '?Descr']
    let req = [true, true, true, false]
    let title = ""
    let items = []
    for (let line of lines) {
        if (line === "") continue
        let parts = line.split(";")
        if (parts.length < 2 && !parts[0].startsWith('#')) {
            console.error(`Failed to parse line: [${line}]`)
            continue
        }

        switch (parts[0][0]) {
            case '#':
                title = parts[0].slice(1).trim()
                break

            case '*':
                [headers, req] = parseParts(parts)
                break

            default:
                items.push(parts)
        }
    }

    return { title: title, headers: headers, req: req, items: items }
}

function parseParts(parts) {
    let headers = []
    let req = []

    for (let part of parts) {
        switch (part[0]) {
            case '*': // required
                headers.push(part.slice(1).trim())
                req.push(true)
                break

            case '?': // optional
                headers.push(part.slice(1).trim())
                req.push(false)
                break

            default:
                headers.push(part.trim())
                req.push(true)
        }
    }

    return [headers, req]
}
