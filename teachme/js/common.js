function onReady(callback) {
    document.addEventListener("DOMContentLoaded", callback)
}

function go(url) {
    document.location = url
}

function documentQuery() {
    let search = document.location.search.substring(1)
    let args = search.split("&")
    let query = {}
    for (let arg of args) {
        if (arg !== "") {
            let [name, value] = arg.split("=")
            query[name] = value
        }
    }
    return query
}

function loadText(url, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ((response) => {
        return () => {
            if (response.readyState === 4) {
                if (response.status !== 200) {
                    onError(response.status + " " + response.statusText)
                    return
                }

                try {
                    onSuccess(response.responseText)
                } catch(e) {
                    console.error(e)
                    onError(e)
                }
            }
        }
    })(xhr)
    xhr.open('GET', url, true);
    xhr.send('');
}

function id(value) {
    return document.getElementById(value)
}

function randomInt(max) {
    return Math.floor(Math.random() * max)
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5)
}

function clone(object) {
    if (object === null) {
        return null
    }

    let out
    if (object instanceof Array) {
        out = []
        for (let i = 0; i < object.length; ++i) {
            out.push(clone(object[i]))
        }
    } else if (typeof object === "object") {
        out = {}
        for (let key in object) {
            out[key] = clone(object[key])
        }
    } else {
        out = object
    }
    return out
}

function equals(a, b) {
    if ((a === null && b === null) || (a === undefined && b === undefined)) {
        return true
    }
    if (a === null || b === null || a === undefined || b === undefined) {
        return false
    }
    if (typeof a !== typeof b) {
        return false
    }

    if (a instanceof Array && b instanceof Array) {
        if (a.length !== b.length) {
            return false
        }
        for (let i = 0; i < a.length; ++i) {
            if (!equals(a[i], b[i])) {
                return false
            }
        }
    } else if (typeof a === "object" && typeof b === "object") {
        var aProps = Object.getOwnPropertyNames(a)
        var bProps = Object.getOwnPropertyNames(b)

        if (aProps.length !== bProps.length) {
            return false
        }

        for (const prop of aProps) {
            if (!equals(a[prop], b[prop])) {
                return false
            }
        }
    } else {
        return a === b
    }

    return true
}

let query = documentQuery()

const tagMapping = {
    "2": ["kanji", "kana"],
    "3": ["kanji", "kana", "translation"],
    "4": ["kanji", "kana", "translation", "description"],
    "5": ["kanji", "kana", "kana2", "translation", "description"],
    "7": ["kanji", "kana", "", "kana2", "", "translation", "description"],
}
