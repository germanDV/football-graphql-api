# Back-End Challenge

## Pre-Requisites

You will need to have the following installed to run this project:

- Node.js (I recommend the latest LTS _18.15.0_, but other versions should work fine)
- A package manager for Node. In this project I'm using _yarn_ and the examples will show _yarn_ commands, but feel free to use _npm_ or _pnpm_ if you prefer.
- Docker
- Docker Compose V2

## Run It

After cloning this repository or downloading the sources, on the root of the project, run `yarn` to install dependencies.

Make a copy of `.env.example` and name it `.env`. In a real project, you would typically need to replace the values provided in the example with real ones, but to facilitate these steps, the values in `.env.example` are good for a local development environment. For a production version of this service, it would be a severe vulnerability to expose the API_TOKEN this way.

Next, run `yarn docker:start` to start the postgres and redis containers (more on these later).

There are two ways to run the API server:

- In _dev mode_ with hot reloading: `yarn dev`
- Compile it and run the compiled JS: `yarn build && yarn start`

The server will be listening for requests on _http://localhost:4040/graphql_ by default, you can change the port with environment variables.

## Making Requests

You can visit the Apollo client at _http://localhost:4040/graphql_ in your browser. But I suggest getting started with the postman collection provided in this repo. Import it in Postman and you'll have several example requests that you can use to test the service.

## Env Vars

Environment variables are loaded from the `.env` file that you created before (by making a copy of `.env.example`).

## Technology Choices

I decided to use TypeScript because I think it provides a better developer experience, helps teams collaborate, helps keep the code clean and it helps catching some bugs at compile time rather than runtime.

When a crafting a GrpahQL service, a decission must be made between "schema first" and "code first" approaches. They both have their pros and cons, in this case, I decided to go "code first" on account of personal preference, and because it integrates a little bit better with TypeScript in my view.

I'm using Apollo Server because I think it's kind of the de factor graphql server. I'm curious to try Mercurious, having been built by the Fastify team, but I went with Apollo as it's more popular.

I chose to use Fastify as it's the fastest framework for node servers. In addition to the graphql server exposed on `/graphql`, I wanted to show how to add other routes, which I did with Fastify. As an example, I created a `/healthcheck` endpoint.

PostgreSQL has been chosen as database because it's a well-known, production-tested, feature-rich database that is widely used.

Relational databases are harder to scale than no-relational ones, but there are some effective techniques that could be implemented should the need arise. By the nature of this service, it would like be read-heavy more than write-heavy, for such case, a cache or read replicas or a combination of both could be used to accomodate larger traffic.

There are some many-to-many relationships in this schema, when that happens and queries tend to aggregate information from different tables, relational databases will be more performant than NoSQL.

## 3rd Party API

This service ingests information from a rate-limited 3rd party API. To avoid hitting such limit, I added a middleware to the mutation. It is set to 8 requests per minute, after that, you will see a "too many requests" error.

To implement said middleware, I used redis, so that the limit count does not live in the service memory, and potentially we could spin up multiple servers and they would share the same limiter.

## Contributing

I included an `engines` key in _package.json_ noting the _node_ version used in the project. It is not enforced because the service is likely to work with many other versions, but, ideally anyone contributing to the project should use the same version.

Before commiting your changes, please run:

- `yarn fmt` to format the code using prettier
- `yarn lint` to lint the code using eslint

I haven't done it for this excercise, but typically I would add a git pre-commit hook to automatically run the two scripts above automatically.

## Notes On Requirements

The requirements mention that I should use _coaches_ instead of _players_ should the latter not be available at the moment of the implementation. As I'm writing this, _players_ are available, so I have used them instead of _coaches_.

According to the requirements, we should gather the _areaName_ for the _Competition_. I intentionally left this information out because it would require an additional request and the limits for the API's free account are too low. The endpoint `http://api.football-data.org/v4/competitions/:code/teams` does not provide the _area_ information, but it provides all other information required; so, with the limits being so low, I decided it was not worth it to make another request to `http://api.football-data.org/v4/competitions/:code` just to get the area. In a real application, the additional request wouldn't be a problem because we would surely have higher limits.
