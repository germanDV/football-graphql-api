import { PoolClient } from "pg"
import { query } from "../../database/db_client"
import { PlayerArgs } from "./player_dto"
import { ApiCompetition } from "../../utils/football_api"
import { escapeSingleQuote } from "../../utils/escape"

export async function findPlayersByTeam(teamId: number) {
  let result = await query("select distinct(player_id) from team_players where team_id = $1", [
    teamId,
  ])

  const playerIds = result.rows.map((i) => i.player_id).join(",")
  result = await query(
    `select id, name, position, dob as "dateOfBirth", nationality from players where id in (${playerIds})`
  )

  return result.rows
}

export async function findPlayersByCompetition(input: PlayerArgs) {
  let text = ""
  let args: string[] = []
  if (input.teamName) {
    text = `select team_id from competition_teams
      where competition_id = (select id from competitions where code = $1)
      and team_id = (select id from teams where lower(name) = $2 or lower(short_name) = $2)`
    args = [input.leagueCode, input.teamName.toLowerCase()]
  } else {
    text =
      "select team_id from competition_teams where competition_id = (select id from competitions where code = $1)"
    args = [input.leagueCode]
  }

  let result = await query(text, args)
  if (result.rows.length === 0) {
    if (!input.teamName) {
      throw new Error(`League "${input.leagueCode}" not found in database`)
    } else {
      throw new Error(
        `League "${input.leagueCode}" not found in database or team "${input.teamName}" does not belong to said league.`
      )
    }
  }

  const teamIds = result.rows.map((i) => i.team_id).join(",")
  result = await query(`select distinct(player_id) from team_players where team_id in (${teamIds})`)

  const playerIds = result.rows.map((i) => i.player_id).join(",")
  result = await query(
    `select id, name, position, dob as "dateOfBirth", nationality from players where id in (${playerIds})`
  )

  return result.rows
}

export async function insertTeamsPlayers(dbClient: PoolClient, teams: ApiCompetition["teams"]) {
  const playerValues: string[] = []
  const mappingValues: string[] = []

  for (const t of teams) {
    for (const p of t.squad) {
      const name = escapeSingleQuote(p.name)
      const nation = escapeSingleQuote(p.nationality)
      playerValues.push(`(${p.id}, '${name}', '${p.position}', '${p.dateOfBirth}', '${nation}')`)
      mappingValues.push(`(${p.id}, ${t.id})`)
    }
  }

  const players = playerValues.join(", ")
  const mappings = mappingValues.join(", ")

  // Conflict may arise from the fact that one player could play for multiple teams in the span of a season.
  const insertPlayersQuery = `insert into players(id, name, position, dob, nationality) values${players} on conflict do nothing`
  const insertMappingsQuery = `insert into team_players(player_id, team_id) values${mappings} on conflict do nothing`

  await dbClient.query(insertPlayersQuery)
  await dbClient.query(insertMappingsQuery)
}
