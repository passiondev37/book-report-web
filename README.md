# bookreport-web-vue

> A Vue.js project with Vuex, Vue router, Vuetify and Rollup

## Build from Source code to docker/dist


#### install dependencies
`npm install`

#### or update dependencies when pull new commits
`npm update`

#### dev task
Which builds everything, sets up the watchers, and launches the browser on **8000** port
`API=http://api.example.com npm run dev`

without variable API=http://api.example.com `/api` will be redirect to
default `http://192.168.1.5` located in browser-config.js `apiProxy.target`

API (proxy) can be http[s]:// DNS name or IP

#### build all code in docker/dist
`npm run build`

#### build with file watching
`npm run watch`

#### file watching for source code:
`npm run` [`js:watch`, `style:watch`, `pug:watch`]

#### serve with hot reload in browser at localhost:8000
`npm run serve`
`npm run serve:open` launches the browser

## Also there are another build commands:

#### Build index.html for Vue app in docker/dist/index.html
`npm run pug`
#### Build styles.css from src/stylus
`npm run style`
#### Build Vue app core code in docker/dist/js/app.js and vendor's code: Vue, Vuetify, Vuex, vueRouter in docker/dist/js/vendor.js
`npm run js`

#### +
`js:app` - build only core app code
`js:vendor` - build only vendors code

#### Eslint js code
`npm run lint`

## Commands for build and run docker container:

`npm run build:docker`

or native

`docker build docker -t cedarwood/bookreport-web-vue`

## For running as docker container on 5000 port:

`docker run --name vue-app -it -p 5000:5000 -e "API_ENDPOINT=api.example.com" --rm cedarwood/bookreport-web-vue`