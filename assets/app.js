const WORKER_URL = 'https://football-worker.mahdijadir38.workers.dev';

const page = document.body.dataset.page;
let refreshTimer = null;

// ─── Date Helpers ────────────────────────────────────────────────────────────

function todayDate() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function offsetDate(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
}

function formatMatchTime(isoDate) {
  return new Date(isoDate).toLocaleTimeString('ar-EG', { hour:'2-digit', minute:'2-digit' });
}

function randomRefreshMs() {
  return (2 + Math.random() * 1.5) * 60 * 1000;
}

// ─── API Fetch ───────────────────────────────────────────────────────────────

async function apiFetch(path) {
  const res = await fetch(`${WORKER_URL}${path}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function statusBadge(m) {
  if (m.status === 'in') {
    const t = m.minute || m.statusText || 'LIVE';
    return `<span class="status-badge badge-live">🔴 ${t}</span>`;
  }
  if (m.status === 'post') return `<span class="status-badge badge-finished">${m.statusText || 'انتهت'}</span>`;
  return `<span class="status-badge badge-pre">${formatMatchTime(m.date)}</span>`;
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function matchCard(m) {
  const scoreOrTime = m.status === 'pre'
    ? `<span style="font-size:.8rem;color:var(--text2)">${formatMatchTime(m.date)}</span>`
    : `<div class="score-box"><span>${m.homeScore}</span><span class="score-sep">—</span><span>${m.awayScore}</span></div>`;

  const link = `/match?id=${m.id}&league=${m.league}`;

  return `
<div class="match-card ${m.status==='in'?'live-card':''}" data-status="${m.status}" onclick="location.href='${link}'">
  <div class="team-side">
    ${m.homeLogo ? `<img class="team-logo" src="${m.homeLogo}" alt="${m.homeTeam}" onerror="this.style.display='none'">` : ''}
    <span class="team-name">${m.homeTeam}</span>
  </div>
  <div class="match-center">
    ${scoreOrTime}
    ${statusBadge(m)}
  </div>
  <div class="team-side away">
    ${m.awayLogo ? `<img class="team-logo" src="${m.awayLogo}" alt="${m.awayTeam}" onerror="this.style.display='none'">` : ''}
    <span class="team-name">${m.awayTeam}</span>
  </div>
</div>`;
}

// ─── Load Matches ─────────────────────────────────────────────────────────────

async function loadMatches(date, league) {
  const container = document.getElementById('matches-container');
  if (!container) return;

  if (!container.dataset.loaded) {
    container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><div>جارٍ تحميل المباريات...</div></div>`;
  }

  try {
    const leagueParam = (league && league !== 'all') ? `&league=${league}` : '';
    const data = await apiFetch(`/api/matches?date=${date}${leagueParam}`);

    if (!data.matches?.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚽</div><p>لا توجد مباريات في هذا اليوم</p></div>`;
      container.dataset.loaded = '1';
      return;
    }

    // ── التجميع بـ leagueId (مفتاح فريد لكل بطولة من uid) ────────────────────
    // leagueId = "606" لكأس العالم، "775" لأبطال أوروبا، "700" للإنجليزي...
    // بدلاً من season.slug الذي يكون "group-stage" لعشرات البطولات المختلفة
    const grouped = {};
    data.matches.forEach(m => {
      const key = m.leagueId || m.league || 'other';
      if (!grouped[key]) {
        grouped[key] = {
          leagueName: m.leagueName,      // "🌍 كأس العالم FIFA 2026 - دور المجموعات"
          leagueFlag: m.leagueFlag || '⚽',
          leagueNameOnly: m.leagueNameOnly || m.leagueName,
          leagueStage: m.leagueStage || '',
          leagueYear:  m.leagueYear  || '',
          matches: [],
        };
      }
      grouped[key].matches.push(m);
    });

    let html = '';
    for (const [, info] of Object.entries(grouped)) {
      html += `<div class="league-section">
        <div class="league-header">
          <span class="league-header-main">
            <span class="league-flag">${info.leagueFlag}</span>
            <span class="league-title">${info.leagueNameOnly}</span>
            ${info.leagueYear ? `<span class="league-year">${info.leagueYear}</span>` : ''}
          </span>
          ${info.leagueStage ? `<span class="league-stage">${info.leagueStage}</span>` : ''}
        </div>
        ${info.matches.map(matchCard).join('')}
      </div>`;
    }

    container.innerHTML = html;
    container.dataset.loaded = '1';

    const hasLive = data.matches.some(m => m.status === 'in');
    updateRefreshBar(hasLive);

    if (hasLive) {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(() => loadMatches(date, league), randomRefreshMs());
    } else {
      updateRefreshBar(false);
    }

  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل البيانات</p><p style="font-size:.8rem;color:var(--text2)">${e.message}</p></div>`;
  }
}

function updateRefreshBar(active) {
  const bar = document.getElementById('refresh-bar');
  if (!bar) return;
  if (active) {
    bar.innerHTML = `<span class="refresh-dot"></span> يتجدد تلقائياً كل 2-3 دقائق`;
    bar.classList.add('visible');
  } else {
    bar.classList.remove('visible');
  }
}

// ─── Load Match Details ───────────────────────────────────────────────────────

async function loadMatch() {
  const container = document.getElementById('match-container');
  if (!container) return;

  const params  = new URLSearchParams(location.search);
  const matchId = params.get('id');
  const league  = params.get('league') || '';
  if (!matchId) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>معرّف المباراة مفقود</p></div>`;
    return;
  }

  if (!container.dataset.loaded) {
    container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><div>جارٍ تحميل التفاصيل...</div></div>`;
  }

  try {
    const d = await apiFetch(`/api/summary?matchId=${matchId}&league=${league}`);
    container.dataset.loaded = '1';

    document.title = `${d.homeTeam} vs ${d.awayTeam} ${d.homeScore}-${d.awayScore} | كورة لايف`;

    const goalsHtml = d.goals?.length
      ? d.goals.map(g => `<div class="event-row"><span class="event-clock">${g.minute||''}</span><span class="event-icon">${g.type==='OG'?'🔵':'⚽'}</span><span>${g.player||''} <span style="color:var(--text2);font-size:.8rem">(${g.team||''})</span></span></div>`).join('')
      : `<div class="event-row" style="color:var(--text2)">لا توجد أهداف</div>`;

    const cardsHtml = d.cards?.length
      ? d.cards.map(c => `<div class="event-row"><span class="event-clock">${c.minute||''}</span><span class="event-icon">${c.type?.includes('Red')?'🟥':'🟨'}</span><span>${c.player||''} <span style="color:var(--text2);font-size:.8rem">(${c.team||''})</span></span></div>`).join('')
      : `<div class="event-row" style="color:var(--text2)">لا توجد بطاقات</div>`;

    const subsHtml = d.subs?.length
      ? d.subs.map(s => `<div class="event-row"><span class="event-clock">${s.minute||''}</span><span class="event-icon">🔄</span><span style="color:var(--green)">${s.playerIn||''}</span> ← <span style="color:var(--text2)">${s.playerOut||''}</span> <span style="font-size:.75rem;color:var(--text2)">(${s.team||''})</span></div>`).join('')
      : `<div class="event-row" style="color:var(--text2)">لا توجد تبديلات</div>`;

    const statsHtml = d.homeStats?.length
      ? d.homeStats.map((s, i) => {
          const as = d.awayStats?.[i];
          return `<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:.5rem;padding:.45rem 1rem;border-bottom:1px solid var(--border);font-size:.82rem">
            <span style="text-align:right;font-weight:600">${s.value}</span>
            <span style="color:var(--text2);font-size:.72rem;text-align:center">${s.name}</span>
            <span style="text-align:left;font-weight:600">${as?.value||''}</span>
          </div>`;
        }).join('')
      : '<div style="padding:1rem;color:var(--text2)">لا توجد إحصائيات</div>';

    const lineupBlock = (lineup, title) => {
      if (!lineup?.length) return '';
      const starters = lineup.filter(p => p.starter);
      const subs     = lineup.filter(p => !p.starter);
      return `<div class="section-card">
        <div class="section-card-title">${title}</div>
        ${starters.map(p => `<div class="event-row"><span class="event-icon">⬛</span><span>${p.name||''}</span><span style="color:var(--text2);font-size:.72rem;margin-right:auto">${p.position||''}</span></div>`).join('')}
        ${subs.length ? `<div style="padding:.3rem 1rem;font-size:.72rem;color:var(--text2);background:var(--bg3)">الاحتياطيون</div>` : ''}
        ${subs.map(p => `<div class="event-row" style="opacity:.7"><span class="event-icon">⬜</span><span>${p.name||''}</span><span style="color:var(--text2);font-size:.72rem;margin-right:auto">${p.position||''}</span></div>`).join('')}
      </div>`;
    };

    container.innerHTML = `
      <div class="match-hero">
        <div style="font-size:.85rem;color:var(--text2);margin-bottom:.5rem">${d.leagueName||''} ${d.round?'· '+d.round:''}</div>
        ${d.advancement ? `<div style="color:var(--green);font-size:.85rem;font-weight:700;margin-bottom:.4rem">🏆 تأهل: ${d.advancement}</div>` : ''}
        ${d.penaltyWinner ? `<div style="color:var(--orange);font-size:.85rem;font-weight:700;margin-bottom:.4rem">⚽ ركلات ترجيح — فاز: ${d.penaltyWinner}</div>` : ''}
        <div class="hero-teams">
          <div class="hero-team">
            ${d.homeLogo ? `<img class="hero-logo" src="${d.homeLogo}" alt="${d.homeTeam}" onerror="this.style.display='none'">` : ''}
            <div class="hero-team-name">${d.homeTeam}</div>
          </div>
          <div class="hero-score">${d.homeScore} — ${d.awayScore}</div>
          <div class="hero-team">
            ${d.awayLogo ? `<img class="hero-logo" src="${d.awayLogo}" alt="${d.awayTeam}" onerror="this.style.display='none'">` : ''}
            <div class="hero-team-name">${d.awayTeam}</div>
          </div>
        </div>
        <div>${statusBadge(d)}</div>
        ${d.venue  ? `<div style="font-size:.8rem;color:var(--text2);margin-top:.5rem">🏟️ ${d.venue}</div>` : ''}
        ${d.season ? `<div style="font-size:.75rem;color:var(--text2)">الموسم ${d.season}</div>` : ''}
      </div>

      <div class="section-card">
        <div class="section-card-title">⚽ الأهداف</div>
        ${goalsHtml}
      </div>
      <div class="section-card">
        <div class="section-card-title">🟨 البطاقات</div>
        ${cardsHtml}
      </div>
      <div class="section-card">
        <div class="section-card-title">🔄 التبديلات</div>
        ${subsHtml}
      </div>
      <div class="section-card">
        <div class="section-card-title">📊 الإحصائيات</div>
        <div style="display:grid;grid-template-columns:1fr auto 1fr;padding:.4rem 1rem;font-size:.75rem;color:var(--text2)">
          <span style="text-align:right">${d.homeTeam}</span><span></span><span style="text-align:left">${d.awayTeam}</span>
        </div>
        ${statsHtml}
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        ${lineupBlock(d.homeLineup, `تشكيلة ${d.homeTeam}`)}
        ${lineupBlock(d.awayLineup, `تشكيلة ${d.awayTeam}`)}
      </div>

      <div style="margin-top:1rem;font-size:.8rem;color:var(--text2);text-align:center">
        <a href="${WORKER_URL}/page/match/${matchId}/${league}" target="_blank" style="color:var(--text2)">🔗 صفحة SEO للمباراة</a>
      </div>`;

    if (d.status === 'in') {
      clearTimeout(refreshTimer);
      refreshTimer = setTimeout(loadMatch, randomRefreshMs());
    }

  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل التفاصيل</p><p style="font-size:.8rem;color:var(--text2)">${e.message}</p></div>`;
  }
}

// ─── Load Standings ───────────────────────────────────────────────────────────

function buildStandingsTable(entries, leagueName, season) {
  const rows = entries.map(e => {
    const barStyle = e.qualColor
      ? `border-right:3px solid ${e.qualColor};`
      : 'border-right:3px solid transparent;';
    const title = e.qualLabel ? `title="${e.qualLabel}"` : '';
    return `
      <tr ${title} style="${barStyle}cursor:${e.qualLabel?'help':'default'}">
        <td><span class="rank-num">${e.rank}</span></td>
        <td><div class="team-cell">
          ${e.logo ? `<img class="table-logo" src="${e.logo}" alt="${e.team}" onerror="this.style.display='none'">` : ''}
          <span>${e.team}</span>
        </div></td>
        <td>${e.gp}</td>
        <td style="color:var(--green)">${e.w}</td>
        <td>${e.d}</td>
        <td style="color:var(--red)">${e.l}</td>
        <td style="color:${e.gd>=0?'var(--green)':'var(--red)'}">${e.gd>0?'+':''}${e.gd}</td>
        <td class="points-cell">${e.pts}</td>
      </tr>`;
  }).join('');

  return `
    <table class="standings-table">
      <thead><tr>
        <th>#</th><th style="text-align:right">الفريق</th>
        <th>لع</th><th>ف</th><th>ت</th><th>خ</th><th>فا</th><th>نق</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function buildQualLegend(entries) {
  const seen = new Map();
  entries.forEach(e => {
    if (e.qualColor && e.qualLabel && !seen.has(e.qualColor)) {
      seen.set(e.qualColor, e.qualLabel);
    }
  });
  if (!seen.size) return '';
  const items = [...seen.entries()].map(([color, label]) =>
    `<span style="display:inline-flex;align-items:center;gap:.35rem;margin:.2rem .4rem;font-size:.75rem;color:var(--text2)">
      <span style="width:10px;height:10px;border-radius:50%;background:${color};display:inline-block"></span>${label}
    </span>`).join('');
  return `<div style="display:flex;flex-wrap:wrap;padding:.5rem 1rem;border-top:1px solid var(--border)">${items}</div>`;
}

async function loadStandings(league, season) {
  const container = document.getElementById('standings-container');
  if (!container) return;
  container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><div>جارٍ التحميل...</div></div>`;

  try {
    const seasonParam = season ? `&season=${season}` : '';
    const data = await apiFetch(`/api/standings?league=${league}${seasonParam}`);
    const title = `${data.leagueName || ''} — ${data.season || 'الموسم الحالي'}`;

    // ── Grouped tournament (UCL, World Cup Qualifiers, etc.) ──────────────────
    if (data.isGrouped && data.groups?.length) {
      let html = '';
      data.groups.forEach(g => {
        const allEntries = g.entries || [];
        const legend = buildQualLegend(allEntries);
        html += `
          <div class="section-card" style="margin-bottom:1rem">
            <div class="section-card-title">${g.name || 'المجموعة'}</div>
            ${buildStandingsTable(allEntries)}
            ${legend}
          </div>`;
      });
      container.innerHTML = `<div style="font-size:.9rem;color:var(--text2);margin-bottom:.8rem">${title}</div>${html}`;
      return;
    }

    // ── Flat league standings ─────────────────────────────────────────────────
    if (!data.entries?.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📋</div><p>لا توجد بيانات للترتيب</p></div>`;
      return;
    }

    const legend = buildQualLegend(data.entries);
    container.innerHTML = `
      <div class="section-card">
        <div class="section-card-title">${title}</div>
        ${buildStandingsTable(data.entries)}
        ${legend}
      </div>`;

  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل الترتيب</p><p style="font-size:.8rem;color:var(--text2)">${e.message}</p></div>`;
  }
}

// ─── Load Scorers ─────────────────────────────────────────────────────────────

async function loadScorers(league, season) {
  const container = document.getElementById('scorers-container');
  if (!container) return;
  container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><div>جارٍ التحميل...</div></div>`;

  try {
    const seasonParam = season ? `&season=${season}` : '';
    const data = await apiFetch(`/api/scorers?league=${league}${seasonParam}`);

    if (!data.scorers?.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🥅</div><p>لا توجد بيانات للهدافين</p></div>`;
      return;
    }

    const cards = data.scorers.map(s => `
      <div class="scorer-card">
        <div class="scorer-rank">${s.rank}</div>
        ${s.photo
          ? `<img class="scorer-photo" src="${s.photo}" alt="${s.name}" onerror="this.style.background='var(--bg3)';this.style.display='block'">`
          : `<div class="scorer-photo"></div>`}
        <div class="scorer-info">
          <div class="scorer-name">${s.name}</div>
          <div class="scorer-team">
            ${s.teamLogo ? `<img style="width:14px;height:14px;vertical-align:middle;margin-left:3px" src="${s.teamLogo}" onerror="this.style.display='none'">` : ''}
            ${s.team}
          </div>
        </div>
        <div class="scorer-goals">${s.goals}</div>
      </div>`).join('');

    container.innerHTML = `
      <div class="section-card">
        <div class="section-card-title">${data.leagueName} — ${data.season || 'الموسم الحالي'}</div>
        ${cards}
      </div>`;
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل الهدافين</p><p style="font-size:.8rem;color:var(--text2)">${e.message}</p></div>`;
  }
}

// ─── Load Fixtures ────────────────────────────────────────────────────────────

async function loadFixtures() {
  const container = document.getElementById('fixtures-container');
  if (!container) return;
  container.innerHTML = `<div class="loading-spinner"><div class="spinner"></div><div>جارٍ التحميل...</div></div>`;

  try {
    const data = await apiFetch('/api/fixtures');

    if (!data.matches?.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📅</div><p>لا توجد مباريات قادمة</p></div>`;
      return;
    }

    const byDay = {};
    data.matches.forEach(m => {
      const day = m.date.slice(0, 10);
      if (!byDay[day]) byDay[day] = [];
      byDay[day].push(m);
    });

    const daysAr   = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
    const monthsAr = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];

    let html = '';
    for (const [day, matches] of Object.entries(byDay)) {
      const d     = new Date(day);
      const label = `${daysAr[d.getDay()]} ${d.getDate()} ${monthsAr[d.getMonth()]}`;
      html += `<div class="league-section">
        <div class="league-header" style="background:var(--bg3)">${label}</div>
        ${matches.map(m => `
          <div class="fixture-card" onclick="location.href='/match?id=${m.id}&league=${m.league}'" style="cursor:pointer">
            <div class="team-side">
              ${m.homeLogo ? `<img class="team-logo" src="${m.homeLogo}" alt="${m.homeTeam}" onerror="this.style.display='none'">` : ''}
              <span class="team-name">${m.homeTeam}</span>
            </div>
            <div class="fixture-time">
              <div style="font-size:.7rem;color:var(--text2)">${m.leagueName||m.league}</div>
              <div>${formatMatchTime(m.date)}</div>
            </div>
            <div class="team-side away">
              ${m.awayLogo ? `<img class="team-logo" src="${m.awayLogo}" alt="${m.awayTeam}" onerror="this.style.display='none'">` : ''}
              <span class="team-name">${m.awayTeam}</span>
            </div>
          </div>`).join('')}
      </div>`;
    }

    const note = data.fetchedDays > 7
      ? `<div style="text-align:center;color:var(--text2);font-size:.8rem;margin-bottom:1rem">لا توجد مباريات في الأسبوع القادم — يعرض ${data.fetchedDays} يوماً</div>`
      : '';

    container.innerHTML = note + html;
  } catch (e) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>خطأ في تحميل المباريات القادمة</p><p style="font-size:.8rem;color:var(--text2)">${e.message}</p></div>`;
  }
}

// ─── Initialize Pages ─────────────────────────────────────────────────────────

if (page === 'matches') {
  let currentDate  = todayDate();
  let activeLeague = 'all';

  const fillDatePickers = () => {
    const dayEl   = document.getElementById('pick-day');
    const yearEl  = document.getElementById('pick-year');
    if (!dayEl || !yearEl) return;
    for (let d = 1; d <= 31; d++)
      dayEl.innerHTML += `<option value="${String(d).padStart(2,'0')}">${d}</option>`;
    const year = new Date().getFullYear();
    for (let y = year; y >= 2020; y--)
      yearEl.innerHTML += `<option value="${y}">${y}</option>`;
    const today = new Date();
    dayEl.value  = String(today.getDate()).padStart(2,'0');
    yearEl.value = String(today.getFullYear());
    const monthEl = document.getElementById('pick-month');
    if (monthEl) monthEl.value = String(today.getMonth()+1).padStart(2,'0');
  };

  const setActiveDateBtn = (id) => {
    ['btn-yesterday','btn-today','btn-tomorrow'].forEach(b => {
      document.getElementById(b)?.classList.toggle('active', b === id);
    });
  };

  fillDatePickers();
  loadMatches(currentDate, activeLeague);

  document.getElementById('btn-yesterday')?.addEventListener('click', () => {
    currentDate = offsetDate(-1); setActiveDateBtn('btn-yesterday');
    clearTimeout(refreshTimer); loadMatches(currentDate, activeLeague);
  });
  document.getElementById('btn-today')?.addEventListener('click', () => {
    currentDate = todayDate(); setActiveDateBtn('btn-today');
    clearTimeout(refreshTimer); loadMatches(currentDate, activeLeague);
  });
  document.getElementById('btn-tomorrow')?.addEventListener('click', () => {
    currentDate = offsetDate(1); setActiveDateBtn('btn-tomorrow');
    clearTimeout(refreshTimer); loadMatches(currentDate, activeLeague);
  });
  document.getElementById('btn-go-date')?.addEventListener('click', () => {
    const y = document.getElementById('pick-year')?.value;
    const m = document.getElementById('pick-month')?.value;
    const d = document.getElementById('pick-day')?.value;
    if (y && m && d) {
      currentDate = `${y}${m}${d}`;
      setActiveDateBtn(null);
      clearTimeout(refreshTimer);
      loadMatches(currentDate, activeLeague);
    }
  });

  document.querySelectorAll('.sidebar-league').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sidebar-league').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeLeague = btn.dataset.league;
      clearTimeout(refreshTimer);
      loadMatches(currentDate, activeLeague);
    });
  });

  // ── فلتر الحالة (الكل / مباشر / انتهت / القادمة) ──────────────────────────
  let activeStatusFilter = 'all';

  function applyStatusFilter(filter) {
    activeStatusFilter = filter;

    // تحديث أزرار الفلتر
    document.querySelectorAll('.filter-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.filter === filter);
    });

    // إخفاء/إظهار بطاقات المباريات
    document.querySelectorAll('.match-card').forEach(card => {
      const st = card.dataset.status || '';
      const show = filter === 'all' || st === filter;
      card.style.display = show ? '' : 'none';
    });

    // إخفاء أقسام الدوريات الفارغة (كل بطاقاتها مخفية)
    document.querySelectorAll('.league-section').forEach(section => {
      const visible = [...section.querySelectorAll('.match-card')]
        .some(c => c.style.display !== 'none');
      section.style.display = visible ? '' : 'none';
    });
  }

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => applyStatusFilter(btn.dataset.filter));
  });
}

if (page === 'match')    loadMatch();
if (page === 'fixtures') loadFixtures();
