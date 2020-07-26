import FarmerTable from "./list.panel";
import FarmerAdd from "./add.modal";
import ImageUpload from "./page.image";
import { Notify } from "rumsan-ui";

$(document).ready(function () {
  let ft = new FarmerTable({ target: "#farmer-table" });
  let farmerAdd = new FarmerAdd({ target: "#mdlFarmerAdd" });
  let imagePanel = new ImageUpload({ target: "#imageUpload" });

  if (localStorage.getItem("redirect_url")) {
    farmerAdd.open();
  }

  imagePanel.on("image-uploaded", async (e, d) => {
    Notify.warning("Image Uploading");
    let image = await imagePanel.upload(d);
    $("#farmer_image").attr("src", image);
    $("input[name=image_url]").val(image);
    Notify.show("Image Uploaded");
  });

  $("#btnFarmerAdd").on("click", () => {
    farmerAdd.open();
  });

  $("#btnGenPassword").on("click", () => {
    farmerAdd.generatePassword();
  });

  $(document).on("click", "#btnFarmerDelete", function () {
    let farmerId = $(this).val();
    farmerAdd.delete(farmerId);
  });

  farmerAdd.on("farmer-added", () => {
    ft.reload();
    Notify.show("Farmer has been added successfully");
    if (localStorage.getItem("redirect_url")) {
      setTimeout(function () {
        window.location = localStorage.getItem("redirect_url");
      }, 1000);
    }
  });

  farmerAdd.on("farmer-deleted", () => {
    ft.reload();
    Notify.show("Farmer has been deleted successfully");
  });
});
