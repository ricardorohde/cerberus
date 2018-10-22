let SELECTED_IMAGE = undefined;

window.addEventListener("keydown", function(e){
  if(e.keyCode === 69 && e.altKey && e.shiftKey) document.getElementById("cib-target").classList.remove('-hide');
  if(e.keyCode === 27) document.getElementById("cib-target").classList.add('-hide');
});

function UI() {}

function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function handleChangeSearchInput(e) {
  startLoad();
  const modal = document.querySelector('#cib-modal');
  const value = e.value;
  if(value.length) {
    setTimeout(function() {
      activeForm('choose-form');
      modal.classList.add('-active');
      e.focus();
      stopLoad();
    }, 3000)
  } else {
    setTimeout(function() {
      disableForms();
      modal.classList.remove('-active');
      stopLoad();
    }, 3000)
  }
}

function _handleSelectImage(e) {
  const value = e.value;
  SELECTED_IMAGE = value;
  const contacts = document.querySelector('#cib-send');
  contacts.classList.remove('-hide')
  contacts.classList.add('-show')
}

function _handleContactChange(e, contacts) {
  const value = e.value;
  const items = $('#cib-contact-list li');

  items.map(function (i) {
    if (items[i].outerText.toLowerCase().indexOf(value.toLowerCase()) === -1) {
      items[i].classList.add('-hide')
    } else {
      items[i].classList.remove('-hide')
    }
  });
}

function activeForm(id) {
  disableForms();
  const form = document.querySelector(`#${id}`);
  form.classList.add('-show');
  form.classList.remove('-hide');
}

function disableForms() {
  const forms = document.querySelectorAll('.form-wrapper');
  forms.forEach(function(form) {
    form.classList.add('-hide');
    form.classList.remove('-show');
  })
}

function _clearForm() {
  SELECTED_IMAGE = "";
  const contacts = $('#cib-contact-list li input');
  contacts.map(function(i){ contacts[i].checked = false});

  const images = $('input.meme-check-input');
  images.map(function(i){ images[i].checked = false})
  const n = $('.input-group > input#term')[0];
  n.value = "";
}

function startLoad() {
  disableForms();
  const loading = document.querySelector('.cib-loading-wrapper');
  loading.classList.remove('-hide');
  loading.classList.add('-show');
}

function stopLoad() {
  const loading = document.querySelector('.cib-loading-wrapper');
  loading.classList.remove('-show');
  loading.classList.add('-hide');
}

UI.prototype.run = function () {
  setTimeout( function () {
  const d = document.createElement('div');
  d.id = 'cib-target';
  d.classList.add('-hide')

  const c = window.WAPI.getAllContacts();
  let filteredContacts = c;

  // Carrega json da api
  let i = [];

  $.get( "https://ursal.dev.org.br/api/memes/", function( data ) {
    
    const r = {
      "name": "Luke",
      "images": data,
      "contacts": filteredContacts
    };

    const s = document.createElement('script');
    s.id = 'template';
    s.type = 'x-tmpl-mustache';
    s.text = `    
    <section id='cib-modal'>
      <button onclick="_clearForm()">Limpar</button>
      <div class="search-wrapper">
        <h1><img src="{{icons.cerberus}}"> Cerberus</h1>
        <form id="cib-search">
          <div class="input-group">
            <input autocomplete="off" onkeyup="handleChangeSearchInput(this)" oplaceholder="pesquise" id="term" name="term" />
            <img src="{{icons.search}}" />
          </div>
        </form>
      </div>
      <div class='cib-loading-wrapper -hide'>
        <img src="{{icons.loading}}">
      </div>
      <div class="form-wrapper choose-wrapper -hide" id="choose-form">
        <form id="choose">
          <ul>
            {{#images}}
            <li class='choose-item'>
              <input class='meme-check-input' onclick="_handleSelectImage(this)" type="radio" id="meme_{{id}}" name="meme[]" value="{{id}}" />
              <label for="meme_{{id}}" ><img src='{{thumb_base64}}' /></label>
            </li>
            {{/images}}
          </ul>
        </form>
      </div>
      <div class="send-wrapper">
        <form id="cib-send" class="-hide">
          <h2>Destinatários</h2>
          <input onkeyup="_handleContactChange(this)" placeholder="Procure os contatos" id="contactInput" name="contact" />
          <ul id='cib-contact-list'>
            {{#contacts}}
            <li key={{id._serialized}} data-name={{name}}>
              <input
                type="checkbox"
                id={{id._serialized}}
              />
              <label for='{{id._serialized}}'>
                {{formattedName}}
              </label>
            </li>
            {{/contacts}}
          </ul>
          <button type="submit">enviar</button>
        </form>
      </div>
    </section>
    `;

    document.body.appendChild(d);
    document.body.appendChild(s);

    var t = $('#template').html();
    Mustache.parse(t);

    r.icons = JSON.parse(window.sessionStorage.getItem('cerberus-icons'));
    var rendered = Mustache.render(t, r);
    $('#cib-target').html(rendered);

    $('#cib-search').submit(function(e) {
      e.preventDefault();
      console.log('buscou');
    });

    $('#choose').submit(function(e) {
      e.preventDefault();
      window.imageSelected = jQuery(e.currentTarget).find(":checked").parent().find("img");

      console.log('escolheu');
    });

    $('#cib-send').submit(function(e) {
      e.preventDefault();

      const c = jQuery(e.currentTarget).find(":checked");
      for(let x = 0; x < c.length; x++) {
        $.get( "https://ursal.dev.org.br/api/memes/" + SELECTED_IMAGE + '/', function( data ) {
          const n = c[x].id.replace("send-message-", "");
          window.WAPI.sendImage(data, n, "imagename", "", console.log)
          console.log("enviou");
        });
      };
    });

    console.log("Carregamento UI Finalizada")
  });
  }, 3000);
}