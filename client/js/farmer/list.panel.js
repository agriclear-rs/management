import config from "../config";
import { TablePanel, Notify } from "rumsan-ui";

class ListPanel extends TablePanel {
  constructor(cfg) {
    cfg.url = `${config.apiPath}/farmers`;
    super(cfg);
    this.render();
  }

  setColumns() {
    return [
      {
        data: "name"
      },
      {
        data: "phone"
      },
      {
        data: null,
        render: d => {
          return d.address ? d.address : "";
        }
      },
      {
        data: null,
        class: "text-center",
        render: function (data, type, full, meta) {
          return `&nbsp;&nbsp;
          <a href='/farmers/${data._id}' type="button" class="btn btn-xs btn-primary" title='View Farmer Details'><i class='fa fa-eye'></i></a>&nbsp;&nbsp;<button type="button" class="btn btn-xs btn-danger d-none" id="btnFarmerDelete" value="${data._id}"><i class="fa fa-trash"></i></button>`;
        }
      }
    ];
  }
}

export default ListPanel;
