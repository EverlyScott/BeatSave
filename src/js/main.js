const { remote } = require('electron');
const mainProcess = remote.require('./node.js');

var config = undefined;


function updateConfig(callback) {
  mainProcess.updateConfig((json) => {
    config = json
    callback()
  })
}

updateConfig(() => {
  setInnerHTML('text', JSON.stringify(config))
})