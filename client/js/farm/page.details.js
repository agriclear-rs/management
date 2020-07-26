/* eslint-disable no-undef */
import { Notify } from 'rumsan-ui';
import FarmEdit from './edit.panel';
import ImageUpload from './page.image';
import SeedTable from '../seed/list.panel';
import SeedAdd from '../seed/add.modal';

$(document).ready(() => {
  localStorage.removeItem('redirect_url');
  $('#filterBy').select2({ placeholder: 'Filter By', minimumResultsForSearch: -1 });
  const fe = new FarmEdit({ target: '#farmDetailsPanel', id: farmId });
  const st = new SeedTable({ target: '#seed-table', id: farmId });
  const seedAdd = new SeedAdd({ target: '#mdlSeedAdd' });
  const imagePanel = new ImageUpload({ target: '#imageUpload' });
  const imagePanel5 = new ImageUpload({ target: '#imageBatchUpload' });
  const imagePanel6 = new ImageUpload({ target: '#docUpload' });

  $('#farmsBatch').val(farmId);
  seedAdd.renderSelect(farmId);
  seedAdd.renderPlots(farmId);
  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#farmer_image').attr('src', image);
    $('input[name=image_url]').val(image);
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

  $('#btnSeedAdd').on('click', () => {
    seedAdd.open();
  });

  seedAdd.on('seed-added', () => {
    st.reload();
    Notify.show('Seed has been added successfully');
    if (localStorage.getItem('redirect_url')) {
      setTimeout(() => {
        window.location = localStorage.getItem('redirect_url');
      }, 1000);
    }
  });

  seedAdd.on('seed-deleted', () => {
    st.reload();
    Notify.show('Seed has been deleted successfully');
  });

  $(document).on('click', '#btnSeedDelete', function () {
    const seedId = $(this).val();
    seedAdd.delete(seedId);
  });
  $('#cropSelect').on('change', function () {
    const knowledgeId = $(this).val();
    seedAdd.renderVariety(knowledgeId);
  });

  $('#btnGoBack').on('click', () => {
    window.location.replace('/farms');
  });

  fe.on('farm-updated', () => {
    Notify.show('Farm Details Updated Successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  $('#btnAddCrop').on('click', () => {
    localStorage.setItem('redirect_url', window.location.href);
    window.location.replace('/seeds');
  });

  $('#cropDetails').on('click', () => {
    const tab1 = document.getElementById('farmDetails');
    tab1.classList.remove('active');
    const tab2 = document.getElementById('cropDetails');
    tab2.classList.add('active');
    const tab3 = document.getElementById('farmerDetails');
    tab3.classList.remove('active');
    const tab4 = document.getElementById('distributorDetails');
    tab4.classList.remove('active');
  });

  $('#farmDetails').on('click', () => {
    const tab1 = document.getElementById('farmDetails');
    tab1.classList.add('active');
    const tab2 = document.getElementById('cropDetails');
    tab2.classList.remove('active');
    const tab3 = document.getElementById('farmerDetails');
    tab3.classList.remove('active');
    const tab4 = document.getElementById('distributorDetails');
    tab4.classList.remove('active');
  });
  $('#farmerDetails').on('click', () => {
    const tab1 = document.getElementById('farmDetails');
    tab1.classList.remove('active');
    const tab2 = document.getElementById('cropDetails');
    tab2.classList.remove('active');
    const tab3 = document.getElementById('farmerDetails');
    tab3.classList.add('active');
    const tab4 = document.getElementById('distributorDetails');
    tab4.classList.remove('active');
  });
  $('#distributorDetails').on('click', () => {
    const tab1 = document.getElementById('farmDetails');
    tab1.classList.remove('active');
    const tab2 = document.getElementById('cropDetails');
    tab2.classList.remove('active');
    const tab3 = document.getElementById('farmerDetails');
    tab3.classList.remove('active');
    const tab4 = document.getElementById('distributorDetails');
    tab4.classList.add('active');
  });

  $('#searchValue').on('keyup', async function () {
    const filterSelected = $('#filterBy').val();
    if (filterSelected === '') Notify.warning('You need to select atleast one filter type');
    if (filterSelected === 'batch') st.load(`/api/v1/seeds?farmId=${farmId}&&batch=${this.value}`);
    if (filterSelected === 'crop') st.load(`/api/v1/seeds?farmId=${farmId}&&crop=${this.value}`);
    if (filterSelected === 'variety') st.load(`/api/v1/seeds?farmId=${farmId}&&variety=${this.value}`);
  });

  $(document).on('click', '.btnAddTask', function () {
    const data = $(this).val().split(',');
    const [id, batch, crop, variety] = data;
    document.getElementById('batchId').value = id;
    document.getElementById('batchNo').value = batch;
    document.getElementById('cropName').value = crop;
    document.getElementById('cropVariety').value = variety;
    $('#mdlTaskAdd').modal('show');
  });

  $(document).on('click', '#btnSubmitTask', () => {
    const task = $('input[name=task]').val();
    const batchId = $('input[id=batchId]').val();
    if (!task) Notify.warning('Task is empty');
    seedAdd.addTask(batchId, task);
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
