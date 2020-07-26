import { Notify, Session } from 'rumsan-ui';
import config from '../config';
import DistributorEdit from './edit.panel';
import ImageUpload from './page.image';
import SeedTable from '../seed/seed.list.panel';

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
  const de = new DistributorEdit({ target: '#distributorDetailsPanel', id: distributorId });
  const imagePanel = new ImageUpload({ target: '#imageUpload' });
  const st = new SeedTable({ target: '#seed-table', url: `?distributor=${distributorId}` });

  renderSelector();
  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#distributor_image').attr('src', image);
    $('input[name=image_url]').val(image);
    Notify.show('Image Uploaded');
  });

  $('#btnGoBack').on('click', () => {
    window.location.replace('/distributors');
  });

  de.on('distributor-updated', () => {
    Notify.show('Distributor Details Updated Successfully');
    setTimeout(() => {
      window.location.href = '/distributors';
    }, 2000);
  });

  $(document).on('click', '.btnSeedDelete', function () {
    const seedId = $(this).val();
    de.unassignDistributor(seedId, distributorId);
  });

  de.on('distributor-unassigned', () => {
    Notify.show('Batch Crop Unassigned successfully from this distributor');
    st.reload();
  });

  de.on('distributor-assigned', () => {
    Notify.show('Batch Crop Assigned successfully for this distributor');
    st.reload();
  });

  $(document).on('click', '#btnAssignBatch', function () {
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
        de.assignBatch(distributorId, batch);
      });
    } else {
      $('#mdlBatchAssign').modal('show');
    }
  });
});
