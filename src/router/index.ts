import { createRouter, createWebHashHistory } from "vue-router"
import IndexView from "@/views/IndexView.vue"
import DefaultLayout from "@/components/DefaultLayout.vue"
import ReadListView from "@/views/ReadListView.vue"
import WoahView from "@/views/WoahView.vue"
import BearoView from "@/views/BearoView.vue"
import GamesView from "@/views/GamesView.vue"
import ProjectsView from "@/views/ProjectsView.vue"
import WebsiteSrcView from "@/views/WebsiteSrcView.vue"
import OnePieceView from "@/views/OnePieceView.vue"
import TarpitView from "@/views/TarpitView.vue"
import { makeRoute } from "@/utils/misc"

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    makeRoute("/", "index", DefaultLayout, [
      makeRoute("", "home", IndexView),
      makeRoute("/tarpit", "tarpit", TarpitView, undefined, async (to, from, next) => {
        console.log("goto robot jail >:(")
        await new Promise((resolve) => setTimeout(resolve, 60000000))
        next()
      }),
      makeRoute("/lists", "lists", undefined, [
        makeRoute("read-watch", "read-watch", ReadListView),
        makeRoute("games", "games", GamesView),
        makeRoute("projects", "projects", ProjectsView),
        makeRoute("one-piece", "one-piece", OnePieceView),
      ]),
      makeRoute("/jokes", "jokes", undefined, [
        makeRoute("woah", "woah", WoahView),
        makeRoute("bearo", "bearo", BearoView),
      ]),
      makeRoute("/website-src", "website-src", WebsiteSrcView),
      makeRoute("/misc", "misc", undefined, []),
    ]),
  ],
})

export default router
