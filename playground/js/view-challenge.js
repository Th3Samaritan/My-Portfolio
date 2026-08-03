/* ============================================================
   view-challenge.js — the three-pane workspace.

   brief | editor | results

   mountWorkspace() is shared with the assessment runner, which
   uses it in exam mode: no hints, no solution, no per-case
   detail and no persistence until the whole exam is submitted.
   ============================================================ */

import { getChallenge, getTrackOf, DIFFICULTY, caseCount } from '../data/curriculum.js';
import { gradeFor } from '../data/assessments.js';
import * as store from './store.js';
import { md, escapeHtml, diffDots, scoreRing, dimensionBar, toast, modal, render } from './ui.js';
import { createEditor, monacoLanguage } from './editor.js';
import { runCodeChallenge, runWebChallenge, buildPreviewDocument } from './runner.js';
import { grade, xpFor } from './grader.js';
import { showCoach } from './coach.js';

const WEB_FILES = ['html', 'css', 'js'];

/* ------------------------------------------------------------------ helpers */

function starterFor(challenge, track) {
  if (track.kind === 'web') return { ...challenge.files };
  return challenge.starter || '';
}

function draftFor(challenge, track) {
  const saved = store.getDraft(challenge.id);
  if (!saved) return starterFor(challenge, track);
  if (track.kind === 'web') {
    return typeof saved === 'object' ? { ...starterFor(challenge, track), ...saved } : starterFor(challenge, track);
  }
  return typeof saved === 'string' ? saved : starterFor(challenge, track);
}

function joinedSource(code, track) {
  return track.kind === 'web' ? [code.html, code.css, code.js].join('\n') : code;
}

/* --------------------------------------------------------------- brief pane */

function briefHtml(challenge, track, examMode) {
  const difficulty = DIFFICULTY[challenge.difficulty];
  const record = store.attemptFor(challenge.id);
  const visibleCases = (challenge.cases || challenge.checks || []).filter((c) => !c.hidden);
  const hiddenCount = (challenge.cases || challenge.checks || []).length - visibleCases.length;

  return `
    <div class="brief">
      <div class="eyebrow" style="color:${track.accent}">${escapeHtml(track.name)}</div>
      <h1>${escapeHtml(challenge.title)}</h1>

      <div class="brief-meta">
        <span class="pill">${diffDots(challenge.difficulty, difficulty.color)} ${escapeHtml(difficulty.label)}</span>
        <span class="pill">${challenge.xp} XP</span>
        <span class="pill">${caseCount(challenge)} cases</span>
        ${record && !examMode ? `<span class="pill" style="color:${gradeFor(record.bestScore).color}">best ${record.bestScore}</span>` : ''}
      </div>

      <div class="brief-body">${md(challenge.brief)}</div>

      <div class="section-label">Test cases</div>
      ${visibleCases
        .map(
          (testCase) => `
        <div class="requirement">
          <span class="mark">▸</span>
          <span>${escapeHtml(testCase.name)}</span>
        </div>`
        )
        .join('')}
      ${
        hiddenCount
          ? `<div class="requirement" style="color:var(--amber)">
               <span class="mark">◆</span>
               <span>${hiddenCount} hidden case${hiddenCount === 1 ? '' : 's'} — edge conditions you are expected to anticipate.</span>
             </div>`
          : ''
      }

      <div class="section-label">Concepts</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px">
        ${(challenge.concepts || []).map((c) => `<span class="pill">${escapeHtml(c)}</span>`).join('')}
      </div>

      ${
        examMode
          ? `<div class="hint-box" style="border-left-color:var(--blue-soft);margin-top:22px">
               Exam mode: hints, the reference solution and per-case results are locked until you submit the assessment.
             </div>`
          : `
        <div class="section-label">Support</div>
        <div id="hint-zone"></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
          <button class="btn sm ghost" id="hint-btn">Reveal a hint</button>
          <button class="btn sm ghost" id="solution-btn">Reference solution</button>
        </div>`
      }
    </div>`;
}

/* -------------------------------------------------------------- results pane */

function resultsHtml(scorecard, run, track, examMode) {
  if (!scorecard) {
    return `
      <div class="empty-state">
        <h3>Nothing run yet</h3>
        <p style="font-size:0.85rem">Write your solution and hit Run. You will get a score, a per-case breakdown and a rubric report.</p>
      </div>`;
  }

  if (examMode) {
    const passed = run.results.filter((r) => r.passed).length;
    return `
      <div class="scorecard">
        <div class="card" style="text-align:center">
          <div style="font-family:var(--font-mono);font-size:1.8rem;font-weight:700">${passed}/${run.results.length}</div>
          <div style="font-size:0.8rem;color:var(--text-dim)">cases passing</div>
          <p style="font-size:0.78rem;color:var(--text-faint);margin-top:10px">
            Full rubric detail is released when the assessment is submitted.
          </p>
        </div>
      </div>`;
  }

  const dimensions = scorecard.dimensions;

  const checkDetail = (checks) =>
    (checks || [])
      .map((c) => `<span class="${c.ok ? 'ok' : 'no'}">${c.ok ? '✓' : '✗'} ${escapeHtml(c.label)}</span>`)
      .join('');

  const speedNote =
    dimensions.efficiency.detail.speed === null
      ? ''
      : `<span class="${dimensions.efficiency.detail.speed >= 60 ? 'ok' : 'no'}">
           ⏱ ${Math.round(dimensions.efficiency.detail.timeMs)} ms of ${dimensions.efficiency.detail.budgetMs} ms budget
         </span>`;

  return `
    <div class="scorecard">
      <div class="score-hero">
        ${scoreRing(scorecard.total, scorecard.grade.color)}
        <div>
          <div class="grade-letter" style="color:${scorecard.grade.color}">${scorecard.grade.grade}</div>
          <div class="grade-label">${escapeHtml(scorecard.grade.label)}</div>
          ${scorecard.xpAwarded ? `<div class="xp-gain">+${scorecard.xpAwarded} XP</div>` : ''}
        </div>
      </div>

      ${dimensionBar('Correctness', dimensions.correctness.score, dimensions.correctness.weight, 'var(--green)',
        `<span>${dimensions.correctness.detail.passed}/${dimensions.correctness.detail.total} cases passing` +
        (dimensions.correctness.detail.hiddenFailed ? ` · ${dimensions.correctness.detail.hiddenFailed} hidden failing` : '') +
        `</span>`)}

      ${dimensionBar('Efficiency', dimensions.efficiency.score, dimensions.efficiency.weight, 'var(--blue-soft)',
        checkDetail(dimensions.efficiency.detail.checks) + speedNote)}

      ${dimensionBar('Code quality', dimensions.quality.score, dimensions.quality.weight, 'var(--purple)',
        checkDetail(dimensions.quality.detail.checks))}

      ${dimensionBar('Style & concision', dimensions.style.score, dimensions.style.weight, 'var(--gold)',
        `<span>${dimensions.style.detail.lines} significant lines vs ${dimensions.style.detail.reference} in the reference (${dimensions.style.detail.ratio}×)</span>` +
        (dimensions.style.detail.penalties || []).map((p) => `<span class="no">− ${escapeHtml(p.label)}</span>`).join(''))}

      <div class="section-label">Feedback</div>
      ${scorecard.feedback
        .map(
          (note) => `
        <div class="feedback-item ${note.tone}">
          <span class="icon">${note.tone === 'good' ? '✓' : note.tone === 'bad' ? '✕' : '!'}</span>
          <span>${escapeHtml(note.text)}</span>
        </div>`
        )
        .join('')}

      <div class="section-label">Cases</div>
      <div style="border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden">
        ${run.results
          .map(
            (result) => `
          <div class="result-row">
            <span class="result-mark ${result.passed ? 'pass' : 'fail'}">${result.passed ? 'PASS' : 'FAIL'}</span>
            <div class="result-body">
              <div class="result-name">
                ${escapeHtml(result.name)}
                ${result.hidden ? '<span class="pill" style="margin-left:6px;font-size:0.62rem">hidden</span>' : ''}
              </div>
              ${
                result.passed
                  ? ''
                  : `<div class="result-diff">
                       <span class="got">got ${escapeHtml(result.got)}</span>
                       ${track.kind === 'web' ? '' : ` &nbsp;·&nbsp; <span class="want">want ${escapeHtml(result.want)}</span>`}
                     </div>`
              }
            </div>
          </div>`
          )
          .join('')}
      </div>

      ${
        run.compileError
          ? `<div class="section-label">Compiler output</div><div class="console-out error">${escapeHtml(run.compileError)}</div>`
          : ''
      }
      ${
        run.stderr && run.stderr.trim()
          ? `<div class="section-label">Stderr</div><div class="console-out error">${escapeHtml(run.stderr)}</div>`
          : ''
      }
      ${
        run.logs && run.logs.trim()
          ? `<div class="section-label">Output</div><div class="console-out">${escapeHtml(run.logs)}</div>`
          : ''
      }
    </div>`;
}

/* ------------------------------------------------------------- the workspace */

/**
 * Mount the workspace into `host`.
 * @returns {{ run: Function, getCode: Function, dispose: Function, lastScore: Function }}
 */
export async function mountWorkspace(host, { challenge, track, examMode = false, onScored = null, initialCode = null }) {
  const isWeb = track.kind === 'web';
  let code = initialCode ?? (examMode ? starterFor(challenge, track) : draftFor(challenge, track));
  if (isWeb) code = { ...code };
  let activeFile = 'html';
  let scorecard = null;
  let lastRun = null;
  let hintsShown = 0;
  let busy = false;

  render(
    host,
    `
    <div class="workspace">
      <section class="pane brief-pane">
        <div class="pane-head"><h2>Brief</h2></div>
        <div class="pane-body pad" id="brief-pane"></div>
      </section>

      <section class="pane editor-pane">
        <div class="pane-head">
          <h2>Solution</h2>
          ${
            isWeb
              ? `<div class="tabs" id="file-tabs" style="margin-left:12px">
                   ${WEB_FILES.map((f) => `<button class="tab${f === 'html' ? ' active' : ''}" data-file="${f}">${f}</button>`).join('')}
                 </div>`
              : `<span class="pill" style="margin-left:10px">${escapeHtml(track.lang)}</span>`
          }
          <div class="spacer"></div>
          ${examMode ? '' : '<button class="btn sm ghost" id="reset-btn">Reset</button>'}
        </div>
        <div class="editor-host" id="editor-host"></div>
        <div class="run-bar">
          <button class="btn primary" id="run-btn">Run &amp; grade ▸</button>
          <span class="run-status" id="run-status">Ctrl/⌘ + Enter to run</span>
        </div>
      </section>

      <section class="pane results-pane">
        <div class="pane-head">
          <h2>${isWeb ? 'Preview &amp; results' : 'Results'}</h2>
          <div class="spacer"></div>
          <span class="pill" id="engine-pill" hidden></span>
        </div>
        ${isWeb ? '<iframe class="preview-frame" id="preview" title="Live preview" sandbox="allow-scripts allow-same-origin allow-forms allow-modals"></iframe>' : ''}
        <div class="pane-body" id="results-pane"></div>
      </section>
    </div>`
  );

  const briefPane = host.querySelector('#brief-pane');
  const resultsPane = host.querySelector('#results-pane');
  const runButton = host.querySelector('#run-btn');
  const runStatus = host.querySelector('#run-status');
  const enginePill = host.querySelector('#engine-pill');
  const previewFrame = host.querySelector('#preview');

  briefPane.innerHTML = briefHtml(challenge, track, examMode);
  resultsPane.innerHTML = resultsHtml(null, null, track, examMode);

  /* ---- editor ---- */

  const editor = await createEditor(host.querySelector('#editor-host'), {
    language: isWeb ? 'html' : monacoLanguage(track.id),
    value: isWeb ? code.html : code,
    fontSize: store.settings().fontSize,
    onChange: (value) => {
      if (isWeb) code[activeFile] = value;
      else code = value;
      if (!examMode) scheduleSave();
      if (isWeb) schedulePreview();
    },
  });

  let saveTimer = null;
  function scheduleSave() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => store.saveDraft(challenge.id, code), 700);
  }

  let previewTimer = null;
  function schedulePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(refreshPreview, 450);
  }

  function refreshPreview() {
    if (previewFrame) previewFrame.srcdoc = buildPreviewDocument(code);
  }

  if (isWeb) {
    refreshPreview();
    host.querySelector('#file-tabs').addEventListener('click', (event) => {
      const button = event.target.closest('[data-file]');
      if (!button) return;
      code[activeFile] = editor.getValue();
      activeFile = button.dataset.file;
      host.querySelectorAll('#file-tabs .tab').forEach((t) => t.classList.toggle('active', t === button));
      editor.setValue(code[activeFile]);
      editor.setLanguage(activeFile === 'js' ? 'javascript' : activeFile);
    });
  }

  /* ---- hints & solution ---- */

  if (!examMode) {
    const hintButton = briefPane.querySelector('#hint-btn');
    const hintZone = briefPane.querySelector('#hint-zone');
    const solutionButton = briefPane.querySelector('#solution-btn');
    const record = store.attemptFor(challenge.id);
    const attempts = record ? record.attempts : 0;
    const cleared = record ? record.cleared : false;

    // Max hint level allowed based on attempts (0-indexed hints)
    const maxHintLevel = cleared ? Infinity : Math.min(attempts, (challenge.hints || []).length);
    // Lock button label
    const updateHintButton = () => {
      if (hintsShown >= (challenge.hints || []).length) {
        hintButton.textContent = 'No more hints';
        hintButton.disabled = true;
      } else if (maxHintLevel <= hintsShown) {
        hintButton.textContent = `Reveal a hint (after ${hintsShown + 1} attempt${hintsShown > 0 ? 's' : ''})`;
        hintButton.disabled = true;
      } else {
        hintButton.textContent = 'Reveal a hint';
        hintButton.disabled = false;
      }
    };
    updateHintButton();

    // Lock solution behind 3 attempts or cleared
    if (!cleared && attempts < 3) {
      solutionButton.textContent = 'Reference solution (after 3 attempts)';
      solutionButton.disabled = true;
    }

    hintButton.addEventListener('click', () => {
      const hints = challenge.hints || [];
      if (hintsShown >= hints.length) {
        toast('No more hints for this one.', 'info');
        return;
      }
      if (maxHintLevel <= hintsShown) {
        toast(`Earn another hint by attempting the challenge. (${hintsShown + 1} attempt${hintsShown > 0 ? 's' : ''} needed)`, 'info');
        return;
      }
      const node = document.createElement('div');
      node.className = 'hint-box';
      node.textContent = hints[hintsShown];
      hintZone.appendChild(node);
      hintsShown += 1;
      updateHintButton();
    });

    solutionButton.addEventListener('click', () => {
      const solution = isWeb
        ? WEB_FILES.map((f) => `--- ${f} ---\n${challenge.solution[f]}`).join('\n\n')
        : challenge.solution;

      modal(
        `<h2>Reference solution</h2>
         <p style="color:var(--text-dim);font-size:0.86rem;margin-bottom:14px">
           One idiomatic way to solve it — not the only one. Reading it will teach you more than pasting it.
         </p>
         <pre style="background:var(--bg-input);border:1px solid var(--border);padding:14px;border-radius:var(--radius-sm);overflow:auto;max-height:52vh;font-size:0.78rem"><code>${escapeHtml(solution)}</code></pre>
         <div class="modal-actions">
           <button class="btn ghost" data-close>Close</button>
           <button class="btn" id="load-solution">Load into editor</button>
         </div>`,
        {
          onMount: (node, close) => {
            node.querySelector('#load-solution').addEventListener('click', () => {
              if (isWeb) {
                code = { ...challenge.solution };
                editor.setValue(code[activeFile]);
                refreshPreview();
              } else {
                code = challenge.solution;
                editor.setValue(code);
              }
              store.saveDraft(challenge.id, code);
              close();
              toast('Reference solution loaded. Run it to see a perfect scorecard.', 'info');
            });
          },
        }
      );
    });

    host.querySelector('#reset-btn').addEventListener('click', () => {
      code = starterFor(challenge, track);
      editor.setValue(isWeb ? code[activeFile] : code);
      store.clearDraft(challenge.id);
      if (isWeb) refreshPreview();
      toast('Editor reset to the starter.', 'info');
    });
  }

  /* ---- run ---- */

  async function run() {
    if (busy) return;
    busy = true;
    runButton.disabled = true;
    runStatus.innerHTML = '<span class="spinner"></span> Preparing…';

    if (isWeb) code[activeFile] = editor.getValue();
    else code = editor.getValue();

    const onProgress = (message) => {
      runStatus.innerHTML = '<span class="spinner"></span> ' + escapeHtml(message);
    };

    try {
      lastRun = isWeb
        ? await runWebChallenge(challenge, code, { onProgress })
        : await runCodeChallenge(track, challenge, code, {
            onProgress,
            engine: store.settings().engine,
            runnerUrl: store.settings().runnerUrl,
          });

      scorecard = grade(challenge, joinedSource(code, track), lastRun);

      if (!examMode) {
        const record = store.attemptFor(challenge.id);
        const earned = xpFor(challenge, scorecard, record ? record.awardedXp : 0);
        const outcome = store.recordAttempt(challenge, scorecard, earned);
        scorecard.xpAwarded = earned;

        if (outcome.firstClear) {
          toast('Cleared! ' + challenge.title + ' — every case passing.', 'good');
          showCoach('breakthrough');
        } else if (earned > 0) {
          toast('+' + earned + ' XP', 'good');
          showCoach(scorecard.total >= 80 ? 'breakthrough' : 'struggle');
        }
      }

      resultsPane.innerHTML = resultsHtml(scorecard, lastRun, track, examMode);
      enginePill.hidden = false;
      enginePill.textContent = lastRun.engine;

      const passed = lastRun.results.filter((r) => r.passed).length;
      runStatus.textContent = `${passed}/${lastRun.results.length} cases · scored ${scorecard.total}`;

      if (onScored) onScored(scorecard, lastRun, code);
    } catch (error) {
      resultsPane.innerHTML = `
        <div class="scorecard">
          <div class="feedback-item bad"><span class="icon">✕</span><span>${escapeHtml(
            (error && error.message) || String(error)
          )}</span></div>
          <p style="font-size:0.82rem;color:var(--text-faint);padding:0 11px">
            Rust and Java compile on a shared public service (Compiler Explorer). If it is busy or unreachable,
            wait a few seconds and run again — or point the playground at your own Piston instance from Profile.
          </p>
        </div>`;
      runStatus.textContent = 'Run failed.';
    } finally {
      busy = false;
      runButton.disabled = false;
    }
  }

  runButton.addEventListener('click', run);

  const keyHandler = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      run();
    }
  };
  host.addEventListener('keydown', keyHandler);

  return {
    run,
    getCode: () => code,
    lastScore: () => scorecard,
    lastRun: () => lastRun,
    dispose: () => {
      clearTimeout(saveTimer);
      clearTimeout(previewTimer);
      host.removeEventListener('keydown', keyHandler);
      editor.dispose();
    },
  };
}

/* ------------------------------------------------------------- route entry */

let active = null;

export async function renderChallenge(host, challengeId) {
  const challenge = getChallenge(challengeId);
  const track = getTrackOf(challengeId);

  if (!challenge || !track) {
    render(host, '<div class="view"><div class="empty-state"><h3>Challenge not found</h3></div></div>');
    return;
  }

  if (active) active.dispose();
  host.className = 'view wide';
  active = await mountWorkspace(host, { challenge, track });
}

export function disposeChallenge() {
  if (active) {
    active.dispose();
    active = null;
  }
}
