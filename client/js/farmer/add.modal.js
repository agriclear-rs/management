import { Modal, Form, Session } from 'rumsan-ui';
import config from '../config';
import Service from './service';

class FarmerAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('farmer-added', 'farmer-deleted', 'add-farmer');
    this.comp.submit((e) => {
      e.preventDefault();
      this.addFarmer();
    });
  }

  async addFarmer() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    // if (data.farms) data.farms = [data.farms];
    const resData = await Service.add(data);
    if (!resData) return;
    this.fire('farmer-added', resData);
    this.form.clear();
    $('#farmer_image').attr(
      'src',
      'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png',
    );
    this.close();
  }

  async delete(id) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this farmer permanently.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const resData = await Service.delete(id);
      if (!resData) return;
      this.fire('farmer-deleted', resData);
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
    $('#farmer_image').attr(
      'src',
      'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png',
    );
    this.form.clear();
  }
}

export default FarmerAdd;
