import 'dotenv/config'
import fastify from 'fastify'
import { GraphQLObjectType } from 'graphql'
import mercurius, { MercuriusContext } from 'mercurius'
import type { ClientConfig } from 'pg'
import pg from '@fastify/postgres'

const port =  typeof process.env.PGPORT === 'string' ? process.env.PGPORT : ''

const pgConfig: ClientConfig = {
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: parseInt(port)
}

interface addArgs {
  x: number
  y: number
}

interface userArgs {
  ID: string
}

const schema = `
  type User {
    first_name: String!
  }
  type Query {
    add(x: Int, y: Int): Int
    user(ID: ID): User!
  }
`

const resolvers = {
  Query: {
    add: async (_: GraphQLObjectType, { x, y }: addArgs) => x + y,
    user: async(_parent: GraphQLObjectType, args: userArgs, context: MercuriusContext) => {
      const { app } = context
      const { ID } = args
      const client = await app.pg.connect()
      const query = `SELECT first_name FROM "user" WHERE uuid = '${ID}'`
      const data = await client.query(query)
      client.release()
      return data.rows[0]
    }
  }
}

function build(opts={}) {
  const app = fastify(opts)
  app.register(pg)
  app.register(mercurius, {
    schema,
    resolvers,
    graphiql: true
  })
  app.get('/', async function (request, reply) {
    return { hello: 'world' }
  })
  return app
}

export { build }