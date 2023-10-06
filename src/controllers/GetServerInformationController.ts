import { Controller, GET } from "fastify-decorators"
import { config } from "../config"

@Controller()
export default class GetServerInformationController {
  @GET("/GetServerInformation")
  getServerInformation() {
    config<number>("database.host")
    return {
      test: "test"
    }
  }
}
