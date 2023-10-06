export function log(message: string) {
  console.log(tagToAnsi(message))
}

function tagToAnsi(string: string): string {
  const resetAll = "\x1b[0m"

  string = string
    .replaceAll("<error>", "\x1b[31m")
    .replaceAll("<success>", "\x1b[32m")
    .replaceAll("<warning>", "\x1b[33m")
    .replaceAll("<info>", "\x1b[34m")
    .replaceAll("<strong>", "\x1b[1m")
    .replaceAll("</error>", "")
    .replaceAll("</success>", "")
    .replaceAll("</warning>", "")
    .replaceAll("</info>", "")
    .replaceAll("</strong>", "\x1b[22m")

  return `${string}${resetAll}`
}
