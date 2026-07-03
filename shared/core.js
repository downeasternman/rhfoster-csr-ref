(function() {
  const ACTIVE_BRANCH_KEY = 'rhf_branch';
  const MAP_PATH_PREFIX = window.ACTIVE_BRANCH
    ? '../shared/maps/'
    : 'shared/maps/';

  let activeBranchId = window.ACTIVE_BRANCH || null;

  const storedBranch = localStorage.getItem(ACTIVE_BRANCH_KEY);
  if (!activeBranchId && storedBranch) {
    if (window.BRANCHES && window.BRANCHES[storedBranch]) {
      activeBranchId = storedBranch;
    } else {
      localStorage.removeItem(ACTIVE_BRANCH_KEY);
    }
  }
  if (activeBranchId && window.BRANCHES && window.BRANCHES[activeBranchId]) {
    localStorage.setItem(ACTIVE_BRANCH_KEY, activeBranchId);
  }

  let activeDept = 'all';
  let activeCategory = 'All';
  let searchQuery = '';

  const overrides = window.BRANCH_OVERRIDES || {};
  const suppress = window.BRANCH_SUPPRESS || [];
  const localCards = window.BRANCH_LOCAL_CARDS || [];

  const FAQ_ALL = [
    ...(window.FAQ_SERVICE || []),
    ...(window.FAQ_DELIVERY || []),
    ...(window.FAQ_GENERAL || []),
    ...localCards,
  ].filter(card => !suppress.includes(card.id));
  const searchEl   = document.getElementById('search');
  const clearBtn   = document.getElementById('searchClear');
  const pillsEl    = document.getElementById('pills');
  const listEl     = document.getElementById('faqList');
  const metaEl     = document.getElementById('resultsMeta');
  const printSelectedBtn = document.getElementById('printSelectedBtn');
  const printAllBtn      = document.getElementById('printAllBtn');
  const printSummaryEl = document.getElementById('printSummary');
  const emptyEl    = document.getElementById('emptyState');
  const headerInner = document.querySelector('.header-inner');
  const siteHeader = document.querySelector('.site-header');

  const BRANCH_ORDER = ['penobscot', 'lincoln', 'dennysville', 'machias', 'ellsworth', 'hampden', 'beals'];
  const DEPT_ORDER = ['service', 'delivery', 'general'];
  const DEPT_LABELS = {
    all: 'All',
    service: 'Service',
    delivery: 'Delivery',
    general: 'General',
  };

  const TAG_BY_CATEGORY = {
    'Water Heater': ['plumbing'],
    'Pipes & Leaks': ['plumbing'],
    'Drains': ['plumbing'],
    'Fixtures': ['plumbing'],
    'Water Supply': ['plumbing'],
    'Water Quality': ['plumbing'],
    'Basement & Sump': ['plumbing'],
    'Septic': ['plumbing'],
    'Renovation': ['plumbing'],
    'Outdoor & Seasonal': ['plumbing'],
    'Boiler & Heating': ['hvac', 'oil', 'propane'],
    'Furnaces & Forced Air': ['hvac', 'oil', 'propane'],
    'Heat Pumps': ['hvac'],
    'Thermostats & Controls': ['hvac'],
    'Central A/C': ['hvac'],
    'Airflow & Ductwork': ['hvac'],
    'Routine Maintenance': ['hvac'],
    'Gas & Propane': ['hvac', 'propane', 'oil'],
  };

  const TAG_BY_ID = {
    'wh-no-hot-water': ['plumbing', 'hvac', 'oil', 'propane'],
    'wh-tankless-issue': ['plumbing', 'hvac', 'oil', 'propane'],
    'gas-appliance-line': ['plumbing', 'propane', 'hvac'],
    'gas-dryer-line': ['plumbing', 'propane', 'hvac'],
    'gas-generator-hookup': ['plumbing', 'propane'],
    'propane-regulator-ice': ['propane', 'hvac'],
    'propane-empty-wont-ignite': ['propane', 'hvac'],
    'propane-line-damage': ['propane', 'hvac'],
    'propane-tank-set': ['propane'],
    'oil-burner-lockout': ['hvac', 'oil'],
    'oil-runout-airbound': ['hvac', 'oil'],
    'oil-soot-smoke': ['hvac', 'oil'],
    'oil-odor-leak': ['hvac', 'oil'],
    'gas-fireplace-soot': ['propane', 'hvac'],
    'boiler-expansion-tank': ['hvac'],
    'boiler-zone-no-heat': ['hvac'],
    'boiler-baseboard-leak': ['hvac'],
    'boiler-pressure': ['hvac'],
    'maint-water-heater': ['plumbing'],
    'maint-boiler-furnace': ['hvac', 'oil', 'propane'],
    'maint-heat-pump': ['hvac'],
    'maint-central-ac': ['hvac'],
    'maint-generator': ['hvac', 'propane'],
  };

  function resolveTags(item) {
    if (item.tags && item.tags.length) return item.tags;
    if (TAG_BY_ID[item.id]) return TAG_BY_ID[item.id];
    return TAG_BY_CATEGORY[item.category] || ['plumbing'];
  }

  const TAG_LABELS = { plumbing: 'plumbing', hvac: 'hvac', propane: 'propane', oil: 'oil' };

  const SEARCH_ALIASES = {
    'fawcet': 'faucet',
    'fawcett': 'faucet',
    'cartridge': 'faucet cartridge valve',
    'showerhead': 'shower head',
    'hot water tank': 'water heater',
    'hwt': 'water heater',
    'scalding': 'hot water scalding too hot',
    'lp': 'propane',
    'lp gas': 'propane',
    'furnace': 'furnace forced air heating',
    'forced air': 'furnace forced air',
    'sewer': 'drain sewer',
    'clogged': 'clog drain',
    'backing up': 'sewer backup drain',
    'co': 'carbon monoxide',
    'lockout': 'lockout reset burner boiler',
    'run out': 'runout empty tank oil propane',
    'mini split': 'heat pump mini split',
    'minisplit': 'heat pump mini split',
    'mitsubishi': 'heat pump mitsubishi',
    'fujitsu': 'heat pump fujitsu',
    'defrost': 'heat pump defrost',
    'thermostat': 'thermostat control nest ecobee',
    'nest': 'thermostat nest smart',
    'ecobee': 'thermostat ecobee smart',
    'ac': 'central air conditioning',
    'air conditioner': 'central air conditioning ac',
    'condenser': 'central air conditioning outdoor unit',
    'ductwork': 'airflow duct vent',
    'duct': 'airflow duct vent',
    'musty': 'odor smell duct vent',
    'fuel oil': 'oil leak odor heating',
    'oil smell': 'oil leak odor heating',
    'tune up': 'maintenance annual service',
    'tuneup': 'maintenance annual service',
    'maintenance': 'routine maintenance annual tune up',
    'generac': 'generator standby maintenance',
    'tank set': 'propane tank installation',
    'p trap': 'sewer smell drain ptrap',
    'sewer smell': 'sewer smell drain ptrap',
    'water bill': 'high water bill toilet leak',
    'sump alarm': 'sump pump battery beeping backup',
    'fireplace': 'gas fireplace propane soot',
  };

  function normalizeSearchText(text) {
    return String(text).toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function expandAliases(query) {
    let normalized = normalizeSearchText(query);
    if (!normalized) return normalized;
    // Replace aliases only on whole-word boundaries so short aliases
    // (e.g. "co", "lp") never match inside longer words like "cold" or "help".
    Object.entries(SEARCH_ALIASES).forEach(([alias, replacement]) => {
      const aliasNorm = normalizeSearchText(alias);
      if (!aliasNorm) return;
      const escaped = aliasNorm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const pattern = new RegExp(`\\b${escaped}\\b`, 'g');
      normalized = normalized.replace(pattern, normalizeSearchText(replacement));
    });
    return normalized.replace(/\s+/g, ' ').trim();
  }

  function buildSearchIndex(item) {
    const tags = resolveTags(item);
    return normalizeSearchText([
      item.title,
      item.desc,
      item.category,
      item.department,
      tags.map(t => TAG_LABELS[t] || t).join(' '),
      item.urgencyLabel || '',
      item.stopCondition || '',
      item.questions.join(' '),
      item.script,
    ].join(' '));
  }

  function searchMatches(indexText, query) {
    if (!query) return true;
    const q = expandAliases(query);
    if (!q) return true;
    if (indexText.includes(q)) return true;
    return q.split(' ').filter(Boolean).every(token => indexText.includes(token));
  }

  function recalcOpenAccordion() {
    document.querySelectorAll('.faq-item.open:not(.hidden)').forEach(el => {
      const body = el.querySelector('.faq-body');
      body.style.maxHeight = body.scrollHeight + 'px';
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recalcOpenAccordion, 100);
  });

  function getBranchUrl(branchId) {
    const branch = window.BRANCHES && window.BRANCHES[branchId];
    return branch ? branch.url : branchId;
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getActiveBranch() {
    return activeBranchId && window.BRANCHES && window.BRANCHES[activeBranchId]
      ? window.BRANCHES[activeBranchId]
      : null;
  }

  function resolveBranchPanelData(card) {
    if (overrides[card.id]) return overrides[card.id];
    const branch = getActiveBranch();
    if (!branch || !branch.departments) return null;
    return branch.departments[card.department] || null;
  }

  function renderContact(contact) {
    const extHtml = contact.ext ? `<span>x${escapeHtml(contact.ext)}</span>` : '';
    return `
      <div class="branch-panel-contact">
        <span class="branch-panel-contact-name">${escapeHtml(contact.name)}</span>
        <span>${escapeHtml(contact.role || '')}</span>
        <span>${escapeHtml(contact.phone || '')}</span>
        ${extHtml}
      </div>
    `;
  }

  function renderBranchPanel(card) {
    if (!activeBranchId) return '';

    const branch = getActiveBranch();
    const branchPanelData = resolveBranchPanelData(card);
    if (!branch || !branchPanelData) return '';

    const contacts = Array.isArray(branchPanelData.contacts) ? branchPanelData.contacts : [];
    const hasEmail = Boolean(branchPanelData.email);
    const hasRoutingNote = Boolean(overrides[card.id] && branchPanelData.routingNote);
    if (!hasEmail && !contacts.length && !hasRoutingNote) return '';

    const routingHtml = branchPanelData.routingNote
      ? `<div class="branch-panel-routing">${escapeHtml(branchPanelData.routingNote)}</div>`
      : '';
    const contactsHtml = contacts.length
      ? `<div class="branch-panel-contacts">${contacts.map(renderContact).join('')}</div>`
      : '';
    const deptLabel = DEPT_LABELS[card.department] || card.department;

    return `
      <div class="branch-panel">
        <div class="branch-panel-label">${escapeHtml(branch.name)} Routing</div>
        ${routingHtml}
        ${contactsHtml}
        <button class="branch-panel-email-btn" data-card-id="${escapeHtml(card.id)}" data-dept="${escapeHtml(card.department)}">
          Email ${escapeHtml(branch.name)} ${escapeHtml(deptLabel)}
        </button>
        <div class="branch-panel-email-notice" style="display:none"></div>
      </div>
    `;
  }

  function renderAreaCardBody(card) {
    const fuelCell = daysArr => (Array.isArray(daysArr) && daysArr.length)
      ? escapeHtml(daysArr.join(', '))
      : 'TBD';

    const rows = (card.scheduleTable || []).map(row => `
        <tr>
          <td>${escapeHtml(row.zone || '')}</td>
          <td>${escapeHtml(row.towns || '')}</td>
          <td>${fuelCell(row.offroadDays)}</td>
          <td>${fuelCell(row.heatingDays)}</td>
          <td>${fuelCell(row.propaneDays)}</td>
        </tr>
      `).join('');

    const branch = getActiveBranch();
    const mapHeadingText = card.mapHeading
      || (branch ? `${branch.name} Delivery Map` : card.title);

    const questionsSection = (card.questions && card.questions.length)
      ? `
        <div class="area-card-instructions">
          <div class="area-card-section-label">Confirm with customer</div>
          <ul class="area-card-questions">${card.questions.map(q => `<li>${escapeHtml(q)}</li>`).join('')}</ul>
        </div>
      `
      : '';

    const workflowSection = (card.workflowSteps && card.workflowSteps.length)
      ? `
        <div class="area-card-instructions">
          <div class="area-card-section-label">What to do next</div>
          <div class="area-card-workflow">
            ${card.workflowSteps.map(step => `
              <div class="area-card-workflow-step${step.type === 'emergency' ? ' emergency' : ''}">
                <div class="area-card-workflow-label">${escapeHtml(step.label || '')}</div>
                <p class="area-card-workflow-body">${escapeHtml(step.body || '')}</p>
              </div>
            `).join('')}
          </div>
        </div>
      `
      : '';

    const priorityHtml = card.priorityNote
      ? `<p class="area-card-priority">${escapeHtml(card.priorityNote)}</p>`
      : '';

    return `
      <div class="area-card-body">
        <p class="area-card-summary">${escapeHtml(card.coverageSummary || '')}</p>
        <h4 class="area-card-map-heading">${escapeHtml(mapHeadingText)}</h4>
        <img class="area-card-map" src="${MAP_PATH_PREFIX}${escapeHtml(card.mapImage || '')}" alt="${escapeHtml(card.title)} coverage map" onerror="this.style.display='none'">
        <table class="area-card-table">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Towns</th>
              <th>Offroad</th>
              <th>#2 &amp; Kero</th>
              <th>Propane</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        ${questionsSection}
        ${workflowSection}
        ${priorityHtml}
      </div>
    `;
  }

  function shouldShowAreaQuickAccess() {
    return activeDept === 'all' || activeDept === 'delivery';
  }

  function updateAreaQuickAccess() {
    const strip = document.getElementById('branchContextStrip');
    if (!strip) return;

    const existing = strip.querySelector('.area-quick-access');
    if (existing) existing.remove();
    if (!activeBranchId || !shouldShowAreaQuickAccess()) return;

    const areaCard = FAQ_ALL.find(card =>
      card.cardType === 'area' && card.branchId === activeBranchId
    );
    if (!areaCard) return;

    const link = document.createElement('a');
    link.className = 'area-quick-access';
    link.href = '#';
    link.dataset.areaCardId = areaCard.id;
    link.textContent = 'Delivery area';
    strip.appendChild(link);
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).catch(() => fallbackCopyToClipboard(text));
    }
    fallbackCopyToClipboard(text);
    return Promise.resolve();
  }

  function fallbackCopyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }

  function showEmailNotice(button, html, autoHide) {
    const panel = button.closest('.branch-panel');
    const notice = panel && panel.querySelector('.branch-panel-email-notice');
    if (!notice) return;
    notice.innerHTML = html;
    notice.style.display = 'block';
    if (autoHide) {
      window.setTimeout(() => {
        notice.style.display = 'none';
        notice.innerHTML = '';
      }, 10000);
    }
  }

  function hideEmailNotice(button) {
    const panel = button.closest('.branch-panel');
    const notice = panel && panel.querySelector('.branch-panel-email-notice');
    if (!notice) return;
    notice.style.display = 'none';
    notice.innerHTML = '';
  }

  function getMailSubject(dept, branchName, cardTitle) {
    if (dept === 'delivery') return `DELIVERY REQUEST - ${branchName} - ${cardTitle}`;
    if (dept === 'general') return `GENERAL INQUIRY - ${branchName} - ${cardTitle}`;
    return `SERVICE REQUEST - ${branchName} - ${cardTitle}`;
  }

  function buildMailBody(card) {
    const questions = (card.questions || []).map((q, i) =>
      `${i + 1}. ${q}\n   Answer:\n`
    ).join('\n');
    return `Customer name:\nAccount #:\nAddress:\nCallback:\n\n${questions}\nNotes:`;
  }

  function handleEmailButtonClick(button) {
    const card = FAQ_ALL.find(item => item.id === button.dataset.cardId);
    const dept = button.dataset.dept;
    const branch = getActiveBranch();
    if (!card || !dept || !branch) return;

    const email = (overrides[card.id] && overrides[card.id].email)
      || (window.BRANCHES[activeBranchId] &&
        window.BRANCHES[activeBranchId].departments &&
        window.BRANCHES[activeBranchId].departments[dept] &&
        window.BRANCHES[activeBranchId].departments[dept].email)
      || '';
    const subject = getMailSubject(dept, branch.name || '', card.title);
    const body = buildMailBody(card);
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const mailto = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;

    if (!email) {
      copyToClipboard(body).then(() => {
        showEmailNotice(button, 'No dispatch email configured for this branch yet. Body copied to clipboard.', false);
      });
      return;
    }

    if (mailto.length <= 1800) {
      hideEmailNotice(button);
      window.location.href = mailto;
      return;
    }

    copyToClipboard(body).then(() => {
      const shortMailto = `mailto:${email}?subject=${encodedSubject}`;
      showEmailNotice(
        button,
        `Email body too long. <a href="${shortMailto}">Click here to open email</a>, then paste (Ctrl+V) into the body.`,
        true
      );
    });
  }

  function initBranchContextStrip() {
    if (!siteHeader) return;
    siteHeader.insertAdjacentHTML('afterend', '<div class="branch-context-strip" id="branchContextStrip"><span class="branch-context-name"></span></div>');
    updateBranchContextStrip();
  }

  function updateBranchContextStrip() {
    const strip = document.getElementById('branchContextStrip');
    if (!strip) return;
    const branch = activeBranchId && window.BRANCHES && window.BRANCHES[activeBranchId];
    strip.classList.toggle('active', Boolean(branch));
    const nameEl = strip.querySelector('.branch-context-name');
    if (nameEl) nameEl.textContent = branch ? branch.name : '';
    updateAreaQuickAccess();
  }

  function initBranchSelector() {
    if (!headerInner || !window.BRANCHES) return;

    const optionsHtml = BRANCH_ORDER.map(branchId => {
      const branch = window.BRANCHES[branchId];
      if (!branch) return '';
      return `<option value="${branchId}">${branch.name}</option>`;
    }).join('');

    headerInner.insertAdjacentHTML('beforeend', `
      <div class="branch-selector-wrap">
        <label for="branchSelect">Branch:</label>
        <select id="branchSelect">
          <option value="">Select branch</option>
          ${optionsHtml}
        </select>
      </div>
    `);

    const select = document.getElementById('branchSelect');
    if (!select) return;
    select.value = activeBranchId || '';

    select.addEventListener('change', () => {
      const selectedValue = select.value;
      activeBranchId = selectedValue || null;

      if (activeBranchId) {
        localStorage.setItem(ACTIVE_BRANCH_KEY, activeBranchId);
      } else {
        localStorage.removeItem(ACTIVE_BRANCH_KEY);
      }

      updateBranchContextStrip();

      if (window.ACTIVE_BRANCH) {
        window.location.href = selectedValue ? '../' + getBranchUrl(selectedValue) + '/' : '../';
        return;
      }

      if (selectedValue) {
        window.location.href = getBranchUrl(selectedValue) + '/';
      }

      applyFilters();
    });
  }

  function initDeptTabs() {
    if (!searchEl) return;

    const tabsHtml = `
      <div class="dept-tabs" role="tablist" aria-label="Department filters">
        <button type="button" class="dept-tab active" data-dept="all">All</button>
        <button type="button" class="dept-tab" data-dept="service">Service</button>
        <button type="button" class="dept-tab" data-dept="delivery">Delivery</button>
        <button type="button" class="dept-tab" data-dept="general">General</button>
      </div>
    `;

    document.querySelector('.search-wrap').insertAdjacentHTML('beforebegin', tabsHtml);
    document.querySelectorAll('.dept-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        activeDept = tab.dataset.dept;
        activeCategory = 'All';
        document.querySelectorAll('.dept-tab').forEach(btn => btn.classList.toggle('active', btn === tab));
        buildCategoryPills();
        updateAreaQuickAccess();
        applyFilters();
      });
    });
  }

  function buildCategoryPills() {
    if (!pillsEl) return;
    const categorySourceBase = activeDept === 'all'
      ? FAQ_ALL
      : FAQ_ALL.filter(item => item.department === activeDept);
    const categorySource = categorySourceBase.filter(isRenderableCard);
    const categories = ['All', ...new Set(categorySource.map(item => item.category).sort())];

    if (!categories.includes(activeCategory)) {
      activeCategory = 'All';
    }

    pillsEl.innerHTML = '';
    categories.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill' + (cat === activeCategory ? ' active' : '');
      btn.textContent = cat;
      btn.addEventListener('click', () => {
        activeCategory = cat;
        pillsEl.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        applyFilters();
      });
      pillsEl.appendChild(btn);
    });
  }

  function createDeptHeading(dept) {
    const heading = document.createElement('div');
    heading.className = 'dept-results-heading';
    heading.textContent = DEPT_LABELS[dept] || dept;
    return heading;
  }

  const crossDeptDivider = document.createElement('div');
  crossDeptDivider.className = 'cross-dept-divider';
  crossDeptDivider.id = 'crossDeptDivider';
  crossDeptDivider.innerHTML = '<span>Also in other departments</span>';

  const cardElements = new Map();

  // ── Build accordion items ────────────────────────────────────────────
  FAQ_ALL.forEach(item => {
    const el = document.createElement('div');
    el.className = 'faq-item';
    el.dataset.id = item.id;
    el.dataset.department = item.department;
    el.dataset.category = item.category;
    el.dataset.tags = resolveTags(item).join(',');
    el.dataset.search = buildSearchIndex(item);
    if (item.cardType) el.dataset.cardType = item.cardType;
    if (item.branchId) el.dataset.branchId = item.branchId;

    let urgencyHtml = '';
    if (item.urgency) {
      const badgeClass = item.urgency === 'redirect'
        ? 'redirect-badge'
        : `urgency-flag ${item.urgency === 'emergency' ? 'emergency' : ''}`;
      urgencyHtml = `<div class="${badgeClass}">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        ${escapeHtml(item.urgencyLabel)}
      </div>`;
    }

    let stopHtml = '';
    if (item.stopCondition) {
      stopHtml = `<div class="stop-banner" role="alert">
        <div class="stop-banner-title">STOP - ${escapeHtml(item.stopCondition)}</div>
        ${item.stopUntil ? `<div class="stop-banner-until">${escapeHtml(item.stopUntil)}</div>` : ''}
      </div>`;
    }

    const questionsHtml = item.questions.map((q, i) =>
      `<li><span class="q-num">${i + 1}</span><span>${escapeHtml(q)}</span></li>`
    ).join('');
    const bodyHtml = item.cardType === 'area'
      ? renderAreaCardBody(item)
      : `
          ${stopHtml}
          <div class="faq-questions">
            ${urgencyHtml}
            <div class="faq-section-label">Questions to Ask</div>
            <ol>${questionsHtml}</ol>
          </div>
          <div class="faq-tell">
            <div class="faq-section-label">What to Tell the Customer</div>
            <div class="faq-script">
              <strong class="faq-script-lead">While you wait for a callback:</strong>
              ${escapeHtml(item.script)}
            </div>
          </div>
          ${renderBranchPanel(item)}
        `;

    el.innerHTML = `
      <button class="faq-trigger" aria-expanded="false">
        <span class="faq-cat-badge">${escapeHtml(item.category)}</span>
        <span class="faq-title-group">
          <span class="faq-title">${escapeHtml(item.title)}</span>
          <span class="faq-desc">${escapeHtml(item.desc)}</span>
        </span>
        <svg class="faq-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      <div class="faq-body">
        <div class="faq-body-inner">
          ${bodyHtml}
        </div>
      </div>
    `;

    // Accordion toggle
    const trigger = el.querySelector('.faq-trigger');
    const body    = el.querySelector('.faq-body');
    trigger.addEventListener('click', () => {
      const isOpen = el.classList.contains('open');
      // Close all others
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        o.querySelector('.faq-body').style.maxHeight = null;
      });
      if (!isOpen) {
        el.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
      updatePrintButtonStates();
    });

    cardElements.set(item.id, el);
  });

  // ── Filter logic ─────────────────────────────────────────────────────
  function cardMatchesSearch(item, q) {
    const el = cardElements.get(item.id);
    return el ? searchMatches(el.dataset.search, q) : false;
  }

  function updateCardHighlight(item, q, searchMatch) {
    const el = cardElements.get(item.id);
    if (!el) return;

    const titleEl = el.querySelector('.faq-title');
    const descEl  = el.querySelector('.faq-desc');
    if (q && searchMatch) {
      titleEl.innerHTML = highlight(item.title, q);
      descEl.innerHTML  = highlight(item.desc, q);
    } else {
      titleEl.textContent = item.title;
      descEl.textContent  = item.desc;
    }
  }

  function appendCard(item) {
    const el = cardElements.get(item.id);
    if (!el) return;
    el.classList.remove('hidden');
    listEl.appendChild(el);
  }

  function appendCards(cards) {
    cards.forEach(appendCard);
  }

  function isRenderableCard(item) {
    if (suppress.includes(item.id)) return false;
    if (item.cardType === 'area') {
      return Boolean(activeBranchId) && item.branchId === activeBranchId;
    }
    return true;
  }

  function showEmpty(visible) {
    if (!emptyEl) return;
    emptyEl.textContent = 'No matching entries found.';
    emptyEl.style.display = visible ? 'block' : 'none';
  }

  function applyFilters() {
    const q = searchQuery.trim();
    const hasSearch = Boolean(q);
    let visible = 0;

    cardElements.forEach(el => {
      el.classList.add('hidden');
      el.classList.remove('print-target', 'print-skip');
    });
    listEl.innerHTML = '';
    crossDeptDivider.classList.remove('visible');

    const visibleCards = FAQ_ALL.filter(item => {
      if (!isRenderableCard(item)) return false;
      const deptMatch = activeDept === 'all' || item.department === activeDept;
      const catMatch = activeCategory === 'All' || item.category === activeCategory;
      const searchMatch = cardMatchesSearch(item, q);
      updateCardHighlight(item, q, searchMatch);
      return deptMatch && catMatch && searchMatch;
    });

    if (activeDept === 'all' && !hasSearch) {
      appendCards(visibleCards);
      visible = visibleCards.length;
    } else if (activeDept === 'all' && hasSearch) {
      DEPT_ORDER.forEach(dept => {
        const deptCards = visibleCards.filter(item => item.department === dept);
        if (!deptCards.length) return;
        listEl.appendChild(createDeptHeading(dept));
        appendCards(deptCards);
        visible += deptCards.length;
      });
    } else if (!hasSearch) {
      appendCards(visibleCards);
      visible = visibleCards.length;
    } else {
      appendCards(visibleCards);
      visible = visibleCards.length;

      const crossDeptCards = FAQ_ALL.filter(item => {
        if (!isRenderableCard(item)) return false;
        if (item.department === activeDept) return false;
        const searchMatch = cardMatchesSearch(item, q);
        updateCardHighlight(item, q, searchMatch);
        return searchMatch;
      });

      if (crossDeptCards.length) {
        crossDeptDivider.classList.add('visible');
        listEl.appendChild(crossDeptDivider);
        appendCards(crossDeptCards);
      } else {
        crossDeptDivider.classList.remove('visible');
      }
    }

    // Recompute open item height after filter
    document.querySelectorAll('.faq-item.open').forEach(el => {
      if (!listEl.contains(el)) {
        el.classList.remove('open');
        el.querySelector('.faq-trigger').setAttribute('aria-expanded', 'false');
        el.querySelector('.faq-body').style.maxHeight = null;
      }
    });
    recalcOpenAccordion();

    const parts = [];
    if (visible !== FAQ_ALL.length || q || activeCategory !== 'All' || activeDept !== 'all') {
      parts.push(`${visible} result${visible !== 1 ? 's' : ''}`);
      if (activeDept !== 'all') parts.push(DEPT_LABELS[activeDept]);
      if (activeCategory !== 'All') parts.push(`in ${activeCategory}`);
      if (q) parts.push(`for "${q}"`);
      metaEl.textContent = parts.join(' ');
    } else {
      metaEl.textContent = `${FAQ_ALL.length} topics`;
    }

    showEmpty(visible === 0);
    updatePrintButtonStates();
  }

  function getOpenVisibleItem() {
    return document.querySelector('.faq-item.open:not(.hidden)');
  }

  function updatePrintButtonStates() {
    printSelectedBtn.disabled = !getOpenVisibleItem();
  }

  function updatePrintSummary(count, mode, subtitle) {
    const dateStr = new Date().toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
    if (mode === 'all') {
      printSummaryEl.innerHTML = `
        <h2>General Service FAQ</h2>
        <p><strong>${count}</strong> topics · Printed ${dateStr} · Internal CSR reference — not for customer distribution</p>
      `;
      return;
    }
    const scope = subtitle || 'Selected topic';
    printSummaryEl.innerHTML = `
      <h2>General Service FAQ — Printout</h2>
      <p><strong>${count}</strong> topic${count !== 1 ? 's' : ''} · ${scope}</p>
      <p>Printed ${dateStr} · Internal CSR reference — not for customer distribution</p>
    `;
  }

  function reorderForPrintAll(allItems) {
    const originalOrder = [...allItems];
    const headings = [];
    const fragment = document.createDocumentFragment();

    DEPT_ORDER.forEach(dept => {
      const deptItems = allItems.filter(el => el.dataset.department === dept);
      const categoryOrder = [...new Set(FAQ_ALL
        .filter(item => item.department === dept)
        .map(item => item.category))];

      categoryOrder.forEach(cat => {
        const catItems = deptItems.filter(el => el.dataset.category === cat);
        if (!catItems.length) return;
        const heading = document.createElement('h3');
        heading.className = 'print-cat-heading print-target';
        heading.textContent = `${DEPT_LABELS[dept]} - ${cat}`;
        fragment.appendChild(heading);
        headings.push(heading);
        catItems.forEach(el => fragment.appendChild(el));
      });
    });

    listEl.appendChild(fragment);
    return { originalOrder, headings };
  }

  function runPrint(mode) {
    const allItems = [...document.querySelectorAll('.faq-item')];
    let itemsToPrint;
    let domRestore = null;

    if (mode === 'all') {
      itemsToPrint = allItems;
      document.body.classList.add('print-all');
      domRestore = reorderForPrintAll(allItems);
    } else {
      const selected = getOpenVisibleItem();
      if (!selected) return;
      itemsToPrint = [selected];
    }

    const restoreState = allItems.map(el => {
      const body = el.querySelector('.faq-body');
      const trigger = el.querySelector('.faq-trigger');
      return {
        el,
        wasOpen: el.classList.contains('open'),
        maxHeight: body.style.maxHeight,
        ariaExpanded: trigger.getAttribute('aria-expanded'),
      };
    });

    const printSet = new Set(itemsToPrint);
    allItems.forEach(el => {
      el.classList.remove('print-target', 'print-skip');
      if (printSet.has(el)) {
        el.classList.add('print-target');
        const body = el.querySelector('.faq-body');
        const trigger = el.querySelector('.faq-trigger');
        el.classList.add('open');
        body.style.maxHeight = 'none';
        trigger.setAttribute('aria-expanded', 'true');
      } else {
        el.classList.add('print-skip');
      }
    });

    if (domRestore) {
      domRestore.headings.forEach(h => h.classList.add('print-target'));
    }

    const subtitle = mode === 'selected'
      ? itemsToPrint[0].querySelector('.faq-title').textContent
      : '';
    updatePrintSummary(itemsToPrint.length, mode, subtitle);
    printSummaryEl.setAttribute('aria-hidden', 'false');

    const cleanup = () => {
      if (domRestore) {
        domRestore.headings.forEach(h => h.remove());
        domRestore.originalOrder.forEach(node => listEl.appendChild(node));
        document.body.classList.remove('print-all');
      }
      restoreState.forEach(({ el, wasOpen, maxHeight, ariaExpanded }) => {
        const body = el.querySelector('.faq-body');
        const trigger = el.querySelector('.faq-trigger');
        el.classList.remove('print-target', 'print-skip');
        if (wasOpen) {
          el.classList.add('open');
          trigger.setAttribute('aria-expanded', ariaExpanded || 'true');
          body.style.maxHeight = maxHeight || body.scrollHeight + 'px';
        } else {
          el.classList.remove('open');
          trigger.setAttribute('aria-expanded', ariaExpanded || 'false');
          body.style.maxHeight = maxHeight || null;
        }
      });
      printSummaryEl.setAttribute('aria-hidden', 'true');
      updatePrintButtonStates();
      window.removeEventListener('afterprint', cleanup);
    };

    window.addEventListener('afterprint', cleanup);
    window.print();
  }

  function highlight(text, q) {
    if (!q) return text;
    const tokens = expandAliases(q).split(' ').filter(t => t.length > 1);
    if (!tokens.length) return text;
    const regex = new RegExp(`(${tokens.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  // ── Search input ─────────────────────────────────────────────────────
  searchEl.addEventListener('input', () => {
    searchQuery = searchEl.value;
    clearBtn.style.display = searchQuery ? 'flex' : 'none';
    applyFilters();
  });

  clearBtn.addEventListener('click', () => {
    searchEl.value = '';
    searchQuery = '';
    clearBtn.style.display = 'none';
    searchEl.focus();
    applyFilters();
  });

  listEl.addEventListener('click', event => {
    const emailButton = event.target.closest('.branch-panel-email-btn');
    if (!emailButton) return;
    handleEmailButtonClick(emailButton);
  });

  document.addEventListener('click', event => {
    const areaLink = event.target.closest('.area-quick-access');
    if (!areaLink) return;
    event.preventDefault();

    const cardEl = listEl.querySelector(`[data-id="${areaLink.dataset.areaCardId}"]`);
    if (!cardEl) return;

    const trigger = cardEl.querySelector('.faq-trigger');
    if (trigger && !cardEl.classList.contains('open')) {
      trigger.click();
    }
    cardEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  printSelectedBtn.addEventListener('click', () => runPrint('selected'));
  printAllBtn.addEventListener('click', () => runPrint('all'));

  // ── Init ─────────────────────────────────────────────────────────────
  initBranchContextStrip();
  initBranchSelector();
  initDeptTabs();
  buildCategoryPills();
  applyFilters();

})();

