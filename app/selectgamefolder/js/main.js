const { remote } = require('electron');
const mainProcess = remote.require('../../src/js/node.js');

var config = undefined

mainProcess.updateConfig((newconfig) => {
  config = newconfig
})

function openfolderselection() {
  mainProcess.selectGameFolder((folder) => {
    config.installationLocation = folder
    mainProcess.writeConfig(config, () => {
      document.getElementById('a').innerHTML = config
    })
  })
}