const { remote } = require('electron')
const mainProcess = remote.require('../../src/js/node.js')

var songs = []

function loadSongs() {
  songs = []
  mainProcess.loadSongHashes((hashes) => {
    console.groupCollapsed('The following 404 errors (if any) are handled and do not mean anything. Please expand for more info.')
    console.log('It just means that the song does not exist on BeatSaver, this could be due to having a custom or converted map. The app handles this by reading the info files from your game folder.')
    console.groupEnd()
    for (var i = 0; i < hashes.length; i++) {
      const currenthash = hashes[i]
      mapDetail(currenthash, (info) => {
        if (info == 404) {
          songs.push(JSON.parse(`{"error":404,"hash":"${currenthash}"}`))
        } else {
          songs.push(info)
        }
        if (songs.length == hashes.length) {
          for (var i = 0; i < songs.length; i++) {
            if (songs[i].error == 404) {
              mainProcess.getSongInfo(songs[i].hash, (json) => {
                console.log(JSON.stringify(json))
                var template = document.getElementById('songstemplate')
                var song = template.content.cloneNode(true)
                song.getElementById('img').src = `file://${json.coverURL}`
                song.getElementById('name').innerText = json.metadata.songName
                document.getElementById('songs').appendChild(song)
              })
            } else {
              var template = document.getElementById('songstemplate')
              var song = template.content.cloneNode(true)
              song.getElementById('img').src = `${beatsaverurl}${songs[i].coverURL}`
              song.getElementById('name').innerText = songs[i].metadata.songName
              song.getElementById('songauthor').innerText = songs[i].metadata.songAuthorName
              song.getElementById('levelauthor').innerHTML = songs[i].metadata.levelAuthorName
              document.getElementById('songs').appendChild(song)
            }
          }
        }
      })
    }
  })
}

loadSongs()

function compareValues(key, order = 'asc') {
  return function innerSort(a, b) {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0
    }
    const varA = (typeof a[key] === 'string')
      ? a[key].toUpperCase() : a[key]
    const varB = (typeof b[key] === 'string')
      ? b[key].toUpperCase : b[key]
    let comparison = 0;
    if (varA > varB) {
      comparison = 1
    } else if (varA < varB) {
      comparison = -1
    }
    return (
      (order === 'desc') ? (comparison * -1) : comparison
    )
  }
}