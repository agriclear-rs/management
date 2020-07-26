import { Panel } from "rumsan-ui";
import Service from "./service";

export default class Search extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents("image-uploaded");

    $(`${this.target}`).on("change", () => {
      this.fire("image-uploaded", $(this.target).get(0).files[0]);
    });
  }

  async upload(file) {
    let img_url = await this.getPolicyAndUpload(file);
    return img_url;
  }

  async getPolicyAndUpload(file) {
    if (!file) {
      alert("Please select a file.");
      return;
    }
    let data = await Service.getPolicy({ filename: file.name, contentType: file.type });
    return this.uploadToS3(data, file);
  }

  async uploadToS3(data, file) {
    let formData = new FormData();
    Object.keys(data.params).forEach(d => {
      formData.append(d, data.params[d]);
    });
    formData.append("file", file, file.name);
    let resData = await $.ajax(data.endpoint_url, {
      method: "POST",
      data: formData,
      processData: false,
      contentType: false
    });
    return resData.getElementsByTagName("Location")[0].innerHTML;
  }
}
