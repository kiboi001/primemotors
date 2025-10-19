// ✅ Car Data (With Real Image Paths)
const cars = [
  { id:1, brand:"Toyota", model:"Corolla", year:2021, price:2200000, mileage:42000, color:"Gray", image:"images/2020.jpg" },
  { id:2, brand:"BMW", model:"M3", year:2019, price:6500000, mileage:30000, color:"Black", image:"images/m3.jpg" },
  { id:3, brand:"Toyota", model:"Supra", year:2022, price:8500000, mileage:15000, color:"White", image:"images/supra.jpg" },
  { id:4, brand:"Nissan", model:"GTR", year:2018, price:10500000, mileage:60000, color:"Silver", image:"images/gtr.jpg" },
  { id:5, brand:"Mercedes", model:"C300", year:2020, price:7200000, mileage:28000, color:"Black", image:"images/benz.jpg" }
];

// ✅ DOM Elements
const carsGrid = document.getElementById('cars');
const searchInput = document.getElementById('global-search');
const clearSearchBtn = document.getElementById('clear-search');
const brandFilter = document.getElementById('brand-filter');
const minPriceInput = document.getElementById('min-price');
const maxPriceInput = document.getElementById('max-price');
const sortSelect = document.getElementById('sort-select');
const applyFiltersBtn = document.getElementById('apply-filters');

// ✅ Modal
const modal = document.getElementById('modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalBody = document.getElementById('modal-body');
const closeModalBtn = document.getElementById('close-modal');

// ✅ Footer Year
const yearSpan = document.getElementById('year');
yearSpan.textContent = new Date().getFullYear(); 

// ✅ Initialize Page
function init() {
  populateBrandOptions();
  renderCars(cars);
  attachEvents();
}
init();

// ✅ Render Cars from Array
function renderCars(list){
  carsGrid.innerHTML = '';
  if(!list.length) {
    carsGrid.innerHTML = `<div style="color:gray;text-align:center;padding:20px">No cars found.</div>`;
    return;
  }
  list.forEach(car => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('data-id', car.id);
    card.innerHTML = `
      <div class="card-top">
        <img src="${car.image}" alt="${car.brand} ${car.model}" loading="lazy">
      </div>
      <div class="card-info">
        <h3>${car.brand} ${car.model}</h3>
        <div class="meta">
          <span>${car.year}</span> • 
          <span>${car.mileage.toLocaleString()} km</span> • 
          <strong>KSh ${car.price.toLocaleString()}</strong>
        </div>
      </div>`;
    card.addEventListener('click', () => openModal(car));
    carsGrid.appendChild(card);
  });
}

// ✅ Brand Dropdown Filter Options
function populateBrandOptions() {
  const brands = Array.from(new Set(cars.map(c => c.brand))).sort();
  brands.forEach(b => {
    const opt = document.createElement('option');
    opt.value = b;
    opt.textContent = b;
    brandFilter.appendChild(opt);
  });
}

// ✅ Filter + Sort + Search Logic
function applyAllFilters(){
  const query = searchInput.value.trim().toLowerCase();
  const brand = brandFilter.value;
  const minPrice = Number(minPriceInput.value) || 0;
  const maxPrice = Number(maxPriceInput.value) || Infinity;
  const sort = sortSelect.value;

  let filtered = cars.filter(car => {
    const text = `${car.brand} ${car.model} ${car.year}`.toLowerCase();
    const matchesQuery = !query || text.includes(query);
    const matchesBrand = (brand === 'all') || (car.brand === brand);
    const matchesPrice = (car.price >= minPrice) && (car.price <= maxPrice);
    return matchesQuery && matchesBrand && matchesPrice;
  });

  if(sort === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  if(sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if(sort === 'year-desc') filtered.sort((a,b) => b.year - a.year);

  renderCars(filtered);
}

// ✅ Search + Filter Event Listeners
function attachEvents(){
  let timer;
  searchInput.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(applyAllFilters, 150);
  });
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    applyAllFilters();
  });
  applyFiltersBtn.addEventListener('click', applyAllFilters);
  sortSelect.addEventListener('change', applyAllFilters);
  closeModalBtn.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  window.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeModal(); });
}

// ✅ Modal Popup on Car Click
function openModal(car){
  modal.style.display = 'flex';
  modalBody.innerHTML = `
    <img src="${car.image}" alt="${car.brand} ${car.model}" style="width:100%;border-radius:10px;">
    <h2>${car.brand} ${car.model}</h2>
    <p>Year: ${car.year}</p>
    <p>Mileage: ${car.mileage.toLocaleString()} km</p>
    <p>Color: ${car.color}</p>
    <h3 style="margin-top:10px;">Price: KSh ${car.price.toLocaleString()}</h3>
  `;
  document.body.style.overflow = 'hidden';
}

function closeModal(){
  modal.style.display = 'none';
  modalBody.innerHTML = '';
  document.body.style.overflow = '';
}
