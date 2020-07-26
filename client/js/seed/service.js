import { REST } from 'rumsan-ui';
import config from '../config';

const rest = new REST({ url: config.apiPath, debugMode: config.debugMode });

class Service {
  add(body) {
    return rest.post({
      path: '/seeds',
      body,
    });
  }

  delete(id) {
    return rest.delete({
      path: `/seeds/${id}`,
    });
  }

  getById(id) {
    return rest.get({
      path: `/seeds?seedId=${id}`,
    });
  }

  update(id, body) {
    return rest.put({
      path: `/seeds/${id}`,
      body,
    });
  }

  getPolicy(body) {
    return rest.post({
      path: '/static/getpolicy',
      body,
    });
  }

  addComment(id, question, comment, userType) {
    return rest.post({
      path: '/comments',
      body: {
        seed: id,
        question,
        comment,
        userType,
      },
    });
  }

  getComments(id) {
    return rest.get({
      path: `/comments?seed=${id}`,
    });
  }

  getSeeds(farmId) {
    return rest.get({
      path: `/seeds?farmId=${farmId}`,
    });
  }

  updateStatus(id) {
    return rest.put({
      path: `/comments/${id}`,
    });
  }

  updateFarmer(id, farmerId) {
    return rest.put({
      path: `/seeds/${id}/addFarmer`,
      body: {
        farmerId,
      },
    });
  }

  updateDistributor(id, distributorId) {
    return rest.put({
      path: `/seeds/${id}/addDistributor`,
      body: {
        distributorId,
      },
    });
  }

  unassignFarmer(id, farmerId) {
    return rest.put({
      path: `/seeds/${id}/removeFarmer`,
      body: {
        farmerId,
      },
    });
  }

  unassignDistributor(id, distributorId) {
    return rest.put({
      path: `/seeds/${id}/removeDistributor`,
      body: {
        distributorId,
      },
    });
  }

  addTask(id, task) {
    return rest.put({
      path: `/seeds/${id}/task/add`,
      body: {
        task,
      },
    });
  }

  updateTask(id, taskId, status) {
    return rest.put({
      path: `/seeds/${id}/task/update`,
      body: {
        taskId, status,
      },
    });
  }
}

export default new Service();
