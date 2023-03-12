import fs from "node:fs/promises"
import path from "node:path"
import axios from "axios"

export type ApiCompetition = {
  count: number
  competition: {
    id: number
    name: string
    code: string
  }
  teams: Array<{
    area: {
      name: string
    }
    id: number
    name: string
    shortName: string
    tla: string
    address: string
    squad: Array<{
      id: number
      name: string
      position: string
      dateOfBirth: string
      nationality: string
    }>
  }>
}

export async function fetchCompetition(leagueCode: string) {
  return axios<ApiCompetition>({
    method: "GET",
    url: `http://api.football-data.org/v4/competitions/${leagueCode.toUpperCase()}/teams`,
    headers: {
      "X-Auth-Token": process.env.API_TOKEN,
    },
  })
}
// export async function fetchCompetition(leagueCode: string): Promise<{ data: ApiCompetition }> {
//   const mockRespFile = path.resolve(__dirname, "..", "database", "resp.json")
//   const mockData = await fs.readFile(mockRespFile, { encoding: "utf-8" })
//   return { data: JSON.parse(mockData) }
// }
