const { remote } = require('electron')
const mainProcess = remote.require('../../src/js/node.js')

var songs = []

function loadSongs() {
  songs = []
  mainProcess.loadSongHashes((hashes) => {
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
            var template = document.getElementById('songstemplate')
            var song = template.content.cloneNode(true)
            if (songs[i].error == 404) {
              const errorData = mainProcess.getSongInfo(songs[i].hash, (json) => {
                song.getElementById('img').src = json.coverURL
                console.log(json)
              })
            } else {
              song.getElementById('img').src = `${beatsaverurl}${songs[i].coverURL}`
            }
            document.getElementById('songs').appendChild(song)
          }
        }
      })
    }
  })
}

loadSongs()