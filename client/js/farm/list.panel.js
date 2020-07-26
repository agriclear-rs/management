import { TablePanel, Notify } from 'rumsan-ui';
import config from '../config';

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/farms`;
    super(cfg);
    this.render();
  }

  setColumns() {
    return [
      {
        data: 'name',
      },
      {
        data: 'farm_id',
      },
      {
        data: 'owner',
      },
      {
        data: null,
        render: (d) => (d.address ? d.address : ''),
      },
      {
        data: 'contact_no',
      },
      // {
      //   data: null,
      //   render: (d) => {
      //     const crops = d.crops.map((crop) => crop.name);
      //     return crops.join(',');
      //   },
      // },

      // <li class="addDistributor"><a >Add Distributor</a></li>

      {
        data: null,
        class: 'text-center',
        render(data, type, full, meta) {
          return `&nbsp;&nbsp;
            <button class="btn btn-primary btn-xs dropdown" type="button" data-toggle="dropdown">
            <i class="fa fa-plus fa-sm"></i>
            </button> 
            <ul class="dropdown-menu">
              <input style="display:none" value="${data._id}"></input>
              <li class="addFarmer"><a >Add Farmer</a></li>
              <li class="addBatch"><a >Add Batch</a></li>
            </ul>  
            <a href='/farms/${data._id}' type="button" class="btn btn-xs btn-primary" title='View Farm Details'><i class='fa fa-eye'></i></a>&nbsp;&nbsp;<button type="button" class="btn btn-xs btn-danger" id="btnFarmDelete" value="${data._id}"><i class="fa fa-trash"></i></button>
          `;
        },
      },
    ];
  }
}

export default ListPanel;
