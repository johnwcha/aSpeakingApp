import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _16c370ec = () => interopDefault(import('../pages/inspire.vue' /* webpackChunkName: "pages/inspire" */))
const _25c7d56f = () => interopDefault(import('../pages/inst/class.vue' /* webpackChunkName: "pages/inst/class" */))
const _ed3bbe24 = () => interopDefault(import('../pages/inst/manageSpeaking.vue' /* webpackChunkName: "pages/inst/manageSpeaking" */))
const _498b5960 = () => interopDefault(import('../pages/inst/profile.vue' /* webpackChunkName: "pages/inst/profile" */))
const _e0e6442e = () => interopDefault(import('../pages/user/account.vue' /* webpackChunkName: "pages/user/account" */))
const _61880e98 = () => interopDefault(import('../pages/user/class.vue' /* webpackChunkName: "pages/user/class" */))
const _2a78ee44 = () => interopDefault(import('../pages/user/speaking.vue' /* webpackChunkName: "pages/user/speaking" */))
const _5943b0fc = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

// TODO: remove in Nuxt 3
const emptyFn = () => {}
const originalPush = Router.prototype.push
Router.prototype.push = function push (location, onComplete = emptyFn, onAbort) {
  return originalPush.call(this, location, onComplete, onAbort)
}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: decodeURI('/'),
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/inspire",
    component: _16c370ec,
    name: "inspire"
  }, {
    path: "/inst/class",
    component: _25c7d56f,
    name: "inst-class"
  }, {
    path: "/inst/manageSpeaking",
    component: _ed3bbe24,
    name: "inst-manageSpeaking"
  }, {
    path: "/inst/profile",
    component: _498b5960,
    name: "inst-profile"
  }, {
    path: "/user/account",
    component: _e0e6442e,
    name: "user-account"
  }, {
    path: "/user/class",
    component: _61880e98,
    name: "user-class"
  }, {
    path: "/user/speaking",
    component: _2a78ee44,
    name: "user-speaking"
  }, {
    path: "/",
    component: _5943b0fc,
    name: "index"
  }],

  fallback: false
}

export function createRouter () {
  return new Router(routerOptions)
}
