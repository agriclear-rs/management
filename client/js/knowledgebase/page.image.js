import { Panel, Notify } from 'rumsan-ui';
import Service from './service';

export default class Search extends Panel {
  constructor(cfg) {
    super(cfg);
    this.registerEvents('image-uploaded');

    $(`${this.target}`).on('change', () => {
      Notify.warning('Image is uploading');
      for (let i = 0; i < $(this.target)[0].files.length; i++) {
        this.fire('image-uploaded', $(this.target)[0].files[i]);
      }
    });
  }

  async upload(file) {
    const img_url = await this.getPolicyAndUpload(file);
    return img_url;
  }

  async getPolicyAndUpload(file) {
    if (!file) {
      alert('Please select a file.');
      return;
    }
    const data = await Service.getPolicy({ filename: file.name, contentType: file.type });
    return this.uploadToS3(data, file);
  }

  async uploadToS3(data, file) {
    const formData = new FormData();
    Object.keys(data.params).forEach((d) => {
      formData.append(d, data.params[d]);
    });
    formData.append('file', file, file.name);
    const resData = await $.ajax(data.endpoint_url, {
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
    });
    return resData.getElementsByTagName('Location')[0].innerHTML;
  }
}
