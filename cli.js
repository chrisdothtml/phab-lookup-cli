#!/usr/bin/env node

const { execSync } = require('child_process')
const { promisify } = require('util')
const canduit = require('canduit')

const exec = (input) => execSync(input, { stdio: 'inherit' })

class Commands {
  constructor (phab) {
    this._request = promisify(phab.exec.bind(phab))

    // aliases
    this.c = this.clone
    this.o = this.open
    this.r = this.repo
  }

  async _getRepoByName (repoName) {
    const repos = await this._request('diffusion.repository.search', {
      order: 'oldest',
      constraints: {
        query: repoName,
      },
    }).then(res => res.data)

    for (const repo of repos) {
      const { name } = repo.fields

      if (name === repoName || name.split('/')[1] === repoName) {
        return this._request('repository.query', {
          ids: [ repo.id ],
        }).then(res => res[0])
      }
    }
  }

  async clone (argv) {
    const repoName = argv[0]
    const gitArgs = argv.slice(1)
    const repo = await this._getRepoByName(repoName)

    if (repo) {
      const cloneUrl = repo.remoteURI
      const extraArgs = gitArgs.length ? (' ' + gitArgs.join(' ')) : ''

      exec(`git clone ${cloneUrl + extraArgs}`)
    } else {
      return `Repo not found: ${repoName}`
    }
  }

  async repo ([ repoName ]) {
    const repo = await this._getRepoByName(repoName)

    return repo ? repo.uri : `Repo not found: ${repoName}`
  }

  async open (argv) {
    const url = await this.repo(argv)

    if (url.startsWith('https')) {
      exec(`open ${url}`)
      return `Opening: ${url}`
    } else {
      return url
    }
  }
}

async function main () {
  const argv = process.argv.slice(2)
  const command = argv[0]
  const phab = await promisify(canduit)()
  const commands = new Commands(phab)

  if (!command.startsWith('_') && commands[command]) {
    const res = await commands[command](argv.slice(1))

    if (res) {
      console.log(res)
    }
  } else {
    console.log(`Unrecognized command: ${command}`)
  }
}

main().catch(console.error)
