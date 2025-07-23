import { createRouter, createWebHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ReadListView from '@/views/ReadListView.vue'
import WoahView from '@/views/WoahView.vue'
import BearoView from '@/views/BearoView.vue'
import GamesView from '@/views/GamesView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import WebsiteSrcView from '@/views/WebsiteSrcView.vue'
import OnePieceView from '@/views/OnePieceView.vue'
import TarpitView from '@/views/TarpitView.vue'

const router = createRouter({
  history: createWebHistory('/bearodactyl.dev/'),
  routes: [
    {
      path: '/',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: IndexView,
          meta: {
            title: 'The Motherfucking Bearodactyl',
          },
        },
        {
          path: '/tarpit',
          name: 'tarpit',
          component: TarpitView,
          beforeEnter: async (to, from, next) => {
            console.log('goto robot jail >:(')
            await new Promise((resolve) => setTimeout(resolve, 60000000))
            next()
          },
        },
        {
          path: '/lists',
          name: 'lists',
          children: [
            {
              path: 'read-watch',
              name: 'read-watch',
              component: ReadListView,
              meta: {
                title: 'Read/Watch List',
              },
            },
            {
              path: 'games',
              name: 'games',
              component: GamesView,
            },
            {
              path: 'projects',
              name: 'projects',
              component: ProjectsView,
            },
            {
              path: 'one-piece',
              name: 'one-piece',
              component: OnePieceView,
            },
          ],
        },
        {
          path: '/jokes',
          name: 'jokes',
          children: [
            {
              path: 'woah',
              name: 'woah',
              component: WoahView,
            },
            {
              path: 'bearo',
              name: 'bearo',
              component: BearoView,
            },
          ],
        },
        {
          path: 'website-src',
          name: 'website-src',
          component: WebsiteSrcView,
        },
        {
          path: '/misc',
          name: 'misc',
          children: [],
        },
      ],
    },
  ],
})

export default router
