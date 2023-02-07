const tbody = document.querySelector('tbody')

function updateTeams(res) {
  const teams = res.teams
  
  if (teams.length <= 0) return

  tbody.innerHTML = ''

  for (const team of teams) {
    const row = tbody.insertRow()

    const place = row.insertCell()
    place.textContent = team.place

    const logo = row.insertCell()
    const logoImg = document.createElement('img')
    logoImg.src = team.logo
    logo.appendChild(logoImg)

    const name = row.insertCell()
    name.textContent = team.name

    const wins = row.insertCell()
    wins.textContent = team.wins

    const losses = row.insertCell()
    losses.textContent = team.losses
  }
}

LPTE.onready(async () => {
  const res = await LPTE.request({
    meta: {
      namespace: 'module-league-prm',
      type: 'request',
      version: 1
    }
  })

  updateTeams(res)

  window.LPTE.on('module-league-prm', 'update', updateTeams)
})