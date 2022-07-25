import { build } from './app'

const fastify = build({ logger: true })

const start = async function() {
  try {
    await fastify.listen({ port: 3000 })
  } catch(error) {
    fastify.log.error(error)
    process.exit(1)
  }
}

start()
