import axios from "axios"

type ApiCompetition = {
  count: number
  competition: {
    id: number
    name: string
    code: string
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
