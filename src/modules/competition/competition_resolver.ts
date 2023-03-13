import { Query, Mutation, Resolver, Arg, FieldResolver, Root, UseMiddleware } from "type-graphql"
import { ApolloError, UserInputError } from "apollo-server-core"
import { Competition, ImportCompetitionInput } from "./competition_dto"
import { importCompetition, findCompetitions } from "./competition_service"
import { findTeamsByCompetition } from "../team/team_service"
import { rateLimiter } from "../../utils/rate_limiter"

const IMPORT_LEAGUE_KEY = "import_league_mutation"
const REQS_PER_MINUTE = 8

@Resolver(() => Competition)
class CompetitionResolver {
  @Mutation(() => Competition)
  @UseMiddleware(rateLimiter(IMPORT_LEAGUE_KEY, REQS_PER_MINUTE))
  async importLeague(@Arg("input") input: ImportCompetitionInput) {
    try {
      const competition = await importCompetition(input)
      return competition
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      if (err?.message === "AlreadyImported") {
        throw new UserInputError(`League ${input.leagueCode} has already been imported`)
      }
      throw new ApolloError(err?.message || `Error importing league ${input.leagueCode}`)
    }
  }

  @Query(() => [Competition])
  async competitions() {
    return findCompetitions()
  }

  @FieldResolver()
  async teams(@Root() competition: Competition) {
    return findTeamsByCompetition(competition.code)
  }
}

export default CompetitionResolver
