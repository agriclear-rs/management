import { Notify } from 'rumsan-ui';
import FarmTable from './list.panel';
import FarmAdd from './add.modal';
import FarmerAdd from '../farmer/add.modal';
import DistributorAdd from '../distributor/add.modal';
import SeedAdd from '../seed/add.modal';
import ImageUpload from './page.image';

$(document).ready(() => {
  localStorage.removeItem('redirect_url');
  $('#filterBy').select2({ placeholder: 'Filter By', minimumResultsForSearch: -1 });
  const ft = new FarmTable({ target: '#farm-table' });
  const farmAdd = new FarmAdd({ target: '#farmAddPanel' });
  const farmerAdd = new FarmerAdd({ target: '#mdlFarmerAdd' });
  const distributorAdd = new DistributorAdd({ target: '#mdlDistributorAdd' });
  const seedAdd = new SeedAdd({ target: '#mdlSeedAdd' });

  const imagePanel1 = new ImageUpload({ target: '#land_risk_doc' });
  const imagePanel2 = new ImageUpload({ target: '#monitoring_doc' });
  const imagePanel3 = new ImageUpload({ target: '#imageUpload' });
  const imagePanel4 = new ImageUpload({ target: '#imageDisUpload' });
  const imagePanel5 = new ImageUpload({ target: '#imageBatchUpload' });
  const imagePanel6 = new ImageUpload({ target: '#docUpload' });

  imagePanel1.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel1.upload(d);
    $('input[name=land_risk_doc]').val(image);
    Notify.show('Image Uploaded');
  });
  imagePanel2.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel2.upload(d);
    $('input[name=monitoring_doc]').val(image);
    Notify.show('Image Uploaded');
  });
  imagePanel3.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel3.upload(d);
    $('input[name=image_url]').val(image);
    document.getElementById('farmer_image').src = image;
    Notify.show('Image Uploaded');
  });
  imagePanel4.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel4.upload(d);
    $('input[name=image_url]').val(image);
    document.getElementById('distributor_image').src = image;
    Notify.show('Image Uploaded');
  });
  imagePanel5.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel5.upload(d);
    $('input[name=image_url]').val(image);
    document.getElementById('seed_image').src = image;
    Notify.show('Image Uploaded');
  });
  imagePanel6.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel6.upload(d);
    $('input[name=assurance_doc_url]').val(image);
    setImage('assurance', 'assurance_doc_url', image);
    Notify.show('Image Uploaded');
  });

  $('#has_quality_assurance').on('change', () => {
    $('.doc-upload').toggle();
  });

  $('#any_land_risk').on('change', function () {
    $('.risk-doc').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=land_risk_doc]').val('');
    }
  });

  $('#any_monitoring_program').on('change', function () {
    $('.monitor-doc').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=monitoring_doc]').val('');
    }
  });

  $('#cropSelect').on('change', function () {
    const knowledgeId = $(this).val();
    seedAdd.renderVariety(knowledgeId);
  });

  $('#btnGenPassword').on('click', () => {
    farmerAdd.generatePassword();
  });
  $('#btnDisGenPassword').on('click', () => {
    distributorAdd.generatePassword();
  });

  farmerAdd.on('farmer-added', () => {
    Notify.show('Farmer has been added successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
  distributorAdd.on('distributor-added', () => {
    Notify.show('Distributor has been added successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });
  seedAdd.on('seed-added', () => {
    Notify.show('Batch Crop has been added successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  $(document).on('click', '#btnFarmDelete', function () {
    const farmId = $(this).val();
    farmAdd.delete(farmId);
  });

  farmAdd.on('farm-deleted', () => {
    ft.reload();
    Notify.show('Farm has been deleted successfully');
  });

  $('#searchValue').on('keyup', async function () {
    const filterSelected = $('#filterBy').val();
    if (filterSelected === '') Notify.warning('You need to select atleast one filter type');
    if (filterSelected === 'name') ft.load(`/api/v1/farms?name=${this.value}`);
    if (filterSelected === 'id') ft.load(`/api/v1/farms?farm_id=${this.value}`);
    if (filterSelected === 'owner') ft.load(`/api/v1/farms?owner=${this.value}`);
  });

  $(document).on('click', '.addFarmer', function () {
    const farmId = $(this).prev('input').val();
    farmerAdd.clearForm();
    $('#farmsFarmer').val(farmId);
    $('input[name=type').val('farmer');
    farmerAdd.open();
  });
  $(document).on('click', '.addDistributor', function () {
    const farmId = $(this).prevAll('input').val();
    distributorAdd.clearForm();
    $('#farmsDistributor').val(farmId);
    $('input[name=type').val('distributor');
    distributorAdd.open();
  });
  $(document).on('click', '.addBatch', function () {
    const farmId = $(this).prevAll('input').val();
    seedAdd.clearForm();
    $('#farmsBatch').val(farmId);
    seedAdd.renderPlots();
    seedAdd.renderSelect(farmId);
    seedAdd.open();
  });
});

function setImage(target, input, image) {
  $(`#${target}`).append(
    `<div class="col-md-3"><img src="${image}" class="rounded" height="165px" width="155px" style="margin: auto;"/></div>`,
  );
  $(`input[name=${input}]`).val(
    $(`input[name=${input}]`).val() == '' ? image : `${$(`input[name=${input}]`).val()},${image}`,
  );
}
