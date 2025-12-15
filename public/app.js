// Hämta DOM-element
const galleryGrid = document.getElementById('gallery-grid');
const favoritesGrid = document.getElementById('favorites-grid');
const imageForm = document.getElementById('imageForm');
const modalOverlay = document.getElementById('modalOverlay');

// --- 1. NAVIGERING (SPA LOGIK) ---
const navLinks = document.querySelectorAll('.nav-link');
const views = document.querySelectorAll('.view-section');
const pageTitle = document.getElementById('page-title');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // 1. Ta bort 'active' från alla länkar och lägg på den klickade
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // 2. Dölj alla vyer
        views.forEach(view => view.classList.add('hidden'));

        // 3. Visa rätt vy baserat på data-target
        const targetId = link.getAttribute('data-target');
        document.getElementById(`view-${targetId}`).classList.remove('hidden');

        // 4. Uppdatera rubriken
        if(targetId === 'dashboard') pageTitle.innerText = 'Översikt';
        if(targetId === 'favorites') {
            pageTitle.innerText = 'Dina Favoriter';
            renderFavorites(); // Uppdatera favoritlistan när vi går dit
        }
        if(targetId === 'settings') pageTitle.innerText = 'Inställningar';
    });
});

// --- 2. DATAHANTERING ---
let allImages = []; // Vi sparar bilderna lokalt för snabb åtkomst

async function fetchImages() {
    try {
        const res = await fetch('/api/images');
        const json = await res.json();
        allImages = json.data;
        renderGallery();
    } catch (err) {
        console.error(err);
    }
}

// Rendera Huvudgalleriet
function renderGallery() {
    galleryGrid.innerHTML = allImages.map(img => createCardHTML(img)).join('');
}

// Rendera Favoriter (Filtrera bara de som är favoriter)
function renderFavorites() {
    const favs = allImages.filter(img => img.isFavorite === 1);
    favoritesGrid.innerHTML = favs.length 
        ? favs.map(img => createCardHTML(img)).join('') 
        : '<p style="color:#666">Inga favoriter än.</p>';
}

// HTML för ett kort
function createCardHTML(image) {
    const heartClass = image.isFavorite ? 'ri-heart-fill liked' : 'ri-heart-line';
    return `
        <div class="card">
            <img src="${image.imageUrl}" class="card-img" onerror="this.src='https://via.placeholder.com/400?text=No+Img'">
            <div class="card-body">
                <h3>${image.title}</h3>
                <p>${image.description || ''}</p>
                <div class="card-actions">
                    <button onclick="toggleFavorite(${image.id}, ${image.isFavorite})" class="action-btn ${image.isFavorite ? 'liked' : ''}">
                        <i class="${heartClass}"></i>
                    </button>
                    <button onclick="deleteImage(${image.id})" class="action-btn delete">
                        <i class="ri-delete-bin-line"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// --- 3. INTERAKTIONER ---

// Gilla / Ogilla
window.toggleFavorite = async (id, currentStatus) => {
    const newStatus = currentStatus ? 0 : 1; // Byt mellan 0 och 1
    
    await fetch(`/api/images/${id}/favorite`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFavorite: newStatus })
    });
    
    fetchImages(); // Hämta ny data för att uppdatera ikonen
};

// Radera
window.deleteImage = async (id) => {
    if(!confirm("Vill du verkligen ta bort denna design?")) return;

    await fetch(`/api/images/${id}`, { method: 'DELETE' });
    fetchImages();
};

// Lägg till ny (Modal logic)
document.getElementById('openModalBtn').addEventListener('click', () => modalOverlay.classList.remove('hidden'));
document.getElementById('closeModalBtn').addEventListener('click', () => modalOverlay.classList.add('hidden'));

imageForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('titleInput').value;
    const imageUrl = document.getElementById('urlInput').value;
    const description = document.getElementById('descInput').value;

    await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, imageUrl, description })
    });

    imageForm.reset();
    modalOverlay.classList.add('hidden');
    fetchImages();
});

// Start
fetchImages();