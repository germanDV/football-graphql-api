import { MinLength } from "class-validator"
import { ID, Field, InputType, ObjectType } from "type-graphql"
import { Team } from "../team/team_dto"

@ObjectType()
export class Competition {
  @Field(() => ID, { nullable: false })
  id!: number

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: false })
  code!: string

  @Field(() => String, { nullable: false })
  areaName!: string

  @Field(() => [Team])
  teams!: Team[]
}

@InputType()
export class ImportCompetitionInput {
  @Field({ nullable: false })
  @MinLength(2)
  leagueCode!: string
}
