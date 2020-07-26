import { Notify, Session } from 'rumsan-ui';
import config from '../config';
import DistributorTable from './list.panel';
import DistributorAdd from './add.modal';
import ImageUpload from './page.image';
import QR from './print.modal';

function renderSelector() {
  $('#mdlBatchAssign [name=batches]').select2({
    dropdownParent: $('#mdlBatchAssign .modal-header'),
    width: '100%',
    placeholder: 'Assign Batches',
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

$(document).ready(() => {
  const dt = new DistributorTable({ target: '#distributor-table' });
  const distributorAdd = new DistributorAdd({ target: '#mdlDistributorAdd' });
  const imagePanel = new ImageUpload({ target: '#imageUpload' });
  const qr = new QR({ target: '#mdlPrintQr' });

  if (localStorage.getItem('redirect_url')) {
    distributorAdd.open();
  }
  renderSelector();

  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#distributor_image').attr('src', image);
    $('input[name=image_url]').val(image);
    Notify.show('Image Uploaded');
  });

  $('#btnDistributorAdd').on('click', () => {
    distributorAdd.open();
  });

  $('#btnGenPassword').on('click', () => {
    distributorAdd.generatePassword();
  });

  $(document).on('click', '#btnDistributorDelete', function () {
    const distributorId = $(this).val();
    distributorAdd.delete(distributorId);
  });

  distributorAdd.on('distributor-added', () => {
    dt.reload();
    Notify.show('Distributor has been added successfully');
    if (localStorage.getItem('redirect_url')) {
      setTimeout(() => {
        window.location = localStorage.getItem('redirect_url');
      }, 1000);
    }
  });

  distributorAdd.on('distributor-deleted', () => {
    dt.reload();
    Notify.show('Distributor has been deleted successfully');
  });

  $(document).on('click', '.btnAssignBatch', function () {
    const data = $(this).val().split(',');
    const [disId, disName] = data;
    $('#distributorId').val(disId);
    $('#disName').val(disName);
    $('select').val(null).trigger('change');
    $('#mdlBatchAssign').modal('show');
  });

  let batches; let batchNames = '';
  $(document).on('change', '#batchSelect', function () {
    batches = [];
    batches.push($(this).val());
  });

  $(document).on('click', '#btnSubmitBatch', async () => {
    const distributorId = $('input[id=distributorId]').val();
    if (!batches.length) Notify.warning('Must Assign Atleast One Batch');
    [batches] = [batches[0]];
    const x = document.getElementsByClassName('select2-selection__choice');
    batchNames = '';
    for (let i = 0; i < x.length; i++) {
      if (i === x.length - 1) {
        batchNames += `${x[i].getAttribute('title')}`;
      } else {
        batchNames += `${x[i].getAttribute('title')}, `;
      }
    }
    $('#mdlBatchAssign').modal('hide');
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      html: `You will assign these batches: <b style='color:red'>${batchNames}</b> to distributor.`,
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      batches.map((batch) => {
        distributorAdd.assignBatch(distributorId, batch);
      });
    } else {
      $('#mdlBatchAssign').modal('show');
    }
  });

  $('#printQr').on('click', () => {
    qr.open();
  });

  $('#selectBatch').on('change', function () {
    qr.getSeed($(this).val());
  });

  qr.on('print-ready', (e, params) => {
    const linkUrl = `${window.location.origin}/seeds/scan/${params}`;
    $('#qr_image').empty();
    const qrcode = new QRCode(document.getElementById('qr_image'), {
      width: 150,
      height: 150,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
      dotScale: 1,
      quietZone: 0,
      quietZoneColor: 'transparent',
      logo: '/img/logos/agriclear-leaf.png',
      logoWidth: 45,
      logoHeight: 45,
      logoBackgroundColor: '#ffffff',
    });
    qrcode.makeCode(linkUrl);
  });
});
