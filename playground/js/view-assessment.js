/* ============================================================
   view-assessment.js — the test ground.

   List -> timed exam -> rubric report.

   During an exam: no hints, no reference solution, no per-case
   detail, nothing written to your progress. Everything is
   released and recorded the moment you submit.
   ============================================================ */

import { ASSESSMENTS, getAssessment, gradeFor } from '../data/assessments.js';
import { getChallenge, getTrackOf, getTrack, DIFFICULTY } from '../data/curriculum.js';
import * as store from './store.js';
import { escapeHtml, scoreRing, dimensionBar, radar, toast, modal, formatDuration, relativeTime, render } from './ui.js';
import { mountWorkspace } from './view-challenge.js';
import { aggregate, xpFor } from './grader.js';

/* ------------------------------------------------------------------- list */

export function renderAssessmentList(host) {
  const html = `
    <div class="page-head">
      <div class="eyebrow">Test ground</div>
      <h1>Assessments</h1>
      <p>Timed, multi-problem exams. No hints, no reference solutions, no per-case feedback until you submit.
         Each one produces a rubric scorecard you can compare against your previous attempts.</p>
    </div>

    <div class="grid cols-2">
      ${ASSESSMENTS.map((assessment) => {
        const best = store.bestAssessment(assessment.id);
        const track = assessment.track === 'mixed' ? null : getTrack(assessment.track);
        const attempts = store.assessmentHistory(assessment.id).length;

        return `
          <div class="exam-card" style="border-top:2px solid ${track ? track.accent : 'var(--purple)'}">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px">
              <div>
                <h3>${escapeHtml(assessment.title)}</h3>
                <div style="font-size:0.74rem;color:var(--text-faint);margin-top:2px">${escapeHtml(assessment.level)}</div>
              </div>
              ${best ? `<span class="score-badge" style="color:${gradeFor(best.total).color}">${gradeFor(best.total).grade}</span>` : ''}
            </div>

            <p class="blurb">${escapeHtml(assessment.blurb)}</p>

            <div class="exam-meta">
              <span class="pill">${assessment.minutes} min</span>
              <span class="pill">${assessment.challengeIds.length} problems</span>
              <span class="pill">${track ? escapeHtml(track.name) : 'Polyglot'}</span>
              ${attempts ? `<span class="pill">${attempts} attempt${attempts === 1 ? '' : 's'}</span>` : ''}
            </div>

            ${
              best
                ? `<div style="font-size:0.76rem;color:var(--text-dim)">
                     Best: <strong style="color:${gradeFor(best.total).color}">${best.total}/100</strong> · ${relativeTime(best.at)}
                   </div>`
                : ''
            }

            <div style="display:flex;gap:8px">
              <a class="btn primary sm" href="#/exam/${assessment.id}">${best ? 'Retake' : 'Begin'} →</a>
              ${attempts ? `<a class="btn ghost sm" href="#/report/${assessment.id}">History</a>` : ''}
            </div>
          </div>`;
      }).join('')}
    </div>`;

  render(host, html);
}

/* ------------------------------------------------------------------- exam */

let examState = null;

function clearExam() {
  if (!examState) return;
  clearInterval(examState.ticker);
  if (examState.workspace) examState.workspace.dispose();
  examState = null;
}

export function disposeAssessment() {
  clearExam();
}

export async function renderExam(host, assessmentId) {
  const assessment = getAssessment(assessmentId);
  if (!assessment) {
    render(host, '<div class="view"><div class="empty-state"><h3>Unknown assessment</h3></div></div>');
    return;
  }

  clearExam();
  host.className = 'view wide';

  const problems = assessment.challengeIds
    .map((id) => ({ challenge: getChallenge(id), track: getTrackOf(id) }))
    .filter((p) => p.challenge && p.track);

  render(
    host,
    `
    <div class="exam-shell">
      <div class="pane-head" style="padding:9px 22px;gap:14px;flex-wrap:wrap">
        <strong style="font-family:var(--font-head);font-size:0.92rem">${escapeHtml(assessment.title)}</strong>
        <div class="exam-nav" id="exam-nav">
          ${problems.map((_, i) => `<button class="exam-nav-item${i === 0 ? ' active' : ''}" data-index="${i}">${i + 1}</button>`).join('')}
        </div>
        <div class="spacer" style="margin-left:auto"></div>
        <span class="exam-timer" id="exam-timer">--:--</span>
        <button class="btn accent sm" id="submit-exam">Submit assessment</button>
      </div>
      <div id="exam-workspace"></div>
    </div>`
  );

  examState = {
    assessment,
    problems,
    index: 0,
    // per-problem: { code, scorecard, run }
    answers: problems.map(() => ({ code: null, scorecard: null, run: null })),
    remaining: assessment.minutes * 60,
    startedAt: Date.now(),
    workspace: null,
    ticker: null,
    submitted: false,
  };

  const timerNode = host.querySelector('#exam-timer');
  const navNode = host.querySelector('#exam-nav');
  const workspaceHost = host.querySelector('#exam-workspace');

  function paintNav() {
    if (!examState) return;
    navNode.querySelectorAll('.exam-nav-item').forEach((button, i) => {
      button.classList.toggle('active', i === examState.index);
      button.classList.toggle('answered', Boolean(examState.answers[i].scorecard));
    });
  }

  function paintTimer() {
    if (!examState) return;
    timerNode.textContent = formatDuration(examState.remaining);
    timerNode.classList.toggle('warning', examState.remaining <= 300 && examState.remaining > 60);
    timerNode.classList.toggle('danger', examState.remaining <= 60);
  }

  async function openProblem(index) {
    if (!examState) return;
    if (examState.workspace) {
      examState.answers[examState.index].code = examState.workspace.getCode();
      examState.workspace.dispose();
    }
    examState.index = index;
    const { challenge, track } = examState.problems[index];

    examState.workspace = await mountWorkspace(workspaceHost, {
      challenge,
      track,
      examMode: true,
      initialCode: examState.answers[index].code,
      onScored: (scorecard, run, code) => {
        examState.answers[index] = { code, scorecard, run };
        paintNav();
      },
    });
    paintNav();
  }

  navNode.addEventListener('click', (event) => {
    const button = event.target.closest('[data-index]');
    if (button) openProblem(Number(button.dataset.index));
  });

  host.querySelector('#submit-exam').addEventListener('click', () => confirmSubmit(host));

  examState.ticker = setInterval(() => {
    if (!examState) return;
    examState.remaining -= 1;
    paintTimer();
    if (examState.remaining <= 0) {
      toast('Time is up — submitting automatically.', 'info');
      finishExam(host, true);
    }
  }, 1000);

  paintTimer();
  await openProblem(0);
}

function confirmSubmit(host) {
  if (!examState) return;
  const unanswered = examState.answers.filter((a) => !a.scorecard).length;

  modal(
    `<h2>Submit assessment?</h2>
     <p style="color:var(--text-dim);font-size:0.9rem">
       ${
         unanswered
           ? `<strong style="color:var(--amber)">${unanswered} problem${unanswered === 1 ? ' has' : 's have'} never been run</strong> and will score zero.
              Run each problem at least once before submitting.`
           : 'All problems have been run. Your last run for each is the one that counts.'
       }
     </p>
     <div class="modal-actions">
       <button class="btn ghost" data-close>Keep working</button>
       <button class="btn accent" id="confirm-submit">Submit</button>
     </div>`,
    {
      onMount: (node, close) => {
        node.querySelector('#confirm-submit').addEventListener('click', () => {
          close();
          finishExam(host, false);
        });
      },
    }
  );
}

function finishExam(host, timedOut) {
  if (!examState || examState.submitted) return;
  examState.submitted = true;
  clearInterval(examState.ticker);

  const { assessment, problems, answers } = examState;

  const perProblem = problems.map((problem, index) => {
    const answer = answers[index];
    const scorecard = answer.scorecard;
    return {
      challengeId: problem.challenge.id,
      title: problem.challenge.title,
      track: problem.track.name,
      accent: problem.track.accent,
      total: scorecard ? scorecard.total : 0,
      cleared: scorecard ? scorecard.cleared : false,
      dimensions: scorecard
        ? {
            correctness: scorecard.dimensions.correctness.score,
            efficiency: scorecard.dimensions.efficiency.score,
            quality: scorecard.dimensions.quality.score,
            style: scorecard.dimensions.style.score,
          }
        : { correctness: 0, efficiency: 0, quality: 0, style: 0 },
      feedback: scorecard ? scorecard.feedback : [{ tone: 'bad', text: 'Never run — scored zero.' }],
      run: scorecard ? true : false,
    };
  });

  // Reuse the aggregate helper by rebuilding minimal scorecard shapes.
  const summary = aggregate(
    perProblem.map((p) => ({
      total: p.total,
      cleared: p.cleared,
      dimensions: {
        correctness: { score: p.dimensions.correctness },
        efficiency: { score: p.dimensions.efficiency },
        quality: { score: p.dimensions.quality },
        style: { score: p.dimensions.style },
      },
    }))
  );

  const elapsed = Math.round((Date.now() - examState.startedAt) / 1000);

  const record = {
    id: assessment.id,
    title: assessment.title,
    at: Date.now(),
    total: summary.total,
    dimensions: summary.dimensions,
    cleared: summary.cleared,
    count: summary.count,
    elapsed,
    timedOut,
    perProblem,
  };

  store.recordAssessment(record);

  // Assessment work still feeds the mastery map and XP, at a discount:
  // exam conditions are harder, but the reference solution was never shown.
  for (const problem of problems) {
    const answer = answers[problems.indexOf(problem)];
    if (!answer.scorecard) continue;
    const existing = store.attemptFor(problem.challenge.id);
    const earned = xpFor(problem.challenge, answer.scorecard, existing ? existing.awardedXp : 0);
    if (earned > 0) store.recordAttempt(problem.challenge, answer.scorecard, earned);
  }

  clearExam();
  window.location.hash = '#/report/' + assessment.id;
}

/* ----------------------------------------------------------------- report */

export function renderReport(host, assessmentId) {
  const assessment = getAssessment(assessmentId);
  const history = store.assessmentHistory(assessmentId);

  if (!assessment || !history.length) {
    render(
      host,
      `<div class="page-head"><h1>No results yet</h1><p>Take this assessment first.</p></div>
       <a class="btn primary" href="#/assess">Back to assessments</a>`
    );
    return;
  }

  const latest = history[0];
  const best = store.bestAssessment(assessmentId);
  const band = gradeFor(latest.total);

  const dimensionPoints = [
    { label: 'correctness', value: latest.dimensions.correctness },
    { label: 'efficiency', value: latest.dimensions.efficiency },
    { label: 'quality', value: latest.dimensions.quality },
    { label: 'style', value: latest.dimensions.style },
  ];

  const html = `
    <div class="page-head">
      <div class="eyebrow">Assessment report</div>
      <h1>${escapeHtml(latest.title)}</h1>
      <p>Completed ${relativeTime(latest.at)} in ${formatDuration(latest.elapsed)}${
        latest.timedOut ? ' — the clock ran out' : ''
      }.</p>
    </div>

    <div class="grid cols-2" style="margin-bottom:22px">
      <div class="card">
        <div class="score-hero" style="margin-bottom:0">
          ${scoreRing(latest.total, band.color, 96)}
          <div>
            <div class="grade-letter" style="color:${band.color}">${band.grade}</div>
            <div class="grade-label">${escapeHtml(band.label)}</div>
            <div style="font-size:0.8rem;color:var(--text-dim);margin-top:6px">
              ${latest.cleared} of ${latest.count} problems fully solved
            </div>
            ${
              best && best.at !== latest.at
                ? `<div style="font-size:0.76rem;color:var(--text-faint);margin-top:3px">Personal best: ${best.total}</div>`
                : ''
            }
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-head"><h3>Rubric profile</h3><span class="hint">averaged across problems</span></div>
        <div class="radar-wrap">
          ${radar(dimensionPoints, 190)}
          <div class="radar-legend">
            ${dimensionPoints
              .map(
                (point) =>
                  `<div class="radar-legend-row"><span>${escapeHtml(point.label)}</span><span class="n">${point.value}</span></div>`
              )
              .join('')}
          </div>
        </div>
      </div>
    </div>

    <div class="section-label">Problem breakdown</div>
    <div class="grid cols-2" style="margin-bottom:26px">
      ${latest.perProblem
        .map((problem) => {
          const problemBand = gradeFor(problem.total);
          return `
          <div class="card" style="border-top:2px solid ${problem.accent}">
            <div class="card-head">
              <div>
                <h3 style="font-size:0.95rem">${escapeHtml(problem.title)}</h3>
                <div style="font-size:0.73rem;color:var(--text-faint)">${escapeHtml(problem.track)}</div>
              </div>
              <span class="score-badge" style="color:${problemBand.color}">${problem.total}</span>
            </div>
            ${dimensionBar('Correctness', problem.dimensions.correctness, 60, 'var(--green)')}
            ${dimensionBar('Efficiency', problem.dimensions.efficiency, 15, 'var(--blue-soft)')}
            ${dimensionBar('Quality', problem.dimensions.quality, 15, 'var(--purple)')}
            ${dimensionBar('Style', problem.dimensions.style, 10, 'var(--gold)')}
            <div style="margin-top:12px">
              ${problem.feedback
                .slice(0, 3)
                .map(
                  (note) =>
                    `<div class="feedback-item ${note.tone}"><span class="icon">${
                      note.tone === 'good' ? '✓' : note.tone === 'bad' ? '✕' : '!'
                    }</span><span>${escapeHtml(note.text)}</span></div>`
                )
                .join('')}
            </div>
            <a class="btn sm ghost" href="#/challenge/${problem.challengeId}" style="margin-top:10px">Practise this →</a>
          </div>`;
        })
        .join('')}
    </div>

    ${
      history.length > 1
        ? `<div class="card" style="margin-bottom:22px">
             <div class="card-head"><h3>Attempt history</h3><span class="hint">${history.length} runs</span></div>
             ${history
               .map((run) => {
                 const runBand = gradeFor(run.total);
                 return `
                   <div class="challenge-row" style="padding-left:0;padding-right:0">
                     <span class="score-badge" style="color:${runBand.color}">${runBand.grade}</span>
                     <div class="challenge-main">
                       <div class="t">${run.total}/100</div>
                       <div class="m"><span>${run.cleared}/${run.count} solved</span><span>${formatDuration(run.elapsed)}</span><span>${relativeTime(run.at)}</span></div>
                     </div>
                   </div>`;
               })
               .join('')}
           </div>`
        : ''
    }

    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <a class="btn primary" href="#/exam/${assessment.id}">Retake assessment</a>
      <a class="btn ghost" href="#/assess">All assessments</a>
    </div>`;

  render(host, html);
}
