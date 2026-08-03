/* ============================================================
   views-core.js — dashboard, track browser, rubric, scratch pad,
   and the profile/data screen.
   ============================================================ */

import { TRACKS, getTrack, challengesByTier, DIFFICULTY, totalObtainableXp, caseCount } from '../data/curriculum.js';
import { ASSESSMENTS, RUBRIC_DIMENSIONS, RUBRIC_WEIGHTS, GRADE_BANDS, gradeFor } from '../data/assessments.js';
import * as store from './store.js';
import { md, escapeHtml, diffDots, radar, heatmap, scoreRing, toast, modal, relativeTime, render } from './ui.js';
import { createEditor, monacoLanguage } from './editor.js';
import { runScratch, buildPreviewDocument } from './runner.js';
import { showCoach } from './coach.js';

/* ------------------------------------------------------------------ shared */

function challengeStatus(challengeId) {
  const record = store.attemptFor(challengeId);
  if (!record) return { state: 'new', score: null };
  if (record.cleared) return { state: 'done', score: record.bestScore };
  return { state: 'partial', score: record.bestScore };
}

function statusMark(status) {
  if (status.state === 'done') return '<div class="challenge-status done">✓</div>';
  if (status.state === 'partial') return '<div class="challenge-status partial">◑</div>';
  return '<div class="challenge-status"></div>';
}

/**
 * The next thing worth doing.
 * Lessons come first — you should not be graded on material you have not met.
 * Only once a course's lessons are done do we point at its challenges.
 */
export function recommendation() {
  const chosen = store.profile().courses || [];
  const inPlan = (track) => (chosen.length ? chosen.includes(track.id) : true);

  // 1. An unfinished lesson, in a chosen course, most-advanced first.
  const byLessonProgress = TRACKS.filter(inPlan)
    .map((track) => ({ track, stats: store.lessonStats(track) }))
    .filter(({ stats }) => stats.done < stats.total)
    .sort((a, b) => b.stats.completion - a.stats.completion);

  for (const { track } of byLessonProgress) {
    const lesson = (track.lessons || []).find((l) => !store.isLessonDone(l.id));
    if (lesson) return { kind: 'lesson', track, lesson };
  }

  // 2. Otherwise the next uncleared challenge.
  const byChallengeProgress = TRACKS.filter(inPlan)
    .map((track) => ({ track, stats: store.trackStats(track) }))
    .filter(({ stats }) => stats.cleared < stats.total)
    .sort((a, b) => b.stats.completion - a.stats.completion);

  for (const { track } of byChallengeProgress) {
    for (const group of challengesByTier(track)) {
      for (const challenge of group.challenges) {
        if (challengeStatus(challenge.id).state !== 'done') {
          return { kind: 'challenge', track, challenge };
        }
      }
    }
  }
  return null;
}

/* --------------------------------------------------------------- dashboard */

export function renderDashboard(host) {
  const state = store.getState();
  const level = store.levelInfo(state.xp);
  const streak = store.liveStreak();

  const overall = TRACKS.reduce(
    (acc, track) => {
      const stats = store.trackStats(track);
      acc.cleared += stats.cleared;
      acc.total += stats.total;
      return acc;
    },
    { cleared: 0, total: 0 }
  );

  const mastery = store.masteryTable();
  const top = mastery.slice(0, 8);
  const weakest = [...mastery].reverse().slice(0, 5);
  const next = recommendation();

  const scored = Object.values(state.attempts).filter((a) => a.attempts > 0);
  const averageBest = scored.length
    ? Math.round(scored.reduce((sum, a) => sum + a.bestScore, 0) / scored.length)
    : null;

  const totalLessons = TRACKS.reduce((n, t) => n + (t.lessons || []).length, 0);
  const lessonsDone = TRACKS.reduce((n, t) => n + store.lessonStats(t).done, 0);
  const profile = store.profile();

  const html = `
    ${state.xp === 0 ? `
    <div class="card" style="margin-bottom:20px;border-color:var(--gold);background:linear-gradient(135deg, var(--bg-panel) 0%, rgba(224,170,80,0.06) 100%)">
      <div style="display:flex;gap:24px;align-items:flex-start">
        <div style="flex:1">
          <div class="eyebrow">How it works</div>
          <div style="display:flex;gap:16px;margin-top:8px;font-size:0.88rem;color:var(--text-dim)">
            <div style="flex:1"><strong style="color:var(--text)">1. Learn</strong><br>Read lessons with interactive examples and exercises. Zero experience needed — lesson 1 is "what is a program."</div>
            <div style="flex:1"><strong style="color:var(--text)">2. Practice</strong><br>Solve graded challenges with a 4-part rubric. Get hints when you are stuck. Improve your score and earn XP.</div>
            <div style="flex:1"><strong style="color:var(--text)">3. Prove</strong><br>Take timed assessments that bundle challenges together. See how you stack up on the Hall of Fame.</div>
          </div>
        </div>
      </div>
      <div style="margin-top:14px;display:flex;gap:10px">
        <a class="btn primary sm" href="#/start">Find your path &rarr;</a>
        <a class="btn ghost sm" href="#/learn">Browse lessons</a>
      </div>
    </div>
    ` : ''}
    <div class="hero">
      <div class="eyebrow">The GYM</div>
      <h1>${
        state.xp === 0
          ? 'Start from zero.'
          : profile.name
            ? 'Welcome back, ' + escapeHtml(profile.name.split(' ')[0]) + '.'
            : 'Welcome back.'
      }</h1>
      <p>${
        state.xp === 0
          ? totalLessons +
            ' lessons that assume you have never written a line of code, then ' +
            TRACKS.reduce((n, t) => n + t.challenges.length, 0) +
            ' graded challenges and ' +
            ASSESSMENTS.length +
            ' timed assessments to prove it stuck. Learn it, run it, get scored on it — all in the browser.'
          : 'Your lessons, rubric history, mastery map and streak, all in one place. Pick up where you left off below.'
      }</p>

      <div class="hero-stats">
        <div class="hero-stat"><div class="n">${state.xp.toLocaleString()}</div><div class="k">Total XP</div></div>
        <div class="hero-stat"><div class="n">${level.level}</div><div class="k">${escapeHtml(level.title)}</div></div>
        <div class="hero-stat"><div class="n">${streak}</div><div class="k">Day streak</div></div>
        <div class="hero-stat"><div class="n">${lessonsDone}<span style="color:var(--text-faint);font-size:0.9rem">/${totalLessons}</span></div><div class="k">Lessons</div></div>
        <div class="hero-stat"><div class="n">${overall.cleared}<span style="color:var(--text-faint);font-size:0.9rem">/${overall.total}</span></div><div class="k">Cleared</div></div>
        <div class="hero-stat"><div class="n">${averageBest === null ? '—' : averageBest}</div><div class="k">Avg best score</div></div>
      </div>

      <div class="xp-bar">
        <div class="xp-bar-head">
          <span>Level ${level.level}</span>
          <span>${level.needed.toLocaleString()} XP to level ${level.level + 1}</span>
        </div>
        <div class="progress-track"><div class="progress-fill" style="width:${(level.progress * 100).toFixed(1)}%"></div></div>
      </div>
    </div>

    ${
      next
        ? `<div class="card" style="margin-bottom:22px;display:flex;align-items:center;gap:18px;flex-wrap:wrap">
             <div style="flex:1;min-width:220px">
               <div class="eyebrow" style="color:var(--blue-soft)">Up next</div>
               <h3 style="font-size:1.05rem;margin-bottom:4px">${escapeHtml(
                 next.kind === 'lesson' ? next.lesson.title : next.challenge.title
               )}</h3>
               <p style="font-size:0.83rem;color:var(--text-dim)">
                 ${
                   next.kind === 'lesson'
                     ? `${escapeHtml(next.track.name)} lesson · ${next.lesson.minutes} min · ${escapeHtml(next.lesson.summary)}`
                     : `${escapeHtml(next.track.name)} challenge · ${escapeHtml(
                         DIFFICULTY[next.challenge.difficulty].label
                       )} · ${caseCount(next.challenge)} test cases · ${next.challenge.xp} XP`
                 }
               </p>
             </div>
             <a class="btn primary" href="#/${next.kind === 'lesson' ? 'lesson/' + next.lesson.id : 'challenge/' + next.challenge.id}">
               ${next.kind === 'lesson' ? 'Continue learning →' : 'Start challenge →'}
             </a>
           </div>`
        : ''
    }

    <div class="section-label">Courses</div>
    <div class="grid cols-2" style="margin-bottom:26px">
      ${TRACKS.map((track) => {
        const stats = store.trackStats(track);
        const lessons = store.lessonStats(track);
        const combined = (lessons.done + stats.cleared) / Math.max(1, lessons.total + stats.total);
        return `
          <a class="track-card" href="#/course/${track.id}" style="--accent:${track.accent}">
            <div class="track-card-head">
              <div class="track-glyph" style="background:${track.accent}">${track.glyph}</div>
              <div>
                <h3>${escapeHtml(track.name)}</h3>
                <div class="tagline">${escapeHtml(track.tagline)}</div>
              </div>
            </div>
            <p class="blurb">${escapeHtml(track.forBeginners || track.blurb)}</p>
            <div class="progress-track"><div class="progress-fill" style="width:${(combined * 100).toFixed(0)}%"></div></div>
            <div class="track-meta">
              <span>${lessons.done}/${lessons.total} lessons · ${stats.cleared}/${stats.total} cleared</span>
              <span>${stats.averageBest === null ? 'not started' : 'avg ' + stats.averageBest}</span>
            </div>
          </a>`;
      }).join('')}
    </div>

    <div class="grid cols-2" style="margin-bottom:26px">
      <div class="card">
        <div class="card-head">
          <h3>Concept mastery</h3>
          <span class="hint">rolling average of your scores</span>
        </div>
        ${
          top.length
            ? `<div class="radar-wrap">
                 ${radar(top.map((m) => ({ label: m.concept, value: m.score })))}
                 <div class="radar-legend">
                   ${weakest
                     .map(
                       (m) =>
                         `<div class="radar-legend-row"><span>${escapeHtml(m.concept)}</span><span class="n">${m.score}</span></div>`
                     )
                     .join('')}
                   <div style="font-size:0.72rem;color:var(--text-faint);margin-top:6px">Weakest concepts — worth revisiting.</div>
                 </div>
               </div>`
            : `<div class="empty-state"><h3>No data yet</h3><p style="font-size:0.85rem">Complete a challenge and your concept map starts filling in.</p></div>`
        }
      </div>

      <div class="card">
        <div class="card-head">
          <h3>Practice activity</h3>
          <span class="hint">last 26 weeks</span>
        </div>
        ${heatmap(store.activityGrid(26))}
        <div style="display:flex;gap:22px;margin-top:16px">
          <div><div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:600">${streak}</div><div style="font-size:0.7rem;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.07em">Current streak</div></div>
          <div><div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:600">${state.streak.longest}</div><div style="font-size:0.7rem;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.07em">Longest</div></div>
          <div><div style="font-family:var(--font-mono);font-size:1.15rem;font-weight:600">${Object.values(state.activity).reduce((a, b) => a + b, 0)}</div><div style="font-size:0.7rem;color:var(--text-faint);text-transform:uppercase;letter-spacing:0.07em">Total runs</div></div>
        </div>
      </div>
    </div>

    ${renderRecentAssessments()}
  `;

  render(host, html);
  setTimeout(() => showCoach('idle'), 1000);
}

function renderRecentAssessments() {
  const history = store.assessmentHistory().slice(0, 4);
  if (!history.length) {
    return `
      <div class="card">
        <div class="card-head"><h3>Assessments</h3><a class="btn sm ghost" href="#/assess">Browse →</a></div>
        <p style="font-size:0.86rem;color:var(--text-dim)">
          Timed, multi-problem exams with no hints and no reference solutions until you submit.
          They produce a rubric scorecard you can track over time.
        </p>
      </div>`;
  }

  return `
    <div class="card">
      <div class="card-head"><h3>Recent assessments</h3><a class="btn sm ghost" href="#/assess">All →</a></div>
      ${history
        .map((run) => {
          const band = gradeFor(run.total);
          return `
            <div class="challenge-row" style="padding-left:0;padding-right:0">
              <span class="score-badge" style="color:${band.color}">${band.grade}</span>
              <div class="challenge-main">
                <div class="t">${escapeHtml(run.title)}</div>
                <div class="m"><span>${run.total}/100</span><span>${run.cleared}/${run.count} solved</span><span>${relativeTime(run.at)}</span></div>
              </div>
            </div>`;
        })
        .join('')}
    </div>`;
}

/* -------------------------------------------------------------- track view */

export function renderTrack(host, trackId) {
  const track = getTrack(trackId);
  if (!track) {
    render(host, '<div class="empty-state"><h3>Unknown track</h3></div>');
    return;
  }

  const stats = store.trackStats(track);
  const groups = challengesByTier(track);

  const html = `
    <div class="page-head">
      <div class="eyebrow" style="color:${track.accent}">${escapeHtml(track.tagline)}</div>
      <h1>${escapeHtml(track.name)}</h1>
      <p>${escapeHtml(track.blurb)}</p>
      <div style="display:flex;gap:20px;align-items:center;margin-top:18px;flex-wrap:wrap">
        <div style="min-width:200px;flex:1;max-width:340px">
          <div class="xp-bar-head">
            <span>${stats.cleared} of ${stats.total} cleared</span>
            <span>${Math.round(stats.completion * 100)}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${stats.completion * 100}%"></div></div>
        </div>
        ${stats.averageBest !== null ? `<span class="pill">Average best score <strong style="margin-left:4px">${stats.averageBest}</strong></span>` : ''}
        <span class="pill">${track.challenges.reduce((n, c) => n + c.xp, 0).toLocaleString()} XP available</span>
      </div>
    </div>

    ${groups
      .map((group, index) => {
        const cleared = group.challenges.filter((c) => challengeStatus(c.id).state === 'done').length;
        return `
          <section class="tier">
            <div class="tier-head">
              <div class="tier-index">${String(index + 1).padStart(2, '0')}</div>
              <div>
                <h3>${escapeHtml(group.tier.name)}</h3>
                <p>${escapeHtml(group.tier.blurb)}</p>
              </div>
              <div class="tier-progress">${cleared}/${group.challenges.length}</div>
            </div>
            ${group.challenges
              .map((challenge) => {
                const status = challengeStatus(challenge.id);
                const difficulty = DIFFICULTY[challenge.difficulty];
                const band = status.score !== null ? gradeFor(status.score) : null;
                return `
                  <a class="challenge-row" href="#/challenge/${challenge.id}">
                    ${statusMark(status)}
                    <div class="challenge-main">
                      <div class="t">${escapeHtml(challenge.title)}</div>
                      <div class="m">
                        <span>${diffDots(challenge.difficulty, difficulty.color)} ${escapeHtml(difficulty.label)}</span>
                        <span>${caseCount(challenge)} cases</span>
                        <span>${challenge.xp} XP</span>
                        <span>${(challenge.concepts || []).slice(0, 3).join(' · ')}</span>
                      </div>
                    </div>
                    ${band ? `<span class="score-badge" style="color:${band.color}">${status.score}</span>` : ''}
                  </a>`;
              })
              .join('')}
          </section>`;
      })
      .join('')}
  `;

  render(host, html);
}

/* ------------------------------------------------------------- rubric view */

export function renderRubric(host) {
  const html = `
    <div class="page-head">
      <div class="eyebrow">How scoring works</div>
      <h1>The rubric</h1>
      <p>Every submission is graded on four independent axes and combined into a single 0–100 score.
         Nothing is hidden: each dimension reports exactly which check passed and which did not.</p>
    </div>

    <div class="grid cols-2" style="margin-bottom:26px">
      ${RUBRIC_DIMENSIONS.map(
        (dimension) => `
        <div class="card">
          <div class="card-head">
            <h3>${escapeHtml(dimension.name)}</h3>
            <span class="pill solid" style="background:var(--bg-raised)">${RUBRIC_WEIGHTS[dimension.id]}% weight</span>
          </div>
          <p style="font-size:0.86rem;color:var(--text-dim)">${escapeHtml(dimension.blurb)}</p>
        </div>`
      ).join('')}
    </div>

    <div class="card" style="margin-bottom:26px">
      <div class="card-head"><h3>Grade bands</h3><span class="hint">applied to the weighted total</span></div>
      <div style="display:flex;flex-wrap:wrap;gap:10px">
        ${GRADE_BANDS.map(
          (band) => `
          <div style="flex:1;min-width:120px;padding:12px 14px;border:1px solid var(--border);border-radius:var(--radius-sm);background:var(--bg-panel-2)">
            <div style="font-family:var(--font-head);font-size:1.4rem;font-weight:700;color:${band.color}">${band.grade}</div>
            <div style="font-size:0.8rem;font-weight:600">${escapeHtml(band.label)}</div>
            <div style="font-size:0.73rem;color:var(--text-faint);font-family:var(--font-mono)">${band.min}+</div>
          </div>`
        ).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>The rules the grader plays by</h3></div>
      <div class="brief-body">
        ${md(`- **Hidden cases carry the same weight as visible ones.** They probe empty inputs, boundaries, duplicates and the states you did not plan for. A solution that only satisfies the examples will land around 60.
- **A challenge is only "cleared" at 100% correctness.** You can score well without clearing it; the tracker distinguishes the two.
- **Efficiency is measured twice**: by regexes that look for the specific anti-pattern each task is designed to expose (a nested loop where a hash map belongs, \`pop(0)\` on a list, sorting to find a maximum), and by wall-clock time against a per-challenge budget.
- **Quality checks are per-challenge**, not generic lint. They ask whether you reached for the right tool: \`Counter\` instead of manual counting, \`@property\` instead of \`get_balance()\`, \`Arc<Mutex<_>>\` instead of a data race, chained \`Comparator\`s instead of nested ifs.
- **Style scores concision against a reference solution.** Roughly 0.55×–1.7× the reference length gets full marks. Far longer suggests a simpler shape exists; far shorter usually means something is missing.
- **XP is paid on improvement, not repetition.** Re-running a challenge only pays the difference above what it has already awarded, so you cannot farm the same problem.`)}
      </div>
    </div>
  `;

  render(host, html);
}

/* -------------------------------------------------------------- scratch pad */

const SCRATCH_STARTERS = {
  python: '# Scratch pad — anything goes.\n\nprint("hello from Python")\n',
  rust: 'fn main() {\n    println!("hello from Rust");\n}\n',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("hello from Java");\n    }\n}\n',
  javascript: 'console.log("hello from Node");\n',
};

const SCRATCH_WEB = {
  html: '<h1>Live preview</h1>\n<p>Edit the HTML, CSS or JS and hit Run.</p>\n<button id="go">Click me</button>\n',
  css: 'body {\n  font-family: system-ui, sans-serif;\n  padding: 2rem;\n}\n\nbutton {\n  padding: 0.5rem 1rem;\n  border-radius: 8px;\n  border: 1px solid #ccc;\n  cursor: pointer;\n}\n',
  js: "document.getElementById('go').addEventListener('click', () => {\n  document.body.style.background = '#f0f4ff';\n});\n",
};

export async function renderScratch(host) {
  const html = `
    <div class="page-head">
      <div class="eyebrow">Free play</div>
      <h1>Scratch pad</h1>
      <p>No grading, no tests. Somewhere to try an idea in any of the five runtimes before you take it into a challenge.</p>
    </div>

    <div class="card" style="padding:0;overflow:hidden">
      <div class="pane-head">
        <div class="tabs" id="lang-tabs">
          ${['python', 'rust', 'java', 'javascript', 'web']
            .map((lang) => `<button class="tab${lang === 'python' ? ' active' : ''}" data-lang="${lang}">${lang}</button>`)
            .join('')}
        </div>
        <div class="spacer"></div>
        <div class="tabs" id="web-tabs" hidden>
          ${['html', 'css', 'js'].map((f) => `<button class="tab${f === 'html' ? ' active' : ''}" data-file="${f}">${f}</button>`).join('')}
        </div>
        <button class="btn primary sm" id="run-scratch">Run ▸</button>
      </div>
      <div id="scratch-editor" style="height:46vh;min-height:300px"></div>
      <div class="run-bar">
        <span class="run-status" id="scratch-status">Ready.</span>
      </div>
      <div id="scratch-output" class="console-out" style="max-height:260px">Output appears here.</div>
      <iframe id="scratch-preview" class="preview-frame" title="Scratch preview" hidden style="height:340px"></iframe>
    </div>
  `;

  render(host, html);

  const editorHost = host.querySelector('#scratch-editor');
  const output = host.querySelector('#scratch-output');
  const preview = host.querySelector('#scratch-preview');
  const status = host.querySelector('#scratch-status');
  const webTabs = host.querySelector('#web-tabs');

  let lang = 'python';
  let webFile = 'html';
  const buffers = { ...SCRATCH_STARTERS };
  const webBuffers = { ...SCRATCH_WEB };

  const editor = await createEditor(editorHost, {
    language: 'python',
    value: buffers.python,
    fontSize: store.settings().fontSize,
  });

  const capture = () => {
    if (lang === 'web') webBuffers[webFile] = editor.getValue();
    else buffers[lang] = editor.getValue();
  };

  host.querySelector('#lang-tabs').addEventListener('click', (event) => {
    const button = event.target.closest('[data-lang]');
    if (!button) return;
    capture();
    lang = button.dataset.lang;
    host.querySelectorAll('#lang-tabs .tab').forEach((t) => t.classList.toggle('active', t === button));
    webTabs.hidden = lang !== 'web';
    preview.hidden = lang !== 'web';
    output.hidden = lang === 'web';

    if (lang === 'web') {
      editor.setValue(webBuffers[webFile]);
      editor.setLanguage(webFile === 'js' ? 'javascript' : webFile);
    } else {
      editor.setValue(buffers[lang]);
      editor.setLanguage(lang);
    }
  });

  webTabs.addEventListener('click', (event) => {
    const button = event.target.closest('[data-file]');
    if (!button) return;
    capture();
    webFile = button.dataset.file;
    webTabs.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === button));
    editor.setValue(webBuffers[webFile]);
    editor.setLanguage(webFile === 'js' ? 'javascript' : webFile);
  });

  host.querySelector('#run-scratch').addEventListener('click', async () => {
    capture();

    if (lang === 'web') {
      preview.srcdoc = buildPreviewDocument(webBuffers);
      status.textContent = 'Preview refreshed.';
      return;
    }

    status.innerHTML = '<span class="spinner"></span> Running…';
    output.textContent = '';
    output.classList.remove('error');

    try {
      const result = await runScratch(lang, buffers[lang], {
        onProgress: (message) => { status.innerHTML = '<span class="spinner"></span> ' + escapeHtml(message); },
        runnerUrl: store.settings().runnerUrl,
      });
      const stderr = (result.compileError || '') + (result.stderr || '');
      output.textContent = (result.stdout || '') + (stderr ? '\n' + stderr : '') || '(no output)';
      output.classList.toggle('error', Boolean(stderr.trim()) && !result.stdout);
      status.textContent = 'Done.';
    } catch (error) {
      output.textContent = String((error && error.message) || error);
      output.classList.add('error');
      status.textContent = 'Failed.';
    }
  });
}

/* ------------------------------------------------------------- profile view */

export function renderProfile(host) {
  const state = store.getState();
  const level = store.levelInfo(state.xp);
  const mastery = store.masteryTable();
  const obtainable = totalObtainableXp();

  const html = `
    <div class="page-head">
      <div class="eyebrow">Your data</div>
      <h1>Profile & progress</h1>
      <p>Everything here lives in this browser's localStorage. Nothing is uploaded anywhere — export it if you want a backup.</p>
    </div>

    <div class="grid cols-3" style="margin-bottom:22px">
      <div class="card">
        <div class="card-head"><h3>Level</h3></div>
        <div style="display:flex;align-items:center;gap:16px">
          ${scoreRing(level.progress * 100, 'var(--gold)', 72)}
          <div>
            <div style="font-family:var(--font-head);font-size:1.5rem;font-weight:700">${level.level}</div>
            <div style="font-size:0.82rem;color:var(--text-dim)">${escapeHtml(level.title)}</div>
            <div style="font-size:0.74rem;color:var(--text-faint);margin-top:3px">${level.needed} XP to next</div>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Experience</h3></div>
        <div style="font-family:var(--font-mono);font-size:1.6rem;font-weight:600">${state.xp.toLocaleString()}</div>
        <div style="font-size:0.78rem;color:var(--text-faint)">of ${obtainable.toLocaleString()} obtainable from challenges</div>
        <div class="progress-track" style="margin-top:10px"><div class="progress-fill" style="width:${Math.min(100, (state.xp / obtainable) * 100)}%"></div></div>
      </div>
      <div class="card">
        <div class="card-head"><h3>Consistency</h3></div>
        <div style="font-family:var(--font-mono);font-size:1.6rem;font-weight:600">${store.liveStreak()} days</div>
        <div style="font-size:0.78rem;color:var(--text-faint)">longest run: ${state.streak.longest} days</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:22px">
      <div class="card-head"><h3>Concept mastery</h3><span class="hint">${mastery.length} concepts touched</span></div>
      ${
        mastery.length
          ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:10px 26px">
               ${mastery
                 .map((entry) => {
                   const band = gradeFor(entry.score);
                   return `
                     <div>
                       <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:3px">
                         <span>${escapeHtml(entry.concept)}</span>
                         <span style="font-family:var(--font-mono);color:${band.color}">${entry.score}</span>
                       </div>
                       <div class="dim-track"><div class="dim-fill" style="width:${entry.score}%;background:${band.color}"></div></div>
                     </div>`;
                 })
                 .join('')}
             </div>`
          : '<p style="font-size:0.86rem;color:var(--text-dim)">Nothing yet — complete a challenge to start the map.</p>'
      }
    </div>

    <div class="card" style="margin-bottom:22px">
      <div class="card-head"><h3>Code runner</h3></div>
      <p style="font-size:0.86rem;color:var(--text-dim);margin-bottom:14px">
        Python runs in your browser via Pyodide. Web challenges run in a sandboxed iframe.
        Rust, Java and anything Pyodide cannot handle compile on
        <a href="https://godbolt.org" target="_blank" rel="noopener" style="color:var(--blue-soft)">Compiler Explorer</a>,
        a free shared service — so those need a network connection, and its sandbox limits Java to a single worker thread.
        If you run your own <a href="https://github.com/engineer-man/piston" target="_blank" rel="noopener" style="color:var(--blue-soft)">Piston</a>
        instance, put its API base URL here and it will be used first.
      </p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <input id="runner-url" type="url" placeholder="https://your-piston-host/api/v2/piston"
               value="${escapeHtml(store.settings().runnerUrl || '')}"
               style="flex:1;min-width:260px;padding:9px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-input);color:var(--text);font-family:var(--font-mono);font-size:0.8rem" />
        <button class="btn" id="save-runner">Save</button>
      </div>
    </div>

    <div class="card">
      <div class="card-head"><h3>Data</h3></div>
      <p style="font-size:0.86rem;color:var(--text-dim);margin-bottom:16px">
        Export writes a JSON file with your XP, scores, drafts, mastery and assessment history.
        Import replaces everything currently stored.
      </p>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn" id="export-data">Export progress</button>
        <button class="btn" id="import-data">Import progress</button>
        <button class="btn ghost" id="reset-data" style="color:var(--red);border-color:rgba(239,68,68,0.4)">Reset everything</button>
      </div>
      <input type="file" id="import-file" accept="application/json" hidden />
    </div>

    <div class="card" style="margin-top:22px">
      <div class="card-head"><h3>Share</h3></div>
      <p style="font-size:0.86rem;color:var(--text-dim);margin-bottom:16px">
        Generate a summary card you can screenshot or copy into a portfolio.
      </p>
      <button class="btn" id="share-progress">Generate summary</button>
      <div id="share-output" style="margin-top:14px"></div>
    </div>

    <div class="card" style="margin-top:22px">
      <div class="card-head"><h3>Sync to GitHub Gist</h3></div>
      <p style="font-size:0.86rem;color:var(--text-dim);margin-bottom:12px">
        Save your progress to a private GitHub Gist. Restore it on another device by pasting the Gist ID.
        Requires a <a href="https://github.com/settings/tokens" target="_blank" rel="noopener" style="color:var(--blue-soft)">GitHub token</a> with the <code>gist</code> scope.
      </p>
      <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px">
        <input id="gist-token" type="password" placeholder="GitHub personal access token" autocomplete="off"
          style="flex:1;min-width:200px;padding:9px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-input);color:var(--text);font-size:0.82rem" />
        <button class="btn" id="gist-save">Save to Gist</button>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <input id="gist-id" type="text" placeholder="Or paste an existing Gist ID to restore" autocomplete="off"
          style="flex:1;min-width:200px;padding:9px 12px;border-radius:var(--radius-sm);border:1px solid var(--border);background:var(--bg-input);color:var(--text);font-size:0.82rem" />
        <button class="btn" id="gist-load">Restore from Gist</button>
      </div>
      <div id="gist-status" style="margin-top:10px;font-size:0.8rem"></div>
    </div>
  `;

  render(host, html);

  // Gist handlers
  host.querySelector('#gist-save').addEventListener('click', async () => {
    const token = host.querySelector('#gist-token').value.trim();
    if (!token) { toast('Enter a GitHub token first.', 'warn'); return; }
    const status = host.querySelector('#gist-status');
    status.textContent = 'Saving…';
    try {
      const res = await fetch('https://api.github.com/gists', {
        method: 'POST',
        headers: { Authorization: 'token ' + token, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: 'The GYM progress backup',
          public: false,
          files: { 'prism-progress.json': { content: store.exportJson() } },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      status.innerHTML = `Saved! Gist ID: <code style="background:var(--bg-panel-2);padding:2px 8px;border-radius:4px">${data.id}</code> — save this ID to restore later.`;
      toast('Progress saved to Gist.', 'good');
    } catch (e) {
      status.textContent = 'Error: ' + (e.message || 'Unknown');
      toast('Gist save failed.', 'warn');
    }
  });

  host.querySelector('#gist-load').addEventListener('click', async () => {
    const gistId = host.querySelector('#gist-id').value.trim();
    if (!gistId) { toast('Paste a Gist ID first.', 'warn'); return; }
    const status = host.querySelector('#gist-status');
    status.textContent = 'Loading…';
    try {
      const res = await fetch('https://api.github.com/gists/' + encodeURIComponent(gistId));
      if (!res.ok) throw new Error('Gist not found');
      const data = await res.json();
      const file = Object.values(data.files || {})[0];
      if (!file || !file.content) throw new Error('Empty gist');
      store.importJson(file.content);
      status.textContent = 'Restored! Reloading in 1s…';
      toast('Progress restored from Gist.', 'good');
      setTimeout(() => location.reload(), 1000);
    } catch (e) {
      status.textContent = 'Error: ' + (e.message || 'Unknown');
      toast('Gist load failed.', 'warn');
    }
  });

  // Share handler
  host.querySelector('#share-progress').addEventListener('click', () => {
    const state = store.getState();
    const level = store.levelInfo(state.xp);
    const ts = TRACKS.map(t => ({ name: t.name, ...store.trackStats(t) }));
    const cleared = ts.reduce((s, t) => s + t.cleared, 0);
    const total = ts.reduce((s, t) => s + t.total, 0);
    const lessons = ts.reduce((s, t) => s + store.lessonStats({ id: t.name.toLowerCase().replace(' ', '') }).done, 0);
    const streak = store.liveStreak();

    const html = `
      <div class="card" style="background:linear-gradient(135deg, var(--bg-panel) 0%, rgba(224,170,80,0.08) 100%);border-color:var(--gold);padding:20px">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap">
          <div>
            <div style="font-family:var(--font-head);font-size:1.1rem;font-weight:700;color:var(--gold)">The GYM — Progress Card</div>
            <div style="font-size:0.82rem;color:var(--text-dim);margin-top:2px">${state.xp.toLocaleString()} XP · Level ${level.level} · ${streak}-day streak</div>
            <div style="font-size:0.75rem;color:var(--text-faint);margin-top:1px">${cleared}/${total} challenges cleared · ${lessons} lessons done</div>
          </div>
          <div style="text-align:right;font-size:0.74rem;color:var(--text-faint)">
            ${ts.map(t => `<div>${t.name}: ${t.cleared}/${t.total} cleared</div>`).join('')}
          </div>
        </div>
        <div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border);font-size:0.7rem;color:var(--text-faint);text-align:center">
          the-gym.prism.dev · screenshot or copy this card
        </div>
      </div>`;
    host.querySelector('#share-output').innerHTML = html;
  });

  host.querySelector('#save-runner').addEventListener('click', () => {
    const value = host.querySelector('#runner-url').value.trim();
    store.updateSettings({ runnerUrl: value });
    toast(value ? 'Using your own runner for compiled languages.' : 'Back to the shared public runner.', 'good');
  });

  host.querySelector('#export-data').addEventListener('click', () => {
    const blob = new Blob([store.exportJson()], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'prism-playground-progress.json';
    link.click();
    URL.revokeObjectURL(link.href);
    toast('Progress exported.', 'good');
  });

  const fileInput = host.querySelector('#import-file');
  host.querySelector('#import-data').addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) return;
    try {
      store.importJson(await file.text());
      toast('Progress imported.', 'good');
      renderProfile(host);
    } catch {
      toast('That file could not be read as progress JSON.', 'bad');
    }
  });

  host.querySelector('#reset-data').addEventListener('click', () => {
    modal(
      `<h2>Reset everything?</h2>
       <p style="color:var(--text-dim);font-size:0.9rem">
         This wipes your XP, scores, drafts, mastery map and assessment history from this browser. It cannot be undone.
       </p>
       <div class="modal-actions">
         <button class="btn ghost" data-close>Cancel</button>
         <button class="btn" id="confirm-reset" style="background:var(--red);color:#fff;border-color:transparent">Reset</button>
       </div>`,
      {
        onMount: (node, close) => {
          node.querySelector('#confirm-reset').addEventListener('click', () => {
            store.resetAll();
            close();
            toast('Everything reset.', 'info');
            renderProfile(host);
          });
        },
      }
        );
  });
}

/* ------------------------------------------------------------- track intro */

const trackDetails = {
  python: {
    what: 'Python is the most readable general-purpose language. Its syntax is close to English, and its design philosophy values clarity over cleverness. It ships with a massive standard library ("batteries included").',
    why: 'Python is the best first language. It removes ceremony — no type declarations, no boilerplate class wrappers, no compile step. You focus on the idea, not the punctuation. It is also the duct tape of programming: you can glue together data pipelines, automate workflows, prototype a machine learning model, or build a web backend — all in the same afternoon.',
    where: 'Data science, machine learning, backend web services (Django, FastAPI), automation, scientific computing, education, fintech, DevOps scripting.',
    build: 'A command-line expense tracker, a web scraper, a Discord bot, a REST API, a data analysis notebook, an async task runner.',
    pick: 'you have never coded before, or you want the most versatile first language that opens doors to data, web, and automation.',
    curve: 'Gentle start — you will be writing useful programs by lesson 3. Advanced concepts (async, meta-programming) come later.',
  },
  web: {
    what: 'Web development is three technologies working together: HTML for structure, CSS for appearance, and JavaScript for behaviour. This track teaches all three, plus modern layout, APIs, accessibility, and offline-first design.',
    why: 'The web is the most accessible platform. Anything you build here runs on every device with a browser — no install, no app store. The feedback loop is instant: change a line, see the result. It is the most visual and immediately rewarding way to learn.',
    where: 'Frontend engineering, full-stack development, UI/UX design implementation, browser extensions, Progressive Web Apps, email templates, documentation sites.',
    build: 'A portfolio page, a to-do app with local storage, a GitHub user search, a responsive dashboard, an accessible form with real-time validation, a PWA that works offline.',
    pick: 'you are visual, you want to see results immediately, or you are aiming for frontend/UI roles.',
    curve: 'Very gentle start — you will build a real page in lesson 1. Ramps up when JavaScript, async, and the DOM join forces around lesson 6.',
  },
  java: {
    what: "Java is statically typed, compiled, and object-oriented. It runs on the JVM (Java Virtual Machine), which means the same compiled code works on any operating system. It powers most of the world's large-scale business software.",
    why: 'Choosing Java is choosing structure. The compiler catches type mismatches, null pointer risks, and interface violations before your code ever runs — catching whole bug categories that dynamic languages let through. This strictness scales to teams of hundreds working on million-line codebases.',
    where: 'Enterprise backend systems, Android apps, financial services, big data (Apache Spark, Hadoop), cloud infrastructure, Minecraft mods, university CS curricula.',
    build: 'A banking account class with immutable transactions, a multi-key sorted leaderboard, a generic data cache, a concurrent order processor.',
    pick: 'you like structure and explicit types, or you are targeting enterprise/Android roles.',
    curve: "Moderate start — Java's verbosity means more typing up front. But once you internalise the boilerplate (about lesson 3), the pace picks up.",
  },
  rust: {
    what: 'Rust is a systems language that guarantees memory safety and thread safety without a garbage collector. It catches use-after-free, data races, and null pointer dereferences at compile time — bugs that in C++ survive into production.',
    why: 'Rust solves a real, expensive problem. Memory bugs account for ~70% of security vulnerabilities in large C/C++ codebases. Rust proves your code is safe before it ever runs — and does it without the runtime overhead of a garbage collector. The result: C++ speed with Python-level safety guarantees.',
    where: "Systems programming, embedded devices, WebAssembly, blockchain, CLI tools, game engines, networking infrastructure, anywhere performance and correctness are non-negotiable.",
    build: 'A fast CLI tool, a concurrent web server, a WebAssembly module for the browser, an embedded device driver, a text search engine.',
    pick: 'you care about performance, you want to understand how memory actually works, or you are drawn to systems-level programming.',
    curve: "Steepest start. The borrow checker will fight you for the first 2–3 weeks. Every experienced Rust developer went through this — and every one says it was worth it.",
  },
};

export function renderStart(host) {
  const html = `
    <div class="page-head">
      <span class="eyebrow">Getting started</span>
      <h1>Which path is yours?</h1>
      <p>
        Every track on this platform starts from zero — no experience assumed.
        Pick the one that matches what you want to build and where you want to go.
        You can switch at any time, and all tracks share the same XP and streak system.
      </p>
    </div>

    ${TRACKS.map((track) => {
      const d = trackDetails[track.id] || {};
      return `
        <section class="card" style="margin-bottom:24px;--accent:${track.accent}">
          <div class="card-head">
            <h2>
              <span class="nav-glyph" style="background:${track.accent};color:#fff;display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:8px;font-weight:700;font-size:0.85rem;margin-right:10px;vertical-align:middle">${track.glyph}</span>
              ${escapeHtml(track.name)}
            </h2>
            <span class="hint">${escapeHtml(track.tagline)}</span>
          </div>

          <div class="grid cols-2" style="margin-top:16px;gap:14px">
            <div>
              <h4 style="margin:0 0 4px;color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em">What is it?</h4>
              <p style="margin:0 0 16px;font-size:0.93rem">${escapeHtml(d.what)}</p>

              <h4 style="margin:0 0 4px;color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em">Why learn it?</h4>
              <p style="margin:0 0 16px;font-size:0.93rem">${escapeHtml(d.why)}</p>
            </div>
            <div>
              <h4 style="margin:0 0 4px;color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em">Where is it used?</h4>
              <p style="margin:0 0 16px;font-size:0.93rem">${escapeHtml(d.where)}</p>

              <h4 style="margin:0 0 4px;color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em">What will you build?</h4>
              <p style="margin:0 0 16px;font-size:0.93rem">${escapeHtml(d.build)}</p>
            </div>
          </div>

          <div style="display:flex;gap:24px;margin-top:8px;padding-top:14px;border-top:1px solid var(--border)">
            <div style="flex:1">
              <h4 style="margin:0 0 4px;color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em">Pick this if</h4>
              <p style="margin:0;font-size:0.93rem">${escapeHtml(d.pick)}.</p>
            </div>
            <div style="flex:1">
              <h4 style="margin:0 0 4px;color:var(--text-dim);font-size:0.78rem;text-transform:uppercase;letter-spacing:0.06em">Learning curve</h4>
              <p style="margin:0;font-size:0.93rem">${escapeHtml(d.curve)}</p>
            </div>
          </div>

          <div style="margin-top:16px;display:flex;gap:10px">
            <a class="btn primary sm" href="#/course/${track.id}" style="background:${track.accent};border-color:transparent">
              ${track.id === 'python' ? 'Start learning' : 'View course'} &rarr;
            </a>
            ${track.forBeginners ? `<span style="font-size:0.82rem;color:var(--text-dim);align-self:center">${escapeHtml(track.forBeginners)}</span>` : ''}
          </div>
        </section>`;
    }).join('')}

    <section class="card">
      <div class="card-head">
        <h2>How they relate to each other</h2>
      </div>
      <p style="margin:0 0 16px;font-size:0.93rem;color:var(--text-dim)">
        No single language is "the right one." They overlap in surprising ways — and learning a second one is far easier than the first.
      </p>
      <div style="font-size:0.93rem;line-height:1.8">
        <p style="margin:0 0 12px">
          <strong style="color:var(--gold)">Python</strong> gives you the gentlest start. Its concepts transfer directly to <strong style="color:var(--blue)">Java</strong> (same OOP ideas, stricter rules) and <strong style="color:var(--green)">JavaScript</strong> (in the Web track — same dynamic feel, different syntax).
        </p>
        <p style="margin:0 0 12px">
          <strong style="color:var(--green)">Web Dev</strong> is three languages that each reinforce the others. HTML gives structure, CSS teaches layout thinking, JavaScript connects to the programming logic you would use in any language. The visual feedback loop makes abstract concepts concrete.
        </p>
        <p style="margin:0 0 12px">
          <strong style="color:var(--orange)">Rust</strong> teaches you things no other track does — how memory actually works, what ownership means, why the compiler is your safety net. These insights make you better at every other language, even if you never write Rust professionally.
        </p>
        <p style="margin:0">
          <strong style="color:var(--red)">Java</strong> forces explicitness — every type declared, every exception acknowledged. This strictness can feel slow at first, but it builds habits that prevent entire categories of bugs in any language.
        </p>
      </div>
    </section>

    <section class="card">
      <div class="card-head">
        <h2>Curated paths</h2>
        <span class="hint">If you want a sequence rather than a single track</span>
      </div>
      <div style="display:flex;flex-direction:column;gap:16px;font-size:0.93rem">
        <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 16px;background:var(--bg-panel-2);border-radius:var(--radius-sm)">
          <span style="font-size:1.2rem;min-width:28px">1</span>
          <div>
            <strong>Full-stack foundations</strong>
            <p style="margin:4px 0 0;color:var(--text-dim)">Python lessons → Python challenges → Web Dev lessons (HTML/CSS/JS) → Web Dev challenges. Start with programming logic, then bring it to the browser.</p>
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 16px;background:var(--bg-panel-2);border-radius:var(--radius-sm)">
          <span style="font-size:1.2rem;min-width:28px">2</span>
          <div>
            <strong>Web developer</strong>
            <p style="margin:4px 0 0;color:var(--text-dim)">Web Dev lessons → Web Dev challenges. The most direct path to building things people can see and interact with. Every lesson produces a live page.</p>
          </div>
        </div>
        <div style="display:flex;gap:14px;align-items:flex-start;padding:12px 16px;background:var(--bg-panel-2);border-radius:var(--radius-sm)">
          <span style="font-size:1.2rem;min-width:28px">3</span>
          <div>
            <strong>Systems thinker</strong>
            <p style="margin:4px 0 0;color:var(--text-dim)">Python foundations → Rust ownership and borrowing → Rust challenges. Learn the easy language first, then understand what the computer is actually doing under the hood.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="card" style="text-align:center">
      <p style="margin:0;font-size:0.95rem;color:var(--text-dim)">
        <strong>You are not choosing forever.</strong> Every concept you learn in one track transfers to the others.
        Variables, loops, functions, and data structures work the same way everywhere — only the punctuation changes.
      </p>
      <p style="margin:10px 0 0;font-size:0.85rem;color:var(--text-faint)">
        All tracks assume zero prior knowledge. All give XP toward the same profile. Many people work through two or three at once.
      </p>
    </section>
  `;

  render(host, html);
}
