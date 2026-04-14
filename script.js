/* ============================================================
   SmartStock — Smart Inventory Management System
   Complete Application Logic
   ============================================================ */

// ==================== DATA STORE ====================

const Store = {
    currentUser: null,

    products: [
        { id: 1, name: 'Wireless Mouse', category: 'Electronics', quantity: 45, price: 899, supplier: 'TechWorld Supplies' },
        { id: 2, name: 'Mechanical Keyboard', category: 'Electronics', quantity: 7, price: 2499, supplier: 'TechWorld Supplies' },
        { id: 3, name: 'USB-C Cable', category: 'Electronics', quantity: 120, price: 299, supplier: 'CableMart India' },
        { id: 4, name: 'Office Chair', category: 'Furniture', quantity: 3, price: 8999, supplier: 'FurniCraft Ltd' },
        { id: 5, name: 'Standing Desk', category: 'Furniture', quantity: 12, price: 15999, supplier: 'FurniCraft Ltd' },
        { id: 6, name: 'A4 Paper Ream', category: 'Stationery', quantity: 200, price: 350, supplier: 'PaperWorks Co' },
        { id: 7, name: 'Printer Ink Cartridge', category: 'Stationery', quantity: 5, price: 1200, supplier: 'PaperWorks Co' },
        { id: 8, name: 'Steel Sheets (1mm)', category: 'Raw Materials', quantity: 50, price: 4500, supplier: 'MetalCorp Industries' },
        { id: 9, name: 'Copper Wire (500m)', category: 'Raw Materials', quantity: 8, price: 3200, supplier: 'MetalCorp Industries' },
        { id: 10, name: 'Cardboard Box (Large)', category: 'Packaging', quantity: 300, price: 45, supplier: 'PackRight Solutions' },
        { id: 11, name: 'Bubble Wrap Roll', category: 'Packaging', quantity: 15, price: 650, supplier: 'PackRight Solutions' },
        { id: 12, name: 'Monitor 24" LED', category: 'Electronics', quantity: 9, price: 12500, supplier: 'TechWorld Supplies' },
        { id: 13, name: 'Wooden Shelf Unit', category: 'Furniture', quantity: 18, price: 4599, supplier: 'FurniCraft Ltd' },
        { id: 14, name: 'Aluminum Rods (2m)', category: 'Raw Materials', quantity: 60, price: 1800, supplier: 'MetalCorp Industries' },
        { id: 15, name: 'Tape Dispenser', category: 'Stationery', quantity: 42, price: 150, supplier: 'PaperWorks Co' },
    ],

    orders: [
        { id: 1001, type: 'Sales', productId: 1, quantity: 10, total: 8990, date: '2026-04-14', status: 'Completed', notes: '' },
        { id: 1002, type: 'Purchase', productId: 8, quantity: 20, total: 90000, date: '2026-04-14', status: 'Processing', notes: 'Urgent restock' },
        { id: 1003, type: 'Sales', productId: 3, quantity: 30, total: 8970, date: '2026-04-14', status: 'Pending', notes: '' },
        { id: 1004, type: 'Sales', productId: 5, quantity: 2, total: 31998, date: '2026-04-13', status: 'Completed', notes: '' },
        { id: 1005, type: 'Purchase', productId: 2, quantity: 15, total: 37485, date: '2026-04-13', status: 'Completed', notes: 'Restocking keyboards' },
        { id: 1006, type: 'Sales', productId: 12, quantity: 3, total: 37500, date: '2026-04-12', status: 'Completed', notes: '' },
        { id: 1007, type: 'Purchase', productId: 4, quantity: 5, total: 44995, date: '2026-04-12', status: 'Pending', notes: '' },
    ],

    tasks: [
        { id: 1, name: 'Assemble PCB Boards', productId: 2, quantity: 20, status: 'In Progress', priority: 'High', assignee: 'Rahul Sharma', createdAt: '2026-04-12' },
        { id: 2, name: 'Package Electronics Kit', productId: 1, quantity: 50, status: 'Pending', priority: 'Medium', assignee: 'Priya Patel', createdAt: '2026-04-13' },
        { id: 3, name: 'Cut Steel Sheets', productId: 8, quantity: 30, status: 'Completed', priority: 'High', assignee: 'Amit Kumar', createdAt: '2026-04-10' },
        { id: 4, name: 'Wire Harness Assembly', productId: 9, quantity: 15, status: 'In Progress', priority: 'Medium', assignee: 'Sneha Gupta', createdAt: '2026-04-13' },
        { id: 5, name: 'Furniture Polish & QC', productId: 13, quantity: 10, status: 'Pending', priority: 'Low', assignee: 'Vikram Singh', createdAt: '2026-04-14' },
        { id: 6, name: 'Monitor Burn-in Test', productId: 12, quantity: 8, status: 'Pending', priority: 'High', assignee: 'Rahul Sharma', createdAt: '2026-04-14' },
    ],

    notifications: [],

    nextProductId() { return Math.max(...this.products.map(p => p.id), 0) + 1; },
    nextOrderId() { return Math.max(...this.orders.map(o => o.id), 1000) + 1; },
    nextTaskId() { return Math.max(...this.tasks.map(t => t.id), 0) + 1; },

    getProduct(id) { return this.products.find(p => p.id === id); },
    getProductName(id) { const p = this.getProduct(id); return p ? p.name : 'Unknown'; },
    getLowStockProducts() { return this.products.filter(p => p.quantity < 10); },
    getTodayOrders() {
        const today = new Date().toISOString().split('T')[0];
        return this.orders.filter(o => o.date === today);
    },
    getActiveTasks() { return this.tasks.filter(t => t.status !== 'Completed'); },
};


// ==================== UTILITY FUNCTIONS ====================

function $(selector) { return document.querySelector(selector); }
function $$(selector) { return document.querySelectorAll(selector); }

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount);
}

function showToast(message, type = 'info') {
    const container = $('#toast-container');
    const icons = {
        success: 'fa-circle-check',
        error: 'fa-circle-xmark',
        warning: 'fa-triangle-exclamation',
        info: 'fa-circle-info',
    };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<i class="fas ${icons[type]}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function getStockBadge(quantity) {
    if (quantity <= 0) return '<span class="badge badge-danger"><i class="fas fa-xmark"></i> Out of Stock</span>';
    if (quantity < 10) return '<span class="badge badge-warning"><i class="fas fa-exclamation"></i> Low Stock</span>';
    return '<span class="badge badge-success"><i class="fas fa-check"></i> In Stock</span>';
}

function getOrderStatusBadge(status) {
    const map = {
        Pending: 'badge-warning',
        Processing: 'badge-info',
        Completed: 'badge-success',
        Cancelled: 'badge-neutral',
    };
    return `<span class="badge ${map[status] || 'badge-neutral'}">${status}</span>`;
}

function getPriorityBadge(priority) {
    const map = {
        High: 'badge-danger',
        Medium: 'badge-warning',
        Low: 'badge-info',
    };
    return `<span class="badge ${map[priority] || 'badge-neutral'}">${priority}</span>`;
}


// ==================== LOGIN ====================

function initLogin() {
    $('#login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const username = $('#login-username').value.trim() || 'Admin';
        const role = $('#login-role').value;

        Store.currentUser = {
            username,
            role,
            initial: username.charAt(0).toUpperCase(),
        };

        // Update UI with user info
        const displayRole = role === 'admin' ? 'Administrator' : 'Standard User';
        $('#sidebar-username').textContent = username;
        $('#sidebar-role').textContent = displayRole;
        $('#sidebar-avatar').textContent = Store.currentUser.initial;
        $('#header-username').textContent = username;
        $('#header-role').textContent = displayRole;
        $('#header-avatar').textContent = Store.currentUser.initial;

        // Hide admin-only features for user role
        if (role === 'user') {
            $$('.btn-delete').forEach(btn => btn.style.display = 'none');
        }

        // Transition to app
        $('#login-screen').classList.add('hidden');
        $('#app').classList.remove('hidden');

        // Initialize dashboard
        initDashboard();
        generateNotifications();

        showToast(`Welcome back, ${username}!`, 'success');
    });
}


// ==================== NAVIGATION ====================

const pageTitles = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview of your business' },
    inventory: { title: 'Inventory', subtitle: 'Manage your products and stock' },
    orders: { title: 'Orders', subtitle: 'Sales and purchase order management' },
    manufacturing: { title: 'Manufacturing', subtitle: 'Work-in-progress tracking' },
    reports: { title: 'Reports', subtitle: 'Analytics and insights' },
};

function initNavigation() {
    $$('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Update nav links
    $$('.nav-link').forEach(l => l.classList.remove('active'));
    $(`[data-page="${page}"]`).classList.add('active');

    // Update pages
    $$('.page').forEach(p => p.classList.remove('active'));
    $(`#page-${page}`).classList.add('active');

    // Update header
    const info = pageTitles[page];
    if (info) {
        $('#page-title').textContent = info.title;
        $('#page-subtitle').textContent = info.subtitle;
    }

    // Close sidebar on mobile
    $('#sidebar').classList.remove('open');

    // Render page content
    switch (page) {
        case 'dashboard': initDashboard(); break;
        case 'inventory': renderInventoryTable(); break;
        case 'orders': renderOrdersTable(); break;
        case 'manufacturing': renderManufacturingBoard(); break;
        case 'reports': renderReports(); break;
    }
}


// ==================== SIDEBAR TOGGLE ====================

function initSidebarToggle() {
    $('#sidebar-toggle-open').addEventListener('click', () => {
        $('#sidebar').classList.add('open');
    });
    $('#sidebar-toggle-close').addEventListener('click', () => {
        $('#sidebar').classList.remove('open');
    });
}


// ==================== HEADER (NOTIFICATIONS & PROFILE) ====================

function initHeader() {
    // Notification button
    $('#notification-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        $('#notification-panel').classList.toggle('hidden');
        $('#profile-dropdown').classList.add('hidden');
    });

    // Profile button
    $('#header-profile').addEventListener('click', (e) => {
        e.stopPropagation();
        $('#profile-dropdown').classList.toggle('hidden');
        $('#notification-panel').classList.add('hidden');
    });

    // Clear notifications
    $('#clear-notifications').addEventListener('click', () => {
        Store.notifications = [];
        renderNotifications();
        showToast('Notifications cleared', 'info');
    });

    // Logout
    $('#logout-btn').addEventListener('click', (e) => {
        e.preventDefault();
        Store.currentUser = null;
        $('#app').classList.add('hidden');
        $('#login-screen').classList.remove('hidden');
        $('#login-form').reset();
        $('#profile-dropdown').classList.add('hidden');
        showToast('Logged out successfully', 'info');
    });

    // Close dropdowns on click outside
    document.addEventListener('click', () => {
        $('#notification-panel').classList.add('hidden');
        $('#profile-dropdown').classList.add('hidden');
    });

    // Global search
    $('#global-search').addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length >= 2) {
            // Search across products
            const match = Store.products.find(p => p.name.toLowerCase().includes(query));
            if (match) {
                navigateTo('inventory');
                $('#inventory-search').value = query;
                renderInventoryTable(query);
            }
        }
    });
}

function generateNotifications() {
    Store.notifications = [];
    const lowStock = Store.getLowStockProducts();
    lowStock.forEach(p => {
        Store.notifications.push({
            type: p.quantity <= 0 ? 'danger' : 'warning',
            icon: p.quantity <= 0 ? 'fa-xmark' : 'fa-triangle-exclamation',
            text: p.quantity <= 0
                ? `<strong>${p.name}</strong> is out of stock!`
                : `<strong>${p.name}</strong> is low on stock (${p.quantity} left)`,
            time: 'Just now',
        });
    });

    // Add some general notifications
    Store.notifications.push({
        type: 'success',
        icon: 'fa-circle-check',
        text: 'Order #1001 has been completed successfully',
        time: '2 hours ago',
    });

    renderNotifications();
}

function renderNotifications() {
    const list = $('#notification-list');
    const badge = $('#notification-badge');

    if (Store.notifications.length === 0) {
        list.innerHTML = '<p class="notification-empty">No notifications</p>';
        badge.textContent = '0';
        badge.style.display = 'none';
        return;
    }

    badge.textContent = Store.notifications.length;
    badge.style.display = 'flex';

    list.innerHTML = Store.notifications.map(n => `
        <div class="notification-item">
            <div class="notif-icon ${n.type}"><i class="fas ${n.icon}"></i></div>
            <div class="notif-content">
                <p class="notif-text">${n.text}</p>
                <p class="notif-time">${n.time}</p>
            </div>
        </div>
    `).join('');
}


// ==================== DASHBOARD ====================

let chartInventory = null;
let chartOrders = null;

function initDashboard() {
    // Update summary cards
    $('#total-products').textContent = Store.products.length;
    $('#low-stock-items').textContent = Store.getLowStockProducts().length;
    $('#orders-today').textContent = Store.getTodayOrders().length;
    $('#active-tasks').textContent = Store.getActiveTasks().length;

    // Low stock table
    renderLowStockTable();

    // Recent orders table
    renderRecentOrdersTable();

    // Charts
    renderDashboardCharts();
}

function renderLowStockTable() {
    const tbody = $('#low-stock-table-body');
    const lowStock = Store.getLowStockProducts();

    if (lowStock.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--gray-400);padding:24px;">All products are well-stocked! 🎉</td></tr>';
        return;
    }

    tbody.innerHTML = lowStock.map(p => `
        <tr>
            <td><strong>${p.name}</strong></td>
            <td>${p.quantity}</td>
            <td>${p.supplier}</td>
            <td>${getStockBadge(p.quantity)}</td>
        </tr>
    `).join('');
}

function renderRecentOrdersTable() {
    const tbody = $('#recent-orders-table-body');
    const recent = Store.orders.slice(-5).reverse();

    tbody.innerHTML = recent.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td><span class="badge ${o.type === 'Sales' ? 'badge-info' : 'badge-purple'}">${o.type}</span></td>
            <td>${Store.getProductName(o.productId)}</td>
            <td>${getOrderStatusBadge(o.status)}</td>
        </tr>
    `).join('');
}

function renderDashboardCharts() {
    // Inventory by Category (Doughnut)
    const categories = {};
    Store.products.forEach(p => {
        categories[p.category] = (categories[p.category] || 0) + p.quantity;
    });

    if (chartInventory) chartInventory.destroy();
    chartInventory = new Chart($('#chart-inventory'), {
        type: 'doughnut',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                data: Object.values(categories),
                backgroundColor: [
                    '#4f6df5', '#8b5cf6', '#06b6d4', '#f59e0b', '#22c55e',
                ],
                borderWidth: 0,
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 16,
                        usePointStyle: true,
                        pointStyleWidth: 10,
                        font: { family: 'Inter', size: 12 },
                    },
                },
            },
            cutout: '65%',
        },
    });

    // Orders Overview (Bar)
    const ordersByType = { Sales: 0, Purchase: 0 };
    const ordersByStatus = { Pending: 0, Processing: 0, Completed: 0, Cancelled: 0 };
    Store.orders.forEach(o => {
        ordersByType[o.type] = (ordersByType[o.type] || 0) + 1;
        ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    if (chartOrders) chartOrders.destroy();
    chartOrders = new Chart($('#chart-orders'), {
        type: 'bar',
        data: {
            labels: Object.keys(ordersByStatus),
            datasets: [{
                label: 'Orders',
                data: Object.values(ordersByStatus),
                backgroundColor: ['#f59e0b', '#4f6df5', '#22c55e', '#94a3b8'],
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 40,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { family: 'Inter', size: 12 } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                },
                x: {
                    ticks: { font: { family: 'Inter', size: 12 } },
                    grid: { display: false },
                },
            },
        },
    });
}


// ==================== INVENTORY ====================

function renderInventoryTable(searchQuery = '', categoryFilter = 'all') {
    const tbody = $('#inventory-table-body');
    let filtered = [...Store.products];

    if (searchQuery) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.supplier.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (categoryFilter !== 'all') {
        filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:32px;">No products found</td></tr>';
        return;
    }

    const isAdmin = Store.currentUser && Store.currentUser.role === 'admin';

    tbody.innerHTML = filtered.map(p => `
        <tr>
            <td><strong>#${p.id}</strong></td>
            <td><strong>${p.name}</strong></td>
            <td><span class="badge badge-neutral">${p.category}</span></td>
            <td>${p.quantity}</td>
            <td>${formatCurrency(p.price)}</td>
            <td>${p.supplier}</td>
            <td>${getStockBadge(p.quantity)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-icon" onclick="editProduct(${p.id})" title="Edit" aria-label="Edit product ${p.name}">
                        <i class="fas fa-pen"></i>
                    </button>
                    ${isAdmin ? `
                    <button class="btn btn-icon btn-delete" onclick="deleteProduct(${p.id})" title="Delete" aria-label="Delete product ${p.name}">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function initInventory() {
    // Search
    $('#inventory-search').addEventListener('input', (e) => {
        renderInventoryTable(e.target.value, $('#inventory-filter').value);
    });

    // Filter
    $('#inventory-filter').addEventListener('change', (e) => {
        renderInventoryTable($('#inventory-search').value, e.target.value);
    });

    // Add product button
    $('#add-product-btn').addEventListener('click', () => openProductModal());

    // Product form submit
    $('#product-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveProduct();
    });

    // Modal close buttons
    $('#product-modal-close').addEventListener('click', closeProductModal);
    $('#product-cancel-btn').addEventListener('click', closeProductModal);
}

function openProductModal(product = null) {
    const modal = $('#product-modal');
    const title = $('#product-modal-title');

    if (product) {
        title.innerHTML = '<i class="fas fa-box"></i> Edit Product';
        $('#product-id').value = product.id;
        $('#product-name').value = product.name;
        $('#product-category').value = product.category;
        $('#product-quantity').value = product.quantity;
        $('#product-price').value = product.price;
        $('#product-supplier').value = product.supplier;
    } else {
        title.innerHTML = '<i class="fas fa-box"></i> Add Product';
        $('#product-form').reset();
        $('#product-id').value = '';
    }

    modal.classList.remove('hidden');
}

function closeProductModal() {
    $('#product-modal').classList.add('hidden');
    $('#product-form').reset();
}

function saveProduct() {
    const id = $('#product-id').value;
    const data = {
        name: $('#product-name').value.trim(),
        category: $('#product-category').value,
        quantity: parseInt($('#product-quantity').value),
        price: parseFloat($('#product-price').value),
        supplier: $('#product-supplier').value.trim(),
    };

    if (id) {
        // Edit
        const product = Store.getProduct(parseInt(id));
        if (product) {
            Object.assign(product, data);
            showToast(`Product "${data.name}" updated successfully`, 'success');
        }
    } else {
        // Add
        data.id = Store.nextProductId();
        Store.products.push(data);
        showToast(`Product "${data.name}" added successfully`, 'success');
    }

    closeProductModal();
    renderInventoryTable($('#inventory-search').value, $('#inventory-filter').value);
    generateNotifications();
}

function editProduct(id) {
    const product = Store.getProduct(id);
    if (product) openProductModal(product);
}

function deleteProduct(id) {
    const product = Store.getProduct(id);
    if (!product) return;

    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
        Store.products = Store.products.filter(p => p.id !== id);
        renderInventoryTable($('#inventory-search').value, $('#inventory-filter').value);
        generateNotifications();
        showToast(`Product "${product.name}" deleted`, 'warning');
    }
}


// ==================== ORDERS ====================

function renderOrdersTable(searchQuery = '', typeFilter = 'all') {
    const tbody = $('#orders-table-body');
    let filtered = [...Store.orders];

    if (searchQuery) {
        filtered = filtered.filter(o =>
            String(o.id).includes(searchQuery) ||
            Store.getProductName(o.productId).toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (typeFilter !== 'all') {
        filtered = filtered.filter(o => o.type === typeFilter);
    }

    const isAdmin = Store.currentUser && Store.currentUser.role === 'admin';

    if (filtered.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;color:var(--gray-400);padding:32px;">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = filtered.map(o => `
        <tr>
            <td><strong>#${o.id}</strong></td>
            <td><span class="badge ${o.type === 'Sales' ? 'badge-info' : 'badge-purple'}">${o.type}</span></td>
            <td>${Store.getProductName(o.productId)}</td>
            <td>${o.quantity}</td>
            <td>${formatCurrency(o.total)}</td>
            <td>${o.date}</td>
            <td>${getOrderStatusBadge(o.status)}</td>
            <td>
                <div class="action-btns">
                    <button class="btn btn-icon" onclick="editOrder(${o.id})" title="Edit" aria-label="Edit order #${o.id}">
                        <i class="fas fa-pen"></i>
                    </button>
                    ${isAdmin ? `
                    <button class="btn btn-icon btn-delete" onclick="deleteOrder(${o.id})" title="Delete" aria-label="Delete order #${o.id}">
                        <i class="fas fa-trash"></i>
                    </button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function initOrders() {
    // Search
    $('#orders-search').addEventListener('input', (e) => {
        renderOrdersTable(e.target.value, $('#orders-filter').value);
    });

    // Filter
    $('#orders-filter').addEventListener('change', (e) => {
        renderOrdersTable($('#orders-search').value, e.target.value);
    });

    // Add order button
    $('#add-order-btn').addEventListener('click', () => openOrderModal());

    // Order form submit
    $('#order-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveOrder();
    });

    // Modal close
    $('#order-modal-close').addEventListener('click', closeOrderModal);
    $('#order-cancel-btn').addEventListener('click', closeOrderModal);
}

function populateProductDropdown(selectId) {
    const select = $(selectId);
    const currentVal = select.value;
    // Keep the placeholder
    select.innerHTML = '<option value="">Select Product</option>';
    Store.products.forEach(p => {
        select.innerHTML += `<option value="${p.id}">${p.name} (Qty: ${p.quantity})</option>`;
    });
    if (currentVal) select.value = currentVal;
}

function openOrderModal(order = null) {
    const modal = $('#order-modal');
    const title = $('#order-modal-title');
    populateProductDropdown('#order-product');

    if (order) {
        title.innerHTML = '<i class="fas fa-cart-shopping"></i> Edit Order';
        $('#order-id').value = order.id;
        $('#order-type').value = order.type;
        $('#order-product').value = order.productId;
        $('#order-quantity').value = order.quantity;
        $('#order-status').value = order.status;
        $('#order-notes').value = order.notes || '';
    } else {
        title.innerHTML = '<i class="fas fa-cart-shopping"></i> Create Order';
        $('#order-form').reset();
        $('#order-id').value = '';
    }

    modal.classList.remove('hidden');
}

function closeOrderModal() {
    $('#order-modal').classList.add('hidden');
    $('#order-form').reset();
}

function saveOrder() {
    const id = $('#order-id').value;
    const productId = parseInt($('#order-product').value);
    const quantity = parseInt($('#order-quantity').value);
    const type = $('#order-type').value;
    const status = $('#order-status').value;
    const notes = $('#order-notes').value.trim();
    const product = Store.getProduct(productId);

    if (!product) {
        showToast('Please select a valid product', 'error');
        return;
    }

    if (id) {
        // Edit existing order
        const order = Store.orders.find(o => o.id === parseInt(id));
        if (order) {
            // Reverse the stock change from the old order before applying new one
            const oldProduct = Store.getProduct(order.productId);
            if (oldProduct && order.status !== 'Cancelled') {
                if (order.type === 'Sales') {
                    oldProduct.quantity += order.quantity;
                } else {
                    oldProduct.quantity -= order.quantity;
                }
            }

            order.type = type;
            order.productId = productId;
            order.quantity = quantity;
            order.total = quantity * product.price;
            order.status = status;
            order.notes = notes;

            // Apply new stock change
            if (status !== 'Cancelled') {
                if (type === 'Sales') {
                    product.quantity -= quantity;
                } else {
                    product.quantity += quantity;
                }
            }

            showToast(`Order #${order.id} updated successfully`, 'success');
        }
    } else {
        // New order
        const newOrder = {
            id: Store.nextOrderId(),
            type,
            productId,
            quantity,
            total: quantity * product.price,
            date: new Date().toISOString().split('T')[0],
            status,
            notes,
        };

        // Update stock
        if (status !== 'Cancelled') {
            if (type === 'Sales') {
                if (product.quantity < quantity) {
                    showToast(`Insufficient stock! Only ${product.quantity} available.`, 'error');
                    return;
                }
                product.quantity -= quantity;
            } else {
                product.quantity += quantity;
            }
        }

        Store.orders.push(newOrder);
        showToast(`Order #${newOrder.id} created successfully`, 'success');
    }

    closeOrderModal();
    renderOrdersTable($('#orders-search').value, $('#orders-filter').value);
    generateNotifications();
}

function editOrder(id) {
    const order = Store.orders.find(o => o.id === id);
    if (order) openOrderModal(order);
}

function deleteOrder(id) {
    const order = Store.orders.find(o => o.id === id);
    if (!order) return;

    if (confirm(`Are you sure you want to delete Order #${id}?`)) {
        Store.orders = Store.orders.filter(o => o.id !== id);
        renderOrdersTable($('#orders-search').value, $('#orders-filter').value);
        showToast(`Order #${id} deleted`, 'warning');
    }
}


// ==================== MANUFACTURING ====================

function renderManufacturingBoard(searchQuery = '', statusFilter = 'all') {
    let filtered = [...Store.tasks];

    if (searchQuery) {
        filtered = filtered.filter(t =>
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.assignee.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    if (statusFilter !== 'all') {
        filtered = filtered.filter(t => t.status === statusFilter);
    }

    const pending = filtered.filter(t => t.status === 'Pending');
    const inProgress = filtered.filter(t => t.status === 'In Progress');
    const completed = filtered.filter(t => t.status === 'Completed');

    $('#pending-count').textContent = pending.length;
    $('#in-progress-count').textContent = inProgress.length;
    $('#completed-count').textContent = completed.length;

    renderBoardColumn('#pending-tasks', pending);
    renderBoardColumn('#in-progress-tasks', inProgress);
    renderBoardColumn('#completed-tasks', completed);
}

function renderBoardColumn(containerId, tasks) {
    const container = $(containerId);

    if (tasks.length === 0) {
        container.innerHTML = '<p style="text-align:center;color:var(--gray-400);font-size:13px;padding:24px;">No tasks</p>';
        return;
    }

    container.innerHTML = tasks.map(t => {
        const statusOptions = ['Pending', 'In Progress', 'Completed'];
        const nextStatus = statusOptions[Math.min(statusOptions.indexOf(t.status) + 1, 2)];
        const canAdvance = t.status !== 'Completed';

        return `
        <div class="board-card">
            <div class="board-card-title">${t.name}</div>
            <div class="board-card-meta">
                <span><i class="fas fa-box"></i> ${Store.getProductName(t.productId)}</span>
                <span><i class="fas fa-cubes"></i> Qty: ${t.quantity}</span>
            </div>
            <div class="board-card-meta">
                <span><i class="fas fa-user"></i> ${t.assignee}</span>
                <span>${getPriorityBadge(t.priority)}</span>
            </div>
            <div class="board-card-actions">
                <button class="btn-sm" onclick="editTask(${t.id})" title="Edit">
                    <i class="fas fa-pen"></i> Edit
                </button>
                ${canAdvance ? `
                <button class="btn-sm" onclick="advanceTask(${t.id})" title="Advance to ${nextStatus}">
                    <i class="fas fa-arrow-right"></i> ${nextStatus}
                </button>` : ''}
            </div>
        </div>
        `;
    }).join('');
}

function initManufacturing() {
    // Search
    $('#manufacturing-search').addEventListener('input', (e) => {
        renderManufacturingBoard(e.target.value, $('#manufacturing-filter').value);
    });

    // Filter
    $('#manufacturing-filter').addEventListener('change', (e) => {
        renderManufacturingBoard($('#manufacturing-search').value, e.target.value);
    });

    // Add task button
    $('#add-task-btn').addEventListener('click', () => openTaskModal());

    // Task form submit
    $('#task-form').addEventListener('submit', (e) => {
        e.preventDefault();
        saveTask();
    });

    // Modal close
    $('#task-modal-close').addEventListener('click', closeTaskModal);
    $('#task-cancel-btn').addEventListener('click', closeTaskModal);
}

function openTaskModal(task = null) {
    const modal = $('#task-modal');
    const title = $('#task-modal-title');
    populateProductDropdown('#task-product');

    if (task) {
        title.innerHTML = '<i class="fas fa-industry"></i> Edit Task';
        $('#task-id').value = task.id;
        $('#task-name').value = task.name;
        $('#task-product').value = task.productId;
        $('#task-quantity').value = task.quantity;
        $('#task-priority').value = task.priority;
        $('#task-status').value = task.status;
        $('#task-assignee').value = task.assignee;
    } else {
        title.innerHTML = '<i class="fas fa-industry"></i> Create Task';
        $('#task-form').reset();
        $('#task-id').value = '';
    }

    modal.classList.remove('hidden');
}

function closeTaskModal() {
    $('#task-modal').classList.add('hidden');
    $('#task-form').reset();
}

function saveTask() {
    const id = $('#task-id').value;
    const data = {
        name: $('#task-name').value.trim(),
        productId: parseInt($('#task-product').value),
        quantity: parseInt($('#task-quantity').value),
        priority: $('#task-priority').value,
        status: $('#task-status').value,
        assignee: $('#task-assignee').value.trim() || 'Unassigned',
    };

    if (id) {
        const task = Store.tasks.find(t => t.id === parseInt(id));
        if (task) {
            Object.assign(task, data);
            showToast(`Task "${data.name}" updated`, 'success');
        }
    } else {
        data.id = Store.nextTaskId();
        data.createdAt = new Date().toISOString().split('T')[0];
        Store.tasks.push(data);
        showToast(`Task "${data.name}" created`, 'success');
    }

    closeTaskModal();
    renderManufacturingBoard($('#manufacturing-search').value, $('#manufacturing-filter').value);
}

function editTask(id) {
    const task = Store.tasks.find(t => t.id === id);
    if (task) openTaskModal(task);
}

function advanceTask(id) {
    const task = Store.tasks.find(t => t.id === id);
    if (!task) return;

    const statusOrder = ['Pending', 'In Progress', 'Completed'];
    const currentIndex = statusOrder.indexOf(task.status);
    if (currentIndex < statusOrder.length - 1) {
        task.status = statusOrder[currentIndex + 1];
        renderManufacturingBoard($('#manufacturing-search').value, $('#manufacturing-filter').value);
        showToast(`Task "${task.name}" moved to ${task.status}`, 'success');
    }
}


// ==================== REPORTS ====================

let chartStockLevels = null;
let chartOrderTrends = null;
let chartManufacturingStatus = null;
let chartRevenue = null;

function renderReports() {
    // Stock Levels (Horizontal Bar)
    const topProducts = Store.products.slice(0, 10);

    if (chartStockLevels) chartStockLevels.destroy();
    chartStockLevels = new Chart($('#chart-stock-levels'), {
        type: 'bar',
        data: {
            labels: topProducts.map(p => p.name.length > 20 ? p.name.substring(0, 18) + '…' : p.name),
            datasets: [{
                label: 'Quantity',
                data: topProducts.map(p => p.quantity),
                backgroundColor: topProducts.map(p =>
                    p.quantity < 10 ? '#ef4444' : p.quantity < 30 ? '#f59e0b' : '#22c55e'
                ),
                borderRadius: 6,
                borderSkipped: false,
            }],
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: { font: { family: 'Inter', size: 11 } },
                },
                y: {
                    grid: { display: false },
                    ticks: { font: { family: 'Inter', size: 11 } },
                },
            },
        },
    });

    // Order Trends (Line)
    const days = [];
    const salesData = [];
    const purchaseData = [];

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayLabel = d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });
        days.push(dayLabel);
        salesData.push(Store.orders.filter(o => o.date === dateStr && o.type === 'Sales').length);
        purchaseData.push(Store.orders.filter(o => o.date === dateStr && o.type === 'Purchase').length);
    }

    if (chartOrderTrends) chartOrderTrends.destroy();
    chartOrderTrends = new Chart($('#chart-order-trends'), {
        type: 'line',
        data: {
            labels: days,
            datasets: [
                {
                    label: 'Sales',
                    data: salesData,
                    borderColor: '#4f6df5',
                    backgroundColor: 'rgba(79, 109, 245, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#4f6df5',
                    borderWidth: 2.5,
                },
                {
                    label: 'Purchase',
                    data: purchaseData,
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 5,
                    pointHoverRadius: 8,
                    pointBackgroundColor: '#8b5cf6',
                    borderWidth: 2.5,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true, pointStyleWidth: 10, font: { family: 'Inter', size: 12 } },
                },
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { stepSize: 1, font: { family: 'Inter', size: 11 } },
                    grid: { color: 'rgba(0,0,0,0.04)' },
                },
                x: {
                    ticks: { font: { family: 'Inter', size: 11 } },
                    grid: { display: false },
                },
            },
        },
    });

    // Manufacturing Status (Pie)
    const mfgStatus = {
        Pending: Store.tasks.filter(t => t.status === 'Pending').length,
        'In Progress': Store.tasks.filter(t => t.status === 'In Progress').length,
        Completed: Store.tasks.filter(t => t.status === 'Completed').length,
    };

    if (chartManufacturingStatus) chartManufacturingStatus.destroy();
    chartManufacturingStatus = new Chart($('#chart-manufacturing-status'), {
        type: 'pie',
        data: {
            labels: Object.keys(mfgStatus),
            datasets: [{
                data: Object.values(mfgStatus),
                backgroundColor: ['#f59e0b', '#4f6df5', '#22c55e'],
                borderWidth: 0,
                hoverOffset: 8,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { padding: 16, usePointStyle: true, pointStyleWidth: 10, font: { family: 'Inter', size: 12 } },
                },
            },
        },
    });

    // Revenue by Category (Bar with gradient)
    const revenueByCategory = {};
    Store.orders.forEach(o => {
        if (o.status !== 'Cancelled') {
            const product = Store.getProduct(o.productId);
            if (product) {
                const cat = product.category;
                revenueByCategory[cat] = (revenueByCategory[cat] || 0) + o.total;
            }
        }
    });

    if (chartRevenue) chartRevenue.destroy();
    chartRevenue = new Chart($('#chart-revenue'), {
        type: 'bar',
        data: {
            labels: Object.keys(revenueByCategory),
            datasets: [{
                label: 'Revenue (₹)',
                data: Object.values(revenueByCategory),
                backgroundColor: ['#4f6df5', '#8b5cf6', '#06b6d4', '#f59e0b', '#22c55e'],
                borderRadius: 8,
                borderSkipped: false,
                barThickness: 40,
            }],
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: { legend: { display: false } },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0,0,0,0.04)' },
                    ticks: {
                        font: { family: 'Inter', size: 11 },
                        callback: (value) => '₹' + (value / 1000).toFixed(0) + 'K',
                    },
                },
                x: {
                    ticks: { font: { family: 'Inter', size: 11 } },
                    grid: { display: false },
                },
            },
        },
    });
}


// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    initNavigation();
    initSidebarToggle();
    initHeader();
    initInventory();
    initOrders();
    initManufacturing();
});
