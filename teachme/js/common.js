const learnUrl = "db/vocabulary"

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
                    onError()
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


let query = documentQuery()
