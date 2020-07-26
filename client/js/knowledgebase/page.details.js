import { Notify } from 'rumsan-ui';
import KnowledgeEdit from './edit.panel';
import ImageUpload from './page.image';

$(document).ready(() => {
  const ke = new KnowledgeEdit({ target: '#knowledgeDetailsPanel', id: knowledgeId });
  const imagePanel = new ImageUpload({ target: '#imageUpload' });

  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#crop_image').attr('src', image);
    $('input[name=image_url]').val(image);
    Notify.show('Image Uploaded');
  });

  $('#btnGoBack').on('click', () => {
    window.location.replace('/knowledgebase');
  });

  $('#is_recurring').on('change', function () {
    if ($(this).prop('checked') === false) {
      $('input[name=recurring_years]').val('');
    }
  });

  ke.on('knowledge-updated', () => {
    Notify.show('Crop Details Updated Successfully');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  });

  $('input[name=harvesting_cycle]').on('change', function () {
    if ($(this).attr('id') === 'radio1') {
      $('input[id=radio1]').attr('checked', 'checked').val('single'); $('#radio2').removeAttr('checked');
    }
    if ($(this).attr('id') === 'radio2') {
      $('input[id=radio2]').attr('checked', 'checked').val('multiple'); $('#radio1').removeAttr('checked');
    }
  });
});
