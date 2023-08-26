//* Nome de classes devem comecar com a letra maiuscula
//! o root que o constructor esta a receber e o #app
import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || []
  }

  save() {
    localStorage.setItem("@github-favorites:", JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find( entry => entry.login === username)

      if (userExists) {
        throw new Error("User exist")
      }

      const user = await GithubUser.search(username)

      if (user.login === undefined) {
        throw new Error("User not found!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    this.entries = this.entries.filter((entry) => entry.login !== user.login)
    this.update()
    this.save()
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
      row.querySelector(".user span").textContent = `@${user.login}`
      row.querySelector(".user img").alt = `imagem de ${user.name}`
      row.querySelector(".user a").href = user.html_url
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
                <span class='name'>Clemilsonazevedo</span>
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
