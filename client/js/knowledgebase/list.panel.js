import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/knowledgebase`;
    super(cfg);
    this.render();
  }

  setColumns() {
    return [
      {
        data: 'name',
      },
      {
        data: null,
        render: (d) => (d.variety ? d.variety.join(', ') : ''),
      },
      {
        data: null,
        render: (d) => (d.days_for_seedling ? d.days_for_seedling : ''),
      },
      {
        data: null,
        render: (d) => (d.maturity && d.period ? `${d.maturity} ${d.period}` : ''),
      },
      {
        data: null,
        class: 'text-center',
        render(data, type, full, meta) {
          return `&nbsp;&nbsp;
          <a href='/knowledgebase/${data._id}' type="button" class="btn btn-xs btn-primary" title='View Details'><i class='fa fa-eye'></i></a>&nbsp;&nbsp;<button type="button" class="btn btn-xs btn-danger" id="btnKnowledgeDelete" value="${data._id}"><i class="fa fa-trash"></i></button>`;
        },
      },
    ];
  }
}

export default ListPanel;
