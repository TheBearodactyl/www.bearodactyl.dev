import { createRouter, createWebHashHistory } from 'vue-router'
import IndexView from '@/views/IndexView.vue'
import DefaultLayout from '@/components/DefaultLayout.vue'
import ReadListView from '@/views/ReadListView.vue'
import WoahView from '@/views/WoahView.vue'
import BearoView from '@/views/BearoView.vue'
import GamesView from '@/views/GamesView.vue'
import ProjectsView from '@/views/ProjectsView.vue'
import WebsiteSrcView from '@/views/WebsiteSrcView.vue'

const router = createRouter({
  history: createWebHashHistory(),
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
      ],
    },
  ],
})

export default router
