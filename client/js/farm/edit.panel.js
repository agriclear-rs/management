import {
  Form, Panel, Notify, Session,
} from 'rumsan-ui';
import Service from './service';
import SeedService from '../seed/service';
import config from '../config';

class FarmEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.id = cfg.id;
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('farm-updated', 'unassignFarmer', 'unassignDistributor');
    // this.renderSelector("seed_id", "Choose Seed", "seeds");
    this.loadData(this.id);
    // this.loadSeedData(this.id);
    this.on('unassignFarmer', (d, param) => {
      this.unassignFarmer(param);
    });
    this.on('unassignDistributor', (d, param) => {
      this.unassignDistributor(param);
    });
    this.comp.submit((e) => {
      e.preventDefault();
      this.save();
    });
  }

  async loadData(id) {
    let data = await Service.getById(id);
    [data] = [data.data[0]];
    if (!data) return;
    data.longitude = data.gps.longitude;
    data.latitude = data.gps.latitude;
    this.form.set(data);
    if (data.any_land_risk === true) $('#any_land_risk').attr('checked', 'checked');
    if (data.any_monitoring_program === true) { $('#any_monitoring_program').attr('checked', 'checked'); }
    // if (data.farmers.length) {
    //   const farmers = data.farmers.map((farmer) => this.appendInfo(farmer, 'farmerDisplay', 'appendFarmer', 'farmers', 'unassignFarmer'));
    // } else {
    //   $('#farmerDisplay').append('<div class="col-md-12 text-center"<h3>No Farmers assigned yet</h3>');
    // }
    // if (data.distributors.length) {
    //   const distributors = data.distributors.map((distributor) => this.appendInfo(distributor, 'distributorDisplay', 'appendDistributor', 'distributors', 'unassignDistributor'));
    // } else {
    //   $('#distributorDisplay').append('<div class="col-md-12 text-center"<h3>No Distributors assigned yet</h3>');
    // }
    this.loadAssigned();
  }

  async loadAssigned() {
    const res = await SeedService.getSeeds(this.id);
    const [batches] = [res.data];
    batches.map((batch) => {
      batch.farmers.map((farmer) => {
        this.appendInfo(farmer, 'farmerDisplay', 'appendFarmer', 'farmers', 'unassignFarmer', batch);
      });
      batch.distributors.map((distributor) => {
        this.appendInfo(distributor, 'distributorDisplay', 'appendDistributor', 'distributors', 'unassignDistributor', batch);
      });
    });
  }

  appendInfo(d, id, appendClass, url, unassign, batch) {
    if (!d.image_url) d.image_url = 'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png';
    const user = (url === 'farmers') ? 'Farmer' : 'Distributor';
    $(`#${id}`).append(`
    <div class="col-md-3 form-group ${appendClass}">
      <div class="ibox">
       <div class="ibox-content product-box">
         <div class="product-imitation" style="padding: 10px 0px!important;">
          <img src="${d.image_url}" width="200" height="200"></img>
          <i class="fa fa-window-close btn btn-danger" style="position: absolute; margin-left: -40px" onclick="$('#farmDetailsPanel').trigger('${unassign}','${d._id}')"></i>
         </div>
         <div class="product-desc">
             <span class="product-price">
                 ${d.name}
             </span>
             <div class="m-t text-center">
             <a href="/seeds/${batch._id}" class="btn btn-xs btn-outline btn-primary"> ${batch.batch_no} ${batch.name}<i class="fa fa-long-arrow-right"></i> </a>
             </div>
             <div class="m-t text-center">
                 <a href="/${url}/${d._id}" class="btn btn-xs btn-outline btn-primary">About ${user} <i class="fa fa-long-arrow-right"></i> </a>
             </div>
         </div>
       </div>
     </div>
   </div>
   `);
  }

  async unassignFarmer(id) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will unassign this farmer.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const res = await Service.unassignFarmer(this.id, id);
      Notify.show('Farmer Unassigned Successfully');
    }
  }

  async unassignDistributor(id) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will unassign this farmer.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const res = await Service.unassignDistributor(this.id, id);
      Notify.show('Distributor Unassigned Successfully');
    }
  }

  // async loadSeedData(id) {
  //   let data = await Service.getSeed(id);
  //   data = data.data[0]
  //   if (!data) $(".alert").hide();
  //   this.appendSeedInfo(data);
  //   $("#seed_id").append(new Option(data.name, data._id, true, true))
  // }

  async save() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    data.gps = {
      latitude: data.latitude,
      longitude: data.longitude,
    };
    await Service.update(this.id, data);
    this.fire('farm-updated', data);
  }

  // appendSeedInfo(d) {
  //   $("#farmDetails").append(`
  //     <div class="col-md-3">
  //      <div class="ibox">
  //         <div class="ibox-content product-box">
  //           <div class="product-imitation" style="padding: 10px 0px!important;">
  //               <img src="${d.image_url}" width="200" height="200"></img>
  //           </div>
  //           <div class="product-desc">
  //               <span class="product-price">
  //                   ${d.batch_no} (${d.name})
  //               </span>
  //               <div class="product-name">Detail</div>
  //               <div class="small m-t-xs">
  //                  ${d.comment}
  //               </div>
  //               <div class="m-t text-right">
  //                   <a href="/seeds/${d._id}" class="btn btn-xs btn-outline btn-primary">Info <i class="fa fa-long-arrow-right"></i> </a>
  //               </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   `);
  // }
  // async renderSelector(name, placeholder, url) {
  //   $(`${this.target} [id=${name}]`).select2({
  //     width: "100%",
  //     placeholder: `Select ${placeholder}`,
  //     ajax: {
  //       url: `${config.apiPath}/${url}`,
  //       headers: Session.getToken(),
  //       dataType: "json",
  //       delay: 250,
  //       data: function (params) {
  //         var query = {
  //           name: params.term
  //         };
  //         return query;
  //       },
  //       processResults: data => {
  //         let results = _.map(data.data, d => {
  //           d.id = d._id;
  //           d.text = d.name;
  //           return d;
  //         });
  //         return {
  //           results
  //         };
  //       },
  //       cache: true
  //     }
  //   });
  // }
}

export default FarmEdit;
