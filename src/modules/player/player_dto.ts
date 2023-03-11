import { MinLength } from "class-validator"
import { ObjectType, ID, Field, InputType } from "type-graphql"

@ObjectType()
export class Player {
  @Field(() => ID, { nullable: false })
  id!: number

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: false })
  position!: string

  @Field(() => String, { nullable: false })
  dateOfBirth!: string

  @Field(() => String, { nullable: false })
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
