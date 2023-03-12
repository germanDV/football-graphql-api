import { MinLength } from "class-validator"
import { ObjectType, ID, Field, InputType } from "type-graphql"

@ObjectType()
export class Player {
  @Field(() => ID, { nullable: false })
  id!: number

  @Field(() => String, { nullable: true })
  name!: string

  @Field(() => String, { nullable: true })
  position!: string

  @Field(() => String, { nullable: true })
  dateOfBirth!: string

  @Field(() => String, { nullable: true })
  nationality!: string
}

@InputType()
export class PlayerArgs {
  @Field(() => String, { nullable: false })
  @MinLength(2)
  leagueCode!: string

  @Field(() => String, { nullable: true })
  teamName!: string
}
