import EventEmitter from "events"
import Fastify from "fastify"
import path from "path"
import fs from "fs"
import { getArgs } from "../index"
import { log } from "./utils/Log"
import { bootstrap } from "fastify-decorators"

const phoenix = Fastify({
  logger: true
})

class P extends EventEmitter {
  log(message: string) {
    log(message)
  }
}

export const Phoenix = new P()

export function bootPhoenix() {
  loadPlugins()

  phoenix.register(bootstrap, {
    directory: path.resolve(__dirname, `controllers`),
    mask: /Controller\./,
    prefix: "/Engine.svc"
  })

  phoenix
    .listen({ port: getArgs<number>("port") })
    .then(() => {
      Phoenix.emit("started")
    })
    .catch(err => {
      phoenix.log.error(err)
      process.exit(1)
    })
}

function loadPlugins() {
  const pluginDir = path.resolve(__dirname, "../plugins")

  if (!fs.existsSync(pluginDir)) {
    return
  }

  fs.readdirSync(pluginDir).forEach(async file => {
    if (file.endsWith("Plugin.js")) {
      const pluginPath = path.join(pluginDir, file)
      const plugin = await import(pluginPath)

      if (plugin.boot !== undefined) {
        log(`<info>Loaded plugin ${plugin.default.name} <warning>v${plugin.default.version}<info> : <success>loaded`)
        plugin.boot(Phoenix)
      } else {
        log(
          `<error>Cannot load plugin ${plugin.default.name} <warning>v${plugin.default.version}<error> : No boot function exported`
        )
      }
    }
  })
}
