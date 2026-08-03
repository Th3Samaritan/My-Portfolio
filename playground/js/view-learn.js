/* ============================================================
   view-learn.js — courses and the lesson reader.

   Renders lesson blocks (see data/lessons-*.js for the schema):
      text / note / code / web / try / tryweb / quiz / case /
      debug / complete / refactor

   Runnable examples use a lightweight editable code box rather
   than a full editor — a lesson can hold a dozen of them, and
   Monaco instances are expensive. Graded exercises get Monaco,
   because that is where you actually write.
   ============================================================ */

import {
  TRACKS,
  getTrack,
  getLesson,
  getTrackOfLesson,
  lessonsByTopic,
  lessonsByDifficulty,
  nextLesson,
  previousLesson,
  lessonTasks,
} from '../data/curriculum.js';
import * as store from './store.js';
import { md, escapeHtml, toast, modal, render } from './ui.js';
import { createEditor } from './editor.js';
import { runScratch, runCodeChallenge, runWebChallenge, runJsCases, buildPreviewDocument } from './runner.js';
import { showCoach } from './coach.js';

/* --------------------------------------------------------------- utilities */

/** XP a lesson is worth: a base, plus its graded content. */
export function lessonXp(lesson) {
  const { exercises, quizzes } = lessonTasks(lesson);
  return 40 + exercises.length * 25 + quizzes.length * 10;
}

const LANG_LABEL = { python: 'python', rust: 'rust', java: 'java', javascript: 'javascript' };

function editableCodeBox(id, code, lang) {
  return `
    <div class="code-run" data-lang="${escapeHtml(lang)}">
      <div class="code-run-head">
        <span class="code-lang">${escapeHtml(LANG_LABEL[lang] || lang)}</span>
        <div class="spacer"></div>
        <button class="btn sm" data-run="${id}">Run ▸</button>
      </div>
      <textarea class="code-area" id="src-${id}" spellcheck="false" rows="${Math.min(
        22,
        Math.max(3, code.split('\n').length)
      )}">${escapeHtml(code)}</textarea>
      <pre class="code-out" id="out-${id}" hidden></pre>
    </div>`;
}

function webBox(id, files) {
  return `
    <div class="web-run" data-id="${id}">
      <div class="code-run-head">
        <div class="tabs" data-webtabs="${id}">
          <button class="tab active" data-file="html">html</button>
          <button class="tab" data-file="css">css</button>
          <button class="tab" data-file="js">js</button>
        </div>
        <div class="spacer"></div>
        <button class="btn sm" data-webrun="${id}">Update preview ▸</button>
      </div>
      <textarea class="code-area" id="web-${id}" spellcheck="false" rows="12">${escapeHtml(files.html || '')}</textarea>
      <iframe class="lesson-preview" id="prev-${id}" title="Live preview"
              sandbox="allow-scripts allow-same-origin allow-forms allow-modals"></iframe>
    </div>`;
}

/* -------------------------------------------------------------- course list */

export function renderLearnHome(host) {
  const chosen = store.profile().courses || [];

  const cards = TRACKS.map((track) => {
    const stats = store.lessonStats(track);
    const picked = chosen.includes(track.id);
    const totalMinutes = (track.lessons || []).reduce((n, l) => n + l.minutes, 0);

    return `
      <a class="track-card" href="#/course/${track.id}" style="--accent:${track.accent}">
        <div class="track-card-head">
          <div class="track-glyph" style="background:${track.accent}">${track.glyph}</div>
          <div>
            <h3>${escapeHtml(track.name)}${picked ? ' <span class="pill" style="font-size:0.6rem">chosen</span>' : ''}</h3>
            <div class="tagline">${(track.lessons || []).length} lessons · about ${Math.round(totalMinutes / 60)}h</div>
          </div>
        </div>
        <p class="blurb">${escapeHtml(track.forBeginners || track.blurb)}</p>
        <div class="progress-track"><div class="progress-fill" style="width:${(stats.completion * 100).toFixed(0)}%"></div></div>
        <div class="track-meta">
          <span>${stats.done}/${stats.total} lessons done</span>
          <span>${stats.done === stats.total && stats.total ? 'complete' : picked ? 'in your plan' : 'browse'}</span>
        </div>
      </a>`;
  }).join('');

  render(
    host,
    `
    <div class="page-head">
      <div class="eyebrow">Learn</div>
      <h1>Courses</h1>
      <p>Every course starts from nothing — no prior programming assumed. Read, run the examples, do the
         exercises, then take on the graded challenges when you are ready.</p>
    </div>

    <div class="callout tip" style="margin-bottom:22px">
      <strong>New to all of this?</strong> Start with <a href="#/course/python">Python</a> or
      <a href="#/course/web">Web Dev</a>. Python teaches you to think like a programmer; Web Dev is the most
      visual, since every example is a live page you can edit.
    </div>

    <div class="grid cols-2">${cards}</div>`
  );
}

/* ------------------------------------------------------------- course page */

export function renderCourse(host, trackId) {
  const track = getTrack(trackId);
  if (!track || !(track.lessons || []).length) {
    render(host, '<div class="empty-state"><h3>No course here yet</h3></div>');
    return;
  }

  const stats = store.lessonStats(track);
  const groups = lessonsByTopic(track);
  let position = 0;

  const DIFF_LABELS = { beginner: 'Beginner', intermediate: 'Intermediate', advanced: 'Advanced' };

  const body = groups
    .map(
      (group, topicIndex) => {
        const difficultyGroups = lessonsByDifficulty(group.lessons);
        const doneInTopic = group.lessons.filter((l) => store.isLessonDone(l.id)).length;
        return `
        <section class="tier">
          <div class="tier-head">
            <div class="tier-index">${String(topicIndex + 1).padStart(2, '0')}</div>
            <div>
              <h3>${escapeHtml(group.topic.name)}</h3>
              <p>${escapeHtml(group.topic.blurb)}</p>
            </div>
            <div class="tier-progress">${doneInTopic}/${group.lessons.length}</div>
          </div>
          ${difficultyGroups
            .map(
              (dg) => `
            <div class="difficulty-section">
              <div class="difficulty-label" data-level="${dg.difficulty}">${escapeHtml(dg.label)}</div>
              ${dg.lessons
                .map((lesson) => {
                  position += 1;
                  const done = store.isLessonDone(lesson.id);
                  const { exercises, quizzes } = lessonTasks(lesson);
                  return `
                <a class="challenge-row" href="#/lesson/${lesson.id}">
                  <div class="challenge-status ${done ? 'done' : ''}">${done ? '✓' : position}</div>
                  <div class="challenge-main">
                    <div class="t">${escapeHtml(lesson.title)}</div>
                    <div class="m">
                      <span>${lesson.minutes} min</span>
                      <span>${exercises.length} exercise${exercises.length === 1 ? '' : 's'}</span>
                      <span>${quizzes.length} quiz${quizzes.length === 1 ? '' : 'zes'}</span>
                      <span>${escapeHtml(lesson.summary)}</span>
                    </div>
                  </div>
                  <span class="pill">${lessonXp(lesson)} XP</span>
                </a>`;
                })
                .join('')}
            </div>`
            )
            .join('')}
        </section>`;
      }
    )
    .join('');

  render(
    host,
    `
    <div class="page-head">
      <div class="eyebrow" style="color:${track.accent}">Course · ${escapeHtml(track.name)}</div>
      <h1>${escapeHtml(track.name)} from scratch</h1>
      <p>${escapeHtml(track.forBeginners || track.blurb)}</p>
      <div style="display:flex;gap:20px;align-items:center;margin-top:18px;flex-wrap:wrap">
        <div style="min-width:200px;flex:1;max-width:340px">
          <div class="xp-bar-head">
            <span>${stats.done} of ${stats.total} lessons</span>
            <span>${Math.round(stats.completion * 100)}%</span>
          </div>
          <div class="progress-track"><div class="progress-fill" style="width:${stats.completion * 100}%"></div></div>
        </div>
        <a class="btn ghost sm" href="#/track/${track.id}">Skip to the graded challenges →</a>
      </div>
    </div>
    ${body}`
  );
}

/* ------------------------------------------------------------ lesson reader */

let activeEditors = [];

export function disposeLearn() {
  activeEditors.forEach((editor) => {
    try {
      editor.dispose();
    } catch {
      /* already gone */
    }
  });
  activeEditors = [];
}

export async function renderLesson(host, lessonId) {
  const lesson = getLesson(lessonId);
  const track = getTrackOfLesson(lessonId);
  if (!lesson || !track) {
    render(host, '<div class="empty-state"><h3>Lesson not found</h3></div>');
    return;
  }

  disposeLearn();

  const progress = store.lessonProgress(lessonId);
  const { exercises, quizzes, total } = lessonTasks(lesson);
  const previous = previousLesson(lessonId);
  const upcoming = nextLesson(lessonId);

  /* ---- build the block HTML ---- */
  let runIndex = 0;
  let exerciseIndex = 0;
  let quizIndex = 0;

  const blocksHtml = lesson.blocks
    .map((block) => {
      switch (block.t) {
        case 'text':
          return `<div class="lesson-prose">${md(block.md)}</div>`;

        case 'note':
          return `
            <div class="callout ${escapeHtml(block.tone || 'tip')}">
              ${block.title ? `<strong>${escapeHtml(block.title)}</strong>` : ''}
              ${md(block.md)}
            </div>`;

        case 'code': {
          const id = 'r' + runIndex++;
          const lang = block.lang || track.lang;
          return `
            ${block.md ? `<div class="lesson-prose">${md(block.md)}</div>` : ''}
            ${block.run ? editableCodeBox(id, block.code, lang) : `<pre class="code-static"><code>${escapeHtml(block.code)}</code></pre>`}`;
        }

        case 'web': {
          const id = 'w' + runIndex++;
          return `
            ${block.md ? `<div class="lesson-prose">${md(block.md)}</div>` : ''}
            ${webBox(id, block.files)}`;
        }

        case 'case': {
          const id = 'c' + runIndex++;
          const lang = block.lang || track.lang;
          return `
            <div class="case-study">
              <div class="case-label">Case study</div>
              <h3>${escapeHtml(block.title)}</h3>
              <div class="lesson-prose">${md(block.md)}</div>
              ${
                block.files
                  ? webBox(id, block.files)
                  : block.code
                    ? block.run
                      ? editableCodeBox(id, block.code, lang)
                      : `<pre class="code-static"><code>${escapeHtml(block.code)}</code></pre>`
                    : ''
              }
            </div>`;
        }

        case 'try':
        case 'tryweb':
        case 'debug':
        case 'complete':
        case 'refactor': {
          const key = 'e' + exerciseIndex++;
          const solved = Boolean(progress.exercises[key]);
          const labels = {
            'try': 'Exercise',
            'tryweb': 'Exercise',
            'debug': 'Bug fix',
            'complete': 'Fill in',
            'refactor': 'Refactor',
          };
          const label = labels[block.t] || 'Exercise';
          return `
            <div class="exercise ${solved ? 'solved' : ''} ${block.t}" data-exercise="${key}" data-kind="${block.t}">
              <div class="exercise-head">
                <span class="exercise-badge">${solved ? '✓ solved' : label}</span>
                <div class="spacer"></div>
                ${block.hints && block.hints.length ? `<button class="btn sm ghost" data-hint="${key}">Hint</button>` : ''}
                <button class="btn sm ghost" data-solution="${key}">Show answer</button>
                <button class="btn sm primary" data-check="${key}">Check ▸</button>
              </div>
              <div class="lesson-prose">${md(block.prompt)}</div>
              ${
                block.bug_description
                  ? `<div class="callout warn" style="margin-bottom:8px"><strong>What is wrong:</strong> ${md(block.bug_description)}</div>`
                  : ''
              }
              ${
                block.gap_description
                  ? `<div class="callout tip" style="margin-bottom:8px"><strong>What to fill in:</strong> ${md(block.gap_description)}</div>`
                  : ''
              }
              <div class="hint-zone" id="hints-${key}"></div>
              ${
                block.t === 'tryweb'
                  ? `<div class="tabs" data-extabs="${key}" style="margin-bottom:6px">
                       <button class="tab active" data-file="html">html</button>
                       <button class="tab" data-file="css">css</button>
                       <button class="tab" data-file="js">js</button>
                     </div>`
                  : ''
              }
              <div class="exercise-editor" id="ed-${key}"></div>
              ${block.t === 'tryweb' ? `<iframe class="lesson-preview" id="exprev-${key}" title="Your page" sandbox="allow-scripts allow-same-origin allow-forms allow-modals"></iframe>` : ''}
              <div class="exercise-result" id="res-${key}"></div>
            </div>`;
        }

        case 'quiz': {
          const key = 'q' + quizIndex++;
          const answered = Boolean(progress.quizzes[key]);
          return `
            <div class="quiz ${answered ? 'answered' : ''}" data-quiz="${key}" data-answer="${block.answer}">
              <div class="quiz-label">${answered ? '✓ Answered' : 'Check yourself'}</div>
              <p class="quiz-q">${escapeHtml(block.q)}</p>
              <div class="quiz-options">
                ${block.options
                  .map(
                    (option, i) =>
                      `<button class="quiz-option" data-choice="${i}">${escapeHtml(option)}</button>`
                  )
                  .join('')}
              </div>
              <div class="quiz-why" id="why-${key}" hidden>${escapeHtml(block.why)}</div>
            </div>`;
        }

        default:
          return '';
      }
    })
    .join('');

  render(
    host,
    `
    <div class="lesson-wrap">
      <div class="lesson-head">
        <a class="eyebrow" style="color:${track.accent}" href="#/course/${track.id}">← ${escapeHtml(track.name)} course</a>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lesson-summary">${escapeHtml(lesson.summary)}</p>
        <div class="lesson-meta">
          <span class="pill">${lesson.minutes} min</span>
          <span class="pill">${lessonXp(lesson)} XP</span>
          ${store.isLessonDone(lessonId) ? '<span class="pill" style="color:var(--green)">completed</span>' : ''}
        </div>
        <div class="objectives">
          <strong>By the end you can:</strong>
          <ul>${lesson.objectives.map((o) => `<li>${escapeHtml(o)}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="lesson-body">${blocksHtml}</div>

      <div class="lesson-foot" id="lesson-foot">
        <div class="lesson-progress-note" id="progress-note"></div>
        <div class="lesson-nav">
          ${previous ? `<a class="btn ghost" href="#/lesson/${previous.id}">← ${escapeHtml(previous.title)}</a>` : '<span></span>'}
          <button class="btn primary" id="complete-btn">Mark lesson complete</button>
          ${upcoming ? `<a class="btn" href="#/lesson/${upcoming.id}">${escapeHtml(upcoming.title)} →</a>` : `<a class="btn accent" href="#/track/${track.id}">On to the challenges →</a>`}
        </div>
      </div>
    </div>`
  );

  /* ---- wire everything up ---- */
  wireRunnableBlocks(host, lesson, track);
  await wireExercises(host, lesson, track, lessonId);
  wireQuizzes(host, lesson, lessonId);
  wireCompletion(host, lesson, lessonId, total);
}

/* ------------------------------------------------------------ runnable code */

function wireRunnableBlocks(host, lesson, track) {
  host.querySelectorAll('[data-run]').forEach((button) => {
    button.addEventListener('click', async () => {
      const id = button.dataset.run;
      const source = host.querySelector('#src-' + id).value;
      const lang = button.closest('.code-run').dataset.lang;
      const out = host.querySelector('#out-' + id);

      out.hidden = false;
      out.className = 'code-out';
      out.textContent = 'Running…';
      button.disabled = true;

      try {
        const result = await runScratch(lang, source, { runnerUrl: store.settings().runnerUrl });
        const errors = ((result.compileError || '') + '\n' + (result.stderr || '')).trim();
        out.textContent = (result.stdout || '').trim() || (errors ? '' : '(no output)');
        if (errors) {
          out.textContent = (out.textContent ? out.textContent + '\n\n' : '') + errors;
          if (!result.stdout) out.classList.add('error');
        }
      } catch (error) {
        out.textContent = String((error && error.message) || error);
        out.classList.add('error');
      } finally {
        button.disabled = false;
      }
    });
  });

  // Live-preview blocks: three files behind tabs, one iframe.
  host.querySelectorAll('.web-run').forEach((node) => {
    const id = node.dataset.id;
    const block = findWebBlock(lesson, id);
    if (!block) return;

    const files = { ...block.files };
    let active = 'html';
    const area = host.querySelector('#web-' + id);
    const frame = host.querySelector('#prev-' + id);

    const refresh = () => {
      frame.srcdoc = buildPreviewDocument(files);
    };

    node.querySelector('[data-webtabs]').addEventListener('click', (event) => {
      const tab = event.target.closest('[data-file]');
      if (!tab) return;
      files[active] = area.value;
      active = tab.dataset.file;
      node.querySelectorAll('[data-webtabs] .tab').forEach((t) => t.classList.toggle('active', t === tab));
      area.value = files[active] || '';
    });

    node.querySelector('[data-webrun]').addEventListener('click', () => {
      files[active] = area.value;
      refresh();
    });

    refresh();
  });
}

/** Web blocks are numbered in render order across code/web/case blocks. */
function findWebBlock(lesson, id) {
  let index = 0;
  for (const block of lesson.blocks) {
    if (block.t === 'code' || block.t === 'web' || block.t === 'case') {
      const prefix = block.t === 'web' ? 'w' : block.t === 'case' ? 'c' : 'r';
      if (prefix + index === id) return block;
      index += 1;
    }
  }
  return null;
}

/* ---------------------------------------------------------------- exercises */

async function wireExercises(host, lesson, track, lessonId) {
  const blocks = lesson.blocks.filter((b) => b.t === 'try' || b.t === 'tryweb' || b.t === 'debug' || b.t === 'complete' || b.t === 'refactor');

  for (let i = 0; i < blocks.length; i += 1) {
    const block = blocks[i];
    const key = 'e' + i;
    const node = host.querySelector(`[data-exercise="${key}"]`);
    if (!node) continue;

    const isWeb = block.t === 'tryweb';
    const lang = block.lang || track.lang;
    let code = isWeb ? { ...block.files } : block.starter;
    let activeFile = 'html';
    let hintsShown = 0;

    const frame = isWeb ? host.querySelector('#exprev-' + key) : null;
    const refreshPreview = () => {
      if (frame) frame.srcdoc = buildPreviewDocument(code);
    };

    const editor = await createEditor(host.querySelector('#ed-' + key), {
      language: isWeb ? 'html' : lang === 'javascript' ? 'javascript' : lang,
      value: isWeb ? code.html : code,
      fontSize: 13,
      onChange: (value) => {
        if (isWeb) {
          code[activeFile] = value;
          clearTimeout(node.__timer);
          node.__timer = setTimeout(refreshPreview, 400);
        } else {
          code = value;
        }
      },
    });
    activeEditors.push(editor);
    if (isWeb) refreshPreview();

    const tabs = node.querySelector('[data-extabs]');
    if (tabs) {
      tabs.addEventListener('click', (event) => {
        const tab = event.target.closest('[data-file]');
        if (!tab) return;
        code[activeFile] = editor.getValue();
        activeFile = tab.dataset.file;
        tabs.querySelectorAll('.tab').forEach((t) => t.classList.toggle('active', t === tab));
        editor.setValue(code[activeFile] || '');
        editor.setLanguage(activeFile === 'js' ? 'javascript' : activeFile);
      });
    }

    const hintButton = node.querySelector(`[data-hint="${key}"]`);
    if (hintButton) {
      hintButton.addEventListener('click', () => {
        const hints = block.hints || [];
        if (hintsShown >= hints.length) {
          toast('That is all the hints for this one.', 'info');
          return;
        }
        const hint = document.createElement('div');
        hint.className = 'callout tip';
        hint.innerHTML = md(hints[hintsShown]);
        node.querySelector('#hints-' + key).appendChild(hint);
        hintsShown += 1;
        if (hintsShown >= hints.length) hintButton.disabled = true;
      });
    }

    node.querySelector(`[data-solution="${key}"]`).addEventListener('click', () => {
      const text = isWeb
        ? ['html', 'css', 'js'].map((f) => `--- ${f} ---\n${block.solution[f]}`).join('\n\n')
        : block.solution;

      modal(
        `<h2>One way to do it</h2>
         <p style="color:var(--text-dim);font-size:0.86rem;margin-bottom:12px">
           Reading it will teach you more than pasting it. Try to spot the bit you were missing, then write it yourself.
         </p>
         <pre style="background:var(--bg-input);border:1px solid var(--border);padding:14px;border-radius:var(--radius-sm);overflow:auto;max-height:50vh;font-size:0.78rem"><code>${escapeHtml(text)}</code></pre>
         <div class="modal-actions">
           <button class="btn ghost" data-close>Close</button>
           <button class="btn" id="load-answer">Put it in the editor</button>
         </div>`,
        {
          onMount: (modalNode, close) => {
            modalNode.querySelector('#load-answer').addEventListener('click', () => {
              if (isWeb) {
                code = { ...block.solution };
                editor.setValue(code[activeFile] || '');
                refreshPreview();
              } else {
                code = block.solution;
                editor.setValue(code);
              }
              close();
            });
          },
        }
      );
    });

    node.querySelector(`[data-check="${key}"]`).addEventListener('click', async () => {
      const result = node.querySelector('#res-' + key);
      const button = node.querySelector(`[data-check="${key}"]`);

      if (isWeb) code[activeFile] = editor.getValue();
      else code = editor.getValue();

      button.disabled = true;
      result.className = 'exercise-result running';
      result.textContent = 'Checking…';

      try {
        let run;
        if (isWeb) {
          run = await runWebChallenge({ checks: block.checks }, code, {});
        } else if (lang === 'javascript') {
          run = await runJsCases({ cases: block.cases }, code);
        } else {
          run = await runCodeChallenge(
            { lang, kind: 'code' },
            { id: lessonId + ':' + key, cases: block.cases, preamble: block.preamble },
            code,
            { runnerUrl: store.settings().runnerUrl }
          );
        }

        const passed = run.results.filter((r) => r.passed).length;
        const allPassed = passed === run.results.length && run.results.length > 0;

        if (allPassed) {
          result.className = 'exercise-result pass';
          result.innerHTML = `<strong>✓ Correct — all ${passed} checks passed.</strong>`;
          node.classList.add('solved');
          node.querySelector('.exercise-badge').textContent = '✓ solved';
          store.markExercise(lessonId, key, true);
          updateProgressNote(host, lesson, lessonId);
          toast('Exercise solved.', 'good');
          showCoach('struggle');
        } else {
          result.className = 'exercise-result fail';
          const failures = run.results
            .filter((r) => !r.passed)
            .map(
              (r) =>
                `<li><strong>${escapeHtml(r.name)}</strong>${
                  isWeb ? '' : ` — got <code>${escapeHtml(r.got)}</code>, expected <code>${escapeHtml(r.want)}</code>`
                }</li>`
            )
            .join('');
          result.innerHTML = `
            <strong>${passed} of ${run.results.length} checks passed.</strong>
            <ul>${failures}</ul>
            ${
              run.compileError
                ? `<pre class="code-out error">${escapeHtml(run.compileError)}</pre>`
                : run.stderr && run.stderr.trim()
                  ? `<pre class="code-out error">${escapeHtml(run.stderr)}</pre>`
                  : ''
            }`;
        }
      } catch (error) {
        result.className = 'exercise-result fail';
        result.textContent = String((error && error.message) || error);
      } finally {
        button.disabled = false;
      }
    });
  }
}

/* ------------------------------------------------------------------ quizzes */

function wireQuizzes(host, lesson, lessonId) {
  const blocks = lesson.blocks.filter((b) => b.t === 'quiz');

  blocks.forEach((block, i) => {
    const key = 'q' + i;
    const node = host.querySelector(`[data-quiz="${key}"]`);
    if (!node) return;

    node.querySelectorAll('.quiz-option').forEach((option) => {
      option.addEventListener('click', () => {
        const choice = Number(option.dataset.choice);
        const correct = choice === block.answer;

        node.querySelectorAll('.quiz-option').forEach((o, index) => {
          o.classList.toggle('correct', index === block.answer);
          o.classList.toggle('wrong', index === choice && !correct);
          o.disabled = true;
        });

        node.querySelector('#why-' + key).hidden = false;
        node.classList.add('answered');
        node.querySelector('.quiz-label').textContent = correct ? '✓ Correct' : 'Not quite — here is why';

        store.markQuiz(lessonId, key, correct);
        updateProgressNote(host, lesson, lessonId);
      });
    });
  });
}

/* --------------------------------------------------------------- completion */

function countDone(lesson, lessonId) {
  const progress = store.lessonProgress(lessonId);
  const { exercises, quizzes } = lessonTasks(lesson);
  const exDone = exercises.filter((_, i) => progress.exercises['e' + i]).length;
  const qzDone = quizzes.filter((_, i) => progress.quizzes['q' + i]).length;
  return { exDone, qzDone, exTotal: exercises.length, qzTotal: quizzes.length };
}

function updateProgressNote(host, lesson, lessonId) {
  const note = host.querySelector('#progress-note');
  if (!note) return;
  const { exDone, qzDone, exTotal, qzTotal } = countDone(lesson, lessonId);
  const complete = exDone === exTotal && qzDone === qzTotal;

  note.innerHTML = complete
    ? `<span style="color:var(--green)">Everything in this lesson is done.</span>`
    : `Exercises ${exDone}/${exTotal} · Quizzes ${qzDone}/${qzTotal} — you can mark it complete either way.`;
}

function wireCompletion(host, lesson, lessonId, total) {
  updateProgressNote(host, lesson, lessonId);

  const button = host.querySelector('#complete-btn');
  if (store.isLessonDone(lessonId)) {
    button.textContent = '✓ Completed';
    button.disabled = true;
    button.classList.remove('primary');
  }

  button.addEventListener('click', () => {
    const awarded = store.completeLesson(lessonId, lessonXp(lesson));
    button.textContent = '✓ Completed';
    button.disabled = true;
    button.classList.remove('primary');
    if (awarded) { toast(`Lesson complete — +${awarded} XP`, 'good'); showCoach('complete'); }
    updateProgressNote(host, lesson, lessonId);
  });
}
