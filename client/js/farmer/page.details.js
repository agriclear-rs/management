import { Notify } from 'rumsan-ui';
import FarmerEdit from './edit.panel';
import ImageUpload from './page.image';
import SeedTable from '../seed/seed.list.panel';

$(document).ready(() => {
  const fe = new FarmerEdit({ target: '#farmerDetailsPanel', id: farmerId });
  const st = new SeedTable({ target: '#seed-table', url: `?farmer=${farmerId}` });
  const imagePanel = new ImageUpload({ target: '#imageUpload' });

  imagePanel.on('image-uploaded', async (e, d) => {
    Notify.warning('Image Uploading');
    const image = await imagePanel.upload(d);
    $('#farmer_image').attr('src', image);
    $('input[name=image_url]').val(image);
    Notify.show('Image Uploaded');
  });

  $('#btnGoBack').on('click', () => {
    window.location.replace('/farmers');
  });

  fe.on('farmer-updated', () => {
    Notify.show('Farmer Details Updated Successfully');
    setTimeout(() => {
      window.location.href = '/farmers';
    }, 2000);
  });
});
