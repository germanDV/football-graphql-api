import { ID, ObjectType, Field, InputType } from "type-graphql"

@ObjectType()
export class Team {
  @Field(() => ID, { nullable: false })
  id!: number

  @Field(() => String, { nullable: false })
  name!: string

  @Field(() => String, { nullable: false })
  tla!: string

  @Field(() => String, { nullable: false })
  shortName!: string

  @Field(() => String, { nullable: false })
  areaName!: string

  @Field(() => String, { nullable: false })
  address!: string
}

@InputType()
export class TeamArgs {
  @Field(() => String, { nullable: false })
  name!: string
}
