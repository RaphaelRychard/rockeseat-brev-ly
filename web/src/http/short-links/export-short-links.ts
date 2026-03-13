import { api } from "../api-client"

export interface ExportShortLinksResponse {
  reportUrl: string
}

export async function exportShortLinks() {
  const result = await api
    .post("short-link/exports")
    .json<ExportShortLinksResponse>()

  return result
}