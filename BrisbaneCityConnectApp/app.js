// =====================================================
//  Brisbane City Connect — Slide Navigation
//  Controls the 5-scene executive demo.
//  No external libraries. No API calls.
// =====================================================

const SCENE_IDS = [
  'scene-current-state',   // 0
  'scene-david',           // 1
  'scene-business',        // 2
  'scene-welcome',         // 3
  'scene-transport',       // 4
  'scene-events',          // 5
  'scene-services',        // 6
  'scene-emergency',       // 7
  'scene-vision'           // 8
];

let current = 0;

// ---------- Core navigation ----------

function goTo(index) {
  if (index < 0 || index >= SCENE_IDS.length) return;

  // Hide current scene
  const currentEl = document.getElementById(SCENE_IDS[current]);
  if (currentEl) {
    currentEl.classList.remove('active', 'entering');
  }

  current = index;

  // Show and animate the new scene
  const nextEl = document.getElementById(SCENE_IDS[current]);
  if (nextEl) {
    nextEl.classList.add('active', 'entering');
    scrollToTop();
  }

  // Dark-mode body class for the vision (closing) scene
  if (SCENE_IDS[current] === 'scene-vision') {
    document.body.classList.add('vision-mode');
  } else {
    document.body.classList.remove('vision-mode');
  }

  updateNavBar();
}

function next() {
  goTo(current + 1);
}

function prev() {
  goTo(current - 1);
}

// Scroll helper — desktop uses window; mobile uses .scene-container
// Using 'instant' avoids scroll animation competing with the scene transition
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'instant' });
  var container = document.querySelector('.scene-container');
  if (container) container.scrollTo({ top: 0, behavior: 'instant' });
}

// ---------- Update the bottom navigation bar ----------

function updateNavBar() {
  const btnPrev   = document.getElementById('btnPrev');
  const btnNext   = document.getElementById('btnNext');
  const label     = document.getElementById('navSceneLabel');
  const counter   = document.getElementById('navCounter');

  // Prev button — disable on first scene
  btnPrev.disabled = (current === 0);

  // Next button — disable on last scene
  btnNext.disabled = (current === SCENE_IDS.length - 1);

  // Scene label — read from the data-label attribute
  const sceneEl = document.getElementById(SCENE_IDS[current]);
  label.textContent  = sceneEl ? sceneEl.dataset.label : '';
  counter.textContent = `Scene ${current + 1} of ${SCENE_IDS.length}`;
}

// ---------- Keyboard navigation (presenter convenience) ----------

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    next();
  } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    prev();
  }
});

// ---------- Initialise on page load ----------

// Make sure only scene 0 is visible and nav bar is correct
document.addEventListener('DOMContentLoaded', function () {
  // Hide all scenes first
  SCENE_IDS.forEach(function (id) {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active', 'entering');
  });

  // Show the first scene
  const first = document.getElementById(SCENE_IDS[0]);
  if (first) first.classList.add('active');

  updateNavBar();
});

// =====================================================
//  Business onboarding step logic (Scene 3)
//  Manages the 3-step wizard without a page reload.
// =====================================================

// Simulate a brief "searching" delay then show the found card
function bizSearch() {
  var btn = document.querySelector('.btn-biz-search');
  btn.textContent = 'Searching…';
  btn.disabled = true;

  setTimeout(function () {
    btn.textContent = 'Find my business';
    btn.disabled = false;
    document.getElementById('bizFoundCard').style.display = 'block';
    document.getElementById('bizFoundCard').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 900);
}

// Move between the three wizard panels and update the step indicator
function bizGoStep(step) {
  // Hide all panels
  document.getElementById('bizPanel1').style.display = 'none';
  document.getElementById('bizPanel2').style.display = 'none';
  document.getElementById('bizPanel3').style.display = 'none';

  // Show the target panel
  document.getElementById('bizPanel' + step).style.display = 'block';

  // Update step indicator classes
  for (var i = 1; i <= 3; i++) {
    var el = document.getElementById('bizStep' + i);
    el.classList.remove('biz-step--active', 'biz-step--done');
    if (i < step)  el.classList.add('biz-step--done');
    if (i === step) el.classList.add('biz-step--active');
  }

  // Scroll the step bar into view
  scrollToTop();
}

// Reset back to step 1 and hide the found card
function bizReset() {
  document.getElementById('bizFoundCard').style.display = 'none';
  bizGoStep(1);
}

// =====================================================
//  Scene 2: Visitor view toggle (Hiroshi)
// =====================================================

var _visitorViewActive = false;

function toggleVisitorView() {
  _visitorViewActive = !_visitorViewActive;

  var btn          = document.getElementById('btnVisitorToggle');
  var hiroshi      = document.getElementById('hiroshiPanel');
  var davidMain    = document.getElementById('davidMainContent');

  if (_visitorViewActive) {
    davidMain.style.display = 'none';
    hiroshi.style.display = 'block';
    hiroshi.classList.remove('anim-enter');
    void hiroshi.offsetWidth;
    hiroshi.classList.add('anim-enter');
    btn.textContent = '';
    btn.classList.add('active');

    // Rebuild button content with the dot
    var dot = document.createElement('span');
    dot.className = 'visitor-toggle-dot';
    btn.appendChild(dot);
    btn.appendChild(document.createTextNode(' Back to David\'s journey'));
  } else {
    hiroshi.style.display = 'none';
    davidMain.style.display = 'block';
    davidMain.classList.remove('anim-enter');
    void davidMain.offsetWidth;
    davidMain.classList.add('anim-enter');
    btn.classList.remove('active');

    btn.textContent = '';
    var dot2 = document.createElement('span');
    dot2.className = 'visitor-toggle-dot';
    btn.appendChild(dot2);
    btn.appendChild(document.createTextNode(' Switch to visitor view'));
  }
}


// =====================================================
//  Scene 2: David — Intent and assistant logic
// =====================================================

// Show either the full journey dashboard or the conversational assistant
function davidChoose(choice) {
  var selector  = document.getElementById('davidIntentSelector');
  var dashboard = document.getElementById('davidDashboard');
  var assistant = document.getElementById('davidAssistantPanel');

  selector.style.display = 'none';

  if (choice === 'direct') {
    assistant.style.display = 'none';
    dashboard.style.display = 'block';
    dashboard.classList.remove('anim-enter');
    void dashboard.offsetWidth;
    dashboard.classList.add('anim-enter');
    scrollToTop();
  } else {
    dashboard.style.display = 'none';
    assistant.style.display = 'block';
    assistant.classList.remove('anim-enter');
    void assistant.offsetWidth;
    assistant.classList.add('anim-enter');
    scrollToTop();
  }
}

// Return to the intent selector and reset assistant state
function davidBack() {
  var selector  = document.getElementById('davidIntentSelector');
  var dashboard = document.getElementById('davidDashboard');
  var assistant = document.getElementById('davidAssistantPanel');
  var results   = document.getElementById('davidAssistantResults');
  var btn       = document.getElementById('davidFindBtn');

  dashboard.style.display = 'none';
  assistant.style.display = 'none';

  if (results) results.style.display = 'none';
  if (btn) { btn.textContent = 'Find options'; btn.disabled = false; }

  // Reset venue selection and sub-panels
  document.getElementById('davidVenueActions').style.display = 'none';
  ['davidSharePanel', 'davidAccessPanel', 'davidBookPanel'].forEach(function (id) {
    document.getElementById(id).style.display = 'none';
  });
  document.querySelectorAll('.david-rec-card').forEach(function (c) {
    c.classList.remove('david-rec-card--selected');
  });

  // Reset report flow
  document.getElementById('davidReportPrompt').style.display = 'flex';
  document.getElementById('davidReportPanel').style.display = 'none';
  document.getElementById('davidReportConfirm').style.display = 'none';

  // Reset visitor view if active
  if (_visitorViewActive) {
    _visitorViewActive = false;
    document.getElementById('hiroshiPanel').style.display = 'none';
    document.getElementById('davidMainContent').style.display = 'block';
    var btn = document.getElementById('btnVisitorToggle');
    btn.classList.remove('active');
    btn.textContent = '';
    var dot = document.createElement('span');
    dot.className = 'visitor-toggle-dot';
    btn.appendChild(dot);
    btn.appendChild(document.createTextNode(' Switch to visitor view'));
  }

  selector.style.display = 'block';
  selector.classList.remove('anim-enter');
  void selector.offsetWidth;
  selector.classList.add('anim-enter');
  scrollToTop();
}

// Simulate a brief search delay then reveal the recommendation cards
function davidFindOptions() {
  var btn = document.getElementById('davidFindBtn');
  btn.textContent = 'Finding…';
  btn.disabled = true;

  setTimeout(function () {
    btn.textContent = 'Find options';
    btn.disabled = false;

    var results = document.getElementById('davidAssistantResults');
    results.style.display = 'block';
    results.classList.remove('anim-enter');
    void results.offsetWidth;
    results.classList.add('anim-enter');
    results.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 1100);
}

// =====================================================
//  Scene 2: Venue selection + post-selection actions
// =====================================================

var _selectedVenuePhone = '';

function davidSelectVenue(cardEl, venueName, venuePhone) {
  // Deselect all, then highlight chosen card
  var allCards = document.querySelectorAll('.david-rec-card');
  allCards.forEach(function (c) { c.classList.remove('david-rec-card--selected'); });
  cardEl.classList.add('david-rec-card--selected');

  _selectedVenuePhone = venuePhone;

  // Fill in name wherever it appears
  var nameEls = [
    document.getElementById('davidSelectedVenueName'),
    document.getElementById('davidShareVenueName'),
    document.getElementById('davidShareVenueNameDetail'),
    document.getElementById('davidBookPhone')
  ];
  nameEls[0] && (nameEls[0].textContent = venueName);
  nameEls[1] && (nameEls[1].textContent = venueName);
  nameEls[2] && (nameEls[2].textContent = venueName);
  nameEls[3] && (nameEls[3].textContent = venuePhone);

  // Show venue actions panel, hide sub-panels
  var actionsEl = document.getElementById('davidVenueActions');
  ['davidSharePanel', 'davidAccessPanel', 'davidBookPanel'].forEach(function (id) {
    document.getElementById(id).style.display = 'none';
  });

  actionsEl.style.display = 'block';
  actionsEl.classList.remove('anim-enter');
  void actionsEl.offsetWidth;
  actionsEl.classList.add('anim-enter');
  actionsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function davidBackToRecs() {
  document.getElementById('davidVenueActions').style.display = 'none';
  var allCards = document.querySelectorAll('.david-rec-card');
  allCards.forEach(function (c) { c.classList.remove('david-rec-card--selected'); });
}

// Show one sub-panel, hide others
function davidVenueAction(which) {
  var panels = { share: 'davidSharePanel', access: 'davidAccessPanel', book: 'davidBookPanel' };
  Object.keys(panels).forEach(function (key) {
    var el = document.getElementById(panels[key]);
    if (key === which) {
      el.style.display = 'block';
      el.classList.remove('anim-enter');
      void el.offsetWidth;
      el.classList.add('anim-enter');
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      el.style.display = 'none';
    }
  });
}

function davidBackToActions() {
  ['davidSharePanel', 'davidAccessPanel', 'davidBookPanel'].forEach(function (id) {
    document.getElementById(id).style.display = 'none';
  });
}

// Share sub-panel buttons
function davidCopyLink() {
  var lbl = document.getElementById('davidCopyLabel');
  lbl.textContent = 'Copied!';
  setTimeout(function () { lbl.textContent = 'Copy link'; }, 1800);
}

function davidSendShare() {
  var lbl = document.getElementById('davidSendLabel');
  lbl.textContent = 'Sent ✓';
  setTimeout(function () { lbl.textContent = 'Send to group'; }, 2000);
}

// Booking sub-panel buttons
function davidCallVenue() {
  alert('Calling ' + _selectedVenuePhone + ' — in a real app this would open the phone dialler.');
}

function davidBookOnline() {
  alert('Opening online booking for this venue — in a real app this would open the booking page.');
}


// =====================================================
//  Scene 2: Report an issue flow
// =====================================================

function davidShowReport() {
  document.getElementById('davidReportPrompt').style.display = 'none';
  var panel = document.getElementById('davidReportPanel');
  panel.style.display = 'block';
  panel.classList.remove('anim-enter');
  void panel.offsetWidth;
  panel.classList.add('anim-enter');
  panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function davidHideReport() {
  document.getElementById('davidReportPanel').style.display = 'none';
  document.getElementById('davidReportPrompt').style.display = 'flex';
}

function davidSubmitReport() {
  document.getElementById('davidReportPanel').style.display = 'none';
  document.getElementById('davidReportPrompt').style.display = 'none';

  var confirm = document.getElementById('davidReportConfirm');
  confirm.style.display = 'block';
  confirm.classList.remove('anim-enter');
  void confirm.offsetWidth;
  confirm.classList.add('anim-enter');
  confirm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
