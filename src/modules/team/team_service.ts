import { PoolClient } from "pg"
import { query } from "../../database/db_client"
import { ApiCompetition } from "../../utils/football_api"
import { Competition } from "../competition/competition_dto"
import { TeamArgs } from "./team_dto"

export async function findTeam(input: TeamArgs) {
  const searchName = input.name.toLowerCase()
  const result = await query(
    `select id, name, tla, address, short_name as "shortName", area_name as "areaName"
    from teams where lower(name) = $1 or lower(short_name) = $1`,
    [searchName]
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
  for (const team of teams) {
    await dbClient.query(
      // Conflict may arise from the fact that one team may compete in multiple competitions. In such case, just ignore the duplicate.
      "insert into teams(id, name, tla, short_name, area_name, address) values($1, $2, $3, $4, $5, $6) on conflict do nothing",
      [team.id, team.name, team.tla, team.shortName, team.area.name, team.address]
    )

    await dbClient.query("insert into competition_teams(team_id, competition_id) values($1, $2)", [
      team.id,
      competitionId,
    ])
  }
}
