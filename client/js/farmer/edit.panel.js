import Service from "./service";
import { Form, Panel, Notify, Session } from "rumsan-ui";
import config from "../config";

class FarmerEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.id = cfg.id;
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents("farmer-updated");
    this.loadData(this.id);
    this.comp.submit(e => {
      e.preventDefault();
      this.save();
    });
  }

  async loadData(id) {
    let data = await Service.getById(id);
    if (!data) return;
    this.form.set(data);
    if (data.image_url) $("#farmer_image").attr("src", data.image_url);
  }

  async save() {
    if (!this.comp.validate()) return;
    let data = this.form.get();
    await Service.update(this.id, data);
    this.fire("farmer-updated", data);
  }
}

export default FarmerEdit;
