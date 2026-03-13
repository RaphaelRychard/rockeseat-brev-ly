import type { FastifyInstance } from 'fastify'
import { hasZodFastifySchemaValidationErrors } from 'fastify-type-provider-zod'

import { BadRequestError } from './_errors/bad-request-error'
import { UnauthorizedError } from './_errors/unauthorized-error'

type FastifyErrorHandler = FastifyInstance['errorHandler']

export const fastifyErrorHandler: FastifyErrorHandler = (error, _, reply) => {
  console.log(error);
  
  if (hasZodFastifySchemaValidationErrors(error)) {
    const formattedErrors: Record<string, string[]> = {}

    for (const issue of error.validation) {
      if (issue.instancePath && issue.message) {
        const fieldName = issue.instancePath.substring(1)

        if (fieldName) {
          if (!formattedErrors[fieldName]) {
            formattedErrors[fieldName] = []
          }
          formattedErrors[fieldName].push(issue.message)
        }
      }
    }

    return reply.status(400).send({
      message: 'Validation error.',
      errors: formattedErrors,
    })
  }

  if (error instanceof UnauthorizedError) {
    return reply.status(401).send({
      message: error.message,
    })
  }

  if (error instanceof BadRequestError) {
    return reply.status(404).send({
      message: error.message,
    })
  }

  return reply.status(500).send({
    message: 'Internal server error',
  })
}
