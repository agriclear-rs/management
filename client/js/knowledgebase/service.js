import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/knowledgebase',
      body,
    });
  }

  delete(id) {
    return rest.delete({
      path: `/knowledgebase/${id}`,
    });
  }

  getById(id) {
    return rest.get({
      path: `/knowledgebase/${id}`,
    });
  }

  update(id, body) {
    return rest.put({
      path: `/knowledgebase/${id}`,
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
