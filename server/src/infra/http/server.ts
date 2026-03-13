import { fastifyCors } from '@fastify/cors'
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { fastify } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

import { env } from '../../env'
import { fastifyErrorHandler } from './fastify-error-handler'
import { createShortLinksRoute } from './routes/create-short-links-route'
import { deleteShortLinksRoute } from './routes/delete-short-links-route'
import { exportShortLinksRoute } from './routes/export-short-link-routes'
import { fetchShortLinkRoute } from './routes/fetch-short-links-route'
import { getShortLinksRoute } from './routes/get-short-link-route'
import { redirectShortLinkRoute } from './routes/redirect-short-link-route'

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)
app.setErrorHandler(fastifyErrorHandler)

app.register(fastifyCors, {
  origin: true, // permite qualquer origem
  methods: ['*'],
  allowedHeaders: ['*']
})


app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Typed API',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
  routePrefix: '/docs',
})

app.register(createShortLinksRoute)
app.register(deleteShortLinksRoute)
app.register(getShortLinksRoute)
app.register(fetchShortLinkRoute)
app.register(redirectShortLinkRoute)
app.register(exportShortLinksRoute)

app.listen({ port: env.PORT, host: '0.0.0.0' }).then(() => {
  console.log('🚀 HTTP server running')
})
