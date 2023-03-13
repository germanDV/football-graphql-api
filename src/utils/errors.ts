export class TooManyRequestsError extends Error {
  kind: string
  constructor() {
    super("too many requests")
    this.kind = "TooManyRequestsError"
  }
}

export class AlreadyImportedError extends Error {
  kind: string
  constructor(leagueCode: string) {
    super(`league "${leagueCode}" has already been imported`)
    this.kind = "AlreadyImportedError"
  }
}

export class CompetitionNotFound extends Error {
  kind: string
  constructor(leagueCode: string) {
    super(`league "${leagueCode}" not found in the database`)
    this.kind = "CompetitionNotFound"
  }
}

export class CompetitionOrTeamNotFound extends Error {
  kind: string
  constructor(leagueCode: string, teamName: string) {
    super(
      `league "${leagueCode}" not found in the database or team "${teamName}" does not belong to said league`
    )
    this.kind = "CompetitionOrTeamNotFound"
  }
}
