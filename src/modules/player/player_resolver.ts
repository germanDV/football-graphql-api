import { Resolver, Arg, Query } from "type-graphql"
import { ApolloError } from "apollo-server-core"
import { Player, PlayerArgs } from "./player_dto"
import { findPlayersByCompetition } from "./player_service"

@Resolver(() => Player)
class PlayerResolver {
  @Query(() => [Player])
  async players(@Arg("input") input: PlayerArgs) {
    try {
      return findPlayersByCompetition(input)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new ApolloError(
        err?.message || `Error finding players for competition ${input.leagueCode}`
      )
    }
  }
}

export default PlayerResolver
