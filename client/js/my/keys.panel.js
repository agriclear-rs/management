import Service from "./service";
import { Form, Panel, Notify } from "rumsan-ui";

class UserEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents("save");
    this.load();
    this.comp.submit(e => {
      e.preventDefault();
      this.save();
    });
  }

  async load() {
    let data = await Service.get();
    this.form.set(data.app_keys);
  }

  async save() {
    let data = this.form.get();
    await Service.addAppKeys(data);
    Notify.show(`User app keys have been saved.`);
    this.fire("save", data);
  }
}

export default UserEdit;
