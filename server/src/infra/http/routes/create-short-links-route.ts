import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod/v4'

import { createShortLink } from '@/functions/create-short-links'
import { isRight, unwrapEither } from '@/infra/shared/either'

export const createShortLinksRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/short-links',
    {
      schema: {
        tags: ['short-links'],
        summary: 'Create a new short link',
        body: z.object({
          originUrl: z.url(),
          shortLink: z
            .string()
            .min(4)
            .max(20)
            .regex(
              /^[a-zA-Z0-9-_]+$/,
              'Pode conter letras, números, hífen e underline (sem espaços ou acentuação)',
            )
            .describe(
              'Slug da URL encurtada. Pode conter letras, números, hífen e underline, entre 4 e 20 caracteres.',
            ),
        }),
        response: {
          201: z.object({ id: z.cuid2() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { originUrl, shortLink } = request.body

      const result = await createShortLink({
        originUrl,
        shortLink
      })

      if (isRight(result)) {
        const { id } = unwrapEither(result)

        return reply.status(201).send({ id })
      }

      const error = unwrapEither(result)

      switch (error.constructor.name) {
        case 'ShortLinkAlreadyExists':
          return reply.status(409).send({ message: error.message })
      }
    },
  )
}
