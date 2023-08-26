//* Nome de classes devem comecar com a letra maiuscula
//! o root que o constructor esta a receber e o #app

export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
      .then((data) => data.json())
      .then(({ login, name, public_repos, followers }) => ({
        login,
        name,
        public_repos,
        followers,
      }))
  }
}

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites: ")) || []
  }

  async add(username) {
    const user = await GithubUser.search(username)


  }

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login)

    this.update()
  }
}

//*Vamos extender a classe para poder usar os atributos e exportar

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector("table tbody")

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addButton = this.root.querySelector(".search button")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search input")

      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector(
        ".user img"
      ).src = `https://github.com/${user.login}.png`

      row.querySelector(".user p").textContent = user.name

      row.querySelector(".user img").alt = `imagem de ${user.name}`
      row.querySelector(".repositories").textContent = user.public_repos
      row.querySelector(".followers").textContent = user.followers

      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Confirm this delete?")

        if (isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
            <td class="user">
              <img
                src="https://github.com/clemilsonazevedo.png"
                alt="foto do clemilson azevedo"
              />
              <a href="https://github.com/clemilsonazevedo" target="_blank">
                <p>Clemilson de Azevedo</p>
                <span>Clemilsonazevedo</span>
              </a>
            </td>
            <td class="repositories">3829</td>
            <td class="followers">8837782</td>
            <td><button class='remove'>&times;</button></td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove()
    })
  }
}
