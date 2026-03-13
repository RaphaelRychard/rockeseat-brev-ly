import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { redirectShortLink } from '@/functions/redirect-short-link'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const redirectShortLinkRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/:shortLink',
    {
      schema: {
        tags: ['short-links'],
        summary: 'Redirect to original URL and increment access count',
        params: z.object({
          shortLink: z.string(),
        }),
        response: {
          302: z.any(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortLink } = request.params

      const result = await redirectShortLink({
        shortLink
      })

      if (isRight(result)) {
        const { url } = unwrapEither(result)

        return reply.redirect(url)
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortLinkNotFound':
          return reply.status(404).send({ message: error.message })
      }
    },
  )
}