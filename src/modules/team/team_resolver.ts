import { Arg, Query, Resolver, Root, FieldResolver } from "type-graphql"
import { ApolloError, UserInputError } from "apollo-server-core"
import { Team, TeamArgs } from "./team_dto"
import { findTeam } from "./team_service"
import { findPlayersByTeam } from "../player/player_service"

@Resolver(() => Team)
class TeamResolver {
  @Query(() => Team)
  async team(@Arg("input") input: TeamArgs) {
    try {
      return findTeam(input)
    } catch (err: any) {
      if (err?.message === "team not found") {
        throw new UserInputError(`Team ${input.name} has not been found`)
      }
      throw new ApolloError(err?.message || `Error searching team ${input.name}`)
    }
  }

  @FieldResolver()
  async players(@Root() team: Team) {
    return findPlayersByTeam(team.id)
  }
}

export default TeamResolver
