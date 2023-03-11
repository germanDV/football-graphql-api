import "reflect-metadata"
import * as dotenv from "dotenv"
import { createServer } from "./server"

dotenv.config()

const PORT = Number(process.env.PORT) || 4040

async function main() {
  const { app, server } = await createServer()

  app.get("/healthcheck", async () => "OK")

  await server.start()

  app.register(server.createHandler())

  await app.listen({ port: PORT })
  console.log(`Server up at http://localhost:${PORT}${server.graphqlPath}`)
}

main().catch((err) => console.log("Error in main()!", err))
