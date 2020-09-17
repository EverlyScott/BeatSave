const { remote } = require('electron')
const mainProcess = remote.require('../../src/js/node.js')

var songs = []

function loadSongs() {
  songs = []
  mainProcess.loadSongHashes((hashes) => {
    for (var i = 0; i < hashes.length; i++) {
      mapDetail(hashes[i], (info) => {
        songs.push(info)
      })
    }
    for (var i = 0; i < songs.length; i++) {
      console.log(songs[i])
    }
  })
}