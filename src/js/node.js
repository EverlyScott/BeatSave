const electron = require('electron')
const { shell } = require('electron')
const fs = require('fs');
const app = electron.app;
const Menu = electron.Menu;
const BrowserWindow = electron.BrowserWindow;
const isMac = process.platform === 'darwin';
const isWindows = process.platform === 'win32';
const isLinux = process.platform === 'linux';
const appdata = process.env.APPDATA
const configtemplate = require('../json/configtemplate.json')

var config = undefined;
var mainWindow = null;

app.on('ready', () => {
  if (isWindows) {
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
  }
  createWindow()
  if (isMac) {
    var template = [
      ...(isMac ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          { role: 'services' },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideothers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }] : []),
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
    var osxMenu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(osxMenu)
  }
})

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'BeatSave',
    ...(isMac ? [{
      frame: false,
      transparent: true,
      titleBarStyle: 'hiddenInset'
    }] : []),
    fullscreenable: true,
    autoHideMenuBar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true
    }
  })
  if (isMac) {
    mainWindow.setVibrancy("dark")
  }
  mainWindow.loadFile('src/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

function updateConfig() {
  if (isWindows) {
    config = JSON.parse(fs.readFileSync(`${appdata}/beatsave/config.json`))
  }
}

exports.updateConfig = (callback) => {
  updateConfig()
  callback(config)
}