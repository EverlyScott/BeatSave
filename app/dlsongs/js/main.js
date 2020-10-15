const { remote } = require('electron')
const mainProcess = remote.require('../../src/js/node.js')
const $ = require('jquery')

var songs = []

function loadSongs() {
  songs = []
  mainProcess.loadSongHashes((hashes) => {
    console.groupCollapsed('The following 404 errors (if any) are handled and do not mean anything. Please expand for more info.')
    console.log('It just means that the song does not exist on BeatSaver, this could be due to having a custom or converted map. The app handles this by reading the info files from your game folder.')
    console.groupEnd()
    for (let i = 0; i < hashes.length; i++) {
      const currenthash = hashes[i]
      mapDetail(currenthash, (info) => {
        if (info == 404) {
          songs.push(JSON.parse(`{"error":404,"hash":"${currenthash}"}`))
        } else {
          songs.push(info)
        }
        if (songs.length == hashes.length) {
          for (let i = 0; i < songs.length; i++) {
            if (songs[i].error == 404) {
              mainProcess.getSongInfo(songs[i].hash, (json) => {
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

function sortSongs(type) {
  songs.sort((a, b) => {
    if (a.error == 404 || b.error == 404) {
      nohashsort(a, b)
    } else {
      hashsort(a, b)
    }
  })

  function hashsort(a, b) {
    if (a.metadata.songName < b.metadata.songName) {
      return a
    } else {
      return b
    }
  }

  function nohashsort(a, b) {
    if (a.hash == 'nohash') {
      return b
    } else if (b.hash == 'nohash') {
      return a
    } else if (a.error == 404) {
      mainProcess.getSongInfo(a.hash, (json) => {
        console.log(json)
        if (json.metadata.songName < b.metadata.songName) {
          return a
        } else {
          return b
        }
      })
    } else if (b.error == 404) {
      mainProcess.getSongInfo(b.hash, (json) => {
        if (a.metadata.songName < json.metadata.songName) {
          return a
        } else {
          return b
        }
      })
    }
  }
}

loadSongs()
setTimeout(() => {
  sortSongs()
},1000)