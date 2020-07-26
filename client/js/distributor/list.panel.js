import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/distributors`;
    super(cfg);
    this.render();
  }

  setColumns() {
    return [
      {
        data: 'name',
      },
      {
        data: 'phone',
      },
      {
        data: null,
        render: (d) => (d.address ? d.address : ''),
      },
      {
        data: null,
        render: (d) => (d.distributor_type ? d.distributor_type : ''),
      },
      {
        data: null,
        class: 'text-center',
        render(data, type, full, meta) {
          return `&nbsp;&nbsp;
          <button type="button" class="btn btn-xs btn-primary btnAssignBatch" title='Assign Batches' value='${data._id},${data.name}'><i class='fa fa-plus'></i></button>&nbsp;<a href='/distributors/${data._id}' type="button" class="btn btn-xs btn-primary" title='View Distributor Details'><i class='fa fa-eye'></i></a>&nbsp;&nbsp;<button type="button" class="btn btn-xs btn-danger" id="btnDistributorDelete" value="${data._id}"><i class="fa fa-trash"></i></button>`;
        },
      },
    ];
  }
}

export default ListPanel;
