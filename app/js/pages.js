const pageiframe = document.getElementById('pageiframe')
const dlsongs = document.getElementById('dlsongs')
const dlplaylists = document.getElementById('dlplaylists')
const bssongs = document.getElementById('bssongs')
const bsplaylists = document.getElementById('bsplaylists')

function changePage(page) {
  switch(page) {
    case 'dlsongs':
      pageiframe.src ='https://www.scribblenerd.com'
      resetPageColors()
      dlsongs.classList = 'page selected'
      break;

    case 'dlplaylists':
      resetPageColors()
      dlplaylists.classList = 'page selected'
      break;

    case 'bssongs':
      resetPageColors()
      bssongs.classList = 'page selected'
      break;

    case 'bsplaylists':
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