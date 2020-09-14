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