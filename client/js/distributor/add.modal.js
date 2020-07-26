import {
  Modal, Form, Session, Notify,
} from 'rumsan-ui';
import config from '../config';
import Service from './service';
import SeedService from '../seed/service';

class DistributorAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('distributor-added', 'distributor-deleted');
    this.comp.submit((e) => {
      e.preventDefault();
      this.addDistributor();
    });
  }

  async addDistributor() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    // if (data.farms) data.farms = [data.farms];
    const resData = await Service.add(data);
    if (!resData) return;
    this.fire('distributor-added', resData);
    this.form.clear();
    $('#distributor_image').attr(
      'src',
      'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png',
    );
    this.close();
  }

  async delete(id) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this distributor permanently.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const resData = await Service.delete(id);
      if (!resData) return;
      this.fire('distributor-deleted', resData);
    }
  }

  generatePassword() {
    const string_length = 8;
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$%#@&!';
    let randomstring = '';
    for (let i = 0; i < string_length; i++) { randomstring += possible.charAt(Math.floor(Math.random() * possible.length)); }
    $(`${this.target} [name=password]`).val(randomstring);
  }

  clearForm() {
    $('#distributor_image').attr(
      'src',
      'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png',
    );
    this.form.clear();
  }

  async assignBatch(distributorId, batchId) {
    const res = await SeedService.updateDistributor(batchId, distributorId);
    if (res) Notify.show('Batch Assigned successfully');
  }
}

export default DistributorAdd;
