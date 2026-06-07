// ─── Config ────────────────────────────────────────────────────────────────────
// WORKER_URL فارغ = استخدام نفس الخادم (Replit). غيّره لرابط Worker عند النشر على Netlify
const WORKER_URL   = 'https://football-worker.mahdijadir38.workers.dev/';
const NETLIFY_BASE = '';

// ─── League info (Arabic name + flag emoji) ────────────────────────────────────
const LEAGUES = {
  'uefa.champions'        : { name:'دوري أبطال أوروبا',    flag:'🏆' },
  'uefa.europa'           : { name:'الدوري الأوروبي',       flag:'🏆' },
  'uefa.europa.conf'      : { name:'دوري المؤتمر',          flag:'🏆' },
  'uefa.euro'             : { name:'بطولة أوروبا',          flag:'🇪🇺' },
  'uefa.nations'          : { name:'دوري الأمم الأوروبية',  flag:'🇪🇺' },
  'eng.1'                 : { name:'الدوري الإنجليزي',      flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'eng.2'                 : { name:'الدرجة الأولى الإنجليزية', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'eng.fa'                : { name:'كأس الاتحاد الإنجليزي', flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'eng.league_cup'        : { name:'كأس الرابطة الإنجليزية',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿' },
  'esp.1'                 : { name:'الدوري الإسباني',       flag:'🇪🇸' },
  'esp.2'                 : { name:'الدوري الثاني الإسباني',flag:'🇪🇸' },
  'esp.copa_del_rey'      : { name:'كأس ملك إسبانيا',      flag:'🇪🇸' },
  'ger.1'                 : { name:'الدوري الألماني',       flag:'🇩🇪' },
  'ger.2'                 : { name:'الدوري الثاني الألماني',flag:'🇩🇪' },
  'ger.dfb_pokal'         : { name:'كأس ألمانيا',           flag:'🇩🇪' },
  'ita.1'                 : { name:'الدوري الإيطالي',       flag:'🇮🇹' },
  'ita.2'                 : { name:'الدوري الثاني الإيطالي',flag:'🇮🇹' },
  'ita.coppa_italia'      : { name:'كأس إيطاليا',           flag:'🇮🇹' },
  'fra.1'                 : { name:'الدوري الفرنسي',        flag:'🇫🇷' },
  'fra.2'                 : { name:'الدوري الثاني الفرنسي', flag:'🇫🇷' },
  'fra.coupe_de_france'   : { name:'كأس فرنسا',             flag:'🇫🇷' },
  'por.1'                 : { name:'الدوري البرتغالي',      flag:'🇵🇹' },
  'ned.1'                 : { name:'الدوري الهولندي',       flag:'🇳🇱' },
  'tur.1'                 : { name:'الدوري التركي',         flag:'🇹🇷' },
  'rus.1'                 : { name:'الدوري الروسي',         flag:'🇷🇺' },
  'sco.1'                 : { name:'الدوري الاسكتلندي',    flag:'🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  'bel.1'                 : { name:'الدوري البلجيكي',       flag:'🇧🇪' },
  'ksa.1'                 : { name:'الدوري السعودي',        flag:'🇸🇦' },
  'qat.1'                 : { name:'الدوري القطري',         flag:'🇶🇦' },
  'uae.pro'               : { name:'دوري الخليج العربي',    flag:'🇦🇪' },
  'egy.1'                 : { name:'الدوري المصري',         flag:'🇪🇬' },
  'mar.1'                 : { name:'الدوري المغربي',        flag:'🇲🇦' },
  'tun.1'                 : { name:'الرابطة التونسية',      flag:'🇹🇳' },
  'conmebol.libertadores' : { name:'كأس ليبرتادوريس',      flag:'🏆' },
  'conmebol.sudamericana' : { name:'كأس سودامريكانا',      flag:'🏆' },
  'bra.1'                 : { name:'الدوري البرازيلي',      flag:'🇧🇷' },
  'arg.1'                 : { name:'الدوري الأرجنتيني',    flag:'🇦🇷' },
  'mex.1'                 : { name:'ليغا MX',               flag:'🇲🇽' },
  'usa.1'                 : { name:'MLS',                   flag:'🇺🇸' },
  'afc.champions'         : { name:'دوري أبطال آسيا',      flag:'🏆' },
  'caf.champions'         : { name:'دوري أبطال أفريقيا',   flag:'🏆' },
  'fifa.world'            : { name:'كأس العالم',            flag:'🌍' },
  'fifa.cwc'              : { name:'كأس العالم للأندية',   flag:'🌍' },
  'conmebol.america'      : { name:'كوبا أمريكا',          flag:'🌎' },
  'friendly.national'     : { name:'مباريات ودية',         flag:'🤝' },
};

function leagueInfo(code) {
  return LEAGUES[code] || { name: code || '', flag: '⚽' };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function pad(n) { return String(n).padStart(2, '0'); }

function fmtDateStr(date) {
  return `${date.getFullYear()}${pad(date.getMonth()+1)}${pad(date.getDate())}`;
}

function todayStr()       { return fmtDateStr(new Date()); }
function offsetDate(n)    { const d = new Date(); d.setDate(d.getDate()+n); return fmtDateStr(d); }

function arabicDate(dateStr) {
  const y = dateStr.slice(0,4), m = dateStr.slice(4,6), d = dateStr.slice(6,8);
  const dt = new Date(`${y}-${m}-${d}`);
  const days   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  return `${days[dt.getDay()]} ${Number(d)} ${months[dt.getMonth()]} ${y}`;
}

function todayLabel(dateStr) {
  const today     = todayStr();
  const yesterday = offsetDate(-1);
  const tomorrow  = offsetDate(1);
  if (dateStr === today)     return 'اليوم';
  if (dateStr === yesterday) return 'أمس';
  if (dateStr === tomorrow)  return 'غداً';
  return arabicDate(dateStr).slice(arabicDate(dateStr).indexOf(' ')+1);
}

function fmtTime(iso) {
  return new Date(iso).toLocaleTimeString('ar-EG', { hour:'2-digit', minute:'2-digit' });
}

function isHistorical(dateStr) {
  const dt = new Date(`${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}`);
  return (Date.now() - dt.getTime()) > 60 * 86400 * 1000;
}

function isHistoricalSeason(s) { return s && Number(s) < new Date().getFullYear() - 1; }

function randomMs(minM, maxM) { return (minM + Math.random() * (maxM - minM)) * 60 * 1000; }

// ─── Fetch ────────────────────────────────────────────────────────────────────
async function apiFetch(path) {
  const res = await fetch(`${WORKER_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}
async function netlifyFetch(path) {
  const res = await fetch(`${NETLIFY_BASE}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function setRefresh(active) {
  document.getElementById('refresh-bar')?.classList.toggle('visible', !!active);
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: MATCHES
// ═══════════════════════════════════════════════════════════════════════════════
const PAGE = document.body.dataset.page;
let refreshTimer = null;

if (PAGE === 'matches') {
  let currentDate  = todayStr();
  let dateOffset   = 0;
  let activeFilter = 'all';
  let allMatches   = [];

  // ── Date pill + arrows ──
  function updateDateLabel() {
    const el = document.getElementById('date-label-text');
    if (!el) return;
    const lbl = todayLabel(currentDate);
    const d = new Date(`${currentDate.slice(0,4)}-${currentDate.slice(4,6)}-${currentDate.slice(6,8)}`);
    const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
    const short = `${lbl === 'اليوم' || lbl === 'أمس' || lbl === 'غداً' ? lbl+' '+d.getDate()+' '+months[d.getMonth()] : lbl}`;
    el.textContent = short;
  }

  document.getElementById('btn-prev-day')?.addEventListener('click', () => {
    dateOffset--; currentDate = offsetDate(dateOffset); updateDateLabel(); loadMatches();
  });
  document.getElementById('btn-next-day')?.addEventListener('click', () => {
    dateOffset++; currentDate = offsetDate(dateOffset); updateDateLabel(); loadMatches();
  });

  // ── Modal ──
  const modal = document.getElementById('date-modal');
  const openModal = () => { fillPickers(); modal.classList.remove('hidden'); };
  document.getElementById('btn-cal')?.addEventListener('click', openModal);
  document.getElementById('btn-date-display')?.addEventListener('click', openModal);
  document.getElementById('btn-close-modal')?.addEventListener('click', () => modal.classList.add('hidden'));
  modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.add('hidden'); });
  document.getElementById('btn-apply-date')?.addEventListener('click', () => {
    const y = document.getElementById('pick-year')?.value;
    const m = document.getElementById('pick-month')?.value;
    const d = document.getElementById('pick-day')?.value;
    if (y && m && d) {
      currentDate = `${y}${m}${d}`;
      dateOffset  = 0;
      modal.classList.add('hidden');
      updateDateLabel();
      loadMatches();
    }
  });

  function fillPickers() {
    const dy = document.getElementById('pick-day');
    const yr = document.getElementById('pick-year');
    if (!dy || !yr) return;
    dy.innerHTML = '';
    yr.innerHTML = '';
    for (let i = 1; i <= 31; i++) dy.innerHTML += `<option value="${pad(i)}">${i}</option>`;
    const y = new Date().getFullYear();
    for (let i = y+1; i >= 2020; i--) yr.innerHTML += `<option value="${i}">${i}</option>`;
    const now = new Date();
    dy.value  = pad(now.getDate());
    yr.value  = String(now.getFullYear());
    const mo  = document.getElementById('pick-month');
    if (mo) mo.value = pad(now.getMonth()+1);
  }

  // ── Status tabs ──
  document.querySelectorAll('.status-tab').forEach(t =>
    t.addEventListener('click', () => {
      document.querySelectorAll('.status-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      activeFilter = t.dataset.filter;
      renderMatches();
    })
  );

  // ── Load ──
  async function loadMatches() {
    clearTimeout(refreshTimer);
    const container = document.getElementById('matches-container');
    container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><div>جارٍ تحميل المباريات...</div></div>`;
    try {
      let data;
      if (isHistorical(currentDate)) {
        data = await netlifyFetch(`/data/scoreboard/${currentDate}.json`);
        allMatches = Array.isArray(data) ? data : (data.matches || []);
      } else {
        data = await apiFetch(`/api/matches?date=${currentDate}`);
        allMatches = data.matches || [];
      }
      updateLiveBadge();
      renderMatches();
      const hasLive = allMatches.some(m => m.status === 'in');
      setRefresh(hasLive);
      if (hasLive) refreshTimer = setTimeout(loadMatches, randomMs(2, 3.5));
    } catch (e) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل البيانات</p><p style="font-size:.72rem;color:var(--text2)">${e.message}</p></div>`;
    }
  }

  function updateLiveBadge() {
    const n = allMatches.filter(m => m.status === 'in').length;
    const b = document.getElementById('live-count');
    if (!b) return;
    if (n > 0) { b.textContent = n; b.classList.remove('hidden'); }
    else b.classList.add('hidden');
  }

  function renderMatches() {
    const container = document.getElementById('matches-container');
    let list = allMatches;
    if (activeFilter === 'live') list = list.filter(m => m.status === 'in');
    if (activeFilter === 'pre')  list = list.filter(m => m.status === 'pre');
    if (activeFilter === 'post') list = list.filter(m => m.status === 'post');

    if (!list.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚽</div><p>لا توجد مباريات</p></div>`;
      return;
    }

    // Group by league (preserve first-appearance order)
    const groups = [];
    const seen   = {};
    list.forEach(m => {
      const key = m.league || '_other';
      if (seen[key] === undefined) { seen[key] = groups.length; groups.push({ key, matches: [] }); }
      groups[seen[key]].matches.push(m);
    });

    let html = '';
    for (const g of groups) {
      const info = leagueInfo(g.key);
      const name = g.matches[0].leagueName || info.name;
      const flag = info.flag;

      html += `<div class="league-sep" onclick="toggleLeague(this)">
        <span class="ls-flag">${flag}</span>
        <span style="color:var(--text3);flex:1" onclick="event.stopPropagation();goLeague('${g.key}')">${name}</span>
        <span class="ls-chevron">▾</span>
      </div>
      <div class="league-body">
        ${g.matches.map(m => matchCard(m, name, flag)).join('')}
      </div>`;
    }
    container.innerHTML = html;
  }

  function matchCard(m, leagueName, flag) {
    const isLive = m.status === 'in';
    const isPost = m.status === 'post';
    const link   = `/match.html?id=${m.id}&league=${m.league}`;

    let statusHtml;
    if (isLive) {
      statusHtml = `<div class="mc-status">
        <div class="mc-live-badge">مباشر</div>
        <div class="mc-minute">${m.minute||'LIVE'}'</div>
      </div>`;
    } else if (isPost) {
      statusHtml = `<div class="mc-status"><div class="mc-ended">انتهت</div></div>`;
    } else {
      statusHtml = `<div class="mc-status"><div class="mc-time">${fmtTime(m.date)}</div></div>`;
    }

    let scoreHtml;
    if (m.status === 'pre') {
      scoreHtml = `<div class="mc-score"><div class="mc-score-dash">-:-</div></div>`;
    } else {
      scoreHtml = `<div class="mc-score">
        <div class="mc-score-val ${isLive?'live':''}">${m.homeScore} - ${m.awayScore}</div>
      </div>`;
    }

    return `<div class="match-card ${isLive?'live-card':''}" onclick="location.href='${link}'">
      <div class="mc-league-row">
        <span>${leagueName}</span>
        <span class="mc-league-flag">${flag}</span>
      </div>
      <div class="mc-row">
        ${statusHtml}
        <div class="mc-team">
          ${m.homeLogo?`<img class="mc-logo" src="${m.homeLogo}" alt="" onerror="this.style.display='none'">` : ''}
          <span class="mc-team-name">${m.homeTeam}</span>
        </div>
        ${scoreHtml}
        <div class="mc-team away">
          ${m.awayLogo?`<img class="mc-logo" src="${m.awayLogo}" alt="" onerror="this.style.display='none'">` : ''}
          <span class="mc-team-name">${m.awayTeam}</span>
        </div>
      </div>
    </div>`;
  }

  updateDateLabel();
  loadMatches();
}

// ── Toggle League ──────────────────────────────────────────────────────────────
function toggleLeague(sep) {
  sep.classList.toggle('collapsed');
  sep.nextElementSibling?.classList.toggle('hidden');
}
function goLeague(code) { location.href = `/league.html?code=${code}`; }

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: MATCH DETAIL
// ═══════════════════════════════════════════════════════════════════════════════
if (PAGE === 'match') {

  document.querySelectorAll('.detail-tab').forEach(t =>
    t.addEventListener('click', () => {
      document.querySelectorAll('.detail-tab').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(x => x.classList.remove('active'));
      document.getElementById(`tab-${t.dataset.tab}`)?.classList.add('active');
    })
  );

  async function loadMatch() {
    const p       = new URLSearchParams(location.search);
    const matchId = p.get('id');
    const league  = p.get('league') || '';
    if (!matchId) return;

    try {
      const d = await apiFetch(`/api/summary?matchId=${matchId}&league=${league}`);
      const info = leagueInfo(d.league || league);

      document.title = `${d.homeTeam} vs ${d.awayTeam} | Scorio`;

      const bc = document.getElementById('breadcrumb');
      if (bc) {
        bc.innerHTML = `
          <span class="bc-item link" onclick="location.href='/'">كرة القدم</span>
          <span class="bc-sep">›</span>
          <span class="bc-item link" onclick="goLeague('${d.league||league}')">${d.leagueName || info.name}</span>
          <span class="bc-sep">›</span>
          <span class="bc-item">${d.homeTeam} ضد ${d.awayTeam}</span>`;
      }

      document.getElementById('detail-tabs').style.display = 'flex';

      const isLive = d.status === 'in';
      const isPost = d.status === 'post';

      let statusBar;
      if (isLive) {
        statusBar = `<div class="hero-status-bar">
          <span class="hero-live-pill"><span class="hero-live-dot"></span>مباشر</span>
          <span class="hero-clock-text">${d.minute||''}'</span>
        </div>`;
      } else if (isPost) {
        statusBar = `<div class="hero-status-bar"><span class="hero-time-text">انتهت — ${d.statusText||''}</span></div>`;
      } else {
        statusBar = `<div class="hero-status-bar"><span class="hero-time-text">${fmtTime(d.date)}</span></div>`;
      }

      const scoreHtml = d.status === 'pre'
        ? `<div class="hero-score-pre">-:-</div>`
        : `<div class="hero-score-main ${isLive?'live':''}">${d.homeScore} - ${d.awayScore}</div>`;

      const homeGoals = (d.goals||[]).filter(g => g.team === d.homeTeam || g.home === true);
      const awayGoals = (d.goals||[]).filter(g => g.team === d.awayTeam || g.home === false);
      const goalsHtml = (d.goals?.length) ? `
        <div class="hero-goals-strip">
          <div class="hero-goals-home">${homeGoals.map(g=>`<span class="goal-line">⚽ ${g.player||''} ${g.minute||''}'</span>`).join('')}</div>
          <div class="hero-goals-mid"></div>
          <div class="hero-goals-away">${awayGoals.map(g=>`<span class="goal-line">${g.minute||''}' ${g.player||''} ⚽</span>`).join('')}</div>
        </div>` : '';

      let metaItems = '';
      if (d.venue) metaItems += `<span class="hero-meta-item">🏟️ ${d.venue}</span>`;
      if (d.date)  metaItems += `<span class="hero-meta-item">📅 ${new Date(d.date).toLocaleDateString('ar-EG',{year:'numeric',month:'long',day:'numeric'})}</span>`;
      if (d.round) metaItems += `<span class="hero-meta-item">${d.round}</span>`;

      document.getElementById('match-hero').innerHTML = `
        <div class="match-hero">
          <div class="hero-league-bar">${d.leagueName||info.name} ${info.flag}</div>
          ${d.advancement   ? `<div style="text-align:center;color:var(--green);font-size:.78rem;padding:.2rem 0">🏆 تأهل: ${d.advancement}</div>` : ''}
          ${d.penaltyWinner ? `<div style="text-align:center;color:var(--orange);font-size:.78rem;padding:.2rem 0">⚽ ركلات ترجيح — ${d.penaltyWinner}</div>` : ''}
          ${statusBar}
          <div class="hero-teams">
            <div class="hero-team">
              ${d.homeLogo?`<img class="hero-logo" src="${d.homeLogo}" onerror="this.style.display='none'">` : '<div style="width:56px;height:56px"></div>'}
              <div class="hero-team-name">${d.homeTeam}</div>
            </div>
            <div class="hero-score-col">${scoreHtml}</div>
            <div class="hero-team">
              ${d.awayLogo?`<img class="hero-logo" src="${d.awayLogo}" onerror="this.style.display='none'">` : '<div style="width:56px;height:56px"></div>'}
              <div class="hero-team-name">${d.awayTeam}</div>
            </div>
          </div>
          ${goalsHtml}
          ${metaItems ? `<div class="hero-meta">${metaItems}</div>` : ''}
        </div>`;

      // ── Tab: التفاصيل ──
      const gHtml = (d.goals?.length)
        ? d.goals.map(g => `<div class="event-row">
            <span class="ev-min">${g.minute||''}'</span>
            <span class="ev-icon">${g.type==='OG'?'🔵':'⚽'}</span>
            <div class="ev-body"><div class="ev-player">${g.player||''}</div><div class="ev-detail">${g.team||''}</div></div>
          </div>`).join('')
        : `<div style="padding:.9rem;color:var(--text2);font-size:.82rem">لا توجد أهداف</div>`;

      const cHtml = (d.cards?.length)
        ? d.cards.map(c => `<div class="event-row">
            <span class="ev-min">${c.minute||''}'</span>
            <span class="ev-icon">${c.type?.includes('Red')?'🟥':'🟨'}</span>
            <div class="ev-body"><div class="ev-player">${c.player||''}</div><div class="ev-detail">${c.team||''}</div></div>
          </div>`).join('')
        : `<div style="padding:.9rem;color:var(--text2);font-size:.82rem">لا توجد بطاقات</div>`;

      document.getElementById('tab-details').innerHTML = `
        <div class="divider"></div>
        <div class="section-card">
          <div class="sec-title">⚽ الأهداف</div>${gHtml}
        </div>
        <div class="divider"></div>
        <div class="section-card">
          <div class="sec-title">🟨 البطاقات</div>${cHtml}
        </div>`;

      // ── Tab: التشكيلات ──
      const hStarters = (d.homeLineup||[]).filter(p=>p.starter);
      const hSubs     = (d.homeLineup||[]).filter(p=>!p.starter);
      const aStarters = (d.awayLineup||[]).filter(p=>p.starter);
      const aSubs     = (d.awayLineup||[]).filter(p=>!p.starter);

      function buildLineup(starters, subs, formation) {
        if (!starters.length) return `<div style="padding:.9rem;color:var(--text2);font-size:.82rem">لا توجد تشكيلة</div>`;
        return (formation ? `<div class="formation-row">${formation}</div>` : '') +
          starters.map(p => `<div class="player-row">
            <span class="player-num">${p.jersey||p.num||''}</span>
            <span class="player-name">${p.name||''}</span>
            <span class="player-pos">${p.position||''}</span>
          </div>`).join('') +
          (subs.length ? `<div class="bench-header">الاحتياطيون</div>`+subs.map(p=>
            `<div class="player-row sub"><span class="player-num">${p.jersey||p.num||''}</span><span class="player-name">${p.name||''}</span><span class="player-pos">${p.position||''}</span></div>`
          ).join('') : '');
      }

      document.getElementById('tab-lineup').innerHTML = `
        <div class="lineup-switcher">
          <button class="lineup-team-btn active" id="lbh">${d.homeTeam}</button>
          <button class="lineup-team-btn" id="lba">${d.awayTeam}</button>
        </div>
        <div class="section-card" id="lp-home">${buildLineup(hStarters,hSubs,d.homeFormation)}</div>
        <div class="section-card hidden" id="lp-away">${buildLineup(aStarters,aSubs,d.awayFormation)}</div>`;

      document.getElementById('lbh')?.addEventListener('click',()=>{
        document.getElementById('lbh').classList.add('active');
        document.getElementById('lba').classList.remove('active');
        document.getElementById('lp-home').classList.remove('hidden');
        document.getElementById('lp-away').classList.add('hidden');
      });
      document.getElementById('lba')?.addEventListener('click',()=>{
        document.getElementById('lba').classList.add('active');
        document.getElementById('lbh').classList.remove('active');
        document.getElementById('lp-away').classList.remove('hidden');
        document.getElementById('lp-home').classList.add('hidden');
      });

      // ── Tab: الإحصائيات ──
      if (d.homeStats?.length) {
        const statsHtml = d.homeStats.map((s,i) => {
          const as = d.awayStats?.[i];
          const hv = parseFloat(s.value)||0, av = parseFloat(as?.value)||0;
          const tot = hv+av||1;
          const hp  = Math.round(hv/tot*100), ap = 100-hp;
          return `<div class="stat-item">
            <div class="stat-vals">
              <div class="stat-home">${s.value}</div>
              <div class="stat-name">${s.name}</div>
              <div class="stat-away">${as?.value||'-'}</div>
            </div>
            <div class="stat-bars">
              <div class="stat-bar"><div class="stat-fill-home" style="width:${hp}%"></div></div>
              <div class="stat-bar"><div class="stat-fill-away" style="width:${ap}%"></div></div>
            </div>
          </div>`;
        }).join('');
        document.getElementById('tab-stats').innerHTML = `<div class="divider"></div><div class="section-card">${statsHtml}</div>`;
      } else {
        document.getElementById('tab-stats').innerHTML = `<div class="empty-state"><div class="empty-icon">📊</div><p>لا توجد إحصائيات</p></div>`;
      }

      // ── Tab: الأحداث ──
      const all = [
        ...(d.goals||[]).map(e=>({...e,kind:'goal'})),
        ...(d.cards||[]).map(e=>({...e,kind:'card'})),
        ...(d.subs ||[]).map(e=>({...e,kind:'sub'})),
      ].sort((a,b)=>(parseInt(a.minute)||0)-(parseInt(b.minute)||0));

      function renderEvs(filter) {
        const list = filter==='all' ? all : all.filter(e=>e.kind===filter);
        if (!list.length) return `<div style="padding:.9rem;color:var(--text2);font-size:.82rem">لا توجد أحداث</div>`;
        return list.map(e => {
          let icon='⚽', name=e.player||e.name||'', det=e.team||'';
          if (e.kind==='card') icon = e.type?.includes('Red')?'🟥':'🟨';
          if (e.kind==='sub')  { icon='🔄'; name=''; det=`${e.playerIn||''} ← ${e.playerOut||''} (${e.team||''})`; }
          return `<div class="event-row">
            <span class="ev-min">${e.minute||''}'</span>
            <span class="ev-icon">${icon}</span>
            <div class="ev-body">
              ${name?`<div class="ev-player">${name}</div>`:''}
              <div class="ev-detail">${det}</div>
            </div>
          </div>`;
        }).join('');
      }

      document.getElementById('tab-events').innerHTML = `
        <div class="ev-filter-bar">
          <button class="ev-btn active" data-ev="all">الكل</button>
          <button class="ev-btn" data-ev="goal">⚽ الأهداف</button>
          <button class="ev-btn" data-ev="card">🟨 البطاقات</button>
          <button class="ev-btn" data-ev="sub">🔄 تبديلات</button>
        </div>
        <div class="section-card" id="ev-list">${renderEvs('all')}</div>`;

      document.querySelectorAll('.ev-btn').forEach(b =>
        b.addEventListener('click', () => {
          document.querySelectorAll('.ev-btn').forEach(x=>x.classList.remove('active'));
          b.classList.add('active');
          document.getElementById('ev-list').innerHTML = renderEvs(b.dataset.ev);
        })
      );

      if (isLive) {
        setRefresh(true);
        clearTimeout(refreshTimer);
        refreshTimer = setTimeout(loadMatch, randomMs(2, 3));
      }

    } catch (e) {
      document.getElementById('match-hero').innerHTML = `
        <div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل المباراة</p><p style="font-size:.72rem;color:var(--text2)">${e.message}</p></div>`;
    }
  }

  loadMatch();
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: LEAGUE
// ═══════════════════════════════════════════════════════════════════════════════
if (PAGE === 'league') {
  const p          = new URLSearchParams(location.search);
  const leagueCode = p.get('code') || 'eng.1';
  let   curSeason  = '';

  document.querySelectorAll('#league-tabs .detail-tab').forEach(t =>
    t.addEventListener('click', () => {
      document.querySelectorAll('#league-tabs .detail-tab').forEach(x=>x.classList.remove('active'));
      t.classList.add('active');
      document.querySelectorAll('.tab-panel').forEach(x=>x.classList.remove('active'));
      document.getElementById(`tab-${t.dataset.tab}`)?.classList.add('active');
      if (t.dataset.tab==='standings') loadStandings();
      if (t.dataset.tab==='scorers')   loadScorers();
      if (t.dataset.tab==='matches')   loadLeagueMatches();
    })
  );

  async function initLeague() {
    const info = leagueInfo(leagueCode);
    document.getElementById('league-hero').innerHTML = `
      <div class="league-hero">
        <div class="league-hero-logo" style="font-size:2.5rem;width:56px;text-align:center">${info.flag}</div>
        <div class="league-hero-info">
          <div class="league-hero-name">${info.name}</div>
          <div class="league-hero-country">${leagueCode}</div>
        </div>
      </div>`;

    const sel = document.getElementById('season-select');
    const yr  = new Date().getFullYear();
    sel.innerHTML = `<option value="">الموسم الحالي</option>`;
    for (let y = yr-1; y >= 2020; y--) sel.innerHTML += `<option value="${y}">${y}/${y+1}</option>`;
    document.getElementById('season-row').style.display = 'flex';
    sel.addEventListener('change', () => {
      curSeason = sel.value;
      loadStandings(); loadScorers();
    });

    document.getElementById('league-tabs').style.display = 'flex';
    loadStandings();
  }

  async function loadStandings() {
    const c = document.getElementById('tab-standings');
    c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
    try {
      let data;
      if (curSeason && isHistoricalSeason(curSeason))
        data = await netlifyFetch(`/data/standings/${leagueCode}/${curSeason}.json`);
      else
        data = await apiFetch(`/api/standings?league=${leagueCode}${curSeason?'&season='+curSeason:''}`);
      if (!data) { c.innerHTML=noData(); return; }

      function tbl(entries) {
        const seen = new Map();
        entries.forEach(e => { if (e.qualColor&&e.qualLabel&&!seen.has(e.qualColor)) seen.set(e.qualColor,e.qualLabel); });
        const legend = seen.size ? `<div class="qual-legend">${[...seen.entries()].map(([cl,lb])=>`<div class="ql-item"><span class="ql-dot" style="background:${cl}"></span>${lb}</div>`).join('')}</div>` : '';
        const rows = entries.map(e => `<tr style="${e.qualColor?`border-right:3px solid ${e.qualColor}`:''}">
          <td><span class="rank-no">${e.rank}</span></td>
          <td><div class="team-cell">${e.logo?`<img class="t-logo" src="${e.logo}" onerror="this.style.display='none'">`:''}<span>${e.team}</span></div></td>
          <td>${e.gp}</td><td>${e.w}</td><td>${e.d}</td><td>${e.l}</td>
          <td>${e.gd>0?'+':''}${e.gd}</td>
          <td class="pts-cell">${e.pts}</td>
        </tr>`).join('');
        return `<div class="section-card standings-wrap"><table class="std-table">
          <thead><tr><th>#</th><th>الفريق</th><th>لع</th><th>ف</th><th>ت</th><th>خ</th><th>فا</th><th>نق</th></tr></thead>
          <tbody>${rows}</tbody></table>${legend}</div>`;
      }

      let html = '<div class="divider"></div>';
      if (data.isGrouped && data.groups?.length)
        data.groups.forEach(g => { html += `<div class="sec-title">${g.name}</div>${tbl(g.entries||[])}<div class="divider"></div>`; });
      else
        html += tbl(data.entries||[]);

      c.innerHTML = html;
    } catch { c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل الترتيب</p></div>`; }
  }

  async function loadScorers() {
    const c = document.getElementById('tab-scorers');
    c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
    try {
      let data;
      if (curSeason && isHistoricalSeason(curSeason))
        data = await netlifyFetch(`/data/scorers/${leagueCode}/${curSeason}.json`);
      else
        data = await apiFetch(`/api/scorers?league=${leagueCode}${curSeason?'&season='+curSeason:''}`);
      if (!data?.scorers?.length) { c.innerHTML=noData('⚽'); return; }

      const rankClass = i => i===1?'gold':i===2?'silver':i===3?'bronze':'';
      const rows = data.scorers.map(s => `
        <div class="scorer-row">
          <div class="scorer-rank ${rankClass(s.rank)}">${s.rank}</div>
          ${s.photo?`<img class="scorer-photo" src="${s.photo}" onerror="this.style.background='var(--bg3)'">` : '<div class="scorer-photo"></div>'}
          <div class="scorer-info">
            <div class="scorer-name">${s.name}</div>
            <div class="scorer-team">
              ${s.teamLogo?`<img style="width:14px;height:14px;object-fit:contain" src="${s.teamLogo}" onerror="this.style.display='none'">` : ''}
              ${s.team}
            </div>
          </div>
          <div class="scorer-goals">${s.goals}</div>
        </div>`).join('');

      c.innerHTML = `<div class="divider"></div><div class="section-card">${rows}</div>`;
    } catch { c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ</p></div>`; }
  }

  async function loadLeagueMatches() {
    const c = document.getElementById('tab-matches');
    c.innerHTML = `<div class="loading-spinner"><div class="spinner"></div></div>`;
    try {
      const dates = [offsetDate(-1), todayStr(), offsetDate(1)];
      const results = await Promise.allSettled(
        dates.map(d => apiFetch(`/api/matches?date=${d}&league=${leagueCode}`))
      );
      const seen = new Set();
      const list = results.flatMap(r =>
        r.status === 'fulfilled' ? (r.value.matches || []) : []
      ).filter(m => {
        if (seen.has(m.id)) return false;
        seen.add(m.id); return true;
      }).sort((a, b) => new Date(a.date) - new Date(b.date));

      if (!list.length) { c.innerHTML = noData('📅'); return; }

      function matchRow(m) {
        const live = m.status === 'in';
        return `<div class="match-card ${live?'live-card':''}" onclick="location.href='/match.html?id=${m.id}&league=${m.league}'">
          <div class="mc-row">
            <div class="mc-status">
              ${live ? `<div class="mc-live-badge">مباشر</div><div class="mc-minute">${m.minute||''}'</div>`
                     : m.status==='post' ? `<div class="mc-ended">انتهت</div>`
                     : `<div class="mc-time">${fmtTime(m.date)}</div>`}
            </div>
            <div class="mc-team">
              ${m.homeLogo?`<img class="mc-logo" src="${m.homeLogo}" onerror="this.style.display='none'">` : ''}
              <span class="mc-team-name">${m.homeTeam}</span>
            </div>
            <div class="mc-score">
              ${m.status==='pre'
                ? `<div class="mc-score-dash">-:-</div>`
                : `<div class="mc-score-val ${live?'live':''}">${m.homeScore} - ${m.awayScore}</div>`}
            </div>
            <div class="mc-team away">
              ${m.awayLogo?`<img class="mc-logo" src="${m.awayLogo}" onerror="this.style.display='none'">` : ''}
              <span class="mc-team-name">${m.awayTeam}</span>
            </div>
          </div>
        </div>`;
      }

      const byDay = {};
      list.forEach(m => {
        const day = m.date.slice(0, 10);
        if (!byDay[day]) byDay[day] = [];
        byDay[day].push(m);
      });
      const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
      let html = '';
      for (const [day, dayMatches] of Object.entries(byDay)) {
        const dt = new Date(day);
        html += `<div class="fixture-day" style="padding:.5rem 1rem;font-size:.78rem;color:var(--text2)">
          ${todayLabel(day.replace(/-/g,''))} — ${dt.getDate()} ${months[dt.getMonth()]}
        </div><div class="section-card">${dayMatches.map(matchRow).join('')}</div><div class="divider"></div>`;
      }
      c.innerHTML = html;
    } catch { c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ</p></div>`; }
  }

  function noData(icon='📭') {
    return `<div class="empty-state"><div class="empty-icon">${icon}</div><p>لا توجد بيانات</p></div>`;
  }

  initLeague();
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE: FIXTURES
// ═══════════════════════════════════════════════════════════════════════════════
if (PAGE === 'fixtures') {
  const days   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const months = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

  async function loadFixtures() {
    const c = document.getElementById('fixtures-container');
    try {
      const data = await apiFetch('/api/fixtures');
      if (!data.matches?.length) {
        c.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><p>لا توجد مباريات قادمة</p></div>`;
        return;
      }
      const byDay = {};
      data.matches.forEach(m => {
        const k = m.date.slice(0,10);
        if (!byDay[k]) byDay[k] = [];
        byDay[k].push(m);
      });
      let html = '';
      for (const [day, list] of Object.entries(byDay)) {
        const dt = new Date(day);
        html += `<div class="fixture-day">${days[dt.getDay()]} ${dt.getDate()} ${months[dt.getMonth()]} ${dt.getFullYear()}</div>
          <div class="section-card">
          ${list.map(m=>`<div class="match-card" onclick="location.href='/match.html?id=${m.id}&league=${m.league}'">
            <div class="mc-row">
              <div class="mc-status"><div class="mc-time">${fmtTime(m.date)}</div></div>
              <div class="mc-team">${m.homeLogo?`<img class="mc-logo" src="${m.homeLogo}" onerror="this.style.display='none'">` : ''}<span class="mc-team-name">${m.homeTeam}</span></div>
              <div class="mc-score"><div class="mc-score-dash">-:-</div></div>
              <div class="mc-team away">${m.awayLogo?`<img class="mc-logo" src="${m.awayLogo}" onerror="this.style.display='none'">` : ''}<span class="mc-team-name">${m.awayTeam}</span></div>
            </div>
          </div>`).join('')}
          </div><div class="divider"></div>`;
      }
      c.innerHTML = html;
    } catch(e) {
      c.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في التحميل</p></div>`;
    }
  }
  loadFixtures();
}
