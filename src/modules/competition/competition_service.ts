import { Competition, ImportCompetitionInput } from "./competition_dto"
import { fetchCompetition } from "../../utils/football_api"

const MOCKS: Partial<Competition>[] = [
  {
    id: 331,
    name: "Premier League",
    code: "PL",
    areaName: "England",
  },
  {
    id: 154,
    name: "Torne Fútbol Argentino",
    code: "ASL",
    areaName: "Argentina",
  },
]

export async function importCompetition(input: ImportCompetitionInput) {
  const { data } = await fetchCompetition(input.leagueCode)
  console.log(data)

  const comp = MOCKS.find((i) => i.code === input.leagueCode.toUpperCase())
  if (!comp) throw new Error("competition not found")
  return comp
}

export async function findCompetitions() {
  return MOCKS
}
