import UserTable from "./list.panel";
import UserAdd from "./add.modal";

import config from "../config";

// import { Form } from "rumsan-ui";
// window.Form = Form;

$(document).ready(function () {
  let ut = new UserTable({ target: "#user-table" });
  let userAdd = new UserAdd({ target: "#mdlUserAdd" });

  $("#btnUserAdd").on("click", () => {
    userAdd.open();
  });

  userAdd.on("user-added", () => {
    ut.reload();
  });
});
