import { Competition } from "../competition/competition_dto"
import { Team, TeamArgs } from "./team_dto"

const MOCKS: Team[] = [
  {
    id: 57,
    areaName: "England",
    name: "Arsenal FC",
    shortName: "Arsenal",
    tla: "ARS",
    address: "75 Drayton Park London N5 1BU",
  },
  {
    id: 58,
    areaName: "England",
    name: "Aston Villa FC",
    shortName: "Aston Villa",
    tla: "AVL",
    address: "Villa Park Birmingham B6 6HE",
  },
  {
    id: 1,
    areaName: "Argentina",
    name: "Club Atlético Independiente",
    shortName: "Independiente",
    tla: "IND",
    address: "Avellaneda Papá",
  },
]

const MAPPING = [
  { teamTLA: "IND", competitionCode: "ASL" },
  { teamTLA: "ARS", competitionCode: "PL" },
  { teamTLA: "AVL", competitionCode: "PL" },
]

export async function findTeam(input: TeamArgs) {
  const nameLower = input.name.toLowerCase()
  const team = MOCKS.find(
    (i) => i.name.toLowerCase() === nameLower || i.shortName.toLowerCase() === nameLower
  )
  if (!team) throw new Error("team not found")
  return team
}

export async function findTeamsByCompetition(competitionCode: Competition["code"]) {
  const teamTLAs = MAPPING.filter((i) => i.competitionCode === competitionCode.toUpperCase())
  const teams: Team[] = []

  teamTLAs.forEach((t) => {
    const team = MOCKS.find((i) => i.tla === t.teamTLA)
    if (team) teams.push(team)
  })

  return teams
}
