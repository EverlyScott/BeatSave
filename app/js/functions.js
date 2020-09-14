function setInnerHTML(id, html, callback) {
  document.getElementById(id).innerHTML = html
  if (callback != undefined) {
    callback()
  }
}

function locationPrompt() {
  location.replace('')
}