import dotenv from "dotenv"
import yaml from "js-yaml"
import fs from "fs"
import path from "path"

export class ConfigLoader {
  private readonly config

  constructor() {
    const configFilePaths = this.getConfigFilePaths()
    this.config = this.loadConfigs(configFilePaths)
  }

  private getConfigFilePaths(): string[] {
    const configDir = path.join(__dirname, "..", "..", "config")
    const files = fs.readdirSync(configDir)
    return files.map(file => path.join(configDir, file)).filter(file => file.endsWith(".yaml") || file.endsWith(".yml"))
  }

  private loadConfigs(configFilePaths: string[]) {
    const config = {}

    for (const filePath of configFilePaths) {
      const fileContents = fs.readFileSync(filePath, "utf8")
      const interpolatedContents = this.interpolateEnvVariables(fileContents)
      const loadedConfig = yaml.load(interpolatedContents) as object

      this.checkDuplicateKeys(config, loadedConfig)

      Object.assign(config, loadedConfig)
    }

    return config
  }

  private interpolateEnvVariables(contents: string): string {
    if (!fs.existsSync(".env")) {
      return contents
    }

    const envVars = dotenv.parse(fs.readFileSync(".env"))
    return contents.replace(/%env\((.+)\)%/g, (match, key) => envVars[key] || "")
  }

  private checkDuplicateKeys(existingConfig: object, newConfig: object): void {
    const existingKeys = Object.keys(existingConfig)
    const newKeys = Object.keys(newConfig)
    const duplicateKeys = existingKeys.filter(key => newKeys.includes(key))

    if (duplicateKeys.length > 0) {
      throw new Error(`Duplicate keys found in the configuration files: ${duplicateKeys.join(", ")}`)
    }
  }

  getConfig() {
    return this.config
  }
}
