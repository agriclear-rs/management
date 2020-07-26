import config from "../config";
import Service from "./service";
import MiscService from "../misc/service";
import { Modal, Form, Select, Notify, Session } from "rumsan-ui";
import { RSUtils } from "rumsan-core";
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

class UserAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents("generate-password", "user-added");
    this.renderRoleSelector();
    this.on("generate-password", async (event, data) => {
      this.generatePassword();
    });

    this.comp.submit(e => {
      e.preventDefault();
      this.addUser();
    });
  }

  async addUser() {
    if (!this.comp.validate()) return;
    let data = this.form.get();

    let resData = await Service.add(data);
    if (!resData) return;

    this.fire("user-added", resData);
    this.form.clear();
    this.close();
  }

  generatePassword() {
    let string_length = 8;
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%#@&!";
    let randomstring = "";

    for (let i = 0; i < string_length; i++)
      randomstring += possible.charAt(Math.floor(Math.random() * possible.length));

    $(`${this.target} [name=password]`).val(randomstring);
  }

  async renderRoleSelector() {
    $(`${this.target} [name=roles]`).select2({
      dropdownParent: $(`${this.target} .modal-header`),
      width: "100%",
      placeholder: "Select Role",
      minimumInputLength: 0,
      ajax: {
        url: `${config.apiPath}/roles`,
        headers: Session.getToken(),
        dataType: "json",
        delay: 250,
        data: function (params) {
          var query = {
            name: params.term
          };
          return query;
        },
        processResults: data => {
          let results = _.map(data.data, d => {
            d.id = d.name;
            d.text = d.name;
            return d;
          });
          return {
            results
          };
        },
        cache: true
      }
    });
  }
}

export default UserAdd;
