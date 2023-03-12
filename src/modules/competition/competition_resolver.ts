import { Query, Mutation, Resolver, Arg, FieldResolver, Root } from "type-graphql"
import { ApolloError, UserInputError } from "apollo-server-core"
import { Competition, ImportCompetitionInput } from "./competition_dto"
import { importCompetition, findCompetitions } from "./competition_service"
import { findTeamsByCompetition } from "../team/team_service"

@Resolver(() => Competition)
class CompetitionResolver {
  // TODO: rate limit these requests to 10 per minute max.
  @Mutation(() => Competition)
  async importLeague(@Arg("input") input: ImportCompetitionInput) {
    try {
      const competition = await importCompetition(input)
      return competition
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
