import config from "../config";
import MiscService from "../misc/service";
import { Modal, Form, Session, Notify, Select } from "rumsan-ui";

class selectors {
  async staticDataSelector(config = {}) {
    if (!config.target) throw Error("Must send target to render");
    await MiscService.getStaticData();
    return new Select(
      Object.assign(
        {
          idField: "id",
          displayField: "name"
        },
        config
      )
    );
  }
  departments(config) {
    config.data = RSapp.staticData.departments;
    return this.staticDataSelector(config);
  }
  fundAccounts(config) {
    config.data = RSapp.staticData.fund_accounts;
    return this.staticDataSelector(config);
  }
  categories(config) {
    config.data = RSapp.staticData.categories;
    return this.staticDataSelector(config);
  }
}

export default new selectors();
