import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/farms',
      body,
    });
  }

  delete(id) {
    return rest.delete({
      path: `/farms/${id}`,
    });
  }

  getById(id) {
    return rest.get({
      path: `/farms?farmId=${id}`,
    });
  }

  getSeed(id) {
    return rest.get({
      path: `/seeds?farmId=${id}`,
    });
  }

  update(id, body) {
    return rest.put({
      path: `/farms/${id}`,
      body,
    });
  }

  getPolicy(body) {
    return rest.post({
      path: '/static/getpolicy',
      body,
    });
  }

  unassignFarmer(id, farmerId) {
    return rest.put({
      path: `/farms/${id}/removeFarmer`,
      body: {
        farmerId,
      },
    });
  }

  unassignDistributor(id, distributorId) {
    return rest.put({
      path: `/farms/${id}/removeDistributor`,
      body: {
        distributorId,
      },
    });
  }
}

export default new Service();
