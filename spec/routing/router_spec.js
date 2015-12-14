import { expect } from '../spec_helper'
import Router from '../../core/routing/router'

describe('Router', () => {
  describe('#route', () => {
    let router

    beforeEach(() => {
      router = new Router()
    })

    it('should add routes to the route object', () => {
      let expected = {
        path: '/',
        component: 'App',
        childRoutes: [
          { path: 'foo', component: 'Foo', onEnter: function(){} },
          { path: 'bar', component: 'Bar', onEnter: function(){} }
        ]
      }

      let routes = ((router) => {
        router.root('/', 'App')
        router.route('foo', 'Foo')
        router.route('bar', 'Bar')

        return router._routes
      })(router)

      expect(routes).to.equal(expected)
    })

    it('should properly handle nested components', () => {
      let expected = {
        path: '/',
        component: 'App',
        childRoutes: [
          {
            path: 'foo',
            component: 'Foo',
            childRoutes: [
              { path: 'bar', component: 'Bar' }
            ]
          },
          { path: 'baz', component: 'Baz' }
        ]
      }

      let routes = ((router) => {
        router.root('/', 'App')
        router.route('foo', 'Foo', (router) => (
          router.route('bar', 'Bar')
        ))
        router.route('baz', 'Baz')

        return router._routes
      })(router)

      expect(routes).to.eql(expected)
    })

    it('should handle deeply nested components', () => {
      let expected = {
        path: '/',
        component: 'App',
        childRoutes: [
          {
            path: 'foo',
            component: 'Foo',
            childRoutes: [
              { 
                path: 'bar',
                component: 'Bar',
                childRoutes: [
                  { path: 'baz', component: 'Baz' }
                ]
              }
            ]
          }
        ]
      }

      let routes = ((router) => {
        router.root('/', 'App')
        router.route('foo', 'Foo', (router) => (
          router.route('bar', 'Bar', (router) => (
            router.route('baz', 'Baz')
          ))
        ))

        return router._routes
      })(router)

      expect(routes).to.eql(expected)
    })

    it('should handle multiple routes in a nesting', () => {
      let expected = {
        path: '/',
        component: 'App',
        childRoutes: [
          {
            path: 'foo',
            component: 'Foo',
            childRoutes: [
              { path: 'bar', component: 'Bar' },
              { path: 'baz', component: 'Baz' }
            ]
          }
        ]
      }

      let routes = ((router) => {
        router.root('/', 'App')
        router.route('foo', 'Foo', (router) => {
          router.route('bar', 'Bar')
          router.route('baz', 'Baz')

          return router._routes
        })

        return router._routes
      })(router)

      expect(routes).to.eql(expected)
    })
  })
})
