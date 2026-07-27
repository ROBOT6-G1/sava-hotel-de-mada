// DEVWEB IA - App JS for Apex Solutions Vitrine Enterprise

const DEFAULT_SERVICES = [
  {
    id: '1',
    title: 'Consulting Stratégique',
    price: 'A partir de 500 000 Ar',
    desc: 'Fanadihadiana sy fanatsarana ny paikady momba ny varotra sy ny fandrosoan orinasa.',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '2',
    title: 'Développement Nomerika',
    price: 'A partir de 800 000 Ar',
    desc: 'Famoronana tranonkala matihanina sy rindrankajy ho an ny fitantanana anatiny.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '3',
    title: 'Formation & Coaching',
    price: 'A partir de 300 000 Ar',
    desc: 'Fampiofanana ny ekipa sy fampiasana fitaovana maoderina entina mampitombo ny vokatra.',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  }
];

let locationData = {
  name: 'Apex Solutions - Vitrine Entreprise',
  address: 'Lot 206, rue Rn5, Antalaha/ Antsiranana/ SAVA Madagascar',
  phone: '+261323911654',
  whatsapp: '261323911654',
  hours: 'Lundi - Samedi: 08h00 - 18h00',
  notes: 'Akaiky école AVE MARIA Ambondrona'
};

document.addEventListener('DOMContentLoaded', () => {
  loadLocationJson();
  initServices();
  initFaqAccordion();
  initContactForm();
});

async function loadLocationJson() {
  try {
    const res = await fetch('location.json');
    if (res.ok) {
      const data = await res.json();
      locationData = { ...locationData, ...data };
      updateLocationUI();
    }
  } catch (e) {
    console.log('Location.json fallback active');
  }
}

function updateLocationUI() {
  const addrElems = document.querySelectorAll('.loc-address');
  const phoneElems = document.querySelectorAll('.loc-phone');
  const hoursElems = document.querySelectorAll('.loc-hours');
  const notesElems = document.querySelectorAll('.loc-notes');

  addrElems.forEach(el => el.textContent = locationData.address);
  phoneElems.forEach(el => el.textContent = locationData.phone);
  hoursElems.forEach(el => el.textContent = locationData.hours);
  notesElems.forEach(el => el.textContent = locationData.notes);
}

function getStoredServices() {
  const stored = localStorage.getItem('apex_services');
  if (!stored) {
    localStorage.setItem('apex_services', JSON.stringify(DEFAULT_SERVICES));
    return DEFAULT_SERVICES;
  }
  return JSON.parse(stored);
}

function initServices() {
  const container = document.getElementById('services-container');
  const pageContainer = document.getElementById('services-page-container');
  const services = getStoredServices();

  const html = services.map(s => `
    <div class="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden card-hover flex flex-col justify-between">
      <div>
        <img src="${s.image}" alt="${s.title}" class="w-full h-48 object-cover" onerror="this.onerror=null;this.src='https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80';">
        <div class="p-6 space-y-3">
          <div class="flex justify-between items-start">
            <h3 class="text-xl font-bold text-white">${s.title}</h3>
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">${s.price}</span>
          </div>
          <p class="text-slate-400 text-sm leading-relaxed">${s.desc}</p>
        </div>
      </div>
      <div class="p-6 pt-0">
        <button onclick="quickOrder('${s.title}')" class="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-sky-500 hover:text-slate-950 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center gap-2">
          <i class="fa-brands fa-whatsapp text-emerald-400"></i> Nangatahana Devis Direct
        </button>
      </div>
    </div>
  `).join('');

  if (container) container.innerHTML = html;
  if (pageContainer) pageContainer.innerHTML = html;
}

function initFaqAccordion() {
  const btns = document.querySelectorAll('.faq-btn');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('i');
      content.classList.toggle('hidden');
      icon.classList.toggle('rotate-180');
    });
  });
}

function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('clientName').value;
    const phone = document.getElementById('clientPhone').value;
    const service = document.getElementById('clientService').value;
    const message = document.getElementById('clientMessage').value;

    const newMsg = { name, phone, service, message, date: new Date().toLocaleString() };
    const msgs = JSON.parse(localStorage.getItem('apex_messages') || '[]');
    msgs.push(newMsg);
    localStorage.setItem('apex_messages', JSON.stringify(msgs));

    // Push notification trigger
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Hafatra Vaovao!", { body: `${name} dia nandefa hafatra momba ny ${service}` });
    } else if ("Notification" in window) {
      Notification.requestPermission();
    }

    // WhatsApp Redirect
    const defaultPhone = locationData.whatsapp || "261323911654";
    const text = `🛒 HAFATRA VOAO - Apex Solutions Antalaha:\n- Anarana: ${name}\n- Tel: ${phone}\n- Serivisy: ${service}\n- Hafatra: ${message}`;
    const waUrl = `https://wa.me/${defaultPhone}?text=${encodeURIComponent(text)}`;
    
    window.open(waUrl, '_blank');
    form.reset();
  });
}

function quickOrder(serviceTitle) {
  const defaultPhone = locationData.whatsapp || "261323911654";
  const text = `🛒 DEMANDE DE DEVIS - Apex Solutions Antalaha:\n- Serivisy: ${serviceTitle}\nTe hahalala ny antsipiriany kokoa aho.`;
  window.open(`https://wa.me/${defaultPhone}?text=${encodeURIComponent(text)}`, '_blank');
}