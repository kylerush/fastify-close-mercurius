import { build } from '../app'
import { test } from 'tap'

test('Requests the "/" route', async t => {
  t.plan(3)
  const fastify = build()
  t.teardown(() => { fastify.close() })

  const response = await fastify.inject({
    method: 'GET',
    url: '/'
  })

  t.equal(response.statusCode, 200, 'returns a status code of 200')
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'has the right response headers')
  t.same(response.json(), { hello: 'world' }, 'has the right response body')
})

test('Queries GraphQL add', async t => {
  t.plan(3)
  const fastify = build()
  t.teardown(() => { fastify.close() })

  const response = await fastify.inject({
    method: 'GET',
    url: '/graphql',
    query: {
      query: `{add(x: 1, y: 2)}`
    }
  })
  
  t.equal(response.statusCode, 200, 'returns a status code of 200')
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'has the right response headers')
  t.same(response.json(), { data: { add: 3 } }, 'has the right response body')
})

test('Queries GraphQL user', async t => {
  t.plan(3)
  const fastify = build()
  t.teardown(() => { fastify.close() })
  const response = await fastify.inject({
    method: 'GET',
    url: '/graphql',
    query: {
      query: `{user(ID: "3b48133b-e28a-4746-b72e-d673471d1f44"){ first_name }}`
    }
  })
  t.equal(response.statusCode, 200, 'returns a status code of 200')
  t.equal(response.headers['content-type'], 'application/json; charset=utf-8', 'has the right response headers')
  t.same(response.json(), { data: { user: { first_name: 'Kyle' } } }, 'has the right response body')
})