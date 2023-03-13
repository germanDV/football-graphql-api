/**
 * Escape single quote character (') in strings that are to be inserted in Postgres.
 */
export function escapeSingleQuote(str: string): string {
  return str.replace("'", "''")
}
