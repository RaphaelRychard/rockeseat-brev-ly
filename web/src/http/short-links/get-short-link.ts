import { api } from "../api-client"

interface GetShortLinkResponse {
  originUrl: string
}

export async function getShortLink(shortLink: string) {
  return api.get(`short-link/${shortLink}`).json<GetShortLinkResponse>()
}