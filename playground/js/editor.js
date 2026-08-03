/* ============================================================
   editor.js — Monaco (the VS Code editor) loaded from a CDN,
   with a plain-textarea fallback so the app still works offline
   or when the CDN is blocked.

   createEditor(container, options) -> handle
     handle.getValue()      current text
     handle.setValue(text)
     handle.setLanguage(id)
     handle.layout()        re-measure after a container resize
     handle.focus()
     handle.dispose()
   ============================================================ */

const CDN = 'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs';

let monacoPromise = null;

function loadAmdLoader() {
  return new Promise((resolve, reject) => {
    if (window.require && window.require.config) return resolve();
    const script = document.createElement('script');
    script.src = CDN + '/loader.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Monaco loader unavailable'));
    document.head.appendChild(script);
  });
}

function loadMonaco() {
  if (monacoPromise) return monacoPromise;

  monacoPromise = (async () => {
    // Cross-origin workers need a shim that importScripts the real worker.
    window.MonacoEnvironment = {
      getWorkerUrl() {
        const shim = `
          self.MonacoEnvironment = { baseUrl: '${CDN}/' };
          importScripts('${CDN}/base/worker/workerMain.js');
        `;
        return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(shim);
      },
    };

    await loadAmdLoader();
    window.require.config({ paths: { vs: CDN } });

    const monaco = await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Monaco load timed out')), 20000);
      window.require(['vs/editor/editor.main'], () => {
        clearTimeout(timer);
        resolve(window.monaco);
      }, () => {
        clearTimeout(timer);
        reject(new Error('Monaco failed to load'));
      });
    });

    monaco.editor.defineTheme('prism-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6b7280', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'c084fc' },
        { token: 'string', foreground: '86efac' },
        { token: 'number', foreground: 'fbbf24' },
        { token: 'type', foreground: '7dd3fc' },
        { token: 'function', foreground: '93c5fd' },
      ],
      colors: {
        'editor.background': '#0e1117',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#3d4451',
        'editorLineNumber.activeForeground': '#8b949e',
        'editorGutter.background': '#0e1117',
        'editorIndentGuide.background1': '#1f2530',
      },
    });

    monaco.editor.defineTheme('prism-light', {
      base: 'vs',
      inherit: true,
      rules: [],
      colors: {
        'editor.background': '#ffffff',
        'editor.lineHighlightBackground': '#f6f8fa',
      },
    });

    return monaco;
  })().catch((error) => {
    monacoPromise = null;
    throw error;
  });

  return monacoPromise;
}

/* ----------------------------------------------------------- fallback editor */

function createTextareaEditor(container, options) {
  container.innerHTML = '';
  const textarea = document.createElement('textarea');
  textarea.className = 'fallback-editor';
  textarea.spellcheck = false;
  textarea.value = options.value || '';
  textarea.setAttribute('aria-label', (options.language || 'code') + ' editor');
  container.appendChild(textarea);

  // Tab should indent, not move focus out of the editor.
  textarea.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    event.preventDefault();
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    textarea.value = textarea.value.slice(0, start) + '    ' + textarea.value.slice(end);
    textarea.selectionStart = textarea.selectionEnd = start + 4;
    textarea.dispatchEvent(new Event('input'));
  });

  if (options.onChange) {
    textarea.addEventListener('input', () => options.onChange(textarea.value));
  }

  return {
    kind: 'textarea',
    getValue: () => textarea.value,
    setValue: (text) => { textarea.value = text; },
    setLanguage: () => {},
    layout: () => {},
    focus: () => textarea.focus(),
    dispose: () => { container.innerHTML = ''; },
  };
}

/* ------------------------------------------------------------- main factory */

export async function createEditor(container, options = {}) {
  const {
    language = 'python',
    value = '',
    onChange = null,
    fontSize = 14,
    readOnly = false,
    theme = 'prism-dark',
  } = options;

  let monaco;
  try {
    monaco = await loadMonaco();
  } catch {
    return createTextareaEditor(container, options);
  }

  container.innerHTML = '';
  const editor = monaco.editor.create(container, {
    value,
    language,
    theme,
    readOnly,
    fontSize,
    fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Consolas, monospace",
    fontLigatures: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    tabSize: language === 'python' ? 4 : language === 'web' ? 2 : 4,
    insertSpaces: true,
    renderLineHighlight: 'line',
    smoothScrolling: true,
    cursorBlinking: 'smooth',
    padding: { top: 14, bottom: 14 },
    lineNumbersMinChars: 3,
    overviewRulerLanes: 0,
    scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
    bracketPairColorization: { enabled: true },
    guides: { indentation: true },
    suggestOnTriggerCharacters: true,
    quickSuggestions: { other: true, comments: false, strings: false },
  });

  if (onChange) {
    editor.onDidChangeModelContent(() => onChange(editor.getValue()));
  }

  return {
    kind: 'monaco',
    monaco,
    editor,
    getValue: () => editor.getValue(),
    setValue: (text) => editor.setValue(text),
    setLanguage: (id) => monaco.editor.setModelLanguage(editor.getModel(), id),
    layout: () => editor.layout(),
    focus: () => editor.focus(),
    addAction: (action) => editor.addAction(action),
    dispose: () => editor.dispose(),
  };
}

/** Monaco language id for a track. */
export function monacoLanguage(trackId) {
  return { python: 'python', rust: 'rust', java: 'java', web: 'html' }[trackId] || 'plaintext';
}
