const apiurl = 'https://www.beatsaver.com/api' //DO NOT include a trailing slash!

function loadJSON(url, callback) {
  var xobj = new XMLHttpRequest()
  xobj.overrideMimeType("application/json")
  xobj.open('GET', url, true)
  xobj.onreadystatechange = () => {
    if (xobj.readyState == 4 & xobj.status == "200") {
      callback(xobj.responseText)
    }
  }
  xobj.send(null)
}

//download
function downloadKey(key) {
  location.replace(`${apiurl}/download/key/${key}`)
}

function downloadHash(hash) {
  location.replace(`${apiurl}/download/hash/${hash}`)
}

//maps
function mapDetail(key, callback) {
  loadJSON(`${apiurl}/maps/detail/${key}`, (res) => {
    callback(JSON.parse(res))
  })
}

function mapDetailHash(hash, callback) {
  loadJSON(`${apiurl}/maps/by-hash/${hash}`, (res) => {
    callback(JSON.parse(res))
  })
}

function getUploader(id, page, callback) {
  loadJSON(`${apiurl}/maps/uploader/${id}/${page}`, (res) => {
    callback(JSON.parse(res))
  })
}

function byhot(page, callback) {
  loadJSON(`${apiurl}/maps/hot/${page}`, (res) => {
    callback(JSON.parse(res))
  })
}

function byRating(page, callback) {
  loadJSON(`${apiurl}/maps/rating/${page}`, (res) => {
    callback(JSON.parse(res))
  })
}

function byLatest(page, callback) {
  loadJSON(`${apiurl}/maps/latest/${page}`, (res) => {
    callback(JSON.parse(res))
  })
}

function byDownloads(page, callback) {
  loadJSON(`${apiurl}/maps/downloads/${page}`, (res) => {
    callback(JSON.parse(res))
  })
}

function byPlays(page, callback) {
  loadJSON(`${apiurl}/maps/plays/${page}`, (res) => {
    callback(JSON.parse(res))
  })
}

//search
function search(query, page, callback) {
  loadJSON(`${apiurl}/search/text/${page}?q=${query}`, (res) => {
    callback(JSON.parse(res))
  })
}

//stats
function statsKey(key, callback) {
  loadJSON(`${apiurl}/stats/key/${key}`, (res) => {
    callback(JSON.parse(res))
  })
}

function statsHash(hash, callback) {
  loadJSON(`${apiurl}/stats/by-hash/${hash}`, (res) => {
    callback(JSON.parse(res))
  })
}