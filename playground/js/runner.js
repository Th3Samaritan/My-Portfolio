/* ============================================================
   runner.js — turns "user code + challenge" into test results.

   Three execution paths:
     python  -> Pyodide in-browser (falls back to Piston)
     rust    -> Piston (remote compile + run)
     java    -> Piston (remote compile + run)
     web     -> sandboxed iframe, DOM assertions, one fresh
                frame per check so state never leaks between them

   Compiled languages talk back over a line protocol on stdout:
     __T__~|~<name>~|~PASS|FAIL~|~<got>~|~<want>
     __TIME__~|~<milliseconds>
   ============================================================ */

const DELIM = '~|~';
const PYODIDE_VERSION = 'v0.28.0';

/* ------------------------------------------------------------------ utils */

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** JSON.stringify produces a literal that is valid in Python, Rust and Java. */
function strLit(value) {
  return JSON.stringify(String(value));
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === '1') return resolve();
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('failed to load ' + src)));
      return;
    }
    const tag = document.createElement('script');
    tag.src = src;
    tag.addEventListener('load', () => {
      tag.dataset.loaded = '1';
      resolve();
    });
    tag.addEventListener('error', () => reject(new Error('failed to load ' + src)));
    document.head.appendChild(tag);
  });
}

/* ------------------------------------------------------- harness builders */

function buildPythonSource(challenge, userCode) {
  const helpers = [
    'import sys, time, traceback',
    '',
    'def __fmt(v):',
    '    try:',
    '        r = repr(v)',
    '    except Exception:',
    '        r = "<unrepresentable>"',
    '    r = r.replace("' + DELIM + '", "/")',
    '    return r[:300]',
    '',
    'def __chk(name, got, want):',
    '    try:',
    '        ok = bool(got == want)',
    '    except Exception:',
    '        ok = False',
    '    print("__T__' + DELIM + '" + name + "' + DELIM + '" + ("PASS" if ok else "FAIL") + "' + DELIM + '" + __fmt(got) + "' + DELIM + '" + __fmt(want))',
    '',
    'def __raises(fn, exc):',
    '    try:',
    '        fn()',
    '        return False',
    '    except exc:',
    '        return True',
    '    except Exception:',
    '        return False',
    '',
  ].join('\n');

  const cases = (challenge.cases || [])
    .map((testCase) => {
      const name = strLit(testCase.name);
      const want = strLit(testCase.expect);
      return [
        'try:',
        '    __chk(' + name + ', ' + testCase.call + ', ' + testCase.expect + ')',
        'except Exception as __e:',
        '    print("__T__' + DELIM + '" + ' + name + ' + "' + DELIM + 'FAIL' + DELIM + 'raised " + type(__e).__name__ + ": " + str(__e)[:160] + "' + DELIM + '" + ' + want + ')',
      ].join('\n');
    })
    .join('\n');

  return [
    helpers,
    '# ---------------- your code ----------------',
    userCode,
    '',
    '# ---------------- fixtures ----------------',
    challenge.preamble || '',
    '',
    '# ---------------- tests ----------------',
    '__t0 = time.perf_counter()',
    cases,
    'print("__TIME__' + DELIM + '" + str(round((time.perf_counter() - __t0) * 1000, 3)))',
    '',
  ].join('\n');
}

function buildRustSource(challenge, userCode) {
  const cases = (challenge.cases || [])
    .map((testCase) => {
      const name = strLit(testCase.name);
      const want = strLit(testCase.expect);
      return [
        '    {',
        '        let __r = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {',
        '            __chk(' + name + ', ' + testCase.call + ', ' + testCase.expect + ');',
        '        }));',
        '        if __r.is_err() {',
        '            println!("__T__' + DELIM + '{}' + DELIM + 'FAIL' + DELIM + 'panicked' + DELIM + '{}", ' + name + ', ' + want + ');',
        '        }',
        '    }',
      ].join('\n');
    })
    .join('\n');

  return [
    '#![allow(dead_code, unused_imports, unused_variables, unused_mut, unused_parens)]',
    'use std::fmt::Debug;',
    '',
    'fn __fmt<T: Debug>(v: &T) -> String {',
    '    let s = format!("{:?}", v).replace("' + DELIM + '", "/");',
    '    s.chars().take(300).collect()',
    '}',
    '',
    'fn __chk<T: Debug + PartialEq>(name: &str, got: T, want: T) {',
    '    let ok = got == want;',
    '    println!("__T__' + DELIM + '{}' + DELIM + '{}' + DELIM + '{}' + DELIM + '{}",',
    '        name, if ok { "PASS" } else { "FAIL" }, __fmt(&got), __fmt(&want));',
    '}',
    '',
    '// ---------------- your code ----------------',
    userCode,
    '',
    '// ---------------- fixtures ----------------',
    challenge.preamble || '',
    '',
    'fn main() {',
    '    std::panic::set_hook(Box::new(|_| {}));',
    '    let __t0 = std::time::Instant::now();',
    cases,
    '    println!("__TIME__' + DELIM + '{}", __t0.elapsed().as_secs_f64() * 1000.0);',
    '}',
    '',
  ].join('\n');
}

function buildJavaSource(challenge, userCode) {
  const cases = (challenge.cases || [])
    .map((testCase) => {
      const name = strLit(testCase.name);
      const want = strLit(testCase.expect);
      return [
        '        try {',
        '            __chk(' + name + ', (Object) (' + testCase.call + '), (Object) (' + testCase.expect + '));',
        '        } catch (Throwable __e) {',
        '            System.out.println("__T__' + DELIM + '" + ' + name + ' + "' + DELIM + 'FAIL' + DELIM + 'threw " + __e.getClass().getSimpleName() + "' + DELIM + '" + ' + want + ');',
        '        }',
      ].join('\n');
    })
    .join('\n');

  return [
    'import java.util.*;',
    'import java.util.function.*;',
    'import java.util.stream.*;',
    'import java.util.concurrent.*;',
    'import java.util.concurrent.atomic.*;',
    '',
    // Not `public`: the remote compiler names the file <source>, and a public
    // class must live in a file matching its name.
    'class Main {',
    '',
    '    static String __fmt(Object o) {',
    '        String s;',
    '        if (o == null) { s = "null"; }',
    '        else if (o.getClass().isArray()) { s = Arrays.deepToString(new Object[]{o}); }',
    '        else { s = String.valueOf(o); }',
    '        s = s.replace("' + DELIM + '", "/").replace("\\n", "\\\\n").replace("\\r", "");',
    '        return s.length() > 300 ? s.substring(0, 300) : s;',
    '    }',
    '',
    '    static boolean __eq(Object a, Object b) {',
    '        if (a != null && b != null && a.getClass().isArray() && b.getClass().isArray()) {',
    '            return Arrays.deepToString(new Object[]{a}).equals(Arrays.deepToString(new Object[]{b}));',
    '        }',
    '        return Objects.equals(a, b);',
    '    }',
    '',
    '    static void __chk(String name, Object got, Object want) {',
    '        boolean ok = __eq(got, want);',
    '        System.out.println("__T__' + DELIM + '" + name + "' + DELIM + '" + (ok ? "PASS" : "FAIL")',
    '            + "' + DELIM + '" + __fmt(got) + "' + DELIM + '" + __fmt(want));',
    '    }',
    '',
    '    static boolean __throws(Supplier<Object> supplier, Class<?> type) {',
    '        try { supplier.get(); return false; }',
    '        catch (Throwable t) { return type.isInstance(t); }',
    '    }',
    '',
    '    // ---------------- your code ----------------',
    userCode,
    '',
    '    // ---------------- fixtures ----------------',
    challenge.preamble || '',
    '',
    '    public static void main(String[] args) {',
    '        long __t0 = System.nanoTime();',
    cases,
    '        System.out.println("__TIME__' + DELIM + '" + ((System.nanoTime() - __t0) / 1000000.0));',
    '    }',
    '}',
    '',
  ].join('\n');
}

export function buildSource(lang, challenge, userCode) {
  if (lang === 'python') return buildPythonSource(challenge, userCode);
  if (lang === 'rust') return buildRustSource(challenge, userCode);
  if (lang === 'java') return buildJavaSource(challenge, userCode);
  throw new Error('no harness for language: ' + lang);
}

/* --------------------------------------------------------- output parsing */

function parseProtocol(stdout, challenge) {
  const results = [];
  const logs = [];
  let timeMs = null;

  for (const line of String(stdout || '').split('\n')) {
    if (line.startsWith('__T__' + DELIM)) {
      const [, name, status, got, want] = line.split(DELIM);
      results.push({
        name: name || '(unnamed)',
        passed: status === 'PASS',
        got: got === undefined ? '' : got,
        want: want === undefined ? '' : want,
      });
    } else if (line.startsWith('__TIME__' + DELIM)) {
      timeMs = parseFloat(line.split(DELIM)[1]);
    } else if (line.length) {
      logs.push(line);
    }
  }

  // Any declared case that never reported is a failure — usually a crash mid-run.
  const reported = new Set(results.map((r) => r.name));
  for (const testCase of challenge.cases || []) {
    if (!reported.has(testCase.name)) {
      results.push({
        name: testCase.name,
        passed: false,
        got: 'did not run',
        want: testCase.expect,
        missing: true,
      });
    }
  }

  // Restore the authored order and attach the hidden flag.
  const order = new Map((challenge.cases || []).map((c, i) => [c.name, i]));
  results.sort((a, b) => (order.get(a.name) ?? 999) - (order.get(b.name) ?? 999));
  for (const result of results) {
    const source = (challenge.cases || []).find((c) => c.name === result.name);
    result.hidden = Boolean(source && source.hidden);
  }

  return { results, timeMs, logs: logs.join('\n') };
}

/* --------------------------------------------------- remote execution -----
   Compiler Explorer (godbolt.org) is the default remote backend: it compiles
   and executes Rust, Java and Python, and serves CORS headers.

   The old public Piston instance became whitelist-only in February 2026, so
   it is now only reachable if you point `settings.runnerUrl` at your own
   Piston deployment. When that is set it takes priority.
--------------------------------------------------------------------------- */

const GODBOLT_BASE = 'https://godbolt.org/api';

/** Verified-good fallbacks if the compiler listing cannot be fetched. */
const PINNED_COMPILERS = { rust: 'r1750', java: 'java2501', python: 'python312' };

/** Extra compiler flags per language. Rust needs -O or the timing budgets are meaningless. */
const COMPILER_ARGS = { rust: '-O', java: '', python: '' };

const compilerCache = {};

async function resolveCompiler(lang) {
  if (compilerCache[lang]) return compilerCache[lang];

  try {
    const response = await fetch(GODBOLT_BASE + '/compilers/' + lang + '?fields=id,semver', {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) throw new Error('compiler list ' + response.status);
    const all = await response.json();

    // Ids are like r1750 (rustc 1.75.0), java2501 (JDK 25.0.1), python312.
    // gccrs-*, java8u*, and similar oddities are deliberately excluded.
    const prefix = { rust: 'r', java: 'java', python: 'python' }[lang] || lang;
    const pattern = new RegExp('^' + prefix + '(\\d+)$');

    const best = all
      .map((entry) => ({ entry, match: pattern.exec(entry.id) }))
      .filter((row) => row.match)
      .sort((a, b) => Number(b.match[1]) - Number(a.match[1]))[0];

    compilerCache[lang] = (best && best.entry.id) || PINNED_COMPILERS[lang];
  } catch {
    compilerCache[lang] = PINNED_COMPILERS[lang];
  }

  return compilerCache[lang];
}

const textOf = (lines) => (lines || []).map((line) => line.text).join('\n');

async function godboltExecute(lang, source) {
  const compilerId = await resolveCompiler(lang);

  const response = await fetch(GODBOLT_BASE + '/compiler/' + compilerId + '/compile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      source,
      lang,
      options: {
        userArguments: COMPILER_ARGS[lang] || '',
        filters: { execute: true },
        executeParameters: { args: [], stdin: '' },
        compilerOptions: { executorRequest: true },
      },
    }),
  });

  if (response.status === 429) {
    throw new Error('The remote compiler is rate limiting. Wait a few seconds and run again.');
  }
  if (!response.ok) {
    throw new Error('Remote compiler returned HTTP ' + response.status);
  }

  const payload = await response.json();
  const build = payload.buildResult || {};
  const buildFailed = payload.didExecute === false;

  return {
    stdout: textOf(payload.stdout),
    stderr: textOf(payload.stderr),
    compileError: buildFailed ? textOf(build.stderr) || textOf(payload.stderr) : '',
    exitCode: payload.code,
  };
}

/* ---- optional self-hosted Piston, used only when configured ---- */

const FILENAMES = { python: 'main.py', rust: 'main.rs', java: 'Main.java', javascript: 'main.js' };

async function pistonExecute(base, lang, source) {
  const response = await fetch(base.replace(/\/$/, '') + '/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      language: lang,
      version: '*',
      files: [{ name: FILENAMES[lang] || 'main.txt', content: source }],
      compile_timeout: 15000,
      run_timeout: 10000,
    }),
  });

  if (!response.ok) throw new Error('Your Piston instance returned HTTP ' + response.status);

  const payload = await response.json();
  const compile = payload.compile || {};
  const run = payload.run || {};
  return {
    stdout: run.stdout || '',
    stderr: run.stderr || '',
    compileError: (compile.stderr || '').trim(),
    exitCode: run.code,
  };
}

/** Run remotely, preferring a self-hosted Piston when one is configured. */
async function remoteExecute(lang, source, runnerUrl) {
  if (runnerUrl) {
    try {
      return await pistonExecute(runnerUrl, lang, source);
    } catch (error) {
      console.warn('Custom runner failed, falling back to Compiler Explorer:', error);
    }
  }
  return godboltExecute(lang, source);
}

/* ----------------------------------------------------------- Pyodide client */

let pyodidePromise = null;

export function pyodideIsWarm() {
  return pyodidePromise !== null;
}

async function getPyodide(onProgress) {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      if (onProgress) onProgress('Downloading the Python runtime (one time, ~10 MB)…');
      const base = 'https://cdn.jsdelivr.net/pyodide/' + PYODIDE_VERSION + '/full/';
      await loadScript(base + 'pyodide.js');
      if (onProgress) onProgress('Starting the Python runtime…');
      return window.loadPyodide({ indexURL: base });
    })().catch((error) => {
      pyodidePromise = null;
      throw error;
    });
  }
  return pyodidePromise;
}

/**
 * Strip Pyodide's own stack frames from a traceback.
 *
 * Running through Pyodide adds frames inside `/lib/pythonNNN.zip/_pyodide/...`
 * that mean nothing to the person writing the code — and actively get in the
 * way of the lessons that teach traceback reading. Keep the header, the user's
 * own frames, and the final error line.
 */
function cleanTraceback(text) {
  if (!text) return '';
  const lines = String(text).split('\n');
  const kept = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const isInternalFrame = /^\s*File "[^"]*(_pyodide|\/lib\/python\d)/.test(line);
    if (isInternalFrame) {
      // Also consume the frame's continuation lines: the echoed source and any
      // ^^^^ marker underneath it. Stop at the next frame or an unindented line.
      while (
        i + 1 < lines.length &&
        /^\s{2,}\S/.test(lines[i + 1]) &&
        !/^\s*File "/.test(lines[i + 1])
      ) {
        i += 1;
      }
      continue;
    }

    // Drop marker-only lines that no longer point at anything.
    if (/^\s*[\^~]+\s*$/.test(line) && !/^\s{2,}\S/.test(kept[kept.length - 1] || '')) continue;

    kept.push(line);
  }

  return kept.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function runPythonLocally(source, onProgress) {
  const pyodide = await getPyodide(onProgress);
  let out = '';
  let err = '';
  pyodide.setStdout({ batched: (line) => { out += line + '\n'; } });
  pyodide.setStderr({ batched: (line) => { err += line + '\n'; } });
  try {
    await pyodide.runPythonAsync(source);
  } catch (error) {
    err += String(error && error.message ? error.message : error);
  } finally {
    pyodide.setStdout({});
    pyodide.setStderr({});
  }
  return { stdout: out, stderr: cleanTraceback(err), compileError: '', exitCode: 0 };
}

/** Errors that mean "this environment cannot run it", not "the code is wrong". */
function isEnvironmentFailure(stderr) {
  return /asyncio\.run|event loop|no module named|not implemented|WebAssembly|RecursionError: maximum/i.test(
    stderr || ''
  );
}

/* ------------------------------------------------------- compiled languages */

/**
 * Run a challenge in a compiled/scripted language.
 * @returns {{results, timeMs, logs, stderr, compileError, source, engine}}
 */
export async function runCodeChallenge(track, challenge, userCode, options = {}) {
  const lang = track.lang;
  const source = buildSource(lang, challenge, userCode);
  const preferLocal = lang === 'python' && options.engine !== 'remote' && !challenge.remoteOnly;

  let raw;
  let engine;

  const runnerUrl = (options.runnerUrl || '').trim();

  if (preferLocal) {
    try {
      raw = await runPythonLocally(source, options.onProgress);
      engine = 'pyodide';

      // Pyodide lacks a few CPython facilities (notably asyncio.run, threads).
      // Such failures surface either on stderr or, because each case is wrapped
      // in its own try/except, as every single case reporting the same error.
      const everyCaseFailed =
        raw.stdout.includes('__T__') && !raw.stdout.includes(DELIM + 'PASS' + DELIM);

      if (isEnvironmentFailure(raw.stderr) || (everyCaseFailed && isEnvironmentFailure(raw.stdout))) {
        if (options.onProgress) options.onProgress('Local runtime cannot handle this one — using the remote interpreter…');
        raw = await remoteExecute(lang, source, runnerUrl);
        engine = 'remote';
      }
    } catch (error) {
      if (options.onProgress) options.onProgress('Local runtime unavailable — using the remote compiler…');
      raw = await remoteExecute(lang, source, runnerUrl);
      engine = 'remote';
    }
  } else {
    if (options.onProgress) {
      options.onProgress(lang === 'python' ? 'Running remotely…' : 'Compiling and running remotely…');
    }
    raw = await remoteExecute(lang, source, runnerUrl);
    engine = 'remote';
  }

  const parsed = parseProtocol(raw.stdout, challenge);
  return {
    ...parsed,
    stderr: raw.stderr || '',
    compileError: raw.compileError || '',
    exitCode: raw.exitCode,
    source,
    engine,
  };
}

/* --------------------------------------------------------------- web runner */

/** Script injected into every preview frame, before the user's own JS. */
const FRAME_PRELUDE = `
window.__logs = [];
window.__navigated = false;
(function () {
  var wrap = function (level) {
    var original = console[level].bind(console);
    console[level] = function () {
      try {
        window.__logs.push({
          level: level,
          text: Array.prototype.map.call(arguments, function (a) {
            try { return typeof a === 'string' ? a : JSON.stringify(a); }
            catch (e) { return String(a); }
          }).join(' ')
        });
      } catch (e) {}
      original.apply(null, arguments);
    };
  };
  ['log', 'info', 'warn', 'error'].forEach(wrap);
  window.addEventListener('error', function (event) {
    window.__logs.push({ level: 'error', text: String(event.message) });
  });
  document.addEventListener('submit', function (event) {
    if (!event.defaultPrevented) { window.__navigated = true; }
  });
})();
`;

export function buildPreviewDocument(files) {
  return [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1" />',
    '<style>' + (files.css || '') + '</style>',
    '<script>' + FRAME_PRELUDE + '<\/script>',
    '</head>',
    '<body>',
    files.html || '',
    '<script>try {' + (files.js || '') + '} catch (e) { window.__logs.push({ level: "error", text: String(e && e.message || e) }); }<\/script>',
    '</body>',
    '</html>',
  ].join('\n');
}

function createFrame(files) {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    frame.style.cssText = 'position:fixed;left:-10000px;top:0;width:1024px;height:768px;border:0;';
    frame.addEventListener('load', () => resolve(frame), { once: true });
    frame.srcdoc = buildPreviewDocument(files);
    document.body.appendChild(frame);
  });
}

/**
 * Run the web track's DOM assertions.
 * Each check gets a brand-new frame so nothing leaks between them.
 */
export async function runWebChallenge(challenge, files, options = {}) {
  const checks = challenge.checks || [];
  const results = [];
  const logs = [];
  const started = performance.now();

  for (const check of checks) {
    if (options.onProgress) options.onProgress('Checking: ' + check.name);
    const frame = await createFrame(files);
    let passed = false;
    let got = '';

    try {
      const win = frame.contentWindow;
      const doc = frame.contentDocument;
      // Let the user's own top-level script settle before asserting.
      await sleep(20);

      const body = '"use strict"; return (async function () {\n' + check.code + '\n})();';
      const runCheck = new win.Function('doc', 'win', 'sleep', body);
      const value = await Promise.race([
        runCheck(doc, win, sleep),
        sleep(4000).then(() => { throw new Error('check timed out'); }),
      ]);
      passed = Boolean(value);
      got = passed ? 'pass' : 'returned ' + JSON.stringify(value);

      for (const entry of win.__logs || []) {
        const line = '[' + entry.level + '] ' + entry.text;
        if (!logs.includes(line)) logs.push(line);
      }
    } catch (error) {
      passed = false;
      got = 'threw ' + String((error && error.message) || error);
    } finally {
      frame.remove();
    }

    results.push({
      name: check.name,
      passed,
      got,
      want: 'pass',
      hidden: Boolean(check.hidden),
    });
  }

  return {
    results,
    timeMs: performance.now() - started,
    logs: logs.join('\n'),
    stderr: '',
    compileError: '',
    engine: 'iframe',
    source: [files.html, files.css, files.js].join('\n'),
  };
}

/* --------------------------------------------------- JavaScript test cases */

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null) return false;
  if (typeof a !== 'object') return Number.isNaN(a) && Number.isNaN(b);
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

const show = (value) => {
  try {
    return typeof value === 'string' ? JSON.stringify(value) : String(JSON.stringify(value) ?? value);
  } catch {
    return String(value);
  }
};

/**
 * Run {name, call, expect} cases against JavaScript source, in a sandboxed
 * frame. Both `call` and `expect` are evaluated as JS expressions inside the
 * user's own scope, so declarations in their code are visible.
 */
export async function runJsCases(challenge, userCode) {
  const frame = await createFrame({ html: '', css: '', js: '' });
  const results = [];
  const started = performance.now();
  let logs = '';
  let stderr = '';

  try {
    const win = frame.contentWindow;
    // Direct eval inside the function body can see userCode's declarations.
    const evaluate = new win.Function('__expr', userCode + '\n;return eval(__expr);');

    for (const testCase of challenge.cases || []) {
      let passed = false;
      let got = '';
      try {
        const actual = evaluate(testCase.call);
        const wanted = evaluate(testCase.expect);
        passed = deepEqual(actual, wanted);
        got = show(actual);
      } catch (error) {
        got = 'threw ' + String((error && error.message) || error);
      }
      results.push({
        name: testCase.name,
        passed,
        got,
        want: testCase.expect,
        hidden: Boolean(testCase.hidden),
      });
    }

    logs = (win.__logs || []).map((entry) => entry.text).join('\n');
  } catch (error) {
    stderr = String((error && error.message) || error);
    for (const testCase of challenge.cases || []) {
      results.push({ name: testCase.name, passed: false, got: 'did not run', want: testCase.expect, hidden: !!testCase.hidden });
    }
  } finally {
    frame.remove();
  }

  return {
    results,
    timeMs: performance.now() - started,
    logs,
    stderr,
    compileError: '',
    engine: 'browser',
    source: userCode,
  };
}

/* ------------------------------------------------------------ scratch pad */

/** Free-form execution for the scratch playground. */
export async function runScratch(lang, source, options = {}) {
  if (lang === 'web') {
    return { stdout: '', stderr: '', note: 'Web scratch renders in the preview pane.' };
  }
  if (lang === 'python' && options.engine !== 'remote') {
    try {
      const result = await runPythonLocally(source, options.onProgress);
      if (!isEnvironmentFailure(result.stderr)) return result;
    } catch {
      /* fall through to the remote compiler */
    }
  }
  if (lang === 'javascript') return runJavaScriptLocally(source);
  return remoteExecute(lang, source, (options.runnerUrl || '').trim());
}

/** JavaScript runs in a throwaway sandboxed frame — instant, offline, no network. */
async function runJavaScriptLocally(source) {
  const frame = await createFrame({ html: '', css: '', js: '' });
  let stdout = '';
  let stderr = '';

  try {
    const win = frame.contentWindow;
    const runner = new win.Function(
      '"use strict"; return (async function () {\n' + source + '\n})();'
    );
    await Promise.race([
      runner(),
      sleep(5000).then(() => { throw new Error('script timed out after 5s'); }),
    ]);
    await sleep(30);

    for (const entry of win.__logs || []) {
      if (entry.level === 'error') stderr += entry.text + '\n';
      else stdout += entry.text + '\n';
    }
  } catch (error) {
    stderr += String((error && error.message) || error);
  } finally {
    frame.remove();
  }

  return { stdout, stderr, compileError: '', exitCode: stderr ? 1 : 0 };
}

export { sleep };
