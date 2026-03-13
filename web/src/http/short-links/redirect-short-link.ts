import { api } from "../api-client"

interface GetShortLinkResponse {
  originUrl: string
}

export async function redirectShortLink(shortLink: string) {
  return api.get(`/${shortLink}`).json<GetShortLinkResponse>()
}