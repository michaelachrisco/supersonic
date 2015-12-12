import { router } from 'supersonic'
import Container from '../app/views/container'

const routes = ((router) => {
  router.root('/', Container)

  return router._routes
})(router)

export default routes
