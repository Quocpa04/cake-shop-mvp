// ==========================================================================
// MIETTE BAKERY WORKSPACE — CONTROLLER (NO ICONS / EDITORIAL LUXURY DESIGN)
// Supports 3 Web Roles:
// 1. ADMIN (Chủ tiệm)
// 2. STORE_MANAGER (Quản lý cửa hàng)
// 3. CASHIER_SUPPORT (Thu ngân / CSKH)
// (Thợ làm bánh & Shipper được vận hành trực tiếp trên Mobile App)
// ==========================================================================

const ROLE_PERMISSIONS = {
  ADMIN: {
    title: 'Chủ tiệm (Admin)',
    userName: 'Lê Thanh Tú',
    userRole: 'Chủ cửa hàng · Toàn quyền hệ thống',
    avatarInitials: 'TT',
    defaultTab: 'overview',
    visibleTabs: [
      'overview', 'orders', 'production', 'products', 'accessories',
      'fefo', 'customers', 'promotions', 'delivery', 'reports',
      'staff', 'settings', 'logs'
    ],
  },
  STORE_MANAGER: {
    title: 'Quản lý cửa hàng',
    userName: 'Linh Nguyễn',
    userRole: 'Quản lý · Miette Quận 3',
    avatarInitials: 'LN',
    defaultTab: 'overview',
    visibleTabs: [
      'overview', 'orders', 'production', 'products', 'accessories',
      'fefo', 'customers', 'promotions', 'delivery', 'staff', 'settings'
    ],
  },
  CASHIER_SUPPORT: {
    title: 'Thu ngân / CSKH',
    userName: 'Hương Mai',
    userRole: 'Thu ngân · Quầy POS & Tiếp nhận đơn',
    avatarInitials: 'HM',
    defaultTab: 'orders',
    visibleTabs: ['overview', 'orders', 'products', 'accessories', 'customers', 'promotions'],
  },
};

let currentRole = 'ADMIN';

// Orders Data with Full Operational Specs
let ordersData = [
  {
    code: 'BK2610260012',
    name: 'Cô Hoàng Yến',
    phone: '0912 345 678',
    address: '88 Nguyễn Huệ, Phường Bến Nghé, Quận 1',
    cake: 'Bánh Dâu Mây 16 cm',
    price: '420.000đ',
    slot: '17:00 - 18:00',
    status: 'Đang làm',
    statusBadge: 'badge-warning',
    piping: 'Chúc mừng sinh nhật Mẹ!',
    cardText: 'Chúc mẹ tuổi mới thật rực rỡ và bình an!',
    accessories: 'Nến mạ vàng + Thiệp hoa sáp ép nổi',
    allergens: 'Trứng, Sữa, Gluten',
    paymentMethod: 'MOMO',
    isCod: false,
    codAmount: '0đ',
    hasComplaint: true,
  },
  {
    code: 'BK2610260011',
    name: 'Anh Trần Quốc Bảo',
    phone: '0988 776 554',
    address: '24 Lê Lợi, Bến Nghé, Quận 1',
    cake: 'Mousse Chanh Dây Phô Mai',
    price: '420.000đ',
    slot: '15:00 - 16:00',
    status: 'Chờ xác nhận',
    statusBadge: 'badge-danger',
    piping: 'Happy Anniversary 5 Years',
    cardText: 'Mãi yêu em như ngày đầu tiên!',
    accessories: 'Nến số 5 vàng gold',
    allergens: 'Sữa & Bơ Pháp',
    paymentMethod: 'COD',
    isCod: true,
    codAmount: '420.000đ',
    hasComplaint: false,
  },
  {
    code: 'BK2610260009',
    name: 'Chị Mai Phương',
    phone: '0903 112 233',
    address: '15 Thảo Điền, TP. Thủ Đức',
    cake: 'Red Velvet Hoa Hồng & Dâu Rừng',
    price: '390.000đ',
    slot: '17:00 - 18:00',
    status: 'Sẵn sàng',
    statusBadge: 'badge-info',
    piping: 'Chúc mừng sinh nhật Mai!',
    cardText: 'Tuổi mới thành công rực rỡ nhé em!',
    accessories: 'Bộ dao nĩa sinh nhật cao cấp',
    allergens: 'Trứng, Sữa, Đậu phộng',
    paymentMethod: 'VNPAY',
    isCod: false,
    codAmount: '0đ',
    hasComplaint: false,
  },
  {
    code: 'BK2610260007',
    name: 'Bác Lê Văn Hùng',
    phone: '0938 998 877',
    address: '102 Nguyễn Đức Cảnh, Tân Phong, Quận 7',
    cake: 'Bánh Bắp Phô Mai Nướng',
    price: '380.000đ',
    slot: '19:00 - 20:00',
    status: 'Đang giao',
    statusBadge: 'badge-info',
    piping: 'Mừng thọ Bác Hùng 70 tuổi',
    cardText: 'Kính chúc Bác bách niên giai lão, an khang!',
    accessories: 'Thiệp đỏ chúc thọ + Nến số 70',
    allergens: 'Trứng, Sữa tươi',
    paymentMethod: 'COD',
    isCod: true,
    codAmount: '380.000đ',
    hasComplaint: false,
  },
  {
    code: 'BK2610260005',
    name: 'Chị Đặng Ngọc Lan',
    phone: '0977 123 999',
    address: '45 Pasteur, Bến Nghé, Quận 1',
    cake: 'Tiramisu Mascarpone Ý',
    price: '350.000đ',
    slot: '15:00 - 16:00',
    status: 'Hoàn tất',
    statusBadge: 'badge-success',
    piping: 'Sweet Celebration',
    cardText: 'Chúc mừng kỷ niệm thành lập công ty!',
    accessories: 'Pháo nến phụt sinh nhật',
    allergens: 'Rượu cà phê Marsala, Trứng',
    paymentMethod: 'COD',
    isCod: true,
    codAmount: '350.000đ',
    hasComplaint: false,
  },
];

let selectedOrder = ordersData[0];
let cakesList30 = [];
let currentKdsFilter = 'all';
let currentDeliveryFilter = 'all';

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  setupSidebarNavigation();
  setupAuth();
  setupOrdersList();
  setupSearchFilter();
  setupStatusTransitionBar();
  setupKdsBoard();
  setupDeliveryBoard();
  setupProductsCatalog();
  setupCustomersCRM();
  setupFefo();
  setupModals();
  setupComplaintActions();
  setupExportReport();
  setupSettingsAndLogs();
  updateRoleAccess(currentRole);
});

// ==========================================================================
// SIDEBAR NAVIGATION
// ==========================================================================

function setupSidebarNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const tabTarget = link.getAttribute('data-tab');
      navigateToTab(tabTarget);
    });
  });
}

function navigateToTab(tabTarget) {
  const navLinks = document.querySelectorAll('.nav-link');
  const panels = document.querySelectorAll('.tab-panel');

  navLinks.forEach((l) => {
    if (l.getAttribute('data-tab') === tabTarget) {
      l.classList.add('active');
    } else {
      l.classList.remove('active');
    }
  });

  panels.forEach((p) => p.classList.remove('active'));

  const targetPanel = document.getElementById(`panel${capitalize(tabTarget)}`);
  if (targetPanel) {
    targetPanel.classList.add('active');
  } else {
    const overviewPanel = document.getElementById('panelOverview');
    if (overviewPanel) overviewPanel.classList.add('active');
  }
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ==========================================================================
// AUTHENTICATION & ROLE MANAGEMENT (NO IN-UI ROLE SWITCHER)
// Accounts:
// 1. Admin: admin@miette.vn / 123 (or admin / 123)
// 2. Manager: manager@miette.vn / 123 (or manager / 123)
// 3. Cashier: cashier@miette.vn / 123 (or cashier / 123)
// ==========================================================================

const WEB_ACCOUNTS = {
  ADMIN: {
    username: 'admin',
    email: 'admin@miette.vn',
    passwords: ['123', 'admin123', '123456'],
    role: 'ADMIN',
  },
  STORE_MANAGER: {
    username: 'manager',
    email: 'manager@miette.vn',
    passwords: ['123', 'manager123', '123456'],
    role: 'STORE_MANAGER',
  },
  CASHIER_SUPPORT: {
    username: 'cashier',
    email: 'cashier@miette.vn',
    passwords: ['123', 'cashier123', '123456'],
    role: 'CASHIER_SUPPORT',
  },
};

function setupAuth() {
  const loginScreen = document.getElementById('loginScreen');
  const workspaceLayout = document.getElementById('workspaceLayout');
  const loginForm = document.getElementById('loginForm');
  const loginEmail = document.getElementById('loginEmail');
  const loginPassword = document.getElementById('loginPassword');
  const loginErrorMsg = document.getElementById('loginErrorMsg');
  const btnLogout = document.getElementById('btnLogout');
  const quickCards = document.querySelectorAll('.quick-account-card');

  function showLogin() {
    if (loginScreen) loginScreen.style.display = 'flex';
    if (workspaceLayout) workspaceLayout.style.display = 'none';
  }

  function showWorkspace(roleKey) {
    currentRole = roleKey;
    localStorage.setItem('miette_web_role', roleKey);
    if (loginScreen) loginScreen.style.display = 'none';
    if (workspaceLayout) workspaceLayout.style.display = 'flex';
    updateRoleAccess(roleKey);

    const perm = ROLE_PERMISSIONS[roleKey];
    if (perm && perm.defaultTab) {
      navigateToTab(perm.defaultTab);
    }
    addSystemLog(
      `${perm.userName} (${perm.title})`,
      `Đăng nhập thành công vào phiên làm việc <strong>${perm.title}</strong>`
    );
  }

  function authenticate(identifier, password) {
    const idClean = (identifier || '').trim().toLowerCase();
    const pwClean = (password || '').trim();

    for (const key of Object.keys(WEB_ACCOUNTS)) {
      const acc = WEB_ACCOUNTS[key];
      if (
        (acc.email.toLowerCase() === idClean || acc.username.toLowerCase() === idClean) &&
        (acc.passwords.includes(pwClean) || pwClean === '123')
      ) {
        return acc.role;
      }
    }
    return null;
  }

  // Quick account card clicks
  quickCards.forEach((card) => {
    card.addEventListener('click', () => {
      const accType = card.getAttribute('data-acc');
      if (accType === 'admin') {
        if (loginEmail) loginEmail.value = 'admin@miette.vn';
        if (loginPassword) loginPassword.value = '123';
        showWorkspace('ADMIN');
      } else if (accType === 'manager') {
        if (loginEmail) loginEmail.value = 'manager@miette.vn';
        if (loginPassword) loginPassword.value = '123';
        showWorkspace('STORE_MANAGER');
      } else if (accType === 'cashier') {
        if (loginEmail) loginEmail.value = 'cashier@miette.vn';
        if (loginPassword) loginPassword.value = '123';
        showWorkspace('CASHIER_SUPPORT');
      }
    });
  });

  // Form submit
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const roleFound = authenticate(loginEmail.value, loginPassword.value);
      if (roleFound) {
        if (loginErrorMsg) loginErrorMsg.style.display = 'none';
        showWorkspace(roleFound);
      } else {
        if (loginErrorMsg) {
          loginErrorMsg.textContent = 'Sai tài khoản hoặc mật khẩu (Thử admin@miette.vn / 123)';
          loginErrorMsg.style.display = 'block';
        }
      }
    });
  }

  // Logout button
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('miette_web_role');
      if (loginEmail) loginEmail.value = '';
      if (loginPassword) loginPassword.value = '';
      if (loginErrorMsg) loginErrorMsg.style.display = 'none';
      showLogin();
      addSystemLog('Hệ thống', 'Người dùng đã đăng xuất khỏi phiên làm việc');
    });
  }

  // Auto-login from saved session or default to Admin if initial visit
  const savedRole = localStorage.getItem('miette_web_role');
  if (savedRole && ROLE_PERMISSIONS[savedRole]) {
    showWorkspace(savedRole);
  } else {
    // Show login screen by default
    showLogin();
  }
}

function updateRoleAccess(role) {
  const perm = ROLE_PERMISSIONS[role];
  if (!perm) return;

  // 1. Update Sidebar Profile Info & Topbar Logged Info
  const userNameEl = document.querySelector('.sidebar-user-name');
  const userRoleEl = document.querySelector('.sidebar-user-role');
  const avatarTagEl = document.getElementById('topAvatarTag') || document.querySelector('.user-avatar-tag');
  const loggedRoleBadge = document.getElementById('loggedRoleBadge');
  const loggedUserName = document.getElementById('loggedUserName');

  if (userNameEl) userNameEl.textContent = perm.userName;
  if (userRoleEl) userRoleEl.textContent = perm.userRole;
  if (avatarTagEl) avatarTagEl.textContent = perm.avatarInitials;
  if (loggedRoleBadge) loggedRoleBadge.textContent = perm.title;
  if (loggedUserName) loggedUserName.textContent = perm.userName;

  // 2. Filter Visible Sidebar Navigation Links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach((link) => {
    const tabKey = link.getAttribute('data-tab');
    if (perm.visibleTabs.includes(tabKey)) {
      link.style.display = 'flex';
    } else {
      link.style.display = 'none';
    }
  });

  // 3. Complaint Action Permissions based on Role
  const complaintBtns = document.getElementById('complaintBtnsGroup');
  if (complaintBtns) {
    if (role === 'CASHIER_SUPPORT') {
      complaintBtns.innerHTML = `
        <button class="btn btn-primary" id="btnForwardManager">Gửi đề xuất sang Quản lý duyệt</button>
      `;
      const btnForward = document.getElementById('btnForwardManager');
      if (btnForward) {
        btnForward.onclick = () => {
          alert('Đã gửi phiếu đề xuất hoàn tiền sang Quản lý duyệt!');
          addSystemLog('Thu ngân Mai', 'Gửi đề xuất xử lý khiếu nại đơn BK2610260012 sang Quản lý');
        };
      }
    } else if (role === 'KITCHEN' || role === 'SHIPPER') {
      complaintBtns.innerHTML = `
        <span style="font-size: 12px; color: var(--text-muted); font-style: italic;">
          Chỉ Quản lý hoặc Chủ tiệm mới có quyền duyệt hoàn tiền khiếu nại.
        </span>
      `;
    } else {
      complaintBtns.innerHTML = `
        <button class="btn btn-success" id="btnApproveRefund">Duyệt hoàn 50.000đ</button>
        <button class="btn btn-warning-outline" id="btnRework">Làm lại</button>
        <button class="btn btn-danger-outline" id="btnReject">Từ chối</button>
      `;
      setupComplaintActions();
    }
  }

  // 4. Role Status Focus Highlighting
  highlightRoleActions(role);

  // Refresh dynamic role boards
  renderKdsBoard();
  renderKdsSlots();
  renderDeliveryBoard();
}

function highlightRoleActions(role) {
  const steps = [
    { id: 'btnStatusConfirm', roles: ['ADMIN', 'STORE_MANAGER', 'CASHIER_SUPPORT'] },
    { id: 'btnStatusBake', roles: ['ADMIN', 'STORE_MANAGER', 'KITCHEN'] },
    { id: 'btnStatusReady', roles: ['ADMIN', 'STORE_MANAGER', 'KITCHEN'] },
    { id: 'btnStatusDeliver', roles: ['ADMIN', 'STORE_MANAGER', 'SHIPPER'] },
    { id: 'btnStatusComplete', roles: ['ADMIN', 'STORE_MANAGER', 'SHIPPER'] },
  ];

  steps.forEach((step) => {
    const btn = document.getElementById(step.id);
    if (btn) {
      if (step.roles.includes(role)) {
        btn.style.opacity = '1';
        btn.title = `Vai trò ${role} có thẩm quyền thực hiện bước này`;
      } else {
        btn.style.opacity = '0.65';
        btn.title = `Thẩm quyền thuộc vai trò khác`;
      }
    }
  });
}

// ==========================================================================
// ORDERS RENDERING & SELECTION
// ==========================================================================

function setupOrdersList() {
  const container = document.getElementById('ordersScrollBox');
  if (!container) return;

  container.innerHTML = '';
  ordersData.forEach((order) => {
    const item = document.createElement('div');
    item.className = `order-row-item ${order.code === selectedOrder.code ? 'selected' : ''}`;
    item.innerHTML = `
      <div class="order-row-top">
        <span class="order-row-code">${order.code}</span>
        <span class="badge ${order.statusBadge}">${order.status}</span>
      </div>
      <div class="order-row-cake">${order.cake}</div>
      <div class="order-row-meta">${order.name} · ${order.slot} · ${order.price}</div>
    `;

    item.addEventListener('click', () => {
      selectedOrder = order;
      document.querySelectorAll('.order-row-item').forEach((i) => i.classList.remove('selected'));
      item.classList.add('selected');
      updateOrderDetailView(order);
    });

    container.appendChild(item);
  });

  const countBadge = document.getElementById('orderCountBadge');
  if (countBadge) {
    countBadge.textContent = ordersData.length;
  }
}

function updateOrderDetailView(order) {
  const codeEl = document.getElementById('orderDetailCode');
  const badgeEl = document.getElementById('orderDetailStatusBadge');
  const cakeEl = document.getElementById('orderDetailCake');
  const priceEl = document.getElementById('orderDetailPrice');
  const customerEl = document.getElementById('orderDetailCustomer');
  const specsEl = document.getElementById('orderDetailSpecs');
  const complaintPanel = document.getElementById('complaintPanel');

  if (codeEl) codeEl.textContent = order.code;
  if (badgeEl) {
    badgeEl.textContent = order.status;
    badgeEl.className = `badge ${order.statusBadge}`;
  }
  if (cakeEl) cakeEl.textContent = order.cake;
  if (priceEl) priceEl.textContent = order.price;
  if (customerEl) {
    customerEl.textContent = `Khách: ${order.name} · SĐT: ${order.phone} · Địa chỉ: ${order.address || 'Quận 1'} · Khung giờ: ${order.slot}`;
  }
  if (specsEl) {
    specsEl.innerHTML = `
      <div class="spec-item">Chữ kem: <strong>"${order.piping || 'Không yêu cầu'}"</strong></div>
      <div class="spec-item">Thiệp tay: <strong>"${order.cardText || 'Không yêu cầu'}"</strong></div>
      <div class="spec-item">Phụ kiện: <strong>${order.accessories || 'Tiêu chuẩn'}</strong></div>
      <div class="spec-item">Dị ứng: <strong>${order.allergens || 'Không'}</strong></div>
    `;
  }
  if (complaintPanel) {
    complaintPanel.style.display = order.hasComplaint ? 'block' : 'none';
  }

  // Update active step button
  updateStatusStepButtons(order.status);

  // Update Visual Timeline
  updateOrderTimeline(order.status);
}

function updateOrderTimeline(status) {
  const container = document.getElementById('orderTimelineContainer');
  if (!container) return;

  const stepsDef = [
    { num: 1, name: 'Xác nhận đơn', time: 'Tiếp nhận đơn' },
    { num: 2, name: 'Bếp làm bánh', time: 'Nướng & cốt bánh' },
    { num: 3, name: 'Đóng hộp mica', time: 'Bánh hoàn tất' },
    { num: 4, name: 'Giao Shipper', time: 'Bàn giao vận chuyển' },
    { num: 5, name: 'Hoàn tất', time: 'Đã giao khách' },
  ];

  let activeIndex = 1;
  if (status === 'Chờ xác nhận') activeIndex = 1;
  else if (status === 'Đang làm') activeIndex = 2;
  else if (status === 'Sẵn sàng') activeIndex = 3;
  else if (status === 'Đang giao') activeIndex = 4;
  else if (status === 'Hoàn tất') activeIndex = 5;

  container.innerHTML = stepsDef
    .map((step) => {
      let stateClass = '';
      let statusText = step.time;

      if (step.num < activeIndex || (activeIndex === 5 && status === 'Hoàn tất')) {
        stateClass = 'done';
        statusText = 'Hoàn thành';
      } else if (step.num === activeIndex) {
        stateClass = 'active';
        statusText = 'Đang thực hiện';
      }

      return `
        <div class="timeline-step-item ${stateClass}">
          <div class="timeline-step-bullet">${step.num}</div>
          <div class="timeline-step-name">${step.name}</div>
          <div class="timeline-step-time">${statusText}</div>
        </div>
      `;
    })
    .join('');
}

function updateStatusStepButtons(currentStatus) {
  const steps = [
    { id: 'btnStatusConfirm', text: 'Chờ xác nhận' },
    { id: 'btnStatusBake', text: 'Đang làm' },
    { id: 'btnStatusReady', text: 'Sẵn sàng' },
    { id: 'btnStatusDeliver', text: 'Đang giao' },
    { id: 'btnStatusComplete', text: 'Hoàn tất' },
  ];

  steps.forEach((step) => {
    const btn = document.getElementById(step.id);
    if (btn) {
      if (step.text === currentStatus) {
        btn.classList.add('current');
      } else {
        btn.classList.remove('current');
      }
    }
  });
}

function setupStatusTransitionBar() {
  const transitions = [
    { id: 'btnStatusConfirm', status: 'Chờ xác nhận', badge: 'badge-danger' },
    { id: 'btnStatusBake', status: 'Đang làm', badge: 'badge-warning' },
    { id: 'btnStatusReady', status: 'Sẵn sàng', badge: 'badge-info' },
    { id: 'btnStatusDeliver', status: 'Đang giao', badge: 'badge-info' },
    { id: 'btnStatusComplete', status: 'Hoàn tất', badge: 'badge-success' },
  ];

  transitions.forEach((t) => {
    const btn = document.getElementById(t.id);
    if (btn) {
      btn.addEventListener('click', () => {
        changeOrderStatus(selectedOrder.code, t.status, t.badge);
      });
    }
  });
}

function changeOrderStatus(orderCode, newStatus, newBadge) {
  const order = ordersData.find((o) => o.code === orderCode);
  if (!order) return;

  order.status = newStatus;
  order.statusBadge = newBadge;

  setupOrdersList();
  updateOrderDetailView(order);
  renderKdsBoard();
  renderKdsSlots();
  renderDeliveryBoard();

  addSystemLog(
    ROLE_PERMISSIONS[currentRole].userName,
    `Đổi trạng thái đơn <strong>${order.code}</strong> sang <strong>${newStatus.toUpperCase()}</strong>`
  );
}

// ==========================================================================
// KDS PRODUCTION BOARD (BẾP BÁNH KDS)
// ==========================================================================

function setupKdsBoard() {
  const filterBtns = document.querySelectorAll('.kds-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline');
      currentKdsFilter = btn.getAttribute('data-filter');
      renderKdsBoard();
    });
  });

  const btnRefresh = document.getElementById('btnRefreshKds');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      renderKdsBoard();
      renderKdsSlots();
      alert('Đã cập nhật bảng điều hành Bếp KDS mới nhất.');
    });
  }

  renderKdsBoard();
  renderKdsSlots();
}

function renderKdsSlots() {
  const tbody = document.getElementById('kdsSlotsBody');
  if (!tbody) return;

  const maxCakes = parseInt(document.getElementById('cfgMaxCakes')?.value, 10) || 6;
  const slots = ['15:00 - 16:00', '17:00 - 18:00', '19:00 - 20:00'];

  tbody.innerHTML = '';
  slots.forEach((slot) => {
    const slotOrders = ordersData.filter((o) => o.slot === slot);
    const count = slotOrders.length;
    let badge = 'badge-success';
    let statusText = 'Còn chỗ';

    if (count >= maxCakes) {
      badge = 'badge-danger';
      statusText = 'Đã khóa slot';
    } else if (count >= maxCakes - 1) {
      badge = 'badge-warning';
      statusText = 'Gần đầy';
    }

    const orderCodesStr =
      slotOrders.length > 0
        ? slotOrders.map((o) => `${o.code} (${o.cake.split(' - ')[0]})`).join(', ')
        : 'Chưa có đơn đặt trước';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${slot}</strong></td>
      <td>${count} / ${maxCakes} Bánh</td>
      <td>${orderCodesStr}</td>
      <td><span class="badge ${badge}">${statusText}</span></td>
    `;
    tbody.appendChild(row);
  });
}

function renderKdsBoard() {
  const container = document.getElementById('kdsCardsContainer');
  if (!container) return;

  container.innerHTML = '';

  let list = ordersData;
  if (currentKdsFilter === 'baking') {
    list = list.filter((o) => o.status === 'Đang làm');
  } else if (currentKdsFilter === 'pending') {
    list = list.filter((o) => o.status === 'Chờ xác nhận');
  } else if (currentKdsFilter === 'ready') {
    list = list.filter((o) => o.status === 'Sẵn sàng');
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; padding: 32px; text-align: center; color: var(--text-muted); background: #FFF; border-radius: 8px;">
        Không có đơn hàng nào trong mục này. Bếp đang hoàn thành tốt tiến độ!
      </div>
    `;
    return;
  }

  list.forEach((order) => {
    const card = document.createElement('div');
    card.className = 'kds-card';
    card.innerHTML = `
      <div>
        <div class="kds-card-header">
          <div>
            <span class="kds-order-code">${order.code}</span>
            <span class="badge ${order.statusBadge}" style="margin-left: 8px;">${order.status}</span>
          </div>
          <span class="kds-slot-time">Hẹn: ${order.slot}</span>
        </div>

        <div class="kds-cake-name">${order.cake}</div>

        <div class="kds-piping-box">
          Chữ kem: <strong>"${order.piping || 'Không yêu cầu'}"</strong>
        </div>

        <div class="kds-detail-row">Thiệp viết tay: <em>"${order.cardText || 'Không'}"</em></div>
        <div class="kds-detail-row">Phụ kiện: ${order.accessories || 'Tiêu chuẩn'}</div>
        <div class="kds-detail-row">
          Dị ứng: <span class="kds-allergen-tag">${order.allergens || 'An toàn'}</span>
        </div>
      </div>

      <div class="kds-actions-row">
        ${
          order.status !== 'Đang làm'
            ? `<button class="btn btn-warning-outline btn-sm btn-start-baking" data-code="${order.code}">Bắt đầu làm</button>`
            : `<button class="btn btn-success btn-sm btn-finish-baking" data-code="${order.code}">Bánh hoàn tất</button>`
        }
        <button class="btn btn-outline btn-sm btn-print-kds" data-code="${order.code}">Phiếu A5</button>
      </div>
    `;

    container.appendChild(card);
  });

  // Attach interactive button events
  container.querySelectorAll('.btn-start-baking').forEach((btn) => {
    btn.onclick = () => {
      const code = btn.getAttribute('data-code');
      changeOrderStatus(code, 'Đang làm', 'badge-warning');
    };
  });

  container.querySelectorAll('.btn-finish-baking').forEach((btn) => {
    btn.onclick = () => {
      const code = btn.getAttribute('data-code');
      changeOrderStatus(code, 'Sẵn sàng', 'badge-info');
    };
  });

  container.querySelectorAll('.btn-print-kds').forEach((btn) => {
    btn.onclick = () => {
      const code = btn.getAttribute('data-code');
      const ord = ordersData.find((o) => o.code === code);
      if (ord) {
        selectedOrder = ord;
        openPrintPreview(ord);
      }
    };
  });
}

// ==========================================================================
// SHIPPER DELIVERY & COD BOARD (GIAO HÀNG & COD)
// ==========================================================================

function setupDeliveryBoard() {
  const btnRefresh = document.getElementById('btnRefreshDelivery');
  if (btnRefresh) {
    btnRefresh.addEventListener('click', () => {
      renderDeliveryBoard();
      alert('Đã làm mới danh sách giao hàng.');
    });
  }

  // Filter Pills for Shipper
  const filterBtns = document.querySelectorAll('.delivery-filter-btn');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => {
        b.classList.remove('active', 'btn-primary');
        b.classList.add('btn-outline');
      });
      btn.classList.add('active', 'btn-primary');
      btn.classList.remove('btn-outline');
      currentDeliveryFilter = btn.getAttribute('data-filter');
      renderDeliveryBoard();
    });
  });

  // Settle COD Button
  const btnSettle = document.getElementById('btnSettleCod');
  if (btnSettle) {
    btnSettle.addEventListener('click', () => {
      let codTotal = 0;
      ordersData
        .filter((o) => o.status === 'Hoàn tất' && o.isCod)
        .forEach((o) => {
          codTotal += parseInt(o.price.replace(/\D/g, ''), 10) || 0;
        });

      if (codTotal === 0) {
        alert('Hiện tại không có tiền COD nào cần nộp về quỹ.');
        return;
      }

      if (
        confirm(
          `Xác nhận nộp toàn bộ ${codTotal.toLocaleString('vi-VN')}đ tiền COD ca hôm nay về quỹ Thu ngân Mai?`
        )
      ) {
        addSystemLog(
          'Shipper Bảo',
          `Nộp <strong>${codTotal.toLocaleString('vi-VN')}đ</strong> tiền COD ca hôm nay cho Thu ngân Mai`
        );
        alert(
          `Đã bàn giao ${codTotal.toLocaleString('vi-VN')}đ tiền COD về quỹ thu ngân thành công. Ca làm việc đã được chốt!`
        );
      }
    });
  }

  renderDeliveryBoard();
}

function renderDeliveryBoard() {
  const container = document.getElementById('deliveryOrdersList');
  if (!container) return;

  // Calculate Counters
  const readyOrders = ordersData.filter((o) => o.status === 'Sẵn sàng');
  const deliveringOrders = ordersData.filter((o) => o.status === 'Đang giao');
  const completedOrders = ordersData.filter((o) => o.status === 'Hoàn tất');

  let codTotal = 0;
  completedOrders.forEach((o) => {
    if (o.isCod) {
      codTotal += parseInt(o.price.replace(/\D/g, ''), 10) || 0;
    }
  });

  const countReadyEl = document.getElementById('shipCountReady');
  const countDeliveringEl = document.getElementById('shipCountDelivering');
  const countCompletedEl = document.getElementById('shipCountCompleted');
  const codTotalEl = document.getElementById('shipCodTotal');

  if (countReadyEl) countReadyEl.textContent = readyOrders.length;
  if (countDeliveringEl) countDeliveringEl.textContent = deliveringOrders.length;
  if (countCompletedEl) countCompletedEl.textContent = completedOrders.length;
  if (codTotalEl) codTotalEl.textContent = codTotal.toLocaleString('vi-VN') + 'đ';

  container.innerHTML = '';

  let list = ordersData;
  if (currentDeliveryFilter === 'ready') {
    list = list.filter((o) => o.status === 'Sẵn sàng');
  } else if (currentDeliveryFilter === 'delivering') {
    list = list.filter((o) => o.status === 'Đang giao');
  } else if (currentDeliveryFilter === 'completed') {
    list = list.filter((o) => o.status === 'Hoàn tất');
  }

  if (list.length === 0) {
    container.innerHTML = `
      <div style="padding: 28px; text-align: center; color: var(--text-muted); background: #FFF; border-radius: 8px;">
        Không có đơn hàng nào trong bộ lọc này.
      </div>
    `;
    return;
  }

  list.forEach((order) => {
    const card = document.createElement('div');
    card.className = 'delivery-card';
    card.innerHTML = `
      <div class="delivery-info-col">
        <div class="delivery-top-line">
          <strong style="color: var(--accent-burgundy); font-size: 14px;">${order.code}</strong>
          <span class="badge ${order.statusBadge}">${order.status}</span>
          <span style="font-size: 12px; font-weight: 700; color: ${order.isCod ? '#C2410C' : '#15803D'}; background: ${order.isCod ? '#FFEDD5' : '#DCFCE7'}; padding: 2px 8px; border-radius: 4px;">
            ${order.isCod ? `COD: ${order.price}` : 'ĐÃ THANH TOÁN (MOMO/VNPAY)'}
          </span>
        </div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-dark); margin: 3px 0;">
          ${order.cake} · Khung giờ: ${order.slot}
        </div>
        <div class="delivery-address">
          Địa chỉ: <strong>${order.address}</strong>
        </div>
        <div class="delivery-meta-line">
          Khách: <strong>${order.name}</strong> · SĐT: ${order.phone}
        </div>
      </div>

      <div class="delivery-actions-col">
        <button class="btn btn-outline btn-sm btn-call-cust" data-name="${order.name}" data-phone="${order.phone}" data-address="${order.address}">
          Gọi khách
        </button>

        ${
          order.status === 'Sẵn sàng'
            ? `<button class="btn btn-primary btn-sm btn-pick-order" data-code="${order.code}">Nhận giao</button>`
            : ''
        }

        ${
          order.status === 'Đang giao'
            ? `<button class="btn btn-success btn-sm btn-confirm-delivery" data-code="${order.code}" data-name="${order.name}" data-amount="${order.isCod ? order.price : '0đ'}">Xác nhận đã giao & Thu tiền</button>`
            : ''
        }

        ${
          order.status === 'Hoàn tất'
            ? `<span style="font-size: 12px; color: #15803D; font-weight: 700;">ĐÃ GIAO XONG</span>`
            : ''
        }
      </div>
    `;

    container.appendChild(card);
  });

  // Attach button events
  container.querySelectorAll('.btn-call-cust').forEach((btn) => {
    btn.onclick = () => {
      const name = btn.getAttribute('data-name');
      const phone = btn.getAttribute('data-phone');
      const address = btn.getAttribute('data-address');
      openCallModal(name, phone, address);
    };
  });

  container.querySelectorAll('.btn-pick-order').forEach((btn) => {
    btn.onclick = () => {
      const code = btn.getAttribute('data-code');
      changeOrderStatus(code, 'Đang giao', 'badge-info');
    };
  });

  container.querySelectorAll('.btn-confirm-delivery').forEach((btn) => {
    btn.onclick = () => {
      const code = btn.getAttribute('data-code');
      const name = btn.getAttribute('data-name');
      const amount = btn.getAttribute('data-amount');
      openCodModal(code, name, amount);
    };
  });
}

function openCallModal(name, phone, address) {
  const modal = document.getElementById('callModal');
  const nameEl = document.getElementById('callCustomerName');
  const phoneEl = document.getElementById('callCustomerPhone');

  if (nameEl) nameEl.textContent = name;
  if (phoneEl) phoneEl.textContent = `${phone} · ${address || 'TP. Hồ Chí Minh'}`;
  if (modal) modal.classList.add('open');
}

function openCodModal(code, name, amount) {
  const modal = document.getElementById('codModal');
  const codeEl = document.getElementById('codOrderCode');
  const nameEl = document.getElementById('codCustName');
  const amountEl = document.getElementById('codAmount');

  if (codeEl) codeEl.textContent = code;
  if (nameEl) nameEl.textContent = name;
  if (amountEl) amountEl.textContent = amount;
  if (modal) modal.classList.add('open');
}

// ==========================================================================
// PRODUCTS 30 CAKES CATALOG
// ==========================================================================

async function setupProductsCatalog() {
  const searchInput = document.getElementById('cakeSearchInput');
  const categoryFilter = document.getElementById('cakeCategoryFilter');
  const btnOpenModal = document.getElementById('btnOpenNewProductModal');

  try {
    const res = await fetch('/api/cakes');
    if (res.ok) {
      cakesList30 = await res.json();
    }
  } catch {
    console.log('Using default cake list');
  }

  // Fallback if empty
  if (!cakesList30 || cakesList30.length === 0) {
    cakesList30 = [
      { name: 'Bánh Kem Dâu Tây Hoàng Gia', categoryId: 'fresh_cream', price: 380000, leadTimeHours: 2, allergens: ['Trứng', 'Sữa', 'Gluten'] },
      { name: 'Tiramisu Mascarpone Truyền Thống', categoryId: 'cold_cake', price: 350000, leadTimeHours: 3, allergens: ['Trứng', 'Sữa', 'Rượu Marsala'] },
      { name: 'Bánh Chocolate Truffle Bỉ Cổ Điển', categoryId: 'birthday', price: 460000, leadTimeHours: 4, allergens: ['Sữa', 'Hạt hạnh nhân'] },
      { name: 'Red Velvet Hoa Hồng & Trái Cây', categoryId: 'fresh_cream', price: 390000, leadTimeHours: 2, allergens: ['Trứng', 'Sữa'] },
      { name: 'Bánh Bắp Non Phô Mai Nướng', categoryId: 'anniversary', price: 380000, leadTimeHours: 4, allergens: ['Trứng', 'Sữa'] },
      { name: 'Bánh Yến Mạch Thuần Chay', categoryId: 'vegan', price: 440000, leadTimeHours: 6, allergens: ['Hạt dẻ cười'] },
    ];
  }

  populatePosCakesDropdown();
  renderProductsTable();

  if (searchInput) {
    searchInput.addEventListener('input', () => renderProductsTable());
  }

  if (categoryFilter) {
    categoryFilter.addEventListener('change', () => renderProductsTable());
  }

  if (btnOpenModal) {
    btnOpenModal.addEventListener('click', () => {
      const modal = document.getElementById('newProductModal');
      if (modal) modal.classList.add('open');
    });
  }
}

function populatePosCakesDropdown() {
  const select = document.getElementById('posCakeSelect');
  if (!select) return;

  select.innerHTML = '';
  cakesList30.forEach((cake) => {
    const price = cake.variants && cake.variants[0] ? cake.variants[0].price : cake.price || 380000;
    const opt = document.createElement('option');
    opt.value = `${cake.name} - ${price.toLocaleString('vi-VN')}đ`;
    opt.textContent = `${cake.name} - ${price.toLocaleString('vi-VN')}đ`;
    select.appendChild(opt);
  });
}

function renderProductsTable() {
  const tableBody = document.getElementById('productsTableBody');
  const searchInput = document.getElementById('cakeSearchInput');
  const categoryFilter = document.getElementById('cakeCategoryFilter');

  if (!tableBody) return;

  const query = (searchInput?.value || '').toLowerCase().trim();
  const cat = categoryFilter?.value || 'all';

  const categoryNames = {
    fresh_cream: 'Kem tươi',
    cold_cake: 'Bánh lạnh',
    birthday: 'Sinh nhật',
    anniversary: 'Kỷ niệm & Cưới',
    cupcake: 'Mini & Cupcake',
    vegan: 'Thuần chay',
  };

  const filtered = cakesList30.filter((c) => {
    const matchCat = cat === 'all' || c.categoryId === cat;
    const matchQuery =
      !query ||
      c.name.toLowerCase().includes(query) ||
      (c.subtitle && c.subtitle.toLowerCase().includes(query));
    return matchCat && matchQuery;
  });

  tableBody.innerHTML = '';

  if (filtered.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px;">Không tìm thấy món bánh phù hợp.</td></tr>`;
    return;
  }

  filtered.forEach((cake) => {
    const row = document.createElement('tr');
    const priceNum = cake.variants && cake.variants[0] ? cake.variants[0].price : cake.price || 380000;
    const catName = categoryNames[cake.categoryId] || 'Bánh cao cấp';
    const algs = Array.isArray(cake.allergens)
      ? cake.allergens.join(', ')
      : cake.allergens || 'Trứng, Sữa';

    row.innerHTML = `
      <td>
        <strong>${cake.name}</strong>
        <div style="font-size: 11.5px; color: var(--text-muted);">${cake.subtitle || ''}</div>
      </td>
      <td><span class="badge badge-info">${catName}</span></td>
      <td><strong>${priceNum.toLocaleString('vi-VN')}đ</strong></td>
      <td>${cake.leadTimeHours || 2} giờ</td>
      <td><span style="font-size: 11.5px; color: #991B1B;">${algs}</span></td>
      <td>
        <button class="btn btn-outline btn-sm btn-quick-order" data-name="${cake.name}" data-price="${priceNum}">Đặt nhanh</button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  // Attach quick order to open POS modal with cake preselected
  tableBody.querySelectorAll('.btn-quick-order').forEach((btn) => {
    btn.onclick = () => {
      const name = btn.getAttribute('data-name');
      const price = btn.getAttribute('data-price');
      const posModal = document.getElementById('posModal');
      const cakeSelect = document.getElementById('posCakeSelect');

      if (cakeSelect) {
        let opt = Array.from(cakeSelect.options).find((o) => o.value.includes(name));
        if (!opt) {
          opt = new Option(
            `${name} - ${parseInt(price, 10).toLocaleString('vi-VN')}đ`,
            `${name} - ${price}đ`
          );
          cakeSelect.add(opt);
        }
        cakeSelect.value = opt.value;
      }

      if (posModal) posModal.classList.add('open');
    };
  });
}

// ==========================================================================
// SEARCH FILTER FOR ORDERS
// ==========================================================================

function setupSearchFilter() {
  const searchInput = document.getElementById('orderSearchInput');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('.order-row-item');

    ordersData.forEach((order, index) => {
      const match =
        order.code.toLowerCase().includes(query) ||
        order.name.toLowerCase().includes(query) ||
        order.phone.includes(query) ||
        order.cake.toLowerCase().includes(query);

      if (rows[index]) {
        rows[index].style.display = match ? 'block' : 'none';
      }
    });
  });
}

// ==========================================================================
// CUSTOMERS CRM
// ==========================================================================

function setupCustomersCRM() {
  const searchInput = document.getElementById('customerSearchInput');
  const tbody = document.getElementById('customersTableBody');
  if (!tbody) return;

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      tbody.querySelectorAll('tr').forEach((row) => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(q) ? '' : 'none';
      });
    });
  }

  tbody.querySelectorAll('.btn-cust-order').forEach((btn) => {
    btn.onclick = () => {
      const name = btn.getAttribute('data-name');
      const phone = btn.getAttribute('data-phone');
      const posModal = document.getElementById('posModal');
      const nameInput = document.getElementById('posCustName');
      const phoneInput = document.getElementById('posCustPhone');

      if (nameInput) nameInput.value = name;
      if (phoneInput) phoneInput.value = phone;
      if (posModal) posModal.classList.add('open');
    };
  });
}

// ==========================================================================
// FEFO INVENTORY (KHO NGUYÊN LIỆU)
// ==========================================================================

function setupFefo() {
  const container = document.getElementById('fefoTableBody');
  if (!container) return;

  container.querySelectorAll('.btn-fefo-dispense').forEach((btn) => {
    btn.onclick = () => {
      const lot = btn.getAttribute('data-lot');
      const name = btn.getAttribute('data-name');
      const row = btn.closest('tr');
      const stockEl = row.querySelector('.fefo-stock');

      if (stockEl) {
        let stock = parseInt(stockEl.textContent, 10);
        if (stock > 0) {
          stock--;
          stockEl.textContent = stock;
          if (stock === 0) {
            btn.disabled = true;
            btn.textContent = 'Đã hết';
            const badge = row.querySelector('.badge');
            if (badge) {
              badge.className = 'badge badge-danger';
              badge.textContent = 'Đã xuất hết';
            }
          }
          addSystemLog(
            ROLE_PERMISSIONS[currentRole].userName,
            `Xuất dùng 1 đơn vị <strong>${name}</strong> (Lô <strong>${lot}</strong>) vào mẻ làm bánh`
          );
          alert(`Đã xuất 1 đơn vị "${name}" từ lô ${lot}. Tồn kho còn lại: ${stock}`);
        } else {
          alert('Lô này đã xuất hết tồn kho!');
        }
      }
    };
  });
}

// ==========================================================================
// COMPLAINT ACTIONS
// ==========================================================================

function setupComplaintActions() {
  const btnApprove = document.getElementById('btnApproveRefund');
  const btnRework = document.getElementById('btnRework');
  const btnReject = document.getElementById('btnReject');

  if (btnApprove) {
    btnApprove.onclick = () => {
      if (confirm('Xác nhận duyệt hoàn 50.000đ về ví MoMo gốc của khách hàng?')) {
        const panel = document.getElementById('complaintPanel');
        if (panel) {
          panel.innerHTML = `
            <div style="color: #15803D; font-weight: 700; background: #DCFCE7; padding: 12px; border-radius: 6px;">
              ĐÃ DUYỆT HOÀN: 50.000đ đã được hoàn về ví MoMo gốc của khách hàng lúc 14:45.
            </div>
          `;
        }
        addSystemLog(ROLE_PERMISSIONS[currentRole].userName, 'Duyệt hoàn 50.000đ khiếu nại cho đơn BK2610260012');
        alert('Đã duyệt hoàn 50.000đ thành công!');
      }
    };
  }

  if (btnRework) {
    btnRework.onclick = () => {
      alert('Đã chuyển yêu cầu làm lại bánh sang Bếp KDS.');
      addSystemLog(ROLE_PERMISSIONS[currentRole].userName, 'Chuyển yêu cầu làm lại bánh đơn BK2610260012 sang Bếp');
      changeOrderStatus('BK2610260012', 'Đang làm', 'badge-warning');
    };
  }

  if (btnReject) {
    btnReject.onclick = () => {
      const reason = prompt('Nhập lý do từ chối giải quyết:', 'Bánh giao đúng nguyên mẫu khách đã duyệt ảnh trước');
      if (reason) {
        const panel = document.getElementById('complaintPanel');
        if (panel) {
          panel.innerHTML = `
            <div style="color: #991B1B; font-weight: 700; background: #FEE2E2; padding: 12px; border-radius: 6px;">
              ĐÃ TỪ CHỐI KHIẾU NẠI: ${reason}
            </div>
          `;
        }
        addSystemLog(ROLE_PERMISSIONS[currentRole].userName, `Từ chối khiếu nại đơn BK2610260012: "${reason}"`);
      }
    };
  }
}

// ==========================================================================
// MODALS
// ==========================================================================

function setupModals() {
  // POS Modal
  const btnOpenPos = document.getElementById('btnOpenPosModal');
  const posModal = document.getElementById('posModal');
  const btnClosePos = document.getElementById('btnClosePosModal');
  const btnCancelPos = document.getElementById('btnCancelPos');
  const btnSubmitPos = document.getElementById('btnSubmitPos');

  if (btnOpenPos && posModal) {
    btnOpenPos.addEventListener('click', () => posModal.classList.add('open'));
  }

  const closePos = () => posModal && posModal.classList.remove('open');
  if (btnClosePos) btnClosePos.addEventListener('click', closePos);
  if (btnCancelPos) btnCancelPos.addEventListener('click', closePos);

  if (btnSubmitPos) {
    btnSubmitPos.addEventListener('click', () => {
      const name = document.getElementById('posCustName')?.value.trim();
      const phone = document.getElementById('posCustPhone')?.value.trim();
      const cake = document.getElementById('posCakeSelect')?.value;
      const slot = document.getElementById('posTimeSlot')?.value;
      const piping = document.getElementById('posPipingText')?.value.trim();
      const address = document.getElementById('posDeliveryAddress')?.value.trim() || 'Nhận tại quầy Miette Quận 3';
      const paymentMethod = document.getElementById('posPaymentMethod')?.value || 'COD';

      if (!name || !phone) {
        alert('Vui lòng nhập Tên và Số điện thoại của khách hàng.');
        return;
      }

      // Extract price from cake string e.g. "Bánh Dâu Mây 16 cm - 420.000đ"
      const priceMatch = (cake || '').match(/([\d\.]+đ)/);
      const cakePrice = priceMatch ? priceMatch[1] : '420.000đ';
      const isCod = paymentMethod === 'COD';

      const newOrder = {
        code: `BK2610${Math.floor(1000 + Math.random() * 9000)}`,
        name: name,
        phone: phone,
        address: address,
        cake: cake ? cake.split(' - ')[0] : 'Bánh Kem Dâu Tây Hoàng Gia',
        price: cakePrice,
        slot: slot || '17:00 - 18:00',
        status: 'Chờ xác nhận',
        statusBadge: 'badge-danger',
        piping: piping || 'Chúc mừng sinh nhật',
        cardText: 'Chúc bạn tuổi mới ngọt ngào!',
        accessories: 'Nến mạ vàng + Bộ dao nĩa',
        allergens: 'Không',
        paymentMethod: paymentMethod,
        isCod: isCod,
        codAmount: isCod ? cakePrice : '0đ',
        hasComplaint: false,
      };

      ordersData.unshift(newOrder);
      selectedOrder = newOrder;
      setupOrdersList();
      updateOrderDetailView(newOrder);
      renderKdsBoard();
      renderKdsSlots();
      renderDeliveryBoard();
      closePos();

      addSystemLog(
        ROLE_PERMISSIONS[currentRole].userName,
        `Tạo đơn tại quầy POS: <strong>${newOrder.code}</strong> (${name} · ${cakePrice})`
      );
      alert(`Tạo đơn thành công: ${newOrder.code} cho khách ${name}!`);
    });
  }

  // Print Modal
  const btnPrintA5 = document.getElementById('btnPrintA5');
  const printModal = document.getElementById('printModal');
  const btnClosePrint = document.getElementById('btnClosePrintModal');
  const btnCancelPrint = document.getElementById('btnCancelPrint');
  const btnConfirmPrint = document.getElementById('btnConfirmPrint');

  if (btnPrintA5 && printModal) {
    btnPrintA5.addEventListener('click', () => {
      openPrintPreview(selectedOrder);
    });
  }

  const closePrint = () => printModal && printModal.classList.remove('open');
  if (btnClosePrint) btnClosePrint.addEventListener('click', closePrint);
  if (btnCancelPrint) btnCancelPrint.addEventListener('click', closePrint);

  if (btnConfirmPrint) {
    btnConfirmPrint.addEventListener('click', () => {
      addSystemLog(
        ROLE_PERMISSIONS[currentRole].userName,
        `In phiếu A5 bàn giao sản xuất cho đơn <strong>${selectedOrder.code}</strong>`
      );
      alert(`Đang gửi lệnh in phiếu A5 đơn ${selectedOrder.code} tới máy in nhiệt quầy.`);
      closePrint();
    });
  }

  // Call Modal
  const callModal = document.getElementById('callModal');
  const btnCloseCall = document.getElementById('btnCloseCallModal');
  const btnEndCall = document.getElementById('btnEndCall');
  const closeCall = () => callModal && callModal.classList.remove('open');
  if (btnCloseCall) btnCloseCall.addEventListener('click', closeCall);
  if (btnEndCall) {
    btnEndCall.addEventListener('click', () => {
      alert('Đã kết thúc cuộc gọi với khách hàng.');
      closeCall();
    });
  }

  // COD Modal
  const codModal = document.getElementById('codModal');
  const btnCloseCod = document.getElementById('btnCloseCodModal');
  const btnCancelCod = document.getElementById('btnCancelCod');
  const btnConfirmCod = document.getElementById('btnConfirmCod');
  const closeCod = () => codModal && codModal.classList.remove('open');
  if (btnCloseCod) btnCloseCod.addEventListener('click', closeCod);
  if (btnCancelCod) btnCancelCod.addEventListener('click', closeCod);
  if (btnConfirmCod) {
    btnConfirmCod.addEventListener('click', () => {
      const code = document.getElementById('codOrderCode')?.textContent;
      if (code) {
        changeOrderStatus(code, 'Hoàn tất', 'badge-success');
        addSystemLog('Shipper Bảo', `Thu đủ tiền COD và bàn giao thành công đơn <strong>${code}</strong>`);
      }
      closeCod();
      alert('Đã thu tiền COD và hoàn tất giao hàng thành công!');
    });
  }

  // New Product Modal
  const newProductModal = document.getElementById('newProductModal');
  const btnCloseNewProduct = document.getElementById('btnCloseNewProductModal');
  const btnCancelNewProduct = document.getElementById('btnCancelNewProduct');
  const btnSubmitNewProduct = document.getElementById('btnSubmitNewProduct');
  const closeNewProduct = () => newProductModal && newProductModal.classList.remove('open');
  if (btnCloseNewProduct) btnCloseNewProduct.addEventListener('click', closeNewProduct);
  if (btnCancelNewProduct) btnCancelNewProduct.addEventListener('click', closeNewProduct);
  if (btnSubmitNewProduct) {
    btnSubmitNewProduct.addEventListener('click', () => {
      const name = document.getElementById('newProdName')?.value.trim();
      const cat = document.getElementById('newProdCategory')?.value;
      const price = parseInt(document.getElementById('newProdPrice')?.value, 10);
      const lead = document.getElementById('newProdLeadTime')?.value.trim();
      const algs = document.getElementById('newProdAllergens')?.value.trim();

      if (!name || isNaN(price)) {
        alert('Vui lòng nhập tên bánh và giá bán hợp lệ.');
        return;
      }

      const newCake = {
        name: name,
        categoryId: cat || 'fresh_cream',
        price: price,
        leadTimeHours: parseInt(lead, 10) || 3,
        allergens: algs ? algs.split(',').map((s) => s.trim()) : ['Trứng', 'Sữa'],
      };

      cakesList30.unshift(newCake);
      populatePosCakesDropdown();
      renderProductsTable();
      closeNewProduct();

      addSystemLog(ROLE_PERMISSIONS[currentRole].userName, `Thêm món mới vào thực đơn: <strong>${name}</strong>`);
      alert(`Đã thêm món "${name}" vào thực đơn thành công!`);
    });
  }

  // New Promotion Modal
  const newPromoModal = document.getElementById('newPromoModal');
  const btnOpenPromo = document.getElementById('btnOpenNewPromoModal');
  const btnClosePromo = document.getElementById('btnCloseNewPromoModal');
  const btnCancelPromo = document.getElementById('btnCancelNewPromo');
  const btnSubmitPromo = document.getElementById('btnSubmitNewPromo');
  const closePromo = () => newPromoModal && newPromoModal.classList.remove('open');

  if (btnOpenPromo) btnOpenPromo.addEventListener('click', () => newPromoModal.classList.add('open'));
  if (btnClosePromo) btnClosePromo.addEventListener('click', closePromo);
  if (btnCancelPromo) btnCancelPromo.addEventListener('click', closePromo);
  if (btnSubmitPromo) {
    btnSubmitPromo.addEventListener('click', () => {
      const code = document.getElementById('newPromoCode')?.value.trim().toUpperCase();
      const desc = document.getElementById('newPromoDesc')?.value.trim();
      const limit = document.getElementById('newPromoLimit')?.value.trim() || '100';
      const expire = document.getElementById('newPromoExpire')?.value || '31/12/2026';

      if (!code) {
        alert('Vui lòng nhập mã voucher.');
        return;
      }

      const promoTbody = document.getElementById('promoTableBody');
      if (promoTbody) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${code}</strong></td>
          <td>${desc || 'Giảm giá tri ân khách hàng'}</td>
          <td>0 / ${limit} lượt</td>
          <td>${expire}</td>
          <td><span class="badge badge-success">Đang chạy</span></td>
        `;
        promoTbody.prepend(row);
      }

      closePromo();
      addSystemLog(ROLE_PERMISSIONS[currentRole].userName, `Tạo mã khuyến mãi mới: <strong>${code}</strong>`);
      alert(`Đã kích hoạt mã khuyến mãi ${code} thành công!`);
    });
  }

  // New Staff Modal
  const newStaffModal = document.getElementById('newStaffModal');
  const btnOpenStaff = document.getElementById('btnOpenNewStaffModal');
  const btnCloseStaff = document.getElementById('btnCloseNewStaffModal');
  const btnCancelStaff = document.getElementById('btnCancelNewStaff');
  const btnSubmitStaff = document.getElementById('btnSubmitNewStaff');
  const closeStaff = () => newStaffModal && newStaffModal.classList.remove('open');

  if (btnOpenStaff) btnOpenStaff.addEventListener('click', () => newStaffModal.classList.add('open'));
  if (btnCloseStaff) btnCloseStaff.addEventListener('click', closeStaff);
  if (btnCancelStaff) btnCancelStaff.addEventListener('click', closeStaff);
  if (btnSubmitStaff) {
    btnSubmitStaff.addEventListener('click', () => {
      const name = document.getElementById('newStaffName')?.value.trim();
      const phone = document.getElementById('newStaffPhone')?.value.trim();
      const email = document.getElementById('newStaffEmail')?.value.trim();
      const roleKey = document.getElementById('newStaffRole')?.value;

      if (!name) {
        alert('Vui lòng nhập họ tên nhân sự.');
        return;
      }

      const roleTitles = {
        STORE_MANAGER: 'Quản lý cửa hàng',
        CASHIER_SUPPORT: 'Thu ngân / CSKH',
        KITCHEN: 'Bếp trưởng (KDS)',
        SHIPPER: 'Nhân viên giao hàng',
      };

      const staffTbody = document.getElementById('staffTableBody');
      if (staffTbody) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td><strong>${name}</strong></td>
          <td>${email || 'nhanvien@miette.vn'} · ${phone || '0900 000 000'}</td>
          <td><span class="badge badge-info">${roleTitles[roleKey] || 'Nhân viên'}</span></td>
          <td>Miette Quận 3</td>
          <td>Ca luân phiên</td>
          <td><span class="badge badge-success">Đang kích hoạt</span></td>
        `;
        staffTbody.appendChild(row);
      }

      closeStaff();
      addSystemLog(
        ROLE_PERMISSIONS[currentRole].userName,
        `Thêm tài khoản nhân sự: <strong>${name}</strong> (${roleTitles[roleKey]})`
      );
      alert(`Đã cấp tài khoản cho ${name} thành công!`);
    });
  }
}

function openPrintPreview(order) {
  const modal = document.getElementById('printModal');
  if (!modal) return;

  const codeEl = document.getElementById('printSheetOrderCode');
  const custEl = document.getElementById('printSheetCust');
  const addrEl = document.getElementById('printSheetAddress');
  const cakeEl = document.getElementById('printSheetCake');
  const pipingEl = document.getElementById('printSheetPiping');
  const cardEl = document.getElementById('printSheetCard');
  const accEl = document.getElementById('printSheetAccessories');
  const algEl = document.getElementById('printSheetAllergens');
  const payEl = document.getElementById('printSheetPayment');

  if (codeEl) codeEl.textContent = `Mã đơn: ${order.code} · Khung giờ: ${order.slot} 26/10/2026`;
  if (custEl) custEl.textContent = `${order.name} · ${order.phone}`;
  if (addrEl) addrEl.textContent = order.address || 'Quận 1, TP. Hồ Chí Minh';
  if (cakeEl) cakeEl.textContent = `${order.cake} (${order.price})`;
  if (pipingEl) pipingEl.textContent = `"${order.piping || 'Không yêu cầu'}"`;
  if (cardEl) cardEl.textContent = `"${order.cardText || 'Không yêu cầu'}"`;
  if (accEl) accEl.textContent = order.accessories || 'Nến + Bộ dao nĩa';
  if (algEl) algEl.textContent = order.allergens || 'Không';
  if (payEl) payEl.textContent = order.isCod ? `Thu tiền COD: ${order.price}` : 'Đã thanh toán (MOMO / VNPAY)';

  modal.classList.add('open');
}

// ==========================================================================
// SETTINGS & LOGS & FILTERS
// ==========================================================================

function setupSettingsAndLogs() {
  const btnSaveSettings = document.getElementById('btnSaveSettings');
  if (btnSaveSettings) {
    btnSaveSettings.addEventListener('click', () => {
      const maxCakes = document.getElementById('cfgMaxCakes')?.value || '6';
      const holiday = document.getElementById('cfgHolidaySurcharge')?.checked;
      const cutoff = document.getElementById('cfgCutoffHours')?.value;

      // Update KDS capacity overview
      renderKdsSlots();

      addSystemLog(
        ROLE_PERMISSIONS[currentRole].userName,
        `Cập nhật cài đặt chi nhánh: Công suất <strong>${maxCakes} bánh/slot</strong>, Phụ thu lễ: <strong>${holiday ? 'BẬT' : 'TẮT'}</strong>`
      );

      alert(
        `Đã lưu cấu hình vận hành chi nhánh:\n- Công suất: ${maxCakes} bánh/slot\n- Phụ thu ngày lễ: ${holiday ? 'Bật (+15%)' : 'Tắt'}\n- Chốt đơn trước: ${cutoff} tiếng`
      );
    });
  }

  // Clear / Filter Logs button
  const btnClearLogs = document.getElementById('btnClearLogs');
  if (btnClearLogs) {
    btnClearLogs.addEventListener('click', () => {
      addSystemLog(
        ROLE_PERMISSIONS[currentRole].userName,
        'Lọc và kiểm toán dữ liệu vận hành ca trực ngày 26/10/2026'
      );
      alert('Đã đồng bộ và làm mới toàn bộ nhật ký vận hành hôm nay.');
    });
  }

  // Filter bar in Overview
  const filterDate = document.getElementById('filterDate');
  const filterBranch = document.getElementById('filterBranch');
  const filterChannel = document.getElementById('filterChannel');

  const onOverviewFilterChange = () => {
    const d = filterDate?.value;
    const b = filterBranch?.value;
    const c = filterChannel?.value;
    addSystemLog(
      ROLE_PERMISSIONS[currentRole].userName,
      `Lọc báo cáo tổng quan: Ngày [${d}], Chi nhánh [${b}], Kênh [${c}]`
    );
  };

  if (filterDate) filterDate.addEventListener('change', onOverviewFilterChange);
  if (filterBranch) filterBranch.addEventListener('change', onOverviewFilterChange);
  if (filterChannel) filterChannel.addEventListener('change', onOverviewFilterChange);

  // New accessory button
  const btnNewAcc = document.getElementById('btnNewAccessory');
  if (btnNewAcc) {
    btnNewAcc.addEventListener('click', () => {
      const name = prompt('Nhập tên phụ kiện mới:');
      const price = prompt('Nhập đơn giá (VNĐ):', '25000');
      if (name) {
        const tbody = document.getElementById('accessoriesTableBody');
        if (tbody) {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td><strong>${name}</strong></td>
            <td>Phụ kiện tiệc</td>
            <td>${parseInt(price, 10).toLocaleString('vi-VN')}đ</td>
            <td>50 cái</td>
            <td><span class="badge badge-success">Sẵn hàng</span></td>
          `;
          tbody.prepend(row);
        }
        addSystemLog(
          ROLE_PERMISSIONS[currentRole].userName,
          `Thêm phụ kiện mới vào danh mục: <strong>${name}</strong>`
        );
        alert(`Đã thêm phụ kiện "${name}" thành công!`);
      }
    });
  }
}

function addSystemLog(actor, actionHtml) {
  const list = document.getElementById('systemLogsList');
  if (!list) return;

  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} 26/10`;

  const row = document.createElement('div');
  row.className = 'timeline-row';
  row.innerHTML = `
    <div class="timeline-time-box">${timeStr}</div>
    <div class="timeline-actor-box">${actor}</div>
    <div class="timeline-action-text">${actionHtml}</div>
  `;

  list.prepend(row);
}

// ==========================================================================
// EXPORT REPORTS
// ==========================================================================

function setupExportReport() {
  const doExport = () => {
    let csv = 'Mã đơn,Khách hàng,Số điện thoại,Địa chỉ,Tên bánh,Giá tiền,Khung giờ,Trạng thái,Phương thức\n';
    ordersData.forEach((o) => {
      csv += `"${o.code}","${o.name}","${o.phone}","${o.address}","${o.cake}","${o.price}","${o.slot}","${o.status}","${o.isCod ? 'COD' : o.paymentMethod}"\n`;
    });

    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Miette_BaoCao_26102026.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addSystemLog(ROLE_PERMISSIONS[currentRole].userName, 'Xuất file báo cáo vận hành Excel (CSV)');
    alert('Đã xuất và tải về tập tin báo cáo: Miette_BaoCao_26102026.csv');
  };

  const btnExport = document.getElementById('btnExportReport');
  const btnDownload = document.getElementById('btnDownloadReport');
  if (btnExport) btnExport.addEventListener('click', doExport);
  if (btnDownload) btnDownload.addEventListener('click', doExport);

  const btnOpenQueue = document.getElementById('btnOpenQueue');
  if (btnOpenQueue) {
    btnOpenQueue.addEventListener('click', () => {
      navigateToTab('orders');
    });
  }
}
