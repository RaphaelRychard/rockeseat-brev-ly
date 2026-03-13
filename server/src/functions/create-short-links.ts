import { z } from 'zod/v4'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'

import { createId } from '@paralleldrive/cuid2'
import { eq } from 'drizzle-orm'

import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'

import { ShortLinkAlreadyExists } from './errors/short-link-already-exists'

const createShortLinkInput = z.object({
  originUrl: z.string(),
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
})

type CreateShortLinkInput = z.input<typeof createShortLinkInput>

export async function createShortLink(
  input: CreateShortLinkInput,
): Promise<Either<ShortLinkAlreadyExists, { id: string }>> {
  const { originUrl, shortLink } = createShortLinkInput.parse(input)

  const normalizedShortUrl = shortLink.toLowerCase()

  const [existingShortUrl] = await db
    .select()
    .from(schema.shortLinks)
    .where(eq(schema.shortLinks.shortLink, normalizedShortUrl))

  if (existingShortUrl) {
    return makeLeft(new ShortLinkAlreadyExists(normalizedShortUrl))
  }

  const [result] = await db
    .insert(schema.shortLinks)
    .values({
      id: createId(),
      originUrl,
      shortLink: normalizedShortUrl,
      accessCount: 0,
    })
    .returning({ id: schema.shortLinks.id })

  return makeRight({ id: result.id })
}
