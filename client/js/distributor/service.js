import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/distributors',
      body,
    });
  }

  delete(id) {
    return rest.delete({
      path: `/distributors/${id}`,
    });
  }

  getById(id) {
    return rest.get({
      path: `/distributors/${id}`,
    });
  }

  update(id, body) {
    return rest.put({
      path: `/distributors/${id}`,
      body,
    });
  }

  getPolicy(body) {
    return rest.post({
      path: '/static/getpolicy',
      body,
    });
  }
}

export default new Service();
