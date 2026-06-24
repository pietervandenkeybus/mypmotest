/* ============================================================
   MyPMO prototype — vanilla JS
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Mock data ---------- */
  const CHIP = {
    New: "new", Submitted: "submitted", Validated: "validated",
    Declined: "declined", Draft: "draft", Urgent: "urgent", "Needs info": "needsinfo",
  };

  // Home activity feed
  let activity = [
    { title: "Reimbursement Request 25-06-2026", meta: "Standard | Marie Peeters | €34.50", cat: "MyHealth", status: "New" },
    { title: "Reimbursement Request 19-06-2026", meta: "Serious Illness | Tom Jansens | €23.24", cat: "MyHealth", status: "Submitted" },
    { title: "Pension Slip 06-2026", meta: "", cat: "MyRights", status: "" },
    { title: "Health Screening 03-06-2026", meta: "Standard | Marie Peeters | €202.00", cat: "MyHealth", status: "Validated" },
  ];

  // Requests dashboard data
  const requests = {
    urgent: [
      { id: "r-18", title: "Reimbursement Request 18-06-2026", meta: "Standard | Viktor Jansens | €22.00", cat: "MyHealth", status: "Needs info", date: "2026-06-18" },
    ],
    drafts: [
      { id: "r-draft1", title: "Reimbursement Request 21-06-2026", meta: "Standard | Marie Peeters | €58.00", cat: "MyHealth", status: "Draft", date: "2026-06-21" },
    ],
    all: [
      { id: "r-19", title: "Reimbursement Request 19-06-2026", meta: "Serious Illness | Tom Jansens | €23.24", cat: "MyHealth", status: "Submitted", date: "2026-06-19" },
      { id: "r-18b", title: "Reimbursement Request 18-06-2026", meta: "Standard | Viktor Jansens | €22.00", cat: "MyHealth", status: "Needs info", date: "2026-06-18" },
      { id: "r-hs", title: "Health Screening 03-06-2026", meta: "Standard | Marie Peeters | €202.00", cat: "MyHealth", status: "Validated", date: "2026-06-03" },
      { id: "r-02", title: "Reimbursement Request 02-06-2026", meta: "Standard | Marie Peeters | €40.00", cat: "MyHealth", status: "Declined", date: "2026-06-02" },
      { id: "r-pen", title: "Pension Slip 06-2026", meta: "", cat: "MyRights", status: "Submitted", date: "2026-06-01" },
    ],
  };

  const documents = [
    { title: "Document 1", cat: "MyHealth" },
    { title: "Document 2", cat: "MyHealth" },
    { title: "Document 3", cat: "MyHealth" },
    { title: "Document 4", cat: "MyRights" },
    { title: "Pension Slip 06-2026", cat: "MyRights" },
  ];

  const certificates = [
    { title: "Certificate 1", cat: "MyHealth", sub: "Active until 27-06-2026", type: "PDF" },
    { title: "Certificate 2", cat: "MyHealth", sub: "Active until 27-06-2026", type: "QR" },
    { title: "Certificate 3", cat: "MyHealth", sub: "Active until 27-06-2026", type: "PDF" },
    { title: "Certificate 4", cat: "MyRights", sub: "Deactivated", type: "QR" },
  ];

  // Action catalog. `fav` seeds the homepage Quick actions and Favorites tab.
  // Only "Request medical reimbursement" launches the built flow; others toast.
  const ICONS = {
    reimbursement: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 5H5a2 2 0 0 0-2 2v3a2 2 0 0 1 0 4v3a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3a2 2 0 0 1 0-4V7a2 2 0 0 0-2-2z"/><path d="M9 9h6M9 13h6"/></svg>',
    illness: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.5-1.5 3-3.4 3-5.5A4.5 4.5 0 0 0 12 5 4.5 4.5 0 0 0 2 8.5C2 10.6 3.5 12.5 5 14l7 7z"/></svg>',
    bank: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/></svg>',
    disease: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"/></svg>',
    accident: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
    screening: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    family: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/></svg>',
    certificate: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.2 13.9 7 22l5-3 5 3-1.2-8.1"/></svg>',
    billing: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h6"/></svg>',
  };

  const actions = [
    { id: "reimbursement", label: "Request medical reimbursement", icon: "reimbursement", flow: true, fav: true },
    { id: "illness", label: "Declare serious illness", icon: "illness", flow: false, fav: true },
    { id: "bank", label: "Declare bank account", icon: "bank", flow: false, fav: true },
    { id: "disease", label: "Declare occupational disease", icon: "disease", flow: false, fav: false },
    { id: "accident", label: "Declare accident", icon: "accident", flow: false, fav: false },
    { id: "screening", label: "Request health screening", icon: "screening", flow: false, fav: false },
    { id: "family", label: "Update family composition", icon: "family", flow: false, fav: false },
    { id: "certificate", label: "Request a certificate", icon: "certificate", flow: false, fav: false },
    { id: "billing", label: "Manage direct billing", icon: "billing", flow: false, fav: false },
  ];

  const faqs = [
    { q: "How do I submit a reimbursement request?", a: "Tap the central + button, choose “Request medical reimbursement”, then follow the four steps: Define, Upload, Input and Review." },
    { q: "Which documents do I need to upload?", a: "Upload your expense documents (e.g. invoices or receipts) and any supporting documents. You can add, drag, or scan files in each category." },
    { q: "How long does processing take?", a: "Standard reimbursements are usually processed within 10 working days. You can track the status from the Requests screen." },
    { q: "Can a family member be a beneficiary?", a: "Yes. In step 1 of the request you can select any eligible family member from the Beneficiary dropdown." },
    { q: "How do I add a new bank account?", a: "From the home screen, choose “Declare bank account”. Your active account is shown under Payment Info in your profile." },
  ];

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  function catChipClass(cat) {
    if (cat === "MyHealth") return "chip--cat-health";
    if (cat === "MyRights") return "chip--cat-rights";
    return "chip--cat-general";
  }
  function catChip(cat) {
    if (!cat) return "";
    return `<span class="chip ${catChipClass(cat)}">${cat}</span>`;
  }
  function statusChip(status) {
    if (!status) return "";
    const cls = CHIP[status] || "draft";
    return `<span class="chip chip--${cls}">${status}</span>`;
  }
  function statusDot(status) {
    if (!status) return "";
    const cls = CHIP[status] || "draft";
    return `<span class="statusdot statusdot--${cls}"></span>`;
  }

  /* ---------- Toast ---------- */
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (t.hidden = true), 2600);
  }

  /* ---------- Navigation ---------- */
  const screens = {
    home: "screen-home", requests: "screen-requests", "request-detail": "screen-request-detail",
    assignments: "screen-assignments", new: "screen-new", flow: "screen-flow",
    success: "screen-success", documents: "screen-documents", profile: "screen-profile",
    support: "screen-support",
  };
  const navMap = { requests: "requests", new: "new", documents: "documents", support: "support" };

  function navigate(name) {
    Object.values(screens).forEach((id) => { const el = document.getElementById(id); if (el) el.hidden = true; });
    const target = document.getElementById(screens[name]);
    if (target) target.hidden = false;
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });

    // bottom-nav active state
    $$(".navbtn").forEach((b) => b.classList.remove("is-active"));
    const navName = navMap[name] || (name === "home" ? null : null);
    if (navName) {
      const btn = $(`.navbtn[data-nav="${navName}"]`);
      if (btn) btn.classList.add("is-active");
    }
    // render on entry
    if (name === "home") { renderQuickActions(); renderActivity(); }
    if (name === "requests") renderRequests();
    if (name === "documents") { renderDocList(); renderCertList(); }
    if (name === "new") { resetNewSearch(); renderActionPanes(""); }
    if (name === "flow") gotoStep(1, true);
  }

  /* ---------- Render: home quick actions (from favorites) ---------- */
  function actionAttrs(a) {
    return a.flow
      ? `data-start-flow="${a.id}"`
      : `data-toast="“${a.label}” is not built in this prototype."`;
  }
  function renderQuickActions() {
    const wrap = $("#homeQuickActions");
    const favs = actions.filter((a) => a.fav);
    if (!favs.length) {
      wrap.innerHTML = `<div class="empty empty--inline" style="grid-column:1/-1">
        <p class="empty__title">No quick actions</p>
        <p class="empty__text">Favorite an action under New request to pin it here.</p></div>`;
      return;
    }
    wrap.innerHTML = favs.map((a) => `
      <button class="quick-card" ${actionAttrs(a)}>
        <span class="quick-card__icon">${ICONS[a.icon]}</span>
        <span class="quick-card__text">${a.label}</span>
      </button>`).join("");
  }

  /* ---------- Render: activity ---------- */
  function renderActivity() {
    const wrap = $("#homeActivityList");
    wrap.innerHTML = activity.map((a) => cardHTML(a, false)).join("");
  }

  function cardHTML(item, clickable) {
    const linkAttr = item.id ? `data-open-request="${item.id}"` : "";
    return `
      <button class="req-card" ${linkAttr}>
        <div class="req-card__main">
          <p class="req-card__title">${item.title}</p>
          ${item.meta ? `<p class="req-card__meta">${item.meta}</p>` : ""}
          <div class="req-card__chips">
            ${catChip(item.cat)}
          </div>
        </div>
        <div class="req-card__right">
          ${statusChip(item.status) || "<span></span>"}
          <span class="req-card__go" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>
          </span>
        </div>
      </button>`;
  }

  /* ---------- Render: requests dashboard ---------- */
  let filterState = {
    status: ["all"],
    category: ["MyHealth"],
    sort: "new",
  };

  function passFilter(item) {
    // category
    if (!filterState.category.includes(item.cat)) return false;
    // status
    if (!filterState.status.includes("all")) {
      const norm = item.status === "Needs info" ? "Urgent" : item.status;
      if (!filterState.status.includes(norm)) return false;
    }
    return true;
  }

  function sortList(list) {
    const s = [...list];
    s.sort((a, b) => (filterState.sort === "new"
      ? (b.date || "").localeCompare(a.date || "")
      : (a.date || "").localeCompare(b.date || "")));
    return s;
  }

  function renderRequests() {
    fillReqSection("#reqUrgent", requests.urgent);
    fillReqSection("#reqDrafts", requests.drafts);
    fillReqSection("#reqAll", requests.all);
  }

  function fillReqSection(sel, list) {
    const wrap = $(sel);
    const filtered = sortList(list.filter(passFilter));
    if (filtered.length === 0) {
      wrap.innerHTML = `<div class="empty empty--inline">
        <p class="empty__title">No requests found</p>
        <p class="empty__text">No items match the current filters.</p></div>`;
      return;
    }
    wrap.innerHTML = filtered.map((a) => cardHTML(a, true)).join("");
  }

  /* ---------- Request detail ---------- */
  function openRequest(id) {
    const all = [...requests.urgent, ...requests.drafts, ...requests.all,
      ...activity.filter((a) => a.id)];
    let item = all.find((x) => x.id === id);
    if (!item) item = { title: "Reimbursement Request", meta: "", cat: "MyHealth", status: "Submitted" };

    const needsInfo = item.status === "Needs info";
    $("#requestDetailBody").innerHTML = `
      <div class="card">
        <div class="card__head">
          <h2 class="card__title">${item.title}</h2>
          ${statusChip(item.status)}
        </div>
        ${item.meta ? `<p class="req-card__meta" style="margin-bottom:14px">${item.meta}</p>` : ""}
        <div class="review-line"><div><p class="review-line__k">Category</p><p class="review-line__v">${item.cat}</p></div>${catChip(item.cat)}</div>
        <div class="review-line"><div><p class="review-line__k">Submitted on</p><p class="review-line__v">${(item.date || "2026-06-18").split("-").reverse().join("/")}</p></div></div>
        <div class="review-line"><div><p class="review-line__k">Beneficiary</p><p class="review-line__v">${(item.meta.split("|")[1] || " Marie Peeters").trim()}</p></div></div>
      </div>
      ${needsInfo ? `<div class="attention-card" style="margin-bottom:14px">
        <div class="attention-card__icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg></div>
        <div class="attention-card__body"><p class="attention-card__label">Action needed</p>
        <p class="attention-card__text">We need an additional supporting document before this request can be processed.</p></div>
      </div>
      <button class="btn btn--primary btn--block" data-toast="Providing extra info is not built in this prototype.">Provide information</button>` : ""}
      <div class="card" style="margin-top:14px">
        <h3 class="review-block__title">Linked documents</h3>
        <div class="review-doc"><span>Expense Document.pdf</span><span class="review-doc__go">›</span></div>
        <div class="review-doc"><span>Supporting Document.pdf</span><span class="review-doc__go">›</span></div>
      </div>`;
    navigate("request-detail");
  }

  /* ---------- Documents ---------- */
  let docCats = ["MyHealth"];

  function renderDocList() {
    const wrap = $("#docList");
    const filtered = documents.filter((d) => docCats.includes(d.cat));
    if (!filtered.length) { wrap.innerHTML = emptyHTML("📄", "No documents found", "No documents match the selected categories."); return; }
    wrap.innerHTML = filtered.map((d) => `
      <div class="doc-card">
        <div><p class="doc-card__title">${d.title}</p></div>
        ${catChip(d.cat)}
      </div>`).join("");
  }
  function renderCertList() {
    const wrap = $("#certList");
    const filtered = certificates.filter((c) => docCats.includes(c.cat));
    if (!filtered.length) { wrap.innerHTML = emptyHTML("🏅", "No certificates found", "No certificates match the selected categories."); return; }
    wrap.innerHTML = filtered.map((c) => `
      <div class="doc-card">
        <div>
          <p class="doc-card__title">${c.title}</p>
          <p class="doc-card__sub">${c.sub}</p>
          <p class="doc-card__type">${c.type === "QR" ? "▦ QR" : "▤ PDF"}</p>
        </div>
        ${catChip(c.cat)}
      </div>`).join("");
  }
  function emptyHTML(icon, title, text) {
    return `<div class="empty"><div class="empty__icon">${icon}</div><p class="empty__title">${title}</p><p class="empty__text">${text}</p></div>`;
  }

  /* ---------- New request: favorites + all actions ---------- */
  function resetNewSearch() { const i = $("#newSearch"); if (i) i.value = ""; }

  function actionRowHTML(a, showStar) {
    const star = showStar ? `
      <button class="star-btn ${a.fav ? "is-fav" : ""}" data-fav="${a.id}" aria-label="${a.fav ? "Remove from favorites" : "Add to favorites"}" aria-pressed="${a.fav}">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="${a.fav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/></svg>
      </button>` : "";
    return `<div class="action-row-wrap">
      <button class="action-row" ${actionAttrs(a)}>
        <span class="dot dot--blue"></span>
        <span class="action-row__label">${a.label}</span>
        <span class="action-row__spacer"></span>
        <span class="action-row__go"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg></span>
      </button>
      ${star}
    </div>`;
  }

  function renderActionPanes(q) {
    const query = (q || "").toLowerCase();

    // Favorites pane
    const favWrap = $("#favActionsList");
    const favEmpty = $("#favActionsEmpty");
    const favs = actions.filter((a) => a.fav && a.label.toLowerCase().includes(query));
    favEmpty.hidden = favs.length !== 0;
    favWrap.innerHTML = favs.map((a) => actionRowHTML(a, true)).join("");

    // All actions pane
    const allWrap = $("#allActionsList");
    const allEmpty = $("#allActionsEmpty");
    const list = actions.filter((a) => a.label.toLowerCase().includes(query));
    allEmpty.hidden = list.length !== 0;
    allWrap.innerHTML = list.map((a) => actionRowHTML(a, true)).join("");
  }

  function toggleFavorite(id) {
    const a = actions.find((x) => x.id === id);
    if (!a) return;
    a.fav = !a.fav;
    const q = ($("#newSearch") || {}).value || "";
    renderActionPanes(q);
    renderQuickActions(); // keep homepage quick actions in sync
    toast(a.fav ? `“${a.label}” added to favorites.` : `“${a.label}” removed from favorites.`);
  }

  /* ---------- FAQ ---------- */
  function renderFaq(q) {
    const wrap = $("#faqAccordion");
    const empty = $("#faqEmpty");
    const list = faqs.filter((f) => f.q.toLowerCase().includes((q || "").toLowerCase()));
    empty.hidden = list.length !== 0;
    wrap.innerHTML = list.map((f, i) => `
      <div class="acc-item">
        <button class="acc-head" data-acc>${f.q}
          <span class="acc-chev"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>
        </button>
        <div class="acc-body">${f.a}</div>
      </div>`).join("");
  }

  /* ---------- Flow (4 steps) ---------- */
  let currentStep = 1;
  function gotoStep(n, reset) {
    currentStep = n;
    $$(".flow-step").forEach((s) => (s.hidden = String(s.dataset.flowstep) !== String(n)));
    $$(".stepper__item").forEach((it) => {
      const s = Number(it.dataset.step);
      it.classList.toggle("is-active", s === n);
      it.classList.toggle("is-done", s < n);
    });
    if (reset) {
      // clear uploaded files
      $$('[data-files]').forEach((f) => (f.innerHTML = ""));
    }
    window.scrollTo({ top: 0 });
  }
  function flowBack() {
    if (currentStep > 1) gotoStep(currentStep - 1);
    else navigate("new");
  }

  function addFile(zone, name, type) {
    const list = $('[data-files]', zone) || zone.querySelector("[data-files]");
    const el = document.createElement("div");
    el.className = "file-chip";
    el.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#2563eb" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
      <span class="file-chip__name">${name}</span>
      <span class="file-chip__type">${type}</span>
      <button class="file-chip__del" aria-label="Remove file">✕</button>`;
    el.querySelector(".file-chip__del").addEventListener("click", () => el.remove());
    list.appendChild(el);
  }

  /* ---------- Modals ---------- */
  function showOverlay() { $("#overlay").hidden = false; }
  function hideOverlay() { $("#overlay").hidden = true; }
  function openModal(html) {
    $("#modalCard").innerHTML = html;
    $("#modal").hidden = false;
    showOverlay();
  }
  function closeModal() { $("#modal").hidden = true; hideOverlay(); }

  function openFilePicker(zone) {
    const files = ["Expense Document.pdf", "Supporting Document.pdf", "Invoice_June.pdf", "Receipt_scan.pdf", "Prescription.pdf"];
    openModal(`
      <h2 class="modal__title">Select document</h2>
      <div class="filelist">
        ${files.map((f) => `<button class="filelist__item" data-pick="${f}">
          <svg class="ic" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          ${f}</button>`).join("")}
      </div>
      <label class="check" style="margin-top:14px"><input type="checkbox" /><span>Remember document selection</span></label>
      <div class="modal__actions">
        <button class="btn btn--ghost" data-modal-cancel>Cancel</button>
      </div>`);
    $$("[data-pick]", $("#modalCard")).forEach((b) => b.addEventListener("click", () => {
      addFile(zone, b.dataset.pick, "PDF");
      closeModal();
      toast("File added.");
    }));
    $("[data-modal-cancel]", $("#modalCard")).addEventListener("click", closeModal);
  }

  function openCamera(zone) {
    openModal(`
      <div class="camera">
        <div class="camera__view">
          <div class="camera__frame"></div>
          <div class="camera__doc"><span></span><span></span><span></span><span></span></div>
          <p class="camera__hint">Position the document inside the frame</p>
        </div>
        <div class="camera__bar"><button class="shutter" data-shoot aria-label="Capture"></button></div>
      </div>`);
    $("[data-shoot]", $("#modalCard")).addEventListener("click", () => {
      $("#modalCard").innerHTML = `
        <div class="scan-state"><div class="spinner"></div><p class="modal__title" style="margin:0">Scanning document…</p></div>`;
      setTimeout(() => {
        $("#modalCard").innerHTML = `
          <div class="scan-state">
            <div class="success__check" style="width:64px;height:64px"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
            <p class="modal__title" style="margin:0">Document successfully scanned</p>
            <button class="btn btn--primary btn--block" data-scan-done>Attach</button>
          </div>`;
        $("[data-scan-done]", $("#modalCard")).addEventListener("click", () => {
          addFile(zone, "Scanned_document.jpg", "Scan");
          closeModal();
          toast("Scanned document attached.");
        });
      }, 1500);
    });
  }

  function openScanReceipt() {
    openModal(`<div class="scan-state"><div class="spinner"></div><p class="modal__title" style="margin:0">Scanning receipt…</p></div>`);
    setTimeout(() => {
      $("#modalCard").innerHTML = `
        <div class="scan-state">
          <div class="success__check" style="width:64px;height:64px"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div>
          <p class="modal__title" style="margin:0">Receipt successfully scanned</p>
          <button class="btn btn--primary btn--block" data-modal-cancel>Done</button>
        </div>`;
      $("[data-modal-cancel]", $("#modalCard")).addEventListener("click", closeModal);
    }, 1600);
  }

  /* ---------- Filter panel ---------- */
  function openFilterPanel() { $("#filterPanel").hidden = false; showOverlay(); }
  function closeFilterPanel() { $("#filterPanel").hidden = true; hideOverlay(); }

  function readFilterPanel() {
    const status = $$("#filterStatus input:checked").map((i) => i.value);
    const category = $$("#filterCategory input:checked").map((i) => i.value);
    const sort = ($("#filterSort input:checked") || {}).value || "new";
    filterState = {
      status: status.length ? status : ["all"],
      category: category.length ? category : ["MyHealth", "MyRights", "General"],
      sort,
    };
  }
  function syncCategoryChips() {
    $$("#reqCategoryChips .catchip").forEach((c) => {
      c.classList.toggle("is-active", filterState.category.includes(c.dataset.cat));
    });
  }

  /* ---------- Submit ---------- */
  function submitRequest() {
    const ben = $("#fldBeneficiary").value;
    activity.unshift({
      title: "Reimbursement Request 25-06-2026",
      meta: `Standard | ${ben} | €34.50`,
      cat: "MyHealth",
      status: "Submitted",
      id: "r-new-" + Date.now(),
    });
    navigate("success");
  }

  /* ============================================================
     EVENT WIRING (delegation)
     ============================================================ */
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-nav],[data-open-request],[data-start-flow],[data-toast],[data-upload],[data-scan],[data-fav],[data-acc],[data-flow-next],[data-close-panel]");
    if (!t) return;

    if (t.hasAttribute("data-fav")) { toggleFavorite(t.dataset.fav); return; }
    if (t.hasAttribute("data-nav")) {
      const n = t.dataset.nav;
      if (n === "assignments") { toast("Assignments are disabled in this prototype."); return; }
      navigate(n); return;
    }
    if (t.hasAttribute("data-open-request")) { openRequest(t.dataset.openRequest); return; }
    if (t.hasAttribute("data-start-flow")) { navigate("flow"); return; }
    if (t.hasAttribute("data-flow-next")) { gotoStep(Number(t.dataset.flowNext)); return; }
    if (t.hasAttribute("data-toast")) { toast(t.dataset.toast); return; }
    if (t.hasAttribute("data-upload")) { openFilePicker(t.closest(".upload-zone")); return; }
    if (t.hasAttribute("data-scan")) { openCamera(t.closest(".upload-zone")); return; }
    if (t.hasAttribute("data-close-panel")) { closeFilterPanel(); return; }
    if (t.hasAttribute("data-acc")) {
      const item = t.closest(".acc-item");
      item.classList.toggle("is-open");
      return;
    }
  });

  // header buttons
  $("#btnHome").addEventListener("click", () => navigate("home"));
  $("#btnProfile").addEventListener("click", () => navigate("profile"));
  $("#btnNotifications").addEventListener("click", () => toast("You have 1 notification: info needed for Reimbursement Request 18-06-2026."));
  $("#btnSearch").addEventListener("click", () => { navigate("new"); $("#newSearch").focus(); });

  // flow
  $("#flowBack").addEventListener("click", flowBack);
  $("#btnSubmit").addEventListener("click", submitRequest);

  // radio-row visual select (step 3)
  $$(".radio-row input").forEach((r) => r.addEventListener("change", () => {
    $$(".radio-row").forEach((row) => row.classList.remove("is-selected"));
    if (r.checked) r.closest(".radio-row").classList.add("is-selected");
  }));

  // collapse sections
  $$("[data-collapse] .collapse__head").forEach((h) => h.addEventListener("click", () => {
    const c = h.closest("[data-collapse]");
    if (c.hasAttribute("open")) c.removeAttribute("open"); else c.setAttribute("open", "");
  }));

  // tabs (new request + documents)
  $$(".tabs").forEach((tabs) => {
    tabs.addEventListener("click", (e) => {
      const tab = e.target.closest(".tab");
      if (!tab) return;
      const scope = tabs.closest(".screen__pad");
      $$(".tab", tabs).forEach((x) => x.classList.remove("is-active"));
      tab.classList.add("is-active");
      const name = tab.dataset.tab;
      $$(".tabpane", scope).forEach((p) => (p.hidden = p.dataset.pane !== name));
      // category chips visible only for doc/cert tabs
      const chipRow = $("#docCategoryChips");
      if (chipRow && scope.contains(chipRow)) {
        chipRow.style.display = name === "cards" ? "none" : "flex";
      }
    });
  });

  // category chips on requests
  $("#reqCategoryChips").addEventListener("click", (e) => {
    const c = e.target.closest(".catchip");
    if (!c) return;
    c.classList.toggle("is-active");
    const cats = $$("#reqCategoryChips .catchip.is-active").map((x) => x.dataset.cat);
    filterState.category = cats.length ? cats : ["__none__"];
    // sync the panel checkboxes
    $$("#filterCategory input").forEach((i) => (i.checked = cats.includes(i.value)));
    renderRequests();
  });

  // category chips on documents
  $("#docCategoryChips").addEventListener("click", (e) => {
    const c = e.target.closest(".catchip");
    if (!c) return;
    c.classList.toggle("is-active");
    docCats = $$("#docCategoryChips .catchip.is-active").map((x) => x.dataset.cat);
    renderDocList(); renderCertList();
  });

  // filter panel
  $("#btnFilter").addEventListener("click", openFilterPanel);
  $("#filterApply").addEventListener("click", () => {
    readFilterPanel();
    syncCategoryChips();
    renderRequests();
    closeFilterPanel();
    toast("Filters applied.");
  });
  $("#filterReset").addEventListener("click", () => {
    $$("#filterStatus input").forEach((i) => (i.checked = i.value === "all"));
    $$("#filterCategory input").forEach((i) => (i.checked = true));
    $('#filterSort input[value="new"]').checked = true;
    readFilterPanel();
    syncCategoryChips();
    renderRequests();
    toast("Filters reset.");
  });
  // "All" status toggles others off
  $("#filterStatus").addEventListener("change", (e) => {
    if (e.target.value === "all" && e.target.checked) {
      $$('#filterStatus input:not([value="all"])').forEach((i) => (i.checked = false));
    } else if (e.target.value !== "all" && e.target.checked) {
      $('#filterStatus input[value="all"]').checked = false;
    }
  });

  // overlay click closes things
  $("#overlay").addEventListener("click", () => { closeFilterPanel(); closeModal(); });

  // search inputs
  $("#newSearch").addEventListener("input", (e) => {
    // jump to "All actions" tab when the user starts typing
    if (e.target.value) {
      const allTab = $('#newTabs .tab[data-tab="all"]');
      $$('#newTabs .tab').forEach((x) => x.classList.remove("is-active"));
      allTab.classList.add("is-active");
      $$('#screen-new .tabpane').forEach((p) => (p.hidden = p.dataset.pane !== "all"));
    }
    renderActionPanes(e.target.value);
  });
  $("#faqSearch").addEventListener("input", (e) => renderFaq(e.target.value));

  /* ---------- Init ---------- */
  renderQuickActions();
  renderActivity();
  renderActionPanes("");
  renderFaq("");
  navigate("home");
})();
