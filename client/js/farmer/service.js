import config from "../config";
import { REST } from "rumsan-ui";

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: `/farmers`,
      body
    });
  }
  delete(id) {
    return rest.delete({
      path: `/farmers/${id}`
    });
  }
  getById(id) {
    return rest.get({
      path: `/farmers/${id}`
    });
  }
  update(id, body) {
    return rest.put({
      path: `/farmers/${id}`,
      body
    });
  }
  getPolicy(body) {
    return rest.post({
      path: `/static/getpolicy`,
      body
    });
  }
}

export default new Service();
