import { db } from '@/infra/db'
import { schema } from '@/infra/db/schemas'
import { type Either, makeLeft, makeRight } from '@/infra/shared/either'
import { eq, sql } from 'drizzle-orm'
import { z } from 'zod'
import { ShortLinkNotFound } from './errors/short-link-not-found'

const redirectShortLinkInput = z.object({
  shortLink: z.string(),
})

type RedirectShortLinkInput = z.input<typeof redirectShortLinkInput>

type RedirectShortLinkOutput = {
  url: string
}

export async function redirectShortLink(
  input: RedirectShortLinkInput,
): Promise<Either<ShortLinkNotFound, RedirectShortLinkOutput>> {
  const { shortLink } = redirectShortLinkInput.parse(input)

  const [shortLinkRecord] = await db
    .select()
    .from(schema.shortLinks)
    .where(eq(schema.shortLinks.shortLink, shortLink))

  if (!shortLinkRecord) {
    return makeLeft(new ShortLinkNotFound())
  }

  await db
    .update(schema.shortLinks)
    .set({
      accessCount: sql`${schema.shortLinks.accessCount} + 1`,
    })
    .where(eq(schema.shortLinks.id, shortLinkRecord.id))

  return makeRight({ url: shortLinkRecord.originUrl })
}