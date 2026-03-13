import { api } from "../api-client"

interface CreateShortLinkRequest {
  originUrl: string
  shortLink: string
}

interface CreateShortLinkResponse {
  id: string
}

export async function createShortLink({ originUrl, shortLink }: CreateShortLinkRequest) {
  return api
    .post("short-links", {
      json: { originUrl, shortLink },
    })
    .json<CreateShortLinkResponse>()
}