const DEFAULT_PRODUCTS = [
    { id: 1, name: "HUE 01 - Crimson Dusk", price: 45, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&q=80&w=1000", prompt: "A high-end editorial product shot of a crimson red t-shirt on a minimalist white backdrop." },
    { id: 2, name: "HUE 02 - Midnight Forest", price: 45, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000", prompt: "A deep forest green heavy-weight cotton t-shirt displayed in a minimalist art gallery setting." },
    { id: 3, name: "HUE 03 - Pure Slate", price: 45, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&q=80&w=1000", prompt: "A professional fashion flat-lay of a slate grey designer t-shirt on a cool-toned concrete surface." }
];

let products = [];
try {
    const stored = localStorage.getItem('hue_products');
    products = stored ? JSON.parse(stored) : [...DEFAULT_PRODUCTS];
    if (!stored) localStorage.setItem('hue_products', JSON.stringify(products));
} catch (e) {
    products = [...DEFAULT_PRODUCTS];
}

const productGrid = document.getElementById('product-grid');
const signupForm = document.getElementById('signup-form');
const emailInput = document.getElementById('email-input');

function saveProducts() {
    localStorage.setItem('hue_products', JSON.stringify(products));
}

// Toast
function createToast() {
    const el = document.createElement('div');
    el.id = 'toast';
    el.style.cssText = 'visibility:hidden;min-width:250px;margin-left:-125px;background-color:#1a1c1f;color:#fff;text-align:center;border-radius:8px;padding:16px;position:fixed;z-index:1000;left:50%;bottom:30px;font-size:14px;opacity:0;transition:opacity 0.5s,bottom 0.5s,visibility 0.5s;';
    document.body.appendChild(el);
    return el;
}
const toastEl = createToast();

function showToast(message) {
    toastEl.textContent = message;
    toastEl.style.visibility = 'visible';
    toastEl.style.opacity = '1';
    toastEl.style.bottom = '50px';
    setTimeout(() => {
        toastEl.style.opacity = '0';
        toastEl.style.bottom = '30px';
        toastEl.style.visibility = 'hidden';
    }, 3000);
}

// Story & Quality modal controls
function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
}
function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
}
function handleBackdropClick(e, id) {
    if (e.target.id === id) closeModal(id);
}

// Gallery render
function renderGallery() {
    productGrid.innerHTML = products.map(p => `
        <div class="group cursor-pointer">
            <div class="overflow-hidden mb-6 aspect-[4/5] bg-surface-container rounded-sm relative">
                <img src="${p.image}" alt="${p.prompt || 'Minimalist high-end fashion photography.'}" class="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105">
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
            </div>
            <div class="flex flex-col gap-1 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                <h3 class="font-body-md text-body-md text-primary font-medium tracking-wide">${p.name}</h3>
                <p class="font-body-md text-[14px] text-secondary font-light">$${p.price}</p>
            </div>
        </div>
    `).join('');
}

// ---------- Admin Panel (generated dynamically, not in HTML source) ----------
let adminModal, adminModalContent, adminProductList, addProductForm;

function buildAdminHTML() {
    const backdrop = document.createElement('div');
    backdrop.id = 'admin-modal';
    backdrop.className = 'fixed inset-0 z-[100] hidden items-center justify-center p-6 bg-black/40 backdrop-blur-md transition-opacity';

    const content = document.createElement('div');
    content.id = 'admin-modal-content';
    content.className = 'bg-white/80 dark:bg-black/80 backdrop-blur-2xl w-full max-w-4xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 dark:border-white/10 overflow-hidden flex flex-col max-h-[85vh] transform transition-transform scale-95 opacity-0 duration-300';

    content.innerHTML = `
        <div class="p-8 border-b border-surface-container-high/50 flex justify-between items-center bg-transparent sticky top-0 z-10">
            <h3 class="font-headline-md text-[24px] text-primary font-semibold tracking-tight">Inventory Management</h3>
            <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors bg-white/50 hover:bg-white/80 rounded-full p-2 backdrop-blur-sm" id="close-admin-btn">close</button>
        </div>
        <div class="p-8 overflow-y-auto space-y-12 bg-transparent">
            <!-- Add Product -->
            <div class="bg-white/40 dark:bg-black/40 p-8 rounded-2xl shadow-sm border border-white/20 backdrop-blur-xl">
                <h4 class="font-label-caps text-label-caps text-primary mb-6 uppercase tracking-widest">Register New Product</h4>
                <form class="grid grid-cols-1 md:grid-cols-2 gap-6" id="add-product-form">
                    <div class="flex flex-col gap-2">
                        <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Product Name</label>
                        <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm" id="new-name" required type="text">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Price (USD)</label>
                        <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm" id="new-price" required type="number">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Image URL (optional)</label>
                        <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm" id="new-image-url" placeholder="https://..." type="url">
                    </div>
                    <div class="flex flex-col gap-2">
                        <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Upload Image(s)</label>
                        <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm file:cursor-pointer file:border-0 file:bg-primary/10 file:rounded-lg file:px-3 file:py-1 file:text-primary file:font-label-caps file:text-[11px]" id="new-image-file" accept="image/*" type="file">
                        <div class="flex gap-2 flex-wrap" id="image-previews"></div>
                    </div>
                    <div class="md:col-span-2 pt-2">
                        <button class="w-full bg-primary/90 backdrop-blur-md text-on-primary py-4 rounded-xl font-label-caps text-label-caps hover:bg-black transition-colors uppercase tracking-widest shadow-md border border-white/10" type="submit">Synchronize Catalog</button>
                    </div>
                </form>
            </div>
            <!-- Product List -->
            <div>
                <h4 class="font-label-caps text-label-caps text-primary mb-6 uppercase tracking-widest">Current Inventory</h4>
                <div class="space-y-3" id="admin-product-list"></div>
            </div>
        </div>
    `;

    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    adminModal = backdrop;
    adminModalContent = content;
    adminProductList = document.getElementById('admin-product-list');
    addProductForm = document.getElementById('add-product-form');

    document.getElementById('close-admin-btn').addEventListener('click', closeAdmin);
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeAdmin(); });

    // File input preview
    document.getElementById('new-image-file').addEventListener('change', function(e) {
        const container = document.getElementById('image-previews');
        container.innerHTML = '';
        Array.from(e.target.files).forEach((file, i) => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const img = document.createElement('img');
                img.src = ev.target.result;
                img.className = 'w-16 h-16 rounded-lg object-cover border border-white/20';
                img.title = file.name;
                container.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
    });

    addProductForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('new-image-file');
        const urlInput = document.getElementById('new-image-url');
        const hasFile = fileInput.files && fileInput.files.length > 0;
        const hasUrl = urlInput.value.trim() !== '';

        const processAdd = (imageSrc) => {
            const newProd = {
                id: Date.now(),
                name: document.getElementById('new-name').value,
                price: document.getElementById('new-price').value,
                image: imageSrc,
                prompt: "Professional minimalist fashion product image."
            };
            products.push(newProd);
            saveProducts();
            syncUI();
            addProductForm.reset();
            document.getElementById('image-previews').innerHTML = '';
            showToast("Product added to catalog");
        };

        if (hasFile) {
            const reader = new FileReader();
            reader.onload = (ev) => processAdd(ev.target.result);
            reader.readAsDataURL(fileInput.files[0]);
        } else if (hasUrl) {
            processAdd(urlInput.value);
        } else {
            showToast("Please provide an image URL or upload a file.");
        }
    });
}

function renderAdminList() {
    adminProductList.innerHTML = products.map(p => `
        <div class="flex items-center justify-between p-4 rounded-2xl border border-white/20 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow">
            <div class="flex items-center gap-4">
                <div class="w-14 h-14 rounded-xl bg-surface-container overflow-hidden flex-shrink-0">
                    <img src="${p.image}" class="w-full h-full object-cover">
                </div>
                <div>
                    <p class="font-body-md text-[14px] font-medium text-primary">${p.name}</p>
                    <p class="font-body-md text-[13px] text-secondary font-light">$${p.price}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button class="edit-btn p-2 hover:bg-white/50 rounded-full transition-colors text-secondary hover:text-primary" data-id="${p.id}">
                    <span class="material-symbols-outlined text-[20px]">edit</span>
                </button>
                <button class="delete-btn p-2 hover:bg-error-container/50 rounded-full transition-colors text-secondary hover:text-error" data-id="${p.id}">
                    <span class="material-symbols-outlined text-[20px]">delete</span>
                </button>
            </div>
        </div>
    `).join('');

    adminProductList.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(parseInt(btn.dataset.id)));
    });
    adminProductList.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            products = products.filter(p => p.id !== id);
            saveProducts();
            syncUI();
            showToast("Product deleted permanently");
        });
    });
}

function openEditModal(id) {
    const prod = products.find(p => p.id === id);
    if (!prod) return;

    const existing = document.getElementById('edit-modal');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'edit-modal';
    backdrop.className = 'fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md';

    const content = document.createElement('div');
    content.className = 'bg-white/90 dark:bg-black/90 backdrop-blur-2xl w-full max-w-lg rounded-3xl shadow-2xl border border-white/20 dark:border-white/10 overflow-hidden relative';

    content.innerHTML = `
        <button class="absolute top-6 right-6 material-symbols-outlined text-secondary hover:text-primary transition-colors z-20" id="close-edit-btn">close</button>
        <div class="p-10 space-y-6">
            <h3 class="font-headline-md text-headline-md text-primary tracking-tight">Edit Product</h3>
            <form id="edit-product-form" class="space-y-5">
                <div class="flex flex-col gap-2">
                    <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Product Name</label>
                    <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm" id="edit-name" value="${prod.name}" required type="text">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Price (USD)</label>
                    <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm" id="edit-price" value="${prod.price}" required type="number">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Image URL</label>
                    <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm" id="edit-image-url" value="${prod.image}" type="url" placeholder="https://...">
                </div>
                <div class="flex flex-col gap-2">
                    <label class="font-label-caps text-[10px] text-secondary uppercase tracking-widest">Replace with Upload (optional)</label>
                    <input class="bg-white/50 border-none focus:ring-1 focus:ring-primary rounded-xl p-3 font-body-md transition-shadow backdrop-blur-sm file:cursor-pointer file:border-0 file:bg-primary/10 file:rounded-lg file:px-3 file:py-1 file:text-primary file:font-label-caps file:text-[11px]" id="edit-image-file" accept="image/*" type="file">
                    <div class="w-20 h-20 rounded-xl overflow-hidden border border-white/20 mt-2">
                        <img src="${prod.image}" class="w-full h-full object-cover" id="edit-preview">
                    </div>
                </div>
                <button class="w-full bg-primary/90 backdrop-blur-md text-on-primary py-4 rounded-xl font-label-caps text-label-caps hover:bg-black transition-colors uppercase tracking-widest shadow-md border border-white/10" type="submit">Save Changes</button>
            </form>
        </div>
    `;

    backdrop.appendChild(content);
    document.body.appendChild(backdrop);

    document.getElementById('close-edit-btn').addEventListener('click', () => backdrop.remove());
    backdrop.addEventListener('click', (e) => { if (e.target === backdrop) backdrop.remove(); });

    document.getElementById('edit-image-file').addEventListener('change', function(e) {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                document.getElementById('edit-preview').src = ev.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    document.getElementById('edit-product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const fileInput = document.getElementById('edit-image-file');
        const urlInput = document.getElementById('edit-image-url');
        const name = document.getElementById('edit-name').value;
        const price = document.getElementById('edit-price').value;

        const applyEdit = (imageSrc) => {
            prod.name = name;
            prod.price = price;
            prod.image = imageSrc;
            saveProducts();
            syncUI();
            backdrop.remove();
            showToast("Product updated permanently");
        };

        if (fileInput.files && fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => applyEdit(ev.target.result);
            reader.readAsDataURL(fileInput.files[0]);
        } else {
            applyEdit(urlInput.value);
        }
    });
}

function openAdmin() {
    if (!adminModal) buildAdminHTML();
    adminModal.classList.remove('hidden');
    adminModal.classList.add('flex');
    setTimeout(() => {
        adminModalContent.classList.remove('scale-95', 'opacity-0');
        adminModalContent.classList.add('scale-100', 'opacity-100');
    }, 10);
    renderAdminList();
}

function closeAdmin() {
    adminModalContent.classList.remove('scale-100', 'opacity-100');
    adminModalContent.classList.add('scale-95', 'opacity-0');
    setTimeout(() => {
        adminModal.classList.remove('flex');
        adminModal.classList.add('hidden');
    }, 300);
}

function syncUI() {
    renderGallery();
    if (adminProductList) renderAdminList();
}

// Signup form
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (emailInput.value.toLowerCase() === 'adminpanel') {
        openAdmin();
        emailInput.value = '';
        showToast("Admin mode authenticated");
    } else {
        showToast("Thank you for joining our journal.");
        emailInput.value = '';
    }
});

// Initialize
renderGallery();
