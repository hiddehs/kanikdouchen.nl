# [kanikdouchen.nl](https://kanikdouchen.nl)

> front and node server for kanikdouchen.nl with GPIO readout via onoff

## What is kanikdouchen.nl?

kanikdouchen.nl is a simple site to check if a bathroom is locked or not, so you can check anytime/anywhere if you can take a shower or not!


## Configure Spreadsheets

``` bash
# copy example env
cd remote && cp .env.example .env

# change SHEET_ID into your Google Spreadsheet URL's id

```

## Start Back-end

``` bash

# cd into remote directory
cd remote
# install dependencies
yarn install
# start node server
node .

```


## Front-end Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
