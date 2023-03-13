import { PoolClient } from "pg"
import { query } from "../../database/db_client"
import { Competition } from "../competition/competition_dto"
import { TeamArgs } from "./team_dto"
import { escapeSingleQuote } from "../../utils/escape"
import { ApiCompetition } from "../../utils/football_api"

export async function findTeam(input: TeamArgs) {
  const result = await query(
    `select id, name, tla, address, short_name as "shortName", area_name as "areaName"
    from teams where lower(name) = $1 or lower(short_name) = $1`,
    [input.name.toLowerCase()]
  )

  return result.rows.length === 0 ? [] : result.rows[0]
}

export async function findTeamsByCompetition(competitionCode: Competition["code"]) {
  let result = await query(
    "select team_id from competition_teams where competition_id = (select id from competitions where code = $1)",
    [competitionCode]
  )

  const teamIds = result.rows.map((i) => i.team_id).join(",")
  result = await query(
    `select id, name, tla, address, short_name as "shortName", area_name as "areaName" from teams where id in (${teamIds})`
  )

  return result.rows
}

export async function insertTeams(
  dbClient: PoolClient,
  teams: ApiCompetition["teams"],
  competitionId: number
) {
  const teamValues: string[] = []
  const mappingValues: string[] = []

  for (const t of teams) {
    const name = escapeSingleQuote(t.name)
    const tla = escapeSingleQuote(t.tla)
    const short = escapeSingleQuote(t.shortName)
    const area = escapeSingleQuote(t.area.name)
    const addr = escapeSingleQuote(t.address)
    teamValues.push(`(${t.id}, '${name}', '${tla}', '${short}', '${area}', '${addr}')`)
    mappingValues.push(`(${t.id}, ${competitionId})`)
  }

  const teamArg = teamValues.join(", ")
  const mappings = mappingValues.join(", ")

  // Conflict may arise from the fact that one team may compete in multiple competitions. In such case, just ignore the duplicate.
  const insertTeamsQuery = `insert into teams(id, name, tla, short_name, area_name, address) values${teamArg} on conflict do nothing`
  const insertMappingsQuery = `insert into competition_teams(team_id, competition_id) values${mappings} on conflict do nothing`

  await dbClient.query(insertTeamsQuery)
  await dbClient.query(insertMappingsQuery)
}
