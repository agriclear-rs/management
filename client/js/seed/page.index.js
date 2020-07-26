import { Notify } from 'rumsan-ui';
import SeedTable from './list.panel';
import SeedAdd from './add.modal';
import ImageUpload from './page.image';

$(document).ready(() => {
  const st = new SeedTable({ target: '#seed-table' });
  const seedAdd = new SeedAdd({ target: '#mdlSeedAdd' });
  if (localStorage.getItem('redirect_url')) {
    seedAdd.open();
  }

  const imagePanel = new ImageUpload({ target: '#imageUpload' });
  const docPanel = new ImageUpload({ target: '#docUpload' });
  const additiveImg = new ImageUpload({ target: '#additiveUpload' });
  const purchaseImg = new ImageUpload({ target: '#purchaseUpload' });
  const seedlingImg = new ImageUpload({ target: '#seedlingUpload' });
  const transplantImg = new ImageUpload({ target: '#transplantUpload' });
  const fertilizerImg = new ImageUpload({ target: '#fertilizerUpload' });
  const pesticideImg = new ImageUpload({ target: '#pesticideUpload' });
  const plantImg = new ImageUpload({ target: '#plantUpload' });
  const harvestImg = new ImageUpload({ target: '#harvestUpload' });

  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#seed_image').attr('src', image);
    $('input[name=image_url]').val(image);
    Notify.show('Image Uploaded');
  });
  docPanel.on('image-uploaded', async (e, d) => {
    const image = await docPanel.upload(d);
    setImage('assurance', 'assurance_doc_url', image);
  });
  additiveImg.on('image-uploaded', async (e, d) => {
    const image = await additiveImg.upload(d);
    setImage('additive', 'additive_image_url', image);
  });
  purchaseImg.on('image-uploaded', async (e, d) => {
    const image = await purchaseImg.upload(d);
    setImage('purchase', 'seedling_purchase_receipt_url', image);
  });
  seedlingImg.on('image-uploaded', async (e, d) => {
    const image = await seedlingImg.upload(d);
    setImage('seedling', 'seedling_image_url', image);
  });
  transplantImg.on('image-uploaded', async (e, d) => {
    const image = await transplantImg.upload(d);
    setImage('transplant', 'seedling_transplant_image_url', image);
  });
  fertilizerImg.on('image-uploaded', async (e, d) => {
    const image = await fertilizerImg.upload(d);
    setImage('fertilizer', 'fertilizer_image_url', image);
  });
  pesticideImg.on('image-uploaded', async (e, d) => {
    const image = await pesticideImg.upload(d);
    setImage('pesticide', 'pesticide_image_url', image);
  });
  plantImg.on('image-uploaded', async (e, d) => {
    const image = await plantImg.upload(d);
    setImage('plantImage', 'plant_image_url', image);
  });
  harvestImg.on('image-uploaded', async (e, d) => {
    const image = await harvestImg.upload(d);
    setImage('harvestImg', 'harvested_image_url', image);
  });

  $('#btnSeedAdd').on('click', () => {
    seedAdd.open();
  });

  $('#has_quality_assurance').on('change', () => {
    $('.doc-upload').toggle();
  });

  $(document).on('click', '#btnSeedDelete', function () {
    const seedId = $(this).val();
    seedAdd.delete(seedId);
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

  $('#is_harvested').on('change', function () {
    $('.harvest').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=harvested_image_url]').val('');
      $('#is_contaminated').prop('checked', false);
      $('#is_contaminated_isolated').prop('checked', false);
    }
  });

  $('#additives_used').on('change', function () {
    $('.additive').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=additive_image_url]').val('');
    }
  });

  $('#seedling_yourself').on('change', function () {
    $('.purchase').toggle();
    if ($(this).prop('checked') == true) {
      $('input[name=seedling_purchase_receipt_url]').val('');
    }
  });

  $('#seedling_transplanted').on('change', function () {
    $('.transplant').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=seedling_transplant_image_url]').val('');
    }
  });

  $('#fertilizer_added').on('change', function () {
    $('.fertilizer').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=fertilizer_image_url]').val('');
    }
  });

  $('#is_plant_infected').on('change', function () {
    $('.pesticide').toggle();
    if ($(this).prop('checked') == false) {
      $('#pesticide_added').prop('checked', false);
    }
  });

  $('#pesticide_added').on('change', function () {
    $('.pesticide-upload').toggle();
    if ($(this).prop('checked') == false) {
      $('input[name=pesticide_image_url]').val('');
    }
  });

  $(document).on('click', '#btnAddFarm', () => {
    localStorage.setItem('redirect_url', window.location.href);
    window.location.replace('/farms');
  });

  $(document).on('click', '#btnAddFarmer', () => {
    localStorage.setItem('redirect_url', window.location.href);
    window.location.replace('/farmers');
  });

  $(document).on('click', '#btnAddDistributor', () => {
    localStorage.setItem('redirect_url', window.location.href);
    window.location.replace('/distributors');
  });
});

function setImage(target, input, image) {
  $(`#${target}`).append(
    `<div class="col-md-3"><img src="${image}" class="rounded" height="165px" width="155px" style="margin: auto;"/></div>`,
  );
  $(`input[name=${input}]`).val(
    $(`input[name=${input}]`).val() == '' ? image : `${$(`input[name=${input}]`).val()},${image}`,
  );
  Notify.show('Image Uploaded');
}
