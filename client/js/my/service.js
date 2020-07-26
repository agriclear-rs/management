import config from "../config";
import { REST } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  get() {
    return rest.request(`/my`);
  }

  addAppKeys(body) {
    return rest.post({
      path: `/my/appkeys`,
      body
    });
  }
}

export default new Service();
