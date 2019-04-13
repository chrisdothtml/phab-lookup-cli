# phab-lookup-cli

> A convenience CLI for phabricator

## Install

```sh
yarn global add phab-lookup-cli

# or npm
npm i -g phab-lookup-cli
```

## Use

**NOTE**: when providing a repo name, you can provide either the full name (e.g. scope/repo-name) or short name (e.g. repo-name). It'll try to pick the best match based on the search results, but you may need to specify the full name in some cases

### clone

Clone repo (shorthand: `phab c`)

```sh
phab clone repo-name
# git clones `scope/repo-name`

phab clone repo-name -b some-branch
# passes extra args directly into `git clone`

phab clone asdf
#> Repo not found: asdf
```

### open

Open repo in browser (shorthand: `phab o`)

```sh
phab open scope/repo-name
# opens repo in browser

phab open repo-name
# opens repo in browser

phab open asdf
#> Repo not found: asdf
```

### repo

Print diffusion url for repo (shorthand: `phab r`)

```sh
phab repo repo-name
#> https://phab-url.com/diffusion/WECREHQ

phab repo asdf
#> Repo not found: asdf
```

## Configure

This expects an `~/.arcrc` to exist with authentication info (if you use phab, you might already have one). e.g.

```json
{
  "hosts": {
    "https://phab-url.com/api/": {
      "token": "..."
    }
  }
}
```
