import { Notify } from 'rumsan-ui';
import KnowledgeTable from './list.panel';
import KnowledgeAdd from './add.modal';
import ImageUpload from './page.image';

$(document).ready(() => {
  const kt = new KnowledgeTable({ target: '#knowledge-table' });
  const knowledgeAdd = new KnowledgeAdd({ target: '#mdlKnowledgeAdd' });
  const imagePanel = new ImageUpload({ target: '#imageUpload' });

  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#crop_image').attr('src', image);
    $('input[name=image_url]').val(image);
    Notify.show('Image Uploaded');
  });

  $('#btnKnowledgeAdd').on('click', () => {
    knowledgeAdd.open();
  });

  $(document).on('click', '#btnKnowledgeDelete', function () {
    const knowledgeId = $(this).val();
    knowledgeAdd.delete(knowledgeId);
  });

  knowledgeAdd.on('knowledge-added', () => {
    kt.reload();
    Notify.show('New Crop Knowledge Base has been added successfully');
  });

  knowledgeAdd.on('knowledge-deleted', () => {
    kt.reload();
    Notify.show('Crop Knowledge Base has been deleted successfully');
  });

  $('input[type=radio][name=harvesting_cycle]').on('change', function () {
    if ($(this).val() === 'multiple') $('.multipleHarvest').show();
    if ($(this).val() === 'single') {
      $('.multipleHarvest').hide();
      $('input[name=no_of_harvesting]').val('');
    }
  });
});
