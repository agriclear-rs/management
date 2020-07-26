import FarmAdd from "./add.modal";
import ImageUpload from "./page.image";
import { Notify } from "rumsan-ui";


$(document).ready(function () {
  let farmAdd = new FarmAdd({ target: "#farmAddPanel" });
  let imagePanel1 = new ImageUpload({ target: "#land_risk_doc" });
  let imagePanel2 = new ImageUpload({ target: "#monitoring_doc" });

  farmAdd.on("farm-added", () => {
    Notify.show("Farm has been added successfully");
    setTimeout(function () {
      window.location.replace("/farms");
    }, 1000)
  })
  imagePanel1.on("image-uploaded", async (e, d) => {
    Notify.warning("Image Uploading");
    let image = await imagePanel1.upload(d);
    $("input[name=land_risk_doc]").val(image);
    Notify.show("Image Uploaded");
  });
  imagePanel2.on("image-uploaded", async (e, d) => {
    Notify.warning("Image Uploading");
    let image = await imagePanel2.upload(d);
    $("input[name=monitoring_doc]").val(image);
    Notify.show("Image Uploaded");
  });

  $("#any_land_risk").on("change", function () {
    $(".risk-doc").toggle();
    if ($(this).prop("checked") == false) {
      $("input[name=land_risk_doc]").val("");
    }
  });

  $("#any_monitoring_program").on("change", function () {
    $(".monitor-doc").toggle();
    if ($(this).prop("checked") == false) {
      $("input[name=monitoring_doc]").val("");
    }
  });
});