const c1 = () => import(/* webpackChunkName: "page--src--pages--cults-near-me-vue" */ "/Users/Elliss/Development/mixtape/src/pages/CultsNearMe.vue")
const c2 = () => import(/* webpackChunkName: "page--src--pages--about-vue" */ "/Users/Elliss/Development/mixtape/src/pages/About.vue")
const c3 = () => import(/* webpackChunkName: "page--node-modules--gridsome--app--pages--404-vue" */ "/Users/Elliss/Development/mixtape/node_modules/gridsome/app/pages/404.vue")
const c4 = () => import(/* webpackChunkName: "page--src--pages--index-vue" */ "/Users/Elliss/Development/mixtape/src/pages/Index.vue")

export default [
  {
    path: "/cults-near-me/",
    component: c1
  },
  {
    path: "/about/",
    component: c2
  },
  {
    name: "404",
    path: "/404/",
    component: c3
  },
  {
    name: "home",
    path: "/",
    component: c4
  },
  {
    name: "*",
    path: "*",
    component: c3
  }
]
