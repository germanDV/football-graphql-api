import { Resolver, Arg, Query } from "type-graphql"
import { ApolloError } from "apollo-server-core"
import { Player, PlayerArgs } from "./player_dto"
import { findPlayersByCompetition } from "./player_service"

@Resolver(() => Player)
class PlayerResolver {
  @Query(() => [Player])
  async players(@Arg("input") input: PlayerArgs) {
    try {
      // TODO: throw error if `input.leagueCode` is not in the DB.
      return findPlayersByCompetition(input)
    } catch (err: any) {
      throw new ApolloError(
        err?.message || `Error finding players for competition ${input.leagueCode}`
      )
    }
  }
}

export default PlayerResolver
