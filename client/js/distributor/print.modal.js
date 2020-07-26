import {
  Modal, Form, Session, Notify,
} from 'rumsan-ui';
import config from '../config';
import Service from './service';
import SeedService from '../seed/service';

class PrintQR extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('print-ready');
    this.renderSelect();
    this.comp.submit((e) => {
      e.preventDefault();
      this.printQR();
    });
  }

  async printQR() {
    const batchNum = document.getElementById('batch_no').value;
    const crop = document.getElementById('crop_name').value;
    const variety = document.getElementById('variety').value;
    const title = `${batchNum}_${crop}_${variety}`;
    const qr = document.getElementById('qr_image');
    const image = qr.getElementsByTagName('img')[0];
    if (image === undefined) {
      Notify.warning('You need to choose a batch first');
      return;
    }
    const printWindow = window.open('', 'Print QR', 'fullscreen=yes');
    printWindow.document.write(`
    <html>
    <head>
      <title>Agriclear ${title}</title>
    </head>
    <body>
      <div class="row">
        <div class="col-md-12" style="display:flex;justify-content:center;align-items:center;height:75%;">
          <img style="height:50%; width:50%" src='${image.src}'>
        </div>
        <div class="col-md-12" style="text-align:center;">
          <label>
            <h1>${title}<h1>
          </label>
        </div>
      </div>
    </body>
    </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }

  renderSelect() {
    $(`${this.target} [name=selectBatch]`).select2({
      dropdownParent: $(`${this.target} .modal-header`),
      width: '100%',
      placeholder: 'Select Batch Crop',
      minimumInputLength: 0,
      ajax: {
        url: `${config.apiPath}/seeds`,
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
            d.text = `${d.batch_no} ${d.name}`;
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

  async getSeed(id) {
    let data = await SeedService.getById(id);
    [data] = [data.data[0]];
    const farmers = data.farmers.map((d) => d.name);
    const distributors = data.distributors.map((d) => d.name);
    document.getElementById('batch_no').value = data.batch_no;
    document.getElementById('crop_name').value = data.name;
    document.getElementById('variety').value = data.crop_variety;
    document.getElementById('farmersQR').value = farmers.join(', ');
    document.getElementById('distributorsQR').value = distributors.join(', ');
    this.fire('print-ready', data.uuid);
  }
}

export default PrintQR;
