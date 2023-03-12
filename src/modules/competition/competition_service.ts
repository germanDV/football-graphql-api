import { PoolClient } from "pg"
import { Competition, ImportCompetitionInput } from "./competition_dto"
import { insertTeams } from "../team/team_service"
import { fetchCompetition, ApiCompetition } from "../../utils/football_api"
import { getClient, query } from "../../database/db_client"
import { insertTeamsPlayers } from "../player/player_service"

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

async function insertCompetition(dbClient: PoolClient, competition: ApiCompetition["competition"]) {
  return dbClient.query("insert into competitions(id, name, code) values($1, $2, $3)", [
    competition.id,
    competition.name,
    competition.code,
  ])
}

/**
 * Fetches competition data from 3rd party API and inserts competition, team
 * and players information in database.
 *
 * It throws if an already-imported competition tries to be re-imported.
 */
export async function importCompetition(input: ImportCompetitionInput) {
  // Check if competition has already been imported; if so, throw an error.
  let resp = await query("select count(*) from competitions where code = $1", [
    input.leagueCode.toUpperCase(),
  ])
  if (resp.rows[0].count > 0) {
    throw new Error("AlreadyImported")
  }

  // Fetch data from API.
  const { data } = await fetchCompetition(input.leagueCode)

  // Make all inserts in a transaction to ensure data integrity.
  const dbClient = await getClient()
  try {
    await dbClient.query("BEGIN")
    await insertCompetition(dbClient, data.competition)
    await insertTeams(dbClient, data.teams, data.competition.id)
    await insertTeamsPlayers(dbClient, data.teams)
    await dbClient.query("COMMIT")
    return data.competition
  } catch (err) {
    console.log("Rolling back because of:", err)
    await dbClient.query("ROLLBACK")
    throw err
  } finally {
    dbClient.release()
  }
}

export async function findCompetitions() {
  return MOCKS
}
