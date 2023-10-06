import { ConfigLoader } from "./services/ConfigLoader"

const configLoader = new ConfigLoader()

export function config<T>(key: string): T | undefined {
  const keys = key.split(".")
  let obj = configLoader.getConfig() as never

  for (const k of keys) {
    if (k in obj) {
      obj = obj[k]
    } else {
      return undefined
    }
  }

  return obj
}
