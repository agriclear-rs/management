import {
  Form, Panel, Notify, Session,
} from 'rumsan-ui';
import Service from './service';
import config from '../config';

class SeedEdit extends Panel {
  constructor(cfg) {
    super(cfg);
    this.id = cfg.id;
    this.form = new Form({ target: `${cfg.target} form` });
    $('#chooseStage').select2({ placeholder: 'Choose Stage', minimumResultsForSearch: -1 });
    $('#chooseQuestion').select2({
      placeholder: 'Choose Stage First',
      minimumResultsForSearch: -1,
    });
    this.registerEvents('seed-updated', 'comment-posted', 'reply-comment', 'comment-read', 'unassignFarmer', 'unassignDistributor');
    this.loadData(this.id);
    this.on('reply-comment', (d, param) => {
      const question = $(param).parent().parent().parent()
        .find('.card-title')
        .eq(0)
        .text()
        .trim();
      const comment = $(param).parent().parent().find('input')
        .val();
      this.addComment(question, comment);
    });
    this.on('comment-read', (d, param) => {
      const question = $(param).parent().parent().parent()
        .find('.card-title')
        .eq(0)
        .text()
        .trim();
      this.updateStatus(question, param);
    });
    this.on('unassignFarmer', (d, param) => {
      this.unassignFarmer(param);
    });
    this.on('unassignDistributor', (d, param) => {
      this.unassignDistributor(param);
    });
    this.comp.submit((e) => {
      e.preventDefault();
      this.save();
    });
  }

  async loadData(id) {
    let data = await Service.getById(id);
    data = data.data[0];
    if (!data) return;
    this.form.set(data);
    if (data.image_url) $('#seed_image').attr('src', data.image_url);
    for (const elem in data) {
      if (data[elem] === true) {
        $(`#${elem}`).attr('checked', 'checked');
      }
    }
    this.loadImage('additive_image_url', 'additive', data);
    this.loadImage('assurance_doc_url', 'assurance', data);
    this.loadImage('seedling_image_url', 'seedling', data);
    this.loadImage('seedling_purchase_receipt_url', 'purchase', data);
    this.loadImage('seedling_transplant_image_url', 'transplant', data);
    this.loadImage('fertilizer_image_url', 'fertilizer', data);
    this.loadImage('plant_image_url', 'plantImage', data);
    this.loadImage('harvested_image_url', 'harvestImg', data);
    this.loadImage('pesticide_image_url', 'pesticide', data);
    this.loadComments();
    this.loadTasks(data.tasks);
  }

  async loadDistributorData() {
    let data = await Service.getById(this.id);
    [data] = [data.data[0]];
    const distributors = data.distributors.map((distributor) => this.appendInfo(distributor, 'distributorAssign', 'appendDistributor', 'distributors', 'unassignDistributor'));
  }

  async loadFarmerData() {
    let data = await Service.getById(this.id);
    [data] = [data.data[0]];
    const farmers = data.farmers.map((farmer) => this.appendInfo(farmer, 'farmerAssign', 'appendFarmer', 'farmers', 'unassignFarmer'));
  }

  async save() {
    if (!this.comp.validate()) return;
    const data = this.form.get();
    data.farmers = this.getFarmer();
    data.distributors = this.getDistributor();
    await Service.update(this.id, data);
    this.fire('seed-updated', data);
  }

  loadImage(input, target, data) {
    data[`${input}`].map((d) => {
      if (d) {
        $(`#${target}`).append(
          `<div class="col-md-3"><img src="${d}" class="rounded" height="165px" width="155px" style="margin: auto;"/></div>`,
        );
      }
    });
    $(`input[name=${input}]`).val(data[`${input}`].join(','));
  }

  async addComment(question, comment) {
    const user = JSON.parse(localStorage.getItem('user'));
    let userType;
    if (user.roles.includes('Admin')) userType = 'admin';
    if (user.roles.includes('Farmer')) userType = 'farmer';
    if (user.roles.includes('Distributor')) userType = 'distributor';
    if (!userType) return;
    const res = await Service.addComment(this.id, question, comment, userType);
    if (res) this.fire('comment-posted');
  }

  async loadComments() {
    const data = await Service.getComments(this.id);
    const comments = data.data;
    // all questions
    const questions = comments.map((d) => d.question);
    // unique questions
    const uniqueQuestions = questions.filter(function (a) {
      return !this[a] ? (this[a] = true) : false;
    }, {});
    const farComments = [
      'Did you treat your seed with additives/pesticides?',
      'Did you prepare your seedling?',
      'Did you transplant your seedlings?',
      'Did you add fertilizer?',
      'Is the plant infected/infested by pests?',
      'Did you add pestcide?',
      'Did you use untreated human sewage?',
      'Did you test water for contaimnation?',
      'Did you use sewage water during production?',
      'Did you harvest the fruit?',
      'Is the product contaminated?',
      'Did you isolate the contaminated product?',
    ];
    const disComments = [
      'Did you collect product?',
      'Did you use any chemicals and waxes for post-harvest?',
      'Did you wash and clean the product?',
      'Did you use sewage water for post-harvest handling?',
      'Was the product contaminated?',
      'Did you isolate the product that was contaminated?',
      'Is the product packaged?',
    ];
    let i = 1;
    const user = JSON.parse(localStorage.getItem('user'));
    const is_exist = uniqueQuestions.map((d) => {
      if (disComments.includes(d) && (user.roles.includes('Admin') || user.roles.includes('Distributor'))) {
        const filteredData = comments.filter((data) => data.question === d);
        this.setDistributorQuestion(d, i);
        filteredData.map((e) => {
          this.setComment(`disComment${i}`, e);
        });
        this.setReply(`disComment${i}`);
        i++;
        return { is_disComment_exist: true };
      } return { is_disComment_exist: false };
    });
    const is_exist2 = uniqueQuestions.map((d) => {
      if (farComments.includes(d) && (user.roles.includes('Admin') || user.roles.includes('Farmer'))) {
        const filteredData = comments.filter((data) => data.question === d);
        this.setFarmerQuestion(d, i);
        filteredData.map((e) => {
          this.setComment(`farComment${i}`, e);
        });
        this.setReply(`farComment${i}`);
        i++;
        return { is_farComment_exist: true };
      }
      return { is_farComment_exist: false };
    });

    const x = is_exist2.map((d) => {
      if (d.is_farComment_exist === true) {
        return true;
      }
      return false;
    });
    if (x.includes(true)) $('#infoComment .alert').hide();

    const y = is_exist.map((d) => {
      if (d.is_disComment_exist === true) {
        return true;
      }
      return false;
    });
    if (y.includes(true)) { $('#infoComment .alert').hide(); }
  }

  setDistributorQuestion(d, i) {
    $('#infoComment').append(
      ` <div class="card"><div class="card-body row" id="disComment${i}"><div class="col-md-3 text-center"><h4>Topic:</h4></div><div class="col-md-7 text-center"><h3 class="card-title">${d}</h3></div></div></div>`,
    );
  }

  setFarmerQuestion(d, i) {
    $('#infoComment').append(
      ` <div class="card"><div class="card-body row" id="farComment${i}"><div class="col-md-3 text-center"><h4>Topic:</h4></div><div class="col-md-7 text-center"><h4 class="card-title">${d}</h4></div></div></div>`,
    );
  }

  setComment(id, e) {
    let { userType } = e;
    let style;
    let msgTitle;
    const user = JSON.parse(localStorage.getItem('user'));
    if (
      (user.roles.includes('Admin') && e.userType === 'admin')
      || (user.roles.includes('Farmer') && e.userType === 'farmer')
      || (user.roles.includes('Distributor') && e.userType === 'distributor')
    ) {
      userType = 'You';
    }
    const date = e.created_at.split('T')[0];
    const is_new = this.checkIsNew(user.roles, e);
    let badgeText = '';
    if (is_new) {
      badgeText = '<i class="badge badge-pill badge-outline-danger">New</i>';
      if (id.includes('farComment')) document.getElementById('badge').style.opacity = '100';
      if (id.includes('disComment')) document.getElementById('badge').style.opacity = '100';
    }
    if (
      (user.roles.includes('Admin') && e.is_new === true && e.userType === 'admin')
      || (!user.roles.includes('Admin') && e.userType !== 'admin' && e.is_new === true)
    ) {
      style = '';
      msgTitle = 'Comment Delivered';
    } else if (
      (user.roles.includes('Admin') && e.userType !== 'admin')
      || (!user.roles.includes('Admin') && e.userType == 'admin')
    ) {
      style = 'display: none';
      msgTitle = '';
    } else {
      style = 'color: blue';
      msgTitle = 'Comment Seen';
    }
    $(`#${id}`).append(`
      <div class="col-md-12 row"><div class="col-md-3"><h4 class="card-title">[${date}]&nbsp;&nbsp;${userType}: </h4></div><div class="col-md-9 text-left"><h4 class="card-text">${e.comment}${badgeText}&nbsp;&nbsp;<i class="fa fa-check" style="${style}" title="${msgTitle}"></i></h4></div></div>`);
  }

  setReply(id) {
    $(`#${id}`).append(
      '<div class="col-md-12 row"><div class="col-md-3"></div><div class="col-md-7"><input type="text" class="form-control" placeholder="Click to Reply" onClick="$(\'#seedDetailsPanel\').trigger(\'comment-read\',this)"/></div><div class="col-md-2"><button type="button" class="btn btn-primary btn-reply" onClick="$(\'#seedDetailsPanel\').trigger(\'reply-comment\',this)">Post</button></div></div>',
    );
  }

  checkIsNew(roles, d) {
    let is_new = false;
    if (!roles.includes('Admin') && d.userType === 'admin' && d.is_new === true) is_new = true;
    if (roles.includes('Admin') && d.userType !== 'admin' && d.is_new === true) is_new = true;
    return is_new;
  }

  async updateStatus(question, param) {
    const user = JSON.parse(localStorage.getItem('user'));
    const data = await Service.getComments(this.id);
    const filteredData = data.data.filter((d) => d.question === question && d.is_new === true);
    filteredData.map(async (d) => {
      if (
        (d.userType === 'admin' && !user.roles.includes('Admin'))
        || (d.userType !== 'admin' && user.roles.includes('Admin'))
      ) {
        await Service.updateStatus(d._id);
        $(param).parent().parent().prev()
          .find('.badge')
          .remove();
      }
    });
  }

  async renderSelector(name, placeholder, url) {
    $(`select[id=${name}]`).select2({
      width: '50%',
      placeholder: `Select ${placeholder}`,
      ajax: {
        url: `${config.apiPath}/${url}`,
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
            d.text = d.name;
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

  appendInfo(d, id, appendClass, url, unassign) {
    if (!d.image_url) d.image_url = 'https://cdn4.iconfinder.com/data/icons/social-communication/142/add_photo-512.png';
    $(`#${id}`).append(`
    <div class="col-md-3 form-group ${appendClass}">
      <div class="ibox">
       <div class="ibox-content product-box">
         <div class="product-imitation" style="padding: 10px 0px!important;">
          <img src="${d.image_url}" width="200" height="200"></img>
          <i class="fa fa-window-close btn btn-danger" style="position: absolute; margin-left: -40px" onclick="$('#seedDetailsPanel').trigger('${unassign}','${d._id}')"></i>
         </div>
         <div class="product-desc">
             <span class="product-price">
                 ${d.name}
             </span>
             <div class="m-t text-center">
                 <a href="/${url}/${d._id}" class="btn btn-xs btn-outline btn-primary">Info <i class="fa fa-long-arrow-right"></i> </a>
             </div>
         </div>
       </div>
     </div>
   </div>
   `);
  }

  async assignFarmer(seedId, farmerId) {
    const res = await Service.updateFarmer(seedId, farmerId);
    if (res) {
      Notify.show('Farmer Assigned Successfully');
      $('.appendFarmer').remove();
      this.loadFarmerData();
    }
  }

  async assignDistributor(seedId, distributorId) {
    const res = await Service.updateDistributor(seedId, distributorId);
    if (res) {
      Notify.show('Distributor Assigned Successfully');
      $('.appendDistributor').remove();
      this.loadDistributorData();
    }
  }

  async unassignFarmer(id) {
    const res = await Service.unassignFarmer(seedId, id);
    if (res) {
      Notify.show('Farmer Unassigned Successfully');
      $('.appendFarmer').remove();
      this.loadFarmerData();
    }
  }

  async unassignDistributor(id) {
    const res = await Service.unassignDistributor(seedId, id);
    if (res) {
      Notify.show('Distributor Unassigned Successfully');
      $('.appendDistributor').remove();
      this.loadDistributorData();
    }
  }

  loadTasks(tasks) {
    let i = 1;
    tasks.map((task) => {
      $('#taskView').append(`
      <tr>
        <th>${task.date.split('T')[0]}</th>
        <th>${task.task}</th>
        <th>
          <div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input taskStatus" id="taskStatus${i}"
              name="taskStatus${i}" value='${task._id}'/>
            <label class="custom-control-label" for="taskStatus${i}">Yes</label>
          </div>
        </th>
      </tr>`);
      if (task.status === true) $(`#taskStatus${i}`).attr('checked', 'checked');
      i += 1;
    });
  }

  async updateTask(id, taskId, status) {
    const res = await Service.updateTask(id, taskId, status);
    if (status === true) Notify.show('Marked Complete');
    if (status === false) Notify.show('Marked Pending');
  }

  async getSeed(id) {
    const res = await Service.getById(id);
    return res;
  }

  async addTask(id, task) {
    const res = await Service.addTask(id, { task });
    if (!res) return;
    $('#mdlTaskAdd').modal('hide');
    $('#frmTask input').val('');
    Notify.show('Task added Successfully');
  }
}

export default SeedEdit;
