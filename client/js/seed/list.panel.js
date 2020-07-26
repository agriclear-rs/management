import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListPanel extends TablePanel {
  constructor(cfg) {
    const id = cfg.id ? cfg.id : '';
    cfg.url = `${config.apiPath}/seeds?farmId=${id}`;
    super(cfg);
    this.render();
  }

  setColumns() {
    return [
      {
        data: 'batch_no',
      },
      {
        data: 'name',
      },
      {
        data: null,
        render: (d) => d.crop_variety,
      },
      {
        data: null,
        render: (d) => d.plots.join(','),
      },
      {
        data: null,
        render: (d) => {
          const farmers = d.farmers.map((farmer) => farmer.name);
          return farmers.join(',');
        },
      },
      {
        data: null,
        class: 'text-center',
        render(data, type, full, meta) {
          return `&nbsp;&nbsp;
          <button class='btn btn-primary btn-xs btnAddTask' type='button' title='Add Task' value=${data._id},${data.batch_no},${data.name},${data.crop_variety}><i class='fa fa-plus'></i></button>&nbsp;<a href='/seeds/${data._id}' type="button" class="btn btn-xs btn-primary" title='View Seed Details'><i class='fa fa-eye'></i></a>&nbsp;&nbsp;<button type="button" class="btn btn-xs btn-danger" id="btnSeedDelete" value="${data._id}"><i class="fa fa-trash"></i></button>`;
        },
      },
    ];
  }
}

export default ListPanel;
