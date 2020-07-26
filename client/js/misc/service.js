import config from "../config";
import { REST } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  async getStaticData(body) {
    if (!RSapp.staticData)
      RSapp.staticData = await rest.get({
        path: `/static/all`,
        body
      });
    return RSapp.staticData;
  }
}

export default new Service();
