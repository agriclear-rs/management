import config from "../config";
import Service from "./service";
import { Modal, Form, Session } from "rumsan-ui";

class FarmAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.crop = `${cfg.target} [name=crops]`;
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents("farm-added", "farm-deleted");
    this.comp.submit(e => {
      e.preventDefault();
      this.addFarm();
    });
  }
  async addFarm() {
    if (!this.comp.validate()) return;
    let data = this.form.get();
    data.gps = {
      latitude: data.latitude,
      longitude: data.longitude
    };
    data.crops = this.getCrops();
    let resData = await Service.add(data);
    if (!resData) return;
    this.fire("farm-added", resData);
  }

  async delete(id) {
    let isConfirm = await swal.fire({
      title: "Are you sure?",
      text: "You will delete this farm permanently.",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: "No"
    });
    if (isConfirm.value) {
      let resData = await Service.delete(id);
      if (!resData) return;
      this.fire("farm-deleted", resData);
    }
  }
  // async renderSelector() {
  //   $(`${this.target} [id=crops]`).select2({
  //     width: "100%",
  //     placeholder: `Select Crops`,
  //     minimumInputLength: 0,
  //     ajax: {
  //       url: `${config.apiPath}/seeds`,
  //       headers: Session.getToken(),
  //       dataType: "json",
  //       delay: 250,
  //       data: function (params) {
  //         var query = {
  //           name: params.term
  //         };
  //         return query;
  //       },
  //       processResults: data => {
  //         let results = _.map(data.data, d => {
  //           d.id = d._id;
  //           d.text = d.batch_no + " " + d.name;
  //           return d;
  //         });
  //         return {
  //           results
  //         };
  //       },
  //       cache: true
  //     }
  //   });
  // }
  getCrops() {
    return $(this.crop).val();
  }

}

export default FarmAdd;
