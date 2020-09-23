const electron = require('electron')
const { shell, dialog } = require('electron')
const fs = require('fs');
const ping = require('node-http-ping')
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
    width: 1200,
    height: 600,
    title: 'BeatSave',
    fullscreenable: true,
    autoHideMenuBar: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      nodeIntegrationInSubFrames: true
    }
  })
  mainWindow.loadFile('app/index.html');
  ping('https://beatsaver.com').catch(() => {
    const options = {
      type: 'error',
      buttons: ['Reload', 'Exit'],
      defaultId: 2,
      title: 'Error',
      message: 'Error',
      detail: 'Error contacting beatsaver.com\nPlease chech your network connection and try again.'
    }
    dialog.showMessageBox(null, options).then((res) => {
      if (res.response == 0) {
        createWindow()
        BrowserWindow.getFocusedWindow().close()
      }
      if (res.response == 1) {
        process.exit()
      }
    })
  })
  mainWindow.on('closed', () => {
    mainWindow = null;
  })
}

function offlineMode() {
  console.log('Starting in offline mode')
  mainWindow.webContents.executeJavaScript('offlineMode()')
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
    var metadata
    try {
      metadata = JSON.parse(fs.readFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, 'utf-8'))
    } catch {
      fs.writeFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, '{"hash":"nohash"}')
      metadata = JSON.parse(fs.readFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, 'utf-8'))
    }
    hashes.push(metadata.hash)
  }
  callback(hashes)
}

exports.getSongInfo = (hash, callback) => {
  const songs = fs.readdirSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels`)
  for (var i = 0; i < songs.length; i++) {
    var metadata
    try {
      metadata = JSON.parse(fs.readFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, 'utf-8'))
    } catch {
      fs.writeFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, '{"hash":"nohash"}')
      metadata = JSON.parse(fs.readFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\metadata.dat`, 'utf-8'))
    }
    if (metadata.hash == hash) {
      const currentsong = JSON.parse(fs.readFileSync(`${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\info.dat`, 'utf-8'))
      const json = {
        metadata: {
          duration: 0,
          automapper: null,
          levelAuthorName: currentsong._levelAuthorName,
          songAuthorName: currentsong._songAuthorName,
          songName: currentsong._songName,
          songSubName: currentsong._songSubName,
          bpm: currentsong._beatsPerMinute
        },
        stats: {
          downloads: 0,
          plays: 0,
          downVotes: 0,
          upVotes: 0,
          heat: 0,
          rating: 0
        },
        description: "Local map (not downloaded from BeatSaver or BeastSaber)",
        deletedAt: null,
        _id: null,
        name: `${currentsong._songAuthorName} - ${currentsong._songName}`,
        uploader: {
          _id: "0",
          username: "Local Song"
        },
        hash: hash,
        uploaded: Date.now(),
        directDownload: null,
        downlodURL: null,
        coverURL: `${config.installationLocation}\\Beat Saber_Data\\CustomLevels\\${songs[i]}\\${currentsong._coverImageFilename}`
      }
      callback(json)
    }
  }
}