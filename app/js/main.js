const { remote } = require('electron');
const mainProcess = remote.require('./node.js');

var config = undefined;

updateConfig(() => {
  setInnerHTML('text', JSON.stringify(config))
  if (config.installationLocation === "") {
    location.replace('selectgamefolder/index.html')
  }
})