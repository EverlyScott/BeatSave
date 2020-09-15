const electron = require('electron')
const { shell, dialog } = require('electron')
const fs = require('fs');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const appdata = process.env.APPDATA
const configtemplate = require('../json/configtemplate.json')

var config = undefined;
var mainWindow = null;

app.on('ready', () => {
  if (fs.existsSync(`${appdata}/beatsave`)) {
    if (fs.existsSync(`${appdata}/beatsave/config.json`)) {
      updateConfig()
    } else {
      fs.writeFileSync(`${appdata}/beatsave/config.json`, JSON.stringify(configtemplate))
      updateConfig()
    }
  } else {
    fs.mkdirSync(`${appdata}/beatsave`)
    fs.writeFileSync(`${appdata}/beatsave/config.json`, JSON.stringify(configtemplate))
    updateConfig()
  }
  createWindow()
  var template = [
    { role: 'fileMenu' },
    { role: 'editMenu' },
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'Visit Our Forum For More Help',
          click: async() => {
            await shell.openExternal('https://forum.scribblenerd.com')
          }
        }
      ]
    }
  ]
  var menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'BeatSave',
    fullscreenable: true,
    autoHideMenuBar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  mainWindow.loadFile('app/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

function updateConfig() {
  config = JSON.parse(fs.readFileSync(`${appdata}/beatsave/config.json`))
}

exports.updateConfig = (callback) => {
  updateConfig()
  callback(config)
}

exports.selectGameFolder = (callback) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }).then((folder) => {
    callback(folder.filePaths[0])
  })
}

exports.writeConfig = (newconfig, callback) => {
  fs.writeFile(`${appdata}/beatsave/config.json`, JSON.stringify(newconfig), () => {
    updateConfig()
    callback(config)
  })
}

exports.loadSongHashes = (callback) => {
  updateConfig()
  const songs = fs.readdirSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels`)
  var hashes = []
  for (var i = 0; i < songs.length; i++) {
    const metadata = JSON.parse(fs.readFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, 'utf-8'))
    hashes.push(metadata.hash)
  }
  callback(hashes)
}