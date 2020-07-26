import { Notify } from 'rumsan-ui';
import SeedEdit from './edit.panel';
import ImageUpload from './page.image';

$(document).ready(() => {
  localStorage.removeItem('redirect_url');
  const linkUrl = `${window.location.origin}/seeds/scan/${seedUuid}`;
  const qrcode = new QRCode(document.getElementById('qrcode'), {
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

  const se = new SeedEdit({ target: '#seedDetailsPanel', id: seedId });

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

  $('#btnGoBack').on('click', () => {
    window.location.replace('/seeds');
  });

  se.on('seed-updated', () => {
    Notify.show('Seed Details Updated Successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  se.on('comment-posted', () => {
    Notify.show('Comment Posted Successfully');
    $('#chooseStage').val(null).trigger('change');
    $('#chooseQuestion').val(null).trigger('change');
    $('#adminComment').val(null);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  $('#chooseStage').on('change', function () {
    const { value } = this;
    $('#chooseQuestion option').remove();
    if (value === 'preparation') $('#chooseQuestion').append($('#tmpPrep').html());
    if (value === 'transplantation') $('#chooseQuestion').append($('#tmpTrans').html());
    if (value === 'inspection') $('#chooseQuestion').append($('#tmpInspect').html());
    if (value === 'harvesting') $('#chooseQuestion').append($('#tmpHarvest').html());
    if (value === 'processing') $('#chooseQuestion').append($('#tmpProcess').html());
  });

  $('#btnPost').on('click', () => {
    const comment = $('#adminComment').val();
    const question = $('#chooseQuestion option:selected').text().trim();
    if (!question) {
      Notify.warning('You need to select on what you would like to comment on first');
      return;
    }
    if (!comment) {
      Notify.warning('Comment field is empty');
      return;
    }
    se.addComment(question, comment);
  });

  // $('#farmerComment').on('click', () => {
  //   const tab1 = document.getElementById('farmerComment');
  //   tab1.classList.add('active');
  //   const tab2 = document.getElementById('farmerAdminComment');
  //   tab2.classList.remove('active');
  // });

  // $('#farmerAdminComment').on('click', () => {
  //   const tab1 = document.getElementById('farmerAdminComment');
  //   tab1.classList.add('active');
  //   const tab2 = document.getElementById('farmerComment');
  //   tab2.classList.remove('active');
  // });

  // $('#distributorComment').on('click', () => {
  //   const tab1 = document.getElementById('distributorComment');
  //   tab1.classList.add('active');
  //   const tab2 = document.getElementById('distributorAdminComment');
  //   tab2.classList.remove('active');
  // });

  // $('#distributorAdminComment').on('click', () => {
  //   const tab1 = document.getElementById('distributorAdminComment');
  //   tab1.classList.add('active');
  //   const tab2 = document.getElementById('distributorComment');
  //   tab2.classList.remove('active');
  // });

  $('#qrDownload').on('click', () => {
    const qrdata = $('#qrcode').children('img').attr('src');
    $('#qrDownload').attr('href', qrdata);
  });

  // $('#btnAddFarm').on('click', () => {
  //   localStorage.setItem('redirect_url', window.location.href);
  //   window.location.replace('/farms');
  // });
  $('#btnAddFarmer').on('click', () => {
    localStorage.setItem('redirect_url', window.location.href);
    window.location.replace('/farmers');
  });
  $('#btnAddDistributor').on('click', () => {
    localStorage.setItem('redirect_url', window.location.href);
    window.location.replace('/distributors');
  });

  $('#seedDetails').on('click', () => {
    const tab1 = document.getElementById('seedDetails');
    tab1.classList.add('active');
    const tab2 = document.getElementById('farmerDetails');
    tab2.classList.remove('active');
    const tab3 = document.getElementById('distributorDetails');
    tab3.classList.remove('active');
  });
  $('#farmerDetails').on('click', () => {
    const tab1 = document.getElementById('farmerDetails');
    tab1.classList.add('active');
    const tab2 = document.getElementById('seedDetails');
    tab2.classList.remove('active');
    const tab3 = document.getElementById('distributorDetails');
    tab3.classList.remove('active');
    se.renderSelector('farmer_id', 'Farmers', 'farmers');
    $('.appendFarmer').remove();
    se.loadFarmerData();
  });
  $('#distributorDetails').on('click', () => {
    const tab1 = document.getElementById('distributorDetails');
    tab1.classList.add('active');
    const tab2 = document.getElementById('farmerDetails');
    tab2.classList.remove('active');
    const tab3 = document.getElementById('seedDetails');
    tab3.classList.remove('active');
    se.renderSelector('distributor_id', 'Distributors', 'distributors');
    $('.appendDistributor').remove();
    se.loadDistributorData();
  });

  $('#btnAssignFarmer').on('click', () => {
    const id = document.getElementById('farmer_id').value;
    if (!id) { Notify.error('Farmer not selected'); return; }
    se.assignFarmer(seedId, id);
  });
  $('#btnAssignDistributor').on('click', () => {
    const id = document.getElementById('distributor_id').value;
    if (!id) { Notify.error('Distributor not selected'); return; }
    se.assignDistributor(seedId, id);
  });

  const navs = ['seedlingPrepContent', 'seedlingTransContent', 'inspectionContent', 'uploadContent', 'harvestingContent', 'storageContent', 'commentContent'];
  navs.map((nav) => {
    $(`#${nav}`).on('click', () => {
      const tabs = Array.from(document.querySelectorAll('.activity-details'));
      tabs.map((tab) => {
        tab.classList.remove('active');
        return null;
      });
      const activeTab = document.getElementById(nav);
      activeTab.classList.add('active');
    });
  });

  $(document).on('change', '.taskStatus', function (e) {
    const status = $(e.target).is(':checked');
    const taskId = $(this).val();
    se.updateTask(seedId, taskId, status);
  });

  $(document).on('click', '#btnAddTask', async () => {
    let data = await se.getSeed(seedId);
    [data] = [data.data[0]];
    // const data = $(this).val().split(',');
    document.getElementById('batchId').value = data._id;
    document.getElementById('batchNo').value = data.batch_no;
    document.getElementById('cropName').value = data.name;
    document.getElementById('cropVariety').value = data.crop_variety;
    $('#mdlTaskAdd').modal('show');
  });

  $(document).on('click', '#btnSubmitTask', () => {
    const task = $('input[name=task]').val();
    const batchId = $('input[id=batchId]').val();
    if (!task) Notify.warning('Task is empty');
    se.addTask(batchId, task);
    setTimeout(() => {
      window.location.reload();
    }, 800);
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
