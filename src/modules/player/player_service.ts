import { findTeamsByCompetition } from "../team/team_service"
import { Player, PlayerArgs } from "./player_dto"

const MOCKS: Player[] = [
  {
    id: 3141,
    name: "Emiliano Martínez",
    position: "Goalkeeper",
    dateOfBirth: "1992-09-02",
    nationality: "Argentina",
  },
  {
    id: 3883,
    name: "Jed Steer",
    position: "Goalkeeper",
    dateOfBirth: "1992-09-23",
    nationality: "England",
  },
  {
    id: 15512,
    name: "Robin Olsen",
    position: "Goalkeeper",
    dateOfBirth: "1990-01-08",
    nationality: "Sweden",
  },
  {
    id: 3317,
    name: "Ashley Young",
    position: "Defence",
    dateOfBirth: "1985-07-09",
    nationality: "England",
  },
  {
    id: 10,
    name: "Bochini",
    position: "Diez",
    dateOfBirth: "1955-07-09",
    nationality: "Argentina",
  },
  {
    id: 6,
    name: "Gabriel Milito",
    position: "Defence",
    dateOfBirth: "1985-07-09",
    nationality: "Argentina",
  },
]

const MAPPING = [
  { playerId: 3141, teamId: 58 },
  { playerId: 3883, teamId: 58 },
  { playerId: 15512, teamId: 58 },
  { playerId: 3317, teamId: 57 },
  { playerId: 10, teamId: 1 },
  { playerId: 6, teamId: 1 },
]

export async function findPlayersByCompetition(input: PlayerArgs) {
  let teams = await findTeamsByCompetition(input.leagueCode)

  if (input.teamName) {
    teams = teams.filter(
      (i) =>
        i.name.toLowerCase() === input.teamName.toLowerCase() ||
        i.shortName.toLowerCase() === input.teamName.toLowerCase()
    )
  }

  const playerIds: number[] = []
  teams.forEach((t) => {
    const mappings = MAPPING.filter((i) => i.teamId === t.id)
    mappings.forEach((i) => playerIds.push(i.playerId))
  })

  const players: Player[] = []
  playerIds.forEach((id) => {
    const player = MOCKS.find((i) => i.id === id)
    if (player) players.push(player)
  })

  return players
}
