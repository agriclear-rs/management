import {
  Modal, Form, Session, Notify,
} from 'rumsan-ui';
import config from '../config';
import Service from './service';
import knowledgebaseService from '../knowledgebase/service';
import FarmService from '../farm/service';

class SeedAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.plot = `${cfg.target} [name=plots]`;
    this.farmer = `${cfg.target} [name=farmer_id]`;
    this.distributor = `${cfg.target} [name=distributor_id]`;
    this.renderSelector('crop', 'Crop', 'knowledgebase');
    $('#varietySelect').select2({ placeholder: 'Select Crop First', width: '100%' });
    $('#plotSelect').select2({ placeholder: 'Select Plot', width: '100%' });
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('seed-added', 'seed-deleted');
    this.comp.submit((e) => {
      e.preventDefault();
      this.addSeed();
    });
  }

  async addSeed() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    data.name = $('#cropSelect').text().trim();
    data.plots = this.getPlot();
    data.farmers = this.getFarmer();
    data.distributors = this.getDistributor();
    const resData = await Service.add(data);
    if (!resData) return;
    this.fire('seed-added', resData);
    this.clearForm();
    this.close();
  }

  async delete(id) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this seed permanently.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const resData = await Service.delete(id);
      if (!resData) return;
      this.fire('seed-deleted', resData);
    }
  }

  async renderSelector(name, placeholder, url) {
    $(`${this.target} [name=${name}]`).select2({
      dropdownParent: $(`${this.target} .modal-header`),
      width: '100%',
      placeholder: `Select ${placeholder}`,
      minimumInputLength: 0,
      ajax: {
        url: `${config.apiPath}/${url}`,
        headers: Session.getToken(),
        dataType: 'json',
        delay: 250,
        data(params) {
          const query = {
            name: params.term,
          };
          return query;
        },
        processResults: (data) => {
          const results = _.map(data.data, (d) => {
            d.id = d._id;
            d.text = d.name;
            return d;
          });
          return {
            results,
          };
        },
        cache: true,
      },
    });
  }

  async renderPlots(id) {
    const farmId = $('#farmsBatch').val() || id;
    const data = await FarmService.getById(farmId);
    const plots = parseInt(data.data[0].no_of_plot);
    for (let i = 1; i <= plots; i++) {
      $('#plotSelect').append(`<option value=${i}>${i}</option>`);
    }
  }

  async renderVariety(id) {
    const data = await knowledgebaseService.getById(id);
    $('#varietySelect>option').remove();
    data.variety.map((d) => {
      $('#varietySelect').append(`<option value='${d}'>${d}</option>`);
    });
  }

  getPlot() {
    return $(this.plot).val();
  }

  getFarmer() {
    return $(this.farmer).val();
  }

  getDistributor() {
    return $(this.distributor).val();
  }

  clearForm() {
    $('#seed_image').attr(
      'src',
      'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png',
    );
    this.form.clear();
  }

  renderSelect(id) {
    this.renderSelector('farmer_id', 'Farmers', 'farmers');
    this.renderSelector('distributor_id', 'Distributors', 'distributors');
  }

  async addTask(id, task) {
    const res = await Service.addTask(id, { task });
    if (!res) return;
    $('#mdlTaskAdd').modal('hide');
    $('#frmTask input').val('');
    Notify.show('Task added Successfully');
  }
}

export default SeedAdd;
