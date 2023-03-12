import { ID, ObjectType, Field, InputType } from "type-graphql"
import { Player } from "../player/player_dto"

@ObjectType()
export class Team {
  @Field(() => ID, { nullable: false })
  id!: number

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: true })
  tla!: string

  @Field(() => String, { nullable: true })
  shortName!: string

  @Field(() => String, { nullable: true })
  areaName!: string

  @Field(() => String, { nullable: true })
  address!: string

  @Field(() => [Player])
  players!: Player[]
}

@InputType()
export class TeamArgs {
  @Field(() => String, { nullable: false })
  name!: string
}
