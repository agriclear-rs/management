import { Modal, Form, Session } from 'rumsan-ui';
import config from '../config';
import Service from './service';

class KnowledgeAdd extends Modal {
  constructor(cfg) {
    super(cfg);
    this.form = new Form({ target: `${cfg.target} form` });
    this.registerEvents('knowledge-added', 'knowledge-deleted');
    this.comp.submit((e) => {
      e.preventDefault();
      this.addKnowledge();
    });
  }

  async addKnowledge() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    data.variety = data.variety.split(',');
    if (data.recommended_domains) data.recommended_domains = data.recommended_domains.split(',');
    if (!data.image_url) data.image_url = 'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png';
    const resData = await Service.add(data);
    if (!resData) return;
    this.fire('knowledge-added', resData);
    this.form.clear();
    this.close();
  }

  async delete(id) {
    const isConfirm = await swal.fire({
      title: 'Are you sure?',
      text: 'You will delete this knowledge base permanently.',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    });
    if (isConfirm.value) {
      const resData = await Service.delete(id);
      if (!resData) return;
      this.fire('knowledge-deleted', resData);
    }
  }
}

export default KnowledgeAdd;
