const { remote } = require('electron');
const mainProcess = remote.require('../../src/js/node.js');

var config = undefined;
var songs = []

updateConfig(() => {
  if (config.installationLocation == "") {
    location.replace('selectgamefolder/index.html')
  }
})

function setInnerHTML(id, html, callback) {
  document.getElementById(id).innerHTML = html
  if (callback != undefined) {
    callback()
  }
}

function updateConfig(callback) {
  mainProcess.updateConfig((json) => {
    config = json
    callback()
  })
}

function loadSongs() {
  songs = []
  mainProcess.loadSongHashes((hashes) => {
    for (var i = 0; i < hashes.length; i++) {
      mapDetail(hashes[i], (info) => {
        songs.push(info)
      })
    }
    for (var i = 0; i < songs.length; i++) {
      
    }
  })
}