import {
  Form, Panel, Notify, Session,
} from 'rumsan-ui';
import Service from './service';
import config from '../config';

class KnowledgeEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.id = cfg.id;
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('knowledge-updated');
    this.loadData(this.id);
    this.comp.submit((e) => {
      e.preventDefault();
      this.save();
    });
  }

  async loadData(id) {
    const data = await Service.getById(id);
    if (!data) return;
    if (data.variety) data.variety = data.variety.join(',');
    if (data.recommended_domains) data.recommended_domains = data.recommended_domains.join(',');
    this.form.set(data);
    const variety = data.variety.toString();
    const domains = data.recommended_domains.toString();
    document.getElementById('crop_image').src = data.image_url;
    $("input[name='variety']").tagsinput('add', variety);
    $("input[name='recommended_domains']").tagsinput('add', domains);
    if (data.harvesting_cycle === 'single') {
      $('input[id=radio1]').attr('checked', 'checked');
    }
    if (data.harvesting_cycle === 'multiple') {
      $('input[id=radio2]').attr('checked', 'checked');
    }
  }

  async save() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    if (data.variety) data.variety = data.variety.split(',');
    if (data.recommended_domains) data.recommended_domains = data.recommended_domains.split(',');
    if (!data.image_url) data.image_url = 'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png';
    await Service.update(this.id, data);
    this.fire('knowledge-updated', data);
  }
}

export default KnowledgeEdit;
