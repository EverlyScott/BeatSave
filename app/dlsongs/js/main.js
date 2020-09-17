const { remote } = require('electron')
const mainProcess = remote.require('../../src/js/node.js')

var songs = []

function loadSongs() {
  songs = []
  mainProcess.loadSongHashes((hashes) => {
    for (var i = 0; i < hashes.length; i++) {
      const info = mapDetail(hashes[i])
      songs.push(info)
    }
    console.log(songs)
  })
}

loadSongs()