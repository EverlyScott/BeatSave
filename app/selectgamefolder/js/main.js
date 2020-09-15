const { remote } = require('electron');
const mainProcess = remote.require('../../src/js/node.js');

var config = undefined

mainProcess.updateConfig((newconfig) => {
  config = newconfig
  if (config.installationLocation != "") {
    location.replace('../index.html')
  }
})

function openfolderselection() {
  mainProcess.selectGameFolder((folder) => {
    if (folder != undefined) {
      config.installationLocation = folder
      mainProcess.writeConfig(config, () => {
        document.getElementById('path').innerHTML = folder
        document.getElementById('continue').classList = "button blue"
        document.getElementById('continue').setAttribute('onclick', 'continuebutton()')
      })
    }
  })
}

function continuebutton() {
  location.replace('../index.html')
}