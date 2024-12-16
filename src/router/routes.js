import HomeView from 'components/StarChart.vue'
import TriangleView from 'components/TriangleChart.vue'

const routes = [
  { path: '/', component: HomeView },
  { path: '/triangle', component: TriangleView },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
