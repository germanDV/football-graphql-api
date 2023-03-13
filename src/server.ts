import { ApolloServer } from "apollo-server-fastify"
import { ApolloServerPlugin } from "apollo-server-plugin-base"
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core"
import fastify, { FastifyInstance } from "fastify"
import { buildSchema } from "type-graphql"
import CompetitionResolver from "./modules/competition/competition_resolver"
import TeamResolver from "./modules/team/team_resolver"
import PlayerResolver from "./modules/player/player_resolver"

const app = fastify({ logger: true })

/** Stop Fastify app when Apollo server is stopped. */
function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close()
        },
      }
    },
  }
}

/** Set HTTP error code in responses if we have a GraphQL error */
const setHttpErrorCodes: ApolloServerPlugin = {
  async requestDidStart() {
    return {
      async willSendResponse({ response }) {
        if (response && response.http && response.errors && response.errors.length > 0) {
          switch (response.errors[0].extensions?.code) {
            case "BAD_USER_INPUT":
            case "GRAPHQL_VALIDATION_FAILED":
              response.http.status = 400
              break
            case "UNAUTHENTICATED":
              response.http.status = 401
              break
            case "FORBIDDEN":
              response.http.status = 403
              break
            default:
              if (response.errors[0].extensions?.exception?.kind) {
                switch (response.errors[0].extensions?.exception?.kind) {
                  case "TooManyRequestsError":
                    response.http.status = 429
                    break
                  case "CompetitionNotFound":
                  case "CompetitionOrTeamNotFound":
                    response.http.status = 404
                    break
                  default:
                    response.http.status = 500
                }
              } else {
                response.http.status = 500
              }
          }
        }
      },
    }
  },
}

export async function createServer() {
  const schema = await buildSchema({
    validate: { forbidUnknownValues: false },
    resolvers: [CompetitionResolver, TeamResolver, PlayerResolver],
  })

  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      setHttpErrorCodes,
      ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
    ],
  })

  return { app, server }
}
