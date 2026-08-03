/* ============================================================
   view-hall.js — the Hall of Fame.
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';
import * as store from './store.js';
import { escapeHtml, relativeTime, render, toast } from './ui.js';
import { board, publish, isCloudEnabled, myRecord } from './leaderboard.js';
import { openProfileDialog } from './identity.js';

const MEDALS = ['🥇', '🥈', '🥉'];

function courseChips(courses) {
  return (courses || [])
    .map((id) => {
      const track = TRACKS.find((t) => t.id === id);
      if (!track) return '';
      return `<span class="mini-glyph" style="background:${track.accent}" title="${escapeHtml(track.name)}">${track.glyph}</span>`;
    })
    .join('');
}

export async function renderHall(host) {
  const mine = myRecord();

  render(
    host,
    `
    <div class="page-head">
      <div class="eyebrow">Hall of Fame</div>
      <h1>The board</h1>
      <p>Ranked by XP, then by challenges cleared, then by streak. Lessons and challenges both count —
         showing up consistently beats one heroic afternoon.</p>
    </div>
    <div id="board-slot"><div class="empty-state"><h3>Loading the board…</h3></div></div>`
  );

  const slot = host.querySelector('#board-slot');
  const result = await board(50);

  const modeNote = isCloudEnabled()
    ? result.mode === 'shared'
      ? 'Shared board — everyone training on this site.'
      : 'Could not reach the shared board, showing local results. ' + escapeHtml(result.error || '')
    : 'Local board — this device only. The site owner can switch on a shared board in <code>config.js</code>.';

  if (!result.rows.length) {
    slot.innerHTML = `
      <div class="card">
        <div class="empty-state">
          <h3>Nobody on the board yet</h3>
          <p style="font-size:0.86rem">Create a profile and finish a lesson — you will be first.</p>
          <button class="btn primary" id="join-board" style="margin-top:14px">Create a profile</button>
        </div>
      </div>`;
    slot.querySelector('#join-board').addEventListener('click', async () => {
      if (await openProfileDialog({ allowSkip: true })) renderHall(host);
    });
    return;
  }

  slot.innerHTML = `
    <div class="card" style="padding:0;overflow:hidden">
      <div class="pane-head" style="padding:12px 18px">
        <span class="pill ${result.mode === 'shared' ? 'solid' : ''}"
              style="${result.mode === 'shared' ? 'background:var(--green);color:#04140a' : ''}">
          ${result.mode === 'shared' ? 'live' : 'local'}
        </span>
        <span style="font-size:0.78rem;color:var(--text-faint)">${modeNote}</span>
        <div class="spacer"></div>
        <button class="btn sm ghost" id="refresh-board">Refresh</button>
      </div>

      <div class="table-scroll">
        <table class="board-table">
          <thead>
            <tr>
              <th style="width:3.5rem">#</th>
              <th>Athlete</th>
              <th>Training</th>
              <th style="text-align:right">Lessons</th>
              <th style="text-align:right">Cleared</th>
              <th style="text-align:right">Streak</th>
              <th style="text-align:right">XP</th>
            </tr>
          </thead>
          <tbody>
            ${result.rows
              .map((row) => {
                const isMe = mine && row.username === mine.username;
                return `
                <tr class="${isMe ? 'is-me' : ''}">
                  <td class="rank">${row.rank <= 3 ? MEDALS[row.rank - 1] : row.rank}</td>
                  <td>
                    <div class="athlete">
                      <span class="athlete-name">${escapeHtml(row.display_name || row.username)}</span>
                      ${isMe ? '<span class="pill" style="font-size:0.6rem">you</span>' : ''}
                    </div>
                    <div class="athlete-handle">@${escapeHtml(row.username)}${
                      row.updated_at ? ' · ' + relativeTime(new Date(row.updated_at).getTime()) : ''
                    }</div>
                  </td>
                  <td><div class="mini-glyphs">${courseChips(row.courses)}</div></td>
                  <td style="text-align:right;font-family:var(--font-mono)">${row.lessons_done || 0}</td>
                  <td style="text-align:right;font-family:var(--font-mono)">${row.cleared || 0}</td>
                  <td style="text-align:right;font-family:var(--font-mono)">${row.streak || 0}</td>
                  <td style="text-align:right;font-family:var(--font-mono);color:var(--gold-soft);font-weight:600">${(row.xp || 0).toLocaleString()}</td>
                </tr>`;
              })
              .join('')}
          </tbody>
        </table>
      </div>
    </div>

    ${
      mine
        ? `<div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap">
             <button class="btn" id="push-score">Publish my latest score</button>
             <button class="btn ghost" id="edit-profile">Edit profile</button>
           </div>`
        : `<div class="card" style="margin-top:18px;display:flex;align-items:center;gap:16px;flex-wrap:wrap">
             <div style="flex:1;min-width:220px">
               <strong>Not on the board yet</strong>
               <p style="font-size:0.85rem;color:var(--text-dim);margin-top:3px">
                 Pick a username — no password, no email — and your progress starts counting.
               </p>
             </div>
             <button class="btn primary" id="join-board">Create a profile</button>
           </div>`
    }`;

  slot.querySelector('#refresh-board').addEventListener('click', () => renderHall(host));

  const joinButton = slot.querySelector('#join-board');
  if (joinButton) {
    joinButton.addEventListener('click', async () => {
      if (await openProfileDialog({ allowSkip: true })) renderHall(host);
    });
  }

  const pushButton = slot.querySelector('#push-score');
  if (pushButton) {
    pushButton.addEventListener('click', async () => {
      pushButton.disabled = true;
      pushButton.textContent = 'Publishing…';
      const outcome = await publish();
      pushButton.disabled = false;
      pushButton.textContent = 'Publish my latest score';
      toast(
        outcome.mode === 'shared' ? 'Score published to the shared board.' : 'Saved locally. ' + (outcome.error || ''),
        outcome.mode === 'shared' ? 'good' : 'info'
      );
      renderHall(host);
    });
  }

  const editButton = slot.querySelector('#edit-profile');
  if (editButton) {
    editButton.addEventListener('click', async () => {
      if (await openProfileDialog({ allowSkip: true })) renderHall(host);
    });
  }
}
