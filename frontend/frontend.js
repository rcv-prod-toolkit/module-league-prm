document.querySelector('#request-table').addEventListener('submit', (e) => {
  e.preventDefault()

  LPTE.emit({
    meta: {
      namespace: 'module-league-prm',
      type: 'request-table',
      version: 1
    },
    link: document.querySelector('#link').value,
  })
})

let server = ''

LPTE.onready(async () => {
  server = await window.constants.getWebServerPort()
  const location = `http://${server}/pages/op-module-league-prm/gfx`

  const apiKey = await window.constants.getApiKey()

  document.querySelector('#table-gfx').src = `${location}/table.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
  document.querySelector('#table-embed').value = `${location}/table.html${
    apiKey !== null ? '?apikey=' + apiKey : ''
  }`
})
