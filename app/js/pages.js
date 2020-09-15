const pageiframe = document.getElementById('pageiframe')
const dlsongs = document.getElementById('dlsongs')
const dlplaylists = document.getElementById('dlplaylists')
const bssongs = document.getElementById('bssongs')
const bsplaylists = document.getElementById('bsplaylists')

function changePage(page) {
  switch(page) {
    case 'dlsongs':
      pageiframe.src ='dlsongs/index.html'
      resetPageColors()
      dlsongs.classList = 'page selected'
      break;

    case 'dlplaylists':
      pageiframe.src = 'dlplaylists/index.html'
      resetPageColors()
      dlplaylists.classList = 'page selected'
      break;

    case 'bssongs':
      pageiframe.src = 'bssongs/index.html'
      resetPageColors()
      bssongs.classList = 'page selected'
      break;

    case 'bsplaylists':
      pageiframe.src = 'bsplaylists/index.html'
      resetPageColors()
      bsplaylists.classList = 'page selected'
      break;
  }
}

function resetPageColors() {
  dlsongs.classList = 'page'
  dlplaylists.classList = 'page'
  bssongs.classList = 'page'
  bsplaylists.classList = 'page'
}