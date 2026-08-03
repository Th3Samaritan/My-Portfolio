/* ============================================================
   identity.js — login, register, recovery.

   Supports two modes:
     1. Cloud auth (register/login via GitHub Action + encrypted users.json)
     2. Local-only (username + display name, no password, original mode)

   The cloud token (GitHub PAT) can be set in Profile → Settings.
   ============================================================ */

import { TRACKS } from '../data/curriculum.js';
import * as store from './store.js';
import { escapeHtml, modal, toast } from './ui.js';
import { isUsernameTaken, publish, isCloudEnabled } from './leaderboard.js';
import {
  registerUser, loginUser, logout, isLoggedIn, currentUser,
  setAuthToken, recoverWithPhrase,
} from './auth.js';
import { configureAdminKey } from './crypto.js';

const USERNAME_RULE = /^[a-zA-Z0-9_-]{3,20}$/;
const EMAIL_RULE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUsername(value) {
  const trimmed = String(value || '').trim();
  if (!trimmed) return 'Pick a username.';
  if (!USERNAME_RULE.test(trimmed)) {
    return '3–20 characters: letters, numbers, hyphens and underscores only.';
  }
  return null;
}

/* ---------------------------------------------------------- cloud config */

export function configureCloud(adminKeyB64, patToken) {
  if (adminKeyB64) configureAdminKey(adminKeyB64);
  if (patToken) setAuthToken(patToken);
}

/* ----------------------------------------------------------- form builders */

function loginFormHtml(prefill = '') {
  return `
    <h2>Log in to The GYM</h2>
    <p style="color:var(--text-dim);font-size:0.88rem;margin-bottom:20px">
      Your progress syncs across devices. Log in with your username and password.
    </p>

    <label class="field-label" for="auth-username">Username</label>
    <input id="auth-username" class="field-input" placeholder="ada_l" maxlength="20"
           value="${escapeHtml(prefill)}" autocomplete="username" />

    <label class="field-label" for="auth-password" style="margin-top:12px">Password</label>
    <input id="auth-password" class="field-input" type="password" placeholder="Your password" autocomplete="current-password" />
    <div class="field-error" id="auth-error"></div>

    <div class="modal-actions" style="margin-top:18px">
      <button class="btn ghost" id="auth-switch-register">Create an account</button>
      <button class="btn primary" id="auth-login-btn">Log in</button>
    </div>

    <p style="font-size:0.72rem;color:var(--text-faint);margin-top:10px;text-align:right">
      <a href="#" id="auth-recovery-link" style="color:var(--text-faint)">Lost your password?</a>
    </p>`;
}

function registerFormHtml(existing) {
  const chosen = existing.courses || [];
  return `
    <h2>Create your account</h2>
    <p style="color:var(--text-dim);font-size:0.88rem;margin-bottom:18px">
      One account, every device. Your data is encrypted end-to-end.
    </p>

    <label class="field-label" for="reg-username">Username <span style="color:var(--text-faint)">(permanent)</span></label>
    <input id="reg-username" class="field-input" placeholder="ada_l" maxlength="20"
           value="${escapeHtml(existing.username || '')}" autocomplete="off" />
    <div class="field-error" id="reg-username-error"></div>

    <label class="field-label" for="reg-email" style="margin-top:12px">Email</label>
    <input id="reg-email" class="field-input" type="email" placeholder="ada@example.com"
           value="${escapeHtml(existing.email || '')}" autocomplete="email" />

    <label class="field-label" for="reg-name" style="margin-top:12px">Display name</label>
    <input id="reg-name" class="field-input" placeholder="Ada Lovelace" maxlength="40"
           value="${escapeHtml(existing.name || '')}" autocomplete="off" />

    <label class="field-label" for="reg-password" style="margin-top:12px">Password <span style="color:var(--text-faint)">(min 8 characters)</span></label>
    <input id="reg-password" class="field-input" type="password" placeholder="At least 8 characters" autocomplete="new-password" />

    <label class="field-label" for="reg-confirm" style="margin-top:12px">Confirm password</label>
    <input id="reg-confirm" class="field-input" type="password" placeholder="Same password again" autocomplete="new-password" />
    <div class="field-error" id="reg-error"></div>

    <div class="field-label" style="margin-top:20px">What do you want to learn?</div>
    <p style="font-size:0.8rem;color:var(--text-faint);margin-bottom:10px">
      Pick as many as you like — you can change this later.
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

    <div class="modal-actions" style="margin-top:18px">
      <button class="btn ghost" id="reg-switch-login">I already have an account</button>
      <button class="btn primary" id="reg-submit">Create account</button>
    </div>

    <p style="font-size:0.72rem;color:var(--text-faint);margin-top:10px;text-align:right">
      ${
        isCloudEnabled()
          ? 'Your name and score will appear on the shared Hall of Fame.'
          : 'This copy runs a local Hall of Fame.'
      }
    </p>`;
}

function recoveryFormHtml() {
  return `
    <h2>Recover your account</h2>
    <p style="color:var(--text-dim);font-size:0.88rem;margin-bottom:18px">
      Enter your 12-word recovery phrase and choose a new password.
    </p>

    <label class="field-label" for="recovery-username">Username</label>
    <input id="recovery-username" class="field-input" placeholder="ada_l" maxlength="20" autocomplete="off" />

    <label class="field-label" for="recovery-phrase" style="margin-top:12px">Recovery phrase (12 words)</label>
    <textarea id="recovery-phrase" class="field-input" rows="3" placeholder="Enter all 12 words separated by spaces" style="resize:vertical;min-height:70px"></textarea>

    <label class="field-label" for="recovery-new-password" style="margin-top:12px">New password</label>
    <input id="recovery-new-password" class="field-input" type="password" placeholder="At least 8 characters" autocomplete="new-password" />
    <div class="field-error" id="recovery-error"></div>

    <div class="modal-actions" style="margin-top:18px">
      <button class="btn ghost" id="recovery-back">Back to login</button>
      <button class="btn primary" id="recovery-submit">Recover account</button>
    </div>`;
}

function showRecoveryPhraseModal(phrase) {
  return new Promise((resolve) => {
    modal(`
      <h2>Save your recovery phrase</h2>
      <p style="color:var(--text-faint);font-size:0.88rem;margin-bottom:12px">
        This is the <strong>only</strong> way to recover your account if you forget your password.
        Write it down and keep it somewhere safe. It will never be shown again.
      </p>

      <div style="background:var(--bg-input);border:2px solid var(--accent, #f97316);border-radius:var(--radius-sm);padding:14px 16px;margin:12px 0;font-family:var(--font-mono);font-size:0.85rem;letter-spacing:0.02em;word-spacing:0.5em;text-align:center;line-height:1.8;user-select:all">
        ${phrase}
      </div>

      <label style="display:flex;align-items:center;gap:8px;font-size:0.82rem;color:var(--text-dim);margin:10px 0 16px;cursor:pointer">
        <input type="checkbox" id="phrase-saved" />
        I have saved this recovery phrase in a safe place.
      </label>

      <button class="btn primary" id="phrase-continue" disabled style="width:100%">Continue to the gym</button>
    `, {
      onMount: (node, close) => {
        const checkbox = node.querySelector('#phrase-saved');
        const button = node.querySelector('#phrase-continue');
        checkbox.addEventListener('change', () => { button.disabled = !checkbox.checked; });
        button.addEventListener('click', () => { close(); resolve(); });
      },
    });
  });
}

/* ----------------------------------------------------------- main dialog */

export function openProfileDialog({ allowSkip = false } = {}) {
  const existing = store.profile();
  const prefill = existing.username || currentUser()?.username || '';

  return new Promise((resolve) => {
    if (isLoggedIn()) {
      resolve(existing);
      return;
    }

    modal(loginFormHtml(prefill), {
      onMount: (node, close) => {
        const usernameInput = node.querySelector('#auth-username');
        const passwordInput = node.querySelector('#auth-password');
        const errorNode = node.querySelector('#auth-error');
        const loginBtn = node.querySelector('#auth-login-btn');

        const setError = (msg) => { errorNode.textContent = msg; };
        const clearError = () => { errorNode.textContent = ''; };

        usernameInput.addEventListener('input', clearError);
        passwordInput.addEventListener('input', clearError);

        loginBtn.addEventListener('click', async () => {
          const username = usernameInput.value.trim();
          const password = passwordInput.value;

          if (!username) { setError('Enter your username.'); return; }
          if (!password) { setError('Enter your password.'); return; }

          setError('Logging in…');
          loginBtn.disabled = true;

          try {
            await loginUser(username, password);
            close();
            publish().catch(() => {});
            resolve(existing);
          } catch (err) {
            setError(err.message);
            loginBtn.disabled = false;
          }
        });

        node.querySelector('#auth-switch-register').addEventListener('click', () => {
          close();
          openRegisterDialog({ allowSkip }).then(resolve);
        });

        node.querySelector('#auth-recovery-link').addEventListener('click', (e) => {
          e.preventDefault();
          close();
          openRecoveryDialog().then(resolve);
        });

        passwordInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') loginBtn.click();
        });

        setTimeout(() => usernameInput.focus(), 60);
      },
    });
  });
}

function openRegisterDialog({ allowSkip = false } = {}) {
  const existing = store.profile();
  let picked = [...(existing.courses || [])];

  return new Promise((resolve) => {
    modal(registerFormHtml(existing), {
      onMount: (node, close) => {
        const usernameInput = node.querySelector('#reg-username');
        const emailInput = node.querySelector('#reg-email');
        const nameInput = node.querySelector('#reg-name');
        const passwordInput = node.querySelector('#reg-password');
        const confirmInput = node.querySelector('#reg-confirm');
        const usernameError = node.querySelector('#reg-username-error');
        const errorNode = node.querySelector('#reg-error');
        const submitBtn = node.querySelector('#reg-submit');

        const setError = (msg) => { errorNode.textContent = msg; };
        const clearError = () => { errorNode.textContent = ''; usernameError.textContent = ''; };

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

        [usernameInput, passwordInput, confirmInput].forEach(i => i.addEventListener('input', clearError));

        submitBtn.addEventListener('click', async () => {
          const username = usernameInput.value.trim();
          const email = emailInput.value.trim();
          const name = nameInput.value.trim() || username;
          const password = passwordInput.value;
          const confirm = confirmInput.value;

          const userProblem = validateUsername(username);
          if (userProblem) { usernameError.textContent = userProblem; usernameInput.focus(); return; }
          if (!email || !EMAIL_RULE.test(email)) { setError('Enter a valid email address.'); return; }
          if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return; }
          if (password !== confirm) { setError('Passwords do not match.'); return; }

          setError('Creating your identity — this takes a few seconds…');
          submitBtn.disabled = true;

          try {
            const result = await registerUser({ username, password, email, name });

            store.saveProfile({ username, name, email, courses: picked });
            close();

            await showRecoveryPhraseModal(result.recoveryPhrase);
            publish().catch(() => {});
            resolve(existing);
          } catch (err) {
            setError(err.message);
            submitBtn.disabled = false;
          }
        });

        node.querySelector('#reg-switch-login').addEventListener('click', () => {
          close();
          openProfileDialog({ allowSkip }).then(resolve);
        });

        setTimeout(() => usernameInput.focus(), 60);
      },
    });
  });
}

function openRecoveryDialog() {
  return new Promise((resolve) => {
    modal(recoveryFormHtml(), {
      onMount: (node, close) => {
        const usernameInput = node.querySelector('#recovery-username');
        const phraseInput = node.querySelector('#recovery-phrase');
        const passwordInput = node.querySelector('#recovery-new-password');
        const errorNode = node.querySelector('#recovery-error');
        const submitBtn = node.querySelector('#recovery-submit');

        const setError = (msg) => { errorNode.textContent = msg; };

        submitBtn.addEventListener('click', async () => {
          const username = usernameInput.value.trim();
          const phrase = phraseInput.value.trim();
          const newPassword = passwordInput.value;

          if (!username) { setError('Enter your username.'); return; }
          if (!phrase) { setError('Enter your 12-word recovery phrase.'); return; }
          if (!newPassword || newPassword.length < 8) { setError('New password must be at least 8 characters.'); return; }

          setError('Recovering your account…');
          submitBtn.disabled = true;

          try {
            await recoverWithPhrase(phrase, newPassword, username);
            close();
            toast('Account recovered! You are now logged in.', 'good');
            resolve(store.profile());
          } catch (err) {
            setError(err.message);
            submitBtn.disabled = false;
          }
        });

        node.querySelector('#recovery-back').addEventListener('click', () => {
          close();
          openProfileDialog({ allowSkip: true }).then(resolve);
        });
      },
    });
  });
}

/* ----------------------------------------------------------- profile chip */

/** Profile chip in the top bar — shows login status. */
export function refreshProfileChip() {
  const chip = document.getElementById('level-chip');
  if (!chip) return;

  if (isLoggedIn()) {
    const user = currentUser();
    chip.querySelector('.value').textContent = user.username;
  }
}

export function openAuthDialog() {
  if (isLoggedIn()) {
    const user = currentUser();
    modal(`
      <h2>Logged in as ${escapeHtml(user.username)}</h2>
      <p style="color:var(--text-dim);font-size:0.88rem">${escapeHtml(user.email || '')}</p>
      <button class="btn ghost" id="auth-logout" style="margin-top:14px;width:100%;color:#ef4444">Log out</button>
    `, {
      onMount: (node, close) => {
        node.querySelector('#auth-logout').addEventListener('click', () => {
          logout();
          close();
          toast('Logged out.', 'info');
        });
      },
    });
  } else {
    openProfileDialog({ allowSkip: true });
  }
}

/* ------------------------------------------------------------ onboarding */

export async function ensureProfile() {
  if (isLoggedIn()) return store.profile();
  if (store.hasProfile()) return store.profile();
  if (sessionStorage.getItem('gym-skipped-signup')) return null;

  const profile = await openProfileDialog({ allowSkip: true });
  if (!profile) sessionStorage.setItem('gym-skipped-signup', '1');
  return profile;
}
