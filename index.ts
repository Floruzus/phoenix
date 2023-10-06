import { bootPhoenix } from "./src/Phoenix"
import { InvalidArgumentError } from "./src/errors"

const AVAILABLE_ARGS: string[] = ["port"]

const args: { [key in (typeof AVAILABLE_ARGS)[number]]: string | number | boolean } = {
  port: 5353
}

export function getArgs<T extends string | number | boolean>(key: string): T {
  return args[key] as T
}

function parseArgv() {
  for (const arg of process.argv.slice(2)) {
    const [k, v] = arg.split("=")

    if (!AVAILABLE_ARGS.includes(k)) {
      throw new InvalidArgumentError(`Invalid options "${k}", options available: ${AVAILABLE_ARGS.join(" ,")}"`)
    }

    switch (typeof v) {
      case "number":
        args[k] = Number(v)
        break
      case "string":
        if (v === "true" || v === "false") {
          args[k] = v === "true"
        } else {
          args[k] = v
        }
        break
      default:
        args[k] = v
    }
  }
}

parseArgv()

bootPhoenix()
