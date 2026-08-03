/* ============================================================
   identity.js — who you are, with no password.

   You pick a username, a display name, and the courses you want.
   That is the entire sign-up. Progress lives in this browser;
   the username exists so the Hall of Fame has something to call
   you.

   No password means no account recovery and no real security —
   which is exactly right for a training log, and is stated
   plainly to the user rather than implied.
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';
import * as store from './store.js';
import { escapeHtml, modal, toast } from './ui.js';
import { isUsernameTaken, publish, isCloudEnabled } from './leaderboard.js';

const USERNAME_RULE = /^[a-zA-Z0-9_-]{3,20}$/;

export function validateUsername(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'Pick a username.';
  if (!USERNAME_RULE.test(trimmed)) {
    return '3–20 characters: letters, numbers, hyphens and underscores only.';
  }
  return null;
}

/* ------------------------------------------------------------- onboarding */

function formHtml(existing) {
  const chosen = existing.courses || [];

  return `
    <h2>Welcome to The GYM</h2>
    <p style="color:var(--text-dim);font-size:0.9rem;margin-bottom:20px">
      Pick a name and choose what you want to train. No password, no email — your progress is saved
      in this browser, and your username is just what the Hall of Fame calls you.
    </p>

    <label class="field-label" for="gym-username">Username</label>
    <input id="gym-username" class="field-input" placeholder="ada_l" maxlength="20"
           value="${escapeHtml(existing.username || '')}" autocomplete="off" />
    <div class="field-error" id="username-error"></div>

    <label class="field-label" for="gym-name" style="margin-top:14px">Display name</label>
    <input id="gym-name" class="field-input" placeholder="Ada Lovelace" maxlength="40"
           value="${escapeHtml(existing.name || '')}" autocomplete="off" />

    <div class="field-label" style="margin-top:20px">What do you want to learn?</div>
    <p style="font-size:0.8rem;color:var(--text-faint);margin-bottom:10px">
      Pick as many as you like — you can change this any time, and nothing is locked.
    </p>
    <div class="course-picker">
      ${TRACKS.map(
        (track) => `
        <button type="button" class="course-pick${chosen.includes(track.id) ? ' picked' : ''}"
                data-course="${track.id}" style="--accent:${track.accent}">
          <span class="track-glyph" style="background:${track.accent};width:30px;height:30px;font-size:0.7rem">${track.glyph}</span>
          <span class="course-pick-text">
            <strong>${escapeHtml(track.name)}</strong>
            <small>${escapeHtml(track.forBeginners || track.blurb)}</small>
          </span>
          <span class="course-tick">✓</span>
        </button>`
      ).join('')}
    </div>

    <div class="modal-actions">
      <button class="btn ghost" id="skip-signup">Just let me look around</button>
      <button class="btn primary" id="save-signup">Start training</button>
    </div>

    <p style="font-size:0.72rem;color:var(--text-faint);margin-top:14px;text-align:right">
      ${
        isCloudEnabled()
          ? 'Your name and score will appear on the shared Hall of Fame.'
          : 'This copy runs a local Hall of Fame — nothing leaves your device.'
      }
    </p>`;
}

/**
 * Show the sign-up / edit-profile dialog.
 * @returns {Promise<object|null>} the saved profile, or null if skipped
 */
export function openProfileDialog({ allowSkip = true } = {}) {
  return new Promise((resolve) => {
    const existing = store.profile();
    let picked = [...(existing.courses || [])];

    modal(formHtml(existing), {
      onMount: (node, close) => {
        const usernameInput = node.querySelector('#gym-username');
        const nameInput = node.querySelector('#gym-name');
        const errorNode = node.querySelector('#username-error');
        const skipButton = node.querySelector('#skip-signup');

        if (!allowSkip && skipButton) skipButton.remove();

        node.querySelectorAll('[data-course]').forEach((button) => {
          button.addEventListener('click', () => {
            const id = button.dataset.course;
            if (picked.includes(id)) {
              picked = picked.filter((c) => c !== id);
              button.classList.remove('picked');
            } else {
              picked.push(id);
              button.classList.add('picked');
            }
          });
        });

        if (skipButton) {
          skipButton.addEventListener('click', () => {
            close();
            resolve(null);
          });
        }

        node.querySelector('#save-signup').addEventListener('click', async () => {
          const username = usernameInput.value.trim();
          const problem = validateUsername(username);

          if (problem) {
            errorNode.textContent = problem;
            usernameInput.focus();
            return;
          }

          const changedName = username.toLowerCase() !== String(existing.username || '').toLowerCase();
          if (changedName) {
            errorNode.textContent = 'Checking…';
            if (await isUsernameTaken(username)) {
              errorNode.textContent = 'That username is taken. Try another.';
              usernameInput.focus();
              return;
            }
          }

          const profile = store.saveProfile({
            username,
            name: nameInput.value.trim() || username,
            courses: picked,
          });

          close();
          publish().then((result) => {
            if (result.mode === 'shared') toast('You are on the Hall of Fame.', 'good');
          });
          resolve(profile);
        });

        usernameInput.addEventListener('input', () => {
          errorNode.textContent = '';
        });
        setTimeout(() => usernameInput.focus(), 60);
      },
    });
  });
}

/** Show sign-up once, on first visit. Never nags. */
export async function ensureProfile() {
  if (store.hasProfile()) return store.profile();
  if (sessionStorage.getItem('gym-skipped-signup')) return null;

  const profile = await openProfileDialog({ allowSkip: true });
  if (!profile) sessionStorage.setItem('gym-skipped-signup', '1');
  return profile;
}
