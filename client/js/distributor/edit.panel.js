import {
  Form, Panel, Notify, Session,
} from 'rumsan-ui';
import Service from './service';
import SeedService from '../seed/service';
import config from '../config';

class DistributorEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.id = cfg.id;
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('distributor-updated', 'distributor-unassigned', 'distributor-assigned');
    this.loadData(this.id);
    this.comp.submit((e) => {
      e.preventDefault();
      this.save();
    });
  }

  async loadData(id) {
    const data = await Service.getById(id);
    if (!data) return;
    this.form.set(data);
    if (data.image_url) $('#distributor_image').attr('src', data.image_url);
    $('#btnAssignBatch').val(`${data._id}, ${data.name}`);
  }

  async save() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    await Service.update(this.id, data);
    this.fire('distributor-updated', data);
  }

  async unassignDistributor(seedId, distributorId) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will unassign this batch crop from this distributor',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const res = await SeedService.unassignDistributor(seedId, distributorId);
      if (res) this.fire('distributor-unassigned');
    }
  }

  async assignBatch(distributorId, batchId) {
    const res = await SeedService.updateDistributor(batchId, distributorId);
    if (res) this.fire('distributor-assigned');
  }
}

export default DistributorEdit;
