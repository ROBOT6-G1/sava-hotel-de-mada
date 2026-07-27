// Espace Admin - Apex Solutions JavaScript

function checkAdminAuth() {
  const pass = document.getElementById('adminPass').value;
  if (pass === '1234') {
    document.getElementById('login-modal').classList.add('hidden');
    document.getElementById('admin-dashboard').classList.remove('hidden');
    loadAdminData();
  } else {
    alert('Teny miafina tsy marina! (Default: 1234)');
  }
}

function logoutAdmin() {
  document.getElementById('login-modal').classList.remove('hidden');
  document.getElementById('admin-dashboard').classList.add('hidden');
}

function loadAdminData() {
  renderAdminServices();
  renderAdminMessages();
}

function renderAdminServices() {
  const services = JSON.parse(localStorage.getItem('apex_services') || '[]');
  const container = document.getElementById('admin-services-list');
  if (!container) return;

  container.innerHTML = services.map((s, idx) => `
    <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-2">
      <img src="${s.image}" class="w-full h-28 object-cover rounded-lg">
      <h4 class="font-bold text-white text-sm">${s.title}</h4>
      <p class="text-xs text-sky-400 font-semibold">${s.price}</p>
      <button onclick="deleteService(${idx})" class="w-full py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white rounded-lg text-xs font-semibold transition">Fafana</button>
    </div>
  `).join('');
}

function deleteService(idx) {
  let services = JSON.parse(localStorage.getItem('apex_services') || '[]');
  services.splice(idx, 1);
  localStorage.setItem('apex_services', JSON.stringify(services));
  renderAdminServices();
}

function renderAdminMessages() {
  const msgs = JSON.parse(localStorage.getItem('apex_messages') || '[]');
  const container = document.getElementById('admin-messages-list');
  if (!container) return;

  if (msgs.length === 0) {
    container.innerHTML = `<p class="text-xs text-slate-500">Tsy misy hafatra vaovao.</p>`;
    return;
  }

  container.innerHTML = msgs.map(m => `
    <div class="p-4 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
      <div class="flex justify-between items-center text-xs text-sky-400 font-bold">
        <span>${m.name} (${m.phone})</span>
        <span class="text-slate-500">${m.date || ''}</span>
      </div>
      <span class="inline-block px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold">${m.service}</span>
      <p class="text-xs text-slate-300 mt-1">${m.message}</p>
    </div>
  `).join('');
}

// Handle Add Service Form
document.getElementById('add-service-form')?.addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('servTitle').value;
  const price = document.getElementById('servPrice').value;
  const desc = document.getElementById('servDesc').value;
  let imgUrl = document.getElementById('servImgUrl').value;
  const fileInput = document.getElementById('servImgFile');

  if (!imgUrl) {
    imgUrl = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';
  }

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function(evt) {
      // HTML5 Canvas Compressor (<150KB)
      const img = new Image();
      img.src = evt.target.result;
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 600;
        canvas.height = 400;
        ctx.drawImage(img, 0, 0, 600, 400);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        saveNewService(title, price, desc, compressedBase64);
      };
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    saveNewService(title, price, desc, imgUrl);
  }
});

function saveNewService(title, price, desc, image) {
  const services = JSON.parse(localStorage.getItem('apex_services') || '[]');
  services.push({ id: Date.now().toString(), title, price, desc, image });
  localStorage.setItem('apex_services', JSON.stringify(services));
  document.getElementById('add-service-form').reset();
  renderAdminServices();
  alert('Tafiditra soa aman-tsara ny serivisy vaovao!');
}