/* ============================================================
   Web Dev Track — zero to mastery
   ------------------------------------------------------------
   DIFFERENT SHAPE from the compiled tracks.

   files   { html, css, js }   starter content for the three panes
   checks  [] { name, hidden?, code }
             `code` is a JS FUNCTION BODY executed INSIDE the
             preview iframe with these params in scope:
                doc   -> iframe document
                win   -> iframe window
                sleep -> (ms) => Promise
             It must `return` (or resolve to) a truthy value to pass.
             Async is supported: the body may use `await`.

   quality / efficiency regexes run against html + css + js joined.
   ============================================================ */

export const webTiers = [
  { id: 'markup',   name: 'Semantic Markup', blurb: 'Structure that means something — to browsers and to screen readers.' },
  { id: 'layout',   name: 'Modern Layout',   blurb: 'Flexbox and Grid, responsive by default.' },
  { id: 'dom',      name: 'DOM & Events',    blurb: 'State, rendering, delegation, no framework.' },
  { id: 'async',    name: 'Async & Data',    blurb: 'Fetch, loading states, error paths, debouncing.' },
  { id: 'a11y',     name: 'Accessibility',   blurb: 'Labels, roles, focus management, keyboard paths.' },
];

export const webChallenges = [
  /* ---------------------------------------------------------------- Markup */
  {
    id: 'web-m1',
    title: 'Semantic Page Skeleton',
    tier: 'markup',
    difficulty: 1,
    xp: 45,
    concepts: ['html', 'semantics', 'structure'],
    brief: `Build a page skeleton out of **semantic elements**, not a pile of divs.

Required:
- a \`<header>\` containing a \`<nav>\` with a \`<ul>\` of exactly 3 \`<a>\` links
- a \`<main>\` containing two \`<article>\` elements, each with an \`<h2>\`
- an \`<aside>\`
- a \`<footer>\` containing the text \`©\`
- exactly one \`<h1>\`, and it must be inside the \`<header>\`

Screen readers navigate by landmarks. This is the layer that gives them one.`,
    files: {
      html: `<header>\n  <h1>My Site</h1>\n  <!-- add a nav with 3 links -->\n</header>\n\n<!-- add main with two articles, an aside, and a footer -->\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 1.5rem;\n}\n`,
      js: `// No JavaScript needed for this one.\n`,
    },
    solution: {
      html: `<header>\n  <h1>My Site</h1>\n  <nav>\n    <ul>\n      <li><a href="#home">Home</a></li>\n      <li><a href="#work">Work</a></li>\n      <li><a href="#contact">Contact</a></li>\n    </ul>\n  </nav>\n</header>\n\n<main>\n  <article>\n    <h2>First post</h2>\n    <p>Something worth reading.</p>\n  </article>\n  <article>\n    <h2>Second post</h2>\n    <p>Something else worth reading.</p>\n  </article>\n</main>\n\n<aside>\n  <h2>Elsewhere</h2>\n  <p>Links and asides.</p>\n</aside>\n\n<footer>\n  <p>© 2026 My Site</p>\n</footer>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 1.5rem;\n  line-height: 1.6;\n}\n\nnav ul {\n  display: flex;\n  gap: 1rem;\n  list-style: none;\n  padding: 0;\n}\n`,
      js: `// No JavaScript needed for this one.\n`,
    },
    hints: [
      'Landmarks: header, nav, main, aside, footer. Each should appear once at the top level.',
      'Navigation links belong in a list — it tells assistive tech how many there are.',
      'Only one h1 per page; articles get h2.',
    ],
    checks: [
      { name: 'has a header', code: `return !!doc.querySelector('header');` },
      { name: 'nav with 3 links in a list', code: `const links = doc.querySelectorAll('header nav ul a'); return links.length === 3;` },
      { name: 'main with two articles', code: `return doc.querySelectorAll('main article').length === 2;` },
      { name: 'each article has an h2', code: `const arts = [...doc.querySelectorAll('main article')]; return arts.length === 2 && arts.every(a => !!a.querySelector('h2'));` },
      { name: 'has an aside', code: `return !!doc.querySelector('aside');` },
      { name: 'footer contains ©', code: `const f = doc.querySelector('footer'); return !!f && f.textContent.includes('\\u00A9');` },
      { name: 'exactly one h1, inside the header', code: `const h1s = doc.querySelectorAll('h1'); return h1s.length === 1 && !!h1s[0].closest('header');`, hidden: true },
      { name: 'no div soup at the top level', code: `return doc.body.querySelectorAll(':scope > div').length === 0;`, hidden: true },
    ],
    refLines: 39,
    quality: [
      { id: 'semantic', label: 'Uses semantic landmarks', weight: 50, re: /<main[\s>][\s\S]*<footer[\s>]/ },
      { id: 'list-nav', label: 'Navigation marked up as a list', weight: 30, re: /<nav[\s\S]{0,120}<ul/ },
      { id: 'no-div-nav', label: 'No div-based navigation', weight: 20, re: /<div[^>]*class=["'][^"']*nav/, negative: true },
    ],
    efficiency: [
      { id: 'no-inline-style', label: 'No inline style attributes', weight: 100, re: /<[^>]+\sstyle=/, negative: true },
    ],
  },

  /* ---------------------------------------------------------------- Layout */
  {
    id: 'web-l1',
    title: 'Flexbox Navigation Bar',
    tier: 'layout',
    difficulty: 2,
    xp: 60,
    concepts: ['css', 'flexbox', 'layout'],
    brief: `Style the given markup into a real nav bar using **Flexbox**:

- \`.nav\` is a flex row, vertically centred
- the brand sits hard left, the links group sits hard right (use \`justify-content: space-between\`)
- \`.nav-links\` is itself a flex row with a gap of at least \`1rem\`
- the list has no bullets and no default padding

No absolute positioning, no floats — those are the failure modes this exercise is checking for.`,
    files: {
      html: `<nav class="nav">\n  <a class="brand" href="#">Prism</a>\n  <ul class="nav-links">\n    <li><a href="#work">Work</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n}\n\n.nav {\n  /* make me a flex row */\n}\n\n.nav-links {\n  /* flex row, gap, no bullets */\n}\n`,
      js: `// No JavaScript needed for this one.\n`,
    },
    solution: {
      html: `<nav class="nav">\n  <a class="brand" href="#">Prism</a>\n  <ul class="nav-links">\n    <li><a href="#work">Work</a></li>\n    <li><a href="#about">About</a></li>\n    <li><a href="#contact">Contact</a></li>\n  </ul>\n</nav>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n}\n\n.nav {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  padding: 1rem 1.5rem;\n  border-bottom: 1px solid #e5e5e5;\n}\n\n.brand {\n  font-weight: 700;\n  text-decoration: none;\n  color: #0a0a0a;\n}\n\n.nav-links {\n  display: flex;\n  align-items: center;\n  gap: 1.5rem;\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n.nav-links a {\n  text-decoration: none;\n  color: #525252;\n}\n\n.nav-links a:hover {\n  color: #0a0a0a;\n}\n`,
      js: `// No JavaScript needed for this one.\n`,
    },
    hints: [
      '`display: flex` on .nav, then `justify-content: space-between` pushes the two children apart.',
      '`align-items: center` handles the vertical centring.',
      'Resetting a `<ul>` means `list-style: none` plus `padding: 0` — browsers apply both by default.',
    ],
    checks: [
      { name: '.nav is a flex container', code: `return win.getComputedStyle(doc.querySelector('.nav')).display === 'flex';` },
      { name: '.nav is vertically centred', code: `return win.getComputedStyle(doc.querySelector('.nav')).alignItems === 'center';` },
      { name: 'brand and links pushed apart', code: `return win.getComputedStyle(doc.querySelector('.nav')).justifyContent === 'space-between';` },
      { name: '.nav-links is a flex row', code: `return win.getComputedStyle(doc.querySelector('.nav-links')).display === 'flex';` },
      { name: 'links have a gap of at least 1rem', code: `const g = win.getComputedStyle(doc.querySelector('.nav-links')).columnGap; return parseFloat(g) >= 16;` },
      { name: 'bullets removed', code: `return win.getComputedStyle(doc.querySelector('.nav-links')).listStyleType === 'none';`, hidden: true },
      { name: 'default list padding reset', code: `return parseFloat(win.getComputedStyle(doc.querySelector('.nav-links')).paddingLeft) === 0;`, hidden: true },
      { name: 'brand is left of the links', code: `const b = doc.querySelector('.brand').getBoundingClientRect(); const l = doc.querySelector('.nav-links').getBoundingClientRect(); return b.right <= l.left + 1;`, hidden: true },
    ],
    refLines: 39,
    quality: [
      { id: 'flex', label: 'Uses Flexbox', weight: 40, re: /display\s*:\s*flex/ },
      { id: 'gap', label: 'Uses gap rather than margin hacks', weight: 30, re: /gap\s*:/ },
      { id: 'no-float', label: 'No floats', weight: 30, re: /float\s*:\s*(left|right)/, negative: true },
    ],
    efficiency: [
      { id: 'no-absolute', label: 'No absolute positioning to fake the layout', weight: 100, re: /position\s*:\s*absolute/, negative: true },
    ],
  },

  {
    id: 'web-l2',
    title: 'Responsive Grid Gallery',
    tier: 'layout',
    difficulty: 3,
    xp: 80,
    concepts: ['css', 'grid', 'responsive'],
    brief: `Turn \`.gallery\` into a **CSS Grid** that reflows without a single media query.

- use \`grid-template-columns\` with \`repeat(auto-fit, minmax(...))\` so columns are added as space allows
- a gap of at least \`1rem\`
- each \`.card\` keeps a square aspect ratio via \`aspect-ratio\`
- cards must never overflow their column

The whole point of \`auto-fit\` + \`minmax\` is that it replaces the breakpoint ladder you would otherwise hand-write.`,
    files: {
      html: `<section class="gallery">\n  <div class="card">One</div>\n  <div class="card">Two</div>\n  <div class="card">Three</div>\n  <div class="card">Four</div>\n  <div class="card">Five</div>\n  <div class="card">Six</div>\n</section>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 1rem;\n}\n\n.gallery {\n  /* make me an auto-fitting grid */\n}\n\n.card {\n  background: #efefef;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n}\n`,
      js: `// No JavaScript needed for this one.\n`,
    },
    solution: {
      html: `<section class="gallery">\n  <div class="card">One</div>\n  <div class="card">Two</div>\n  <div class="card">Three</div>\n  <div class="card">Four</div>\n  <div class="card">Five</div>\n  <div class="card">Six</div>\n</section>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  margin: 0;\n  padding: 1rem;\n}\n\n.gallery {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));\n  gap: 1rem;\n}\n\n.card {\n  background: #efefef;\n  border-radius: 12px;\n  display: grid;\n  place-items: center;\n  aspect-ratio: 1 / 1;\n  min-width: 0;\n}\n`,
      js: `// No JavaScript needed for this one.\n`,
    },
    hints: [
      '`repeat(auto-fit, minmax(160px, 1fr))` is the entire responsive behaviour.',
      '`aspect-ratio: 1 / 1` keeps the cards square as the columns resize.',
      '`min-width: 0` on grid children stops long content forcing an overflow.',
    ],
    checks: [
      { name: '.gallery is a grid', code: `return win.getComputedStyle(doc.querySelector('.gallery')).display === 'grid';` },
      { name: 'has a gap of at least 1rem', code: `const s = win.getComputedStyle(doc.querySelector('.gallery')); return parseFloat(s.rowGap || s.gap) >= 16;` },
      { name: 'multiple columns are generated', code: `const cols = win.getComputedStyle(doc.querySelector('.gallery')).gridTemplateColumns.split(' ').filter(Boolean); return cols.length >= 2;` },
      { name: 'cards are square', code: `const r = doc.querySelector('.card').getBoundingClientRect(); return Math.abs(r.width - r.height) < 2;` },
      { name: 'no horizontal overflow', code: `return doc.documentElement.scrollWidth <= win.innerWidth + 1;`, hidden: true },
      { name: 'all six cards laid out', code: `return doc.querySelectorAll('.card').length === 6 && [...doc.querySelectorAll('.card')].every(c => c.getBoundingClientRect().width > 0);`, hidden: true },
    ],
    refLines: 26,
    quality: [
      { id: 'grid', label: 'Uses CSS Grid', weight: 35, re: /display\s*:\s*grid/ },
      { id: 'auto-fit', label: 'Uses auto-fit/auto-fill with minmax', weight: 40, re: /repeat\s*\(\s*auto-(fit|fill)\s*,\s*minmax/ },
      { id: 'aspect', label: 'Uses aspect-ratio', weight: 25, re: /aspect-ratio\s*:/ },
    ],
    efficiency: [
      { id: 'no-media', label: 'Responsive without media queries', weight: 100, re: /@media/, negative: true },
    ],
  },

  /* ------------------------------------------------------------- DOM & Events */
  {
    id: 'web-d1',
    title: 'Todo List, No Framework',
    tier: 'dom',
    difficulty: 3,
    xp: 90,
    concepts: ['dom', 'events', 'state'],
    brief: `Wire up a working todo list.

- submitting the form adds the trimmed input value as an \`<li>\` inside \`#list\`, then clears the input
- blank or whitespace-only input adds nothing
- each item renders a \`<button class="del">\` that removes **that** item
- \`#count\` always shows the current number of items

Render from a state array rather than mutating the DOM ad hoc — the hidden tests check that deleting the middle item leaves the right two behind.`,
    files: {
      html: `<form id="form">\n  <input id="input" placeholder="What needs doing?" autocomplete="off" />\n  <button type="submit">Add</button>\n</form>\n\n<ul id="list"></ul>\n<p>Items: <span id="count">0</span></p>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 30rem;\n}\n\n#list {\n  list-style: none;\n  padding: 0;\n}\n\n#list li {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 0.5rem 0;\n  border-bottom: 1px solid #eee;\n}\n`,
      js: `const form = document.getElementById('form');\nconst input = document.getElementById('input');\nconst list = document.getElementById('list');\nconst count = document.getElementById('count');\n\nlet todos = [];\n\nfunction render() {\n  // build the list from the todos array and update the count\n}\n\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  // add the trimmed value if it is not empty\n});\n\nrender();\n`,
    },
    solution: {
      html: `<form id="form">\n  <input id="input" placeholder="What needs doing?" autocomplete="off" />\n  <button type="submit">Add</button>\n</form>\n\n<ul id="list"></ul>\n<p>Items: <span id="count">0</span></p>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 30rem;\n}\n\n#list {\n  list-style: none;\n  padding: 0;\n}\n\n#list li {\n  display: flex;\n  justify-content: space-between;\n  gap: 1rem;\n  padding: 0.5rem 0;\n  border-bottom: 1px solid #eee;\n}\n`,
      js: `const form = document.getElementById('form');\nconst input = document.getElementById('input');\nconst list = document.getElementById('list');\nconst count = document.getElementById('count');\n\nlet todos = [];\n\nfunction render() {\n  list.innerHTML = '';\n  todos.forEach((text, index) => {\n    const item = document.createElement('li');\n    const label = document.createElement('span');\n    label.textContent = text;\n\n    const remove = document.createElement('button');\n    remove.className = 'del';\n    remove.type = 'button';\n    remove.textContent = 'Delete';\n    remove.dataset.index = String(index);\n\n    item.append(label, remove);\n    list.appendChild(item);\n  });\n  count.textContent = String(todos.length);\n}\n\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  const value = input.value.trim();\n  if (!value) return;\n  todos.push(value);\n  input.value = '';\n  render();\n});\n\nlist.addEventListener('click', (event) => {\n  const button = event.target.closest('.del');\n  if (!button) return;\n  todos.splice(Number(button.dataset.index), 1);\n  render();\n});\n\nrender();\n`,
    },
    hints: [
      'Keep the array as the source of truth and rebuild the list inside render() — never patch the DOM in two places.',
      'One click listener on the `<ul>` handles every delete button (event delegation) and survives re-renders.',
      '`event.target.closest(".del")` tells you whether the click landed on a delete button.',
    ],
    checks: [
      { name: 'adds an item', code: `doc.getElementById('input').value = 'write tests'; doc.getElementById('form').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(30); return doc.querySelectorAll('#list li').length === 1;` },
      { name: 'clears the input after adding', code: `doc.getElementById('input').value = 'a'; doc.getElementById('form').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(30); return doc.getElementById('input').value === '';` },
      { name: 'ignores blank input', code: `doc.getElementById('input').value = '   '; doc.getElementById('form').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(30); return doc.querySelectorAll('#list li').length === 0;` },
      { name: 'updates the count', code: `const f = doc.getElementById('form'), i = doc.getElementById('input'); for (const t of ['a','b','c']) { i.value = t; f.dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(10); } return doc.getElementById('count').textContent.trim() === '3';` },
      { name: 'delete button removes its item', code: `const f = doc.getElementById('form'), i = doc.getElementById('input'); for (const t of ['a','b']) { i.value = t; f.dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(10); } doc.querySelector('#list li .del').click(); await sleep(30); return doc.querySelectorAll('#list li').length === 1;` },
      { name: 'deletes the correct middle item', code: `const f = doc.getElementById('form'), i = doc.getElementById('input'); for (const t of ['alpha','beta','gamma']) { i.value = t; f.dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(10); } doc.querySelectorAll('#list li .del')[1].click(); await sleep(30); const texts = [...doc.querySelectorAll('#list li')].map(li => li.textContent); return texts.length === 2 && texts[0].includes('alpha') && texts[1].includes('gamma');`, hidden: true },
      { name: 'count follows a delete', code: `const f = doc.getElementById('form'), i = doc.getElementById('input'); for (const t of ['a','b']) { i.value = t; f.dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(10); } doc.querySelector('#list li .del').click(); await sleep(30); return doc.getElementById('count').textContent.trim() === '1';`, hidden: true },
      { name: 'does not reload the page', code: `return win.__navigated !== true;`, hidden: true },
    ],
    refLines: 56,
    quality: [
      { id: 'delegation', label: 'Uses event delegation for deletes', weight: 35, re: /list\.addEventListener|\.closest\s*\(/ },
      { id: 'prevent-default', label: 'Prevents the default form submit', weight: 30, re: /preventDefault/ },
      { id: 'textcontent', label: 'Uses textContent, not innerHTML, for user input', weight: 35, re: /\.innerHTML\s*=\s*[^'"]*\+/, negative: true },
    ],
    efficiency: [
      { id: 'state-driven', label: 'Renders from a state array', weight: 100, re: /todos\s*\.\s*(push|splice|filter|map|forEach)/ },
    ],
  },

  {
    id: 'web-d2',
    title: 'Filter with Delegation',
    tier: 'dom',
    difficulty: 3,
    xp: 85,
    concepts: ['dom', 'events', 'delegation', 'filtering'],
    brief: `\`#items\` holds products tagged with \`data-category\`. Build the filtering:

- clicking a \`.filter\` button shows only matching items (\`data-filter="all"\` shows everything)
- the active button carries the class \`active\` — exactly one at a time
- \`#visible\` shows the number of currently visible items

Attach **one** listener to the button container, not one per button.`,
    files: {
      html: `<div id="filters">\n  <button class="filter active" data-filter="all">All</button>\n  <button class="filter" data-filter="fruit">Fruit</button>\n  <button class="filter" data-filter="veg">Veg</button>\n</div>\n\n<ul id="items">\n  <li data-category="fruit">Apple</li>\n  <li data-category="veg">Carrot</li>\n  <li data-category="fruit">Banana</li>\n  <li data-category="veg">Leek</li>\n  <li data-category="fruit">Cherry</li>\n</ul>\n\n<p>Showing: <span id="visible">5</span></p>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n.filter {\n  padding: 0.4rem 0.9rem;\n  border: 1px solid #ddd;\n  background: #fff;\n  border-radius: 999px;\n  cursor: pointer;\n}\n\n.filter.active {\n  background: #0a0a0a;\n  color: #fff;\n  border-color: #0a0a0a;\n}\n\n#items {\n  list-style: none;\n  padding: 0;\n}\n\n#items li {\n  padding: 0.4rem 0;\n}\n\n#items li.hidden {\n  display: none;\n}\n`,
      js: `const filters = document.getElementById('filters');\nconst items = document.getElementById('items');\nconst visible = document.getElementById('visible');\n\nfunction applyFilter(category) {\n  // show matching items, hide the rest, update #visible\n}\n\n// attach ONE listener to #filters\n`,
    },
    solution: {
      html: `<div id="filters">\n  <button class="filter active" data-filter="all">All</button>\n  <button class="filter" data-filter="fruit">Fruit</button>\n  <button class="filter" data-filter="veg">Veg</button>\n</div>\n\n<ul id="items">\n  <li data-category="fruit">Apple</li>\n  <li data-category="veg">Carrot</li>\n  <li data-category="fruit">Banana</li>\n  <li data-category="veg">Leek</li>\n  <li data-category="fruit">Cherry</li>\n</ul>\n\n<p>Showing: <span id="visible">5</span></p>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n.filter {\n  padding: 0.4rem 0.9rem;\n  border: 1px solid #ddd;\n  background: #fff;\n  border-radius: 999px;\n  cursor: pointer;\n}\n\n.filter.active {\n  background: #0a0a0a;\n  color: #fff;\n  border-color: #0a0a0a;\n}\n\n#items {\n  list-style: none;\n  padding: 0;\n}\n\n#items li {\n  padding: 0.4rem 0;\n}\n\n#items li.hidden {\n  display: none;\n}\n`,
      js: `const filters = document.getElementById('filters');\nconst items = document.getElementById('items');\nconst visible = document.getElementById('visible');\n\nfunction applyFilter(category) {\n  let shown = 0;\n  items.querySelectorAll('li').forEach((li) => {\n    const match = category === 'all' || li.dataset.category === category;\n    li.classList.toggle('hidden', !match);\n    if (match) shown += 1;\n  });\n  visible.textContent = String(shown);\n}\n\nfilters.addEventListener('click', (event) => {\n  const button = event.target.closest('.filter');\n  if (!button) return;\n  filters.querySelectorAll('.filter').forEach((b) => b.classList.remove('active'));\n  button.classList.add('active');\n  applyFilter(button.dataset.filter);\n});\n\napplyFilter('all');\n`,
    },
    hints: [
      'One listener on `#filters`; `event.target.closest(".filter")` identifies which button was hit.',
      '`classList.toggle("hidden", !match)` sets or clears the class in one call.',
      'Clear `active` from every button before adding it to the clicked one.',
    ],
    checks: [
      { name: 'filters to fruit', code: `doc.querySelector('[data-filter="fruit"]').click(); await sleep(30); const shown = [...doc.querySelectorAll('#items li')].filter(li => win.getComputedStyle(li).display !== 'none'); return shown.length === 3;` },
      { name: 'filters to veg', code: `doc.querySelector('[data-filter="veg"]').click(); await sleep(30); const shown = [...doc.querySelectorAll('#items li')].filter(li => win.getComputedStyle(li).display !== 'none'); return shown.length === 2;` },
      { name: 'all restores everything', code: `doc.querySelector('[data-filter="veg"]').click(); await sleep(20); doc.querySelector('[data-filter="all"]').click(); await sleep(30); const shown = [...doc.querySelectorAll('#items li')].filter(li => win.getComputedStyle(li).display !== 'none'); return shown.length === 5;` },
      { name: 'active class moves', code: `doc.querySelector('[data-filter="fruit"]').click(); await sleep(30); return doc.querySelectorAll('.filter.active').length === 1 && doc.querySelector('.filter.active').dataset.filter === 'fruit';` },
      { name: 'visible count updates', code: `doc.querySelector('[data-filter="veg"]').click(); await sleep(30); return doc.getElementById('visible').textContent.trim() === '2';` },
      { name: 'shows the right fruit', code: `doc.querySelector('[data-filter="fruit"]').click(); await sleep(30); const names = [...doc.querySelectorAll('#items li')].filter(li => win.getComputedStyle(li).display !== 'none').map(li => li.textContent.trim()); return names.join(',') === 'Apple,Banana,Cherry';`, hidden: true },
      { name: 'clicking the container background is a no-op', code: `doc.querySelector('[data-filter="fruit"]').click(); await sleep(20); doc.getElementById('filters').click(); await sleep(20); return doc.querySelector('.filter.active').dataset.filter === 'fruit';`, hidden: true },
    ],
    refLines: 56,
    quality: [
      { id: 'delegation', label: 'Single delegated listener on the container', weight: 45, re: /filters\.addEventListener/ },
      { id: 'no-per-button', label: 'No listener attached per button in a loop', weight: 30, re: /forEach\s*\([\s\S]{0,80}addEventListener/, negative: true },
      { id: 'dataset', label: 'Reads configuration from data attributes', weight: 25, re: /dataset\./ },
    ],
    efficiency: [
      { id: 'classlist', label: 'Toggles classes rather than writing inline styles', weight: 100, re: /classList\.(toggle|add|remove)/ },
    ],
  },

  /* -------------------------------------------------------------- Async & Data */
  {
    id: 'web-a1',
    title: 'Fetch with Loading and Error States',
    tier: 'async',
    difficulty: 4,
    xp: 105,
    concepts: ['async', 'fetch', 'error-handling', 'ux'],
    brief: `A stubbed \`fetchUsers()\` is provided — it resolves after ~120 ms, or rejects when \`window.__failNext\` is true.

Implement \`load()\` so that:
- while in flight, \`#status\` reads \`Loading…\` and the button is \`disabled\`
- on success, \`#users\` gets one \`<li>\` per user and \`#status\` is emptied
- on failure, \`#status\` reads \`Something went wrong\` and the list stays empty
- the button is re-enabled either way

The three-state discipline — loading, loaded, failed — is what separates a demo from a product.`,
    files: {
      html: `<button id="load">Load users</button>\n<p id="status"></p>\n<ul id="users"></ul>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n#users {\n  list-style: none;\n  padding: 0;\n}\n\n#users li {\n  padding: 0.35rem 0;\n  border-bottom: 1px solid #eee;\n}\n\n#status:empty {\n  display: none;\n}\n`,
      js: `// Provided stub — do not change.\nfunction fetchUsers() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (window.__failNext) {\n        reject(new Error('network'));\n      } else {\n        resolve([{ name: 'Ada' }, { name: 'Grace' }, { name: 'Alan' }]);\n      }\n    }, 120);\n  });\n}\n\nconst button = document.getElementById('load');\nconst status = document.getElementById('status');\nconst users = document.getElementById('users');\n\nasync function load() {\n  // loading -> success | failure, and always re-enable the button\n}\n\nbutton.addEventListener('click', load);\n`,
    },
    solution: {
      html: `<button id="load">Load users</button>\n<p id="status"></p>\n<ul id="users"></ul>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n}\n\n#users {\n  list-style: none;\n  padding: 0;\n}\n\n#users li {\n  padding: 0.35rem 0;\n  border-bottom: 1px solid #eee;\n}\n\n#status:empty {\n  display: none;\n}\n`,
      js: `// Provided stub — do not change.\nfunction fetchUsers() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      if (window.__failNext) {\n        reject(new Error('network'));\n      } else {\n        resolve([{ name: 'Ada' }, { name: 'Grace' }, { name: 'Alan' }]);\n      }\n    }, 120);\n  });\n}\n\nconst button = document.getElementById('load');\nconst status = document.getElementById('status');\nconst users = document.getElementById('users');\n\nasync function load() {\n  status.textContent = 'Loading\\u2026';\n  button.disabled = true;\n  users.innerHTML = '';\n\n  try {\n    const people = await fetchUsers();\n    users.innerHTML = '';\n    people.forEach((person) => {\n      const item = document.createElement('li');\n      item.textContent = person.name;\n      users.appendChild(item);\n    });\n    status.textContent = '';\n  } catch (error) {\n    status.textContent = 'Something went wrong';\n    users.innerHTML = '';\n  } finally {\n    button.disabled = false;\n  }\n}\n\nbutton.addEventListener('click', load);\n`,
    },
    hints: [
      'Set the loading state before the await, not after — otherwise it never renders.',
      '`try / catch / finally`: the finally block is where re-enabling the button belongs.',
      'Clear the list on the error path too, so a failed retry does not leave stale rows.',
    ],
    checks: [
      { name: 'shows a loading state', code: `win.__failNext = false; doc.getElementById('load').click(); await sleep(30); return doc.getElementById('status').textContent.includes('Loading');` },
      { name: 'disables the button while loading', code: `win.__failNext = false; doc.getElementById('load').click(); await sleep(30); return doc.getElementById('load').disabled === true;` },
      { name: 'renders the users', code: `win.__failNext = false; doc.getElementById('load').click(); await sleep(300); return doc.querySelectorAll('#users li').length === 3;` },
      { name: 'clears the status on success', code: `win.__failNext = false; doc.getElementById('load').click(); await sleep(300); return doc.getElementById('status').textContent.trim() === '';` },
      { name: 'shows the error message', code: `win.__failNext = true; doc.getElementById('load').click(); await sleep(300); win.__failNext = false; return doc.getElementById('status').textContent.includes('Something went wrong');` },
      { name: 're-enables the button after failure', code: `win.__failNext = true; doc.getElementById('load').click(); await sleep(300); win.__failNext = false; return doc.getElementById('load').disabled === false;`, hidden: true },
      { name: 'list stays empty on failure', code: `win.__failNext = true; doc.getElementById('load').click(); await sleep(300); win.__failNext = false; return doc.querySelectorAll('#users li').length === 0;`, hidden: true },
      { name: 'renders the right names', code: `win.__failNext = false; doc.getElementById('load').click(); await sleep(300); return [...doc.querySelectorAll('#users li')].map(li => li.textContent.trim()).join(',') === 'Ada,Grace,Alan';`, hidden: true },
    ],
    refLines: 50,
    quality: [
      { id: 'try-catch', label: 'Handles the rejection path', weight: 35, re: /catch\s*\(|\.catch\s*\(/ },
      { id: 'finally', label: 'Uses finally for cleanup', weight: 30, re: /finally\s*\{/ },
      { id: 'async-await', label: 'Uses async/await', weight: 35, re: /await\s+fetchUsers/ },
    ],
    efficiency: [
      { id: 'no-innerhtml-concat', label: 'Builds rows safely, not by string-concatenating HTML', weight: 100, re: /innerHTML\s*\+=/, negative: true },
    ],
  },

  {
    id: 'web-a2',
    title: 'Debounced Search',
    tier: 'async',
    difficulty: 4,
    xp: 100,
    concepts: ['async', 'debounce', 'performance', 'closures'],
    brief: `Typing must not fire a search per keystroke.

- write a generic \`debounce(fn, wait)\` — trailing edge, resets the timer on every call
- wire \`#search\` so that typing filters \`#results\` **200 ms after typing stops**
- \`window.__searchCount\` must increment **once per settled burst**, not once per key
- matching is case-insensitive substring

The hidden test types five characters rapidly and asserts exactly one search ran.`,
    files: {
      html: `<input id="search" placeholder="Search fruit…" autocomplete="off" />\n<ul id="results"></ul>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 28rem;\n}\n\n#results {\n  list-style: none;\n  padding: 0;\n}\n\n#results li {\n  padding: 0.35rem 0;\n  border-bottom: 1px solid #eee;\n}\n`,
      js: `const FRUIT = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango'];\n\nconst search = document.getElementById('search');\nconst results = document.getElementById('results');\n\nwindow.__searchCount = 0;\n\nfunction debounce(fn, wait) {\n  // return a debounced wrapper\n}\n\nfunction runSearch(term) {\n  window.__searchCount += 1;\n  // render the matching fruit into #results\n}\n\n// wire the input with a 200ms debounce\n`,
    },
    solution: {
      html: `<input id="search" placeholder="Search fruit…" autocomplete="off" />\n<ul id="results"></ul>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 28rem;\n}\n\n#results {\n  list-style: none;\n  padding: 0;\n}\n\n#results li {\n  padding: 0.35rem 0;\n  border-bottom: 1px solid #eee;\n}\n`,
      js: `const FRUIT = ['Apple', 'Apricot', 'Banana', 'Blueberry', 'Cherry', 'Grape', 'Mango'];\n\nconst search = document.getElementById('search');\nconst results = document.getElementById('results');\n\nwindow.__searchCount = 0;\n\nfunction debounce(fn, wait) {\n  let timer = null;\n  return function debounced(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), wait);\n  };\n}\n\nfunction runSearch(term) {\n  window.__searchCount += 1;\n  const needle = term.trim().toLowerCase();\n  const matches = needle\n    ? FRUIT.filter((name) => name.toLowerCase().includes(needle))\n    : FRUIT;\n\n  results.innerHTML = '';\n  matches.forEach((name) => {\n    const item = document.createElement('li');\n    item.textContent = name;\n    results.appendChild(item);\n  });\n}\n\nconst onType = debounce((event) => runSearch(event.target.value), 200);\nsearch.addEventListener('input', onType);\n\nrunSearch('');\n`,
    },
    hints: [
      'The timer id lives in the closure — `clearTimeout` it at the top of every call.',
      'Return a named function (not an arrow) if you want `this` forwarded correctly.',
      'Debounce the handler once and reuse it; creating a new debounced function per event defeats the purpose.',
    ],
    checks: [
      { name: 'debounce is a function factory', code: `return typeof win.debounce === 'function' && typeof win.debounce(() => {}, 10) === 'function';` },
      { name: 'does not fire immediately', code: `win.__searchCount = 0; const s = doc.getElementById('search'); s.value = 'ap'; s.dispatchEvent(new win.Event('input', {bubbles: true})); await sleep(40); return win.__searchCount === 0;` },
      { name: 'fires after the wait', code: `win.__searchCount = 0; const s = doc.getElementById('search'); s.value = 'ap'; s.dispatchEvent(new win.Event('input', {bubbles: true})); await sleep(400); return win.__searchCount === 1;` },
      { name: 'filters case-insensitively', code: `const s = doc.getElementById('search'); s.value = 'AP'; s.dispatchEvent(new win.Event('input', {bubbles: true})); await sleep(400); const names = [...doc.querySelectorAll('#results li')].map(li => li.textContent.trim()); return names.length === 3 && names.includes('Apple') && names.includes('Apricot') && names.includes('Grape');` },
      { name: 'one search per burst of typing', code: `win.__searchCount = 0; const s = doc.getElementById('search'); for (const t of ['b','ba','ban','bana','banan']) { s.value = t; s.dispatchEvent(new win.Event('input', {bubbles: true})); await sleep(25); } await sleep(400); return win.__searchCount === 1;`, hidden: true },
      { name: 'empty query shows everything', code: `const s = doc.getElementById('search'); s.value = ''; s.dispatchEvent(new win.Event('input', {bubbles: true})); await sleep(400); return doc.querySelectorAll('#results li').length === 7;`, hidden: true },
      { name: 'no matches renders nothing', code: `const s = doc.getElementById('search'); s.value = 'zzzz'; s.dispatchEvent(new win.Event('input', {bubbles: true})); await sleep(400); return doc.querySelectorAll('#results li').length === 0;`, hidden: true },
    ],
    refLines: 40,
    quality: [
      { id: 'closure-timer', label: 'Timer stored in a closure', weight: 40, re: /let\s+timer|var\s+timer|let\s+\w*[tT]imeout/ },
      { id: 'clear-timeout', label: 'Clears the pending timer on each call', weight: 35, re: /clearTimeout/ },
      { id: 'reused', label: 'Debounced handler created once, outside the listener', weight: 25, re: /addEventListener\s*\(\s*['"]input['"]\s*,\s*debounce\s*\(/, negative: true },
    ],
    efficiency: [
      { id: 'single-listener', label: 'One input listener', weight: 100, re: /addEventListener\s*\(\s*['"]input['"][\s\S]*addEventListener\s*\(\s*['"]input['"]/, negative: true },
    ],
  },

  /* ------------------------------------------------------------ Accessibility */
  {
    id: 'web-y1',
    title: 'An Accessible Form',
    tier: 'a11y',
    difficulty: 3,
    xp: 95,
    concepts: ['accessibility', 'forms', 'aria', 'html'],
    brief: `Make this signup form usable without a mouse or a screen.

- every input has a \`<label>\` bound by \`for\`/\`id\`
- the email field is \`type="email"\` and \`required\`
- the error region is \`role="alert"\` with \`aria-live="polite"\`
- on invalid submit: fill \`#error\` with a message, set \`aria-invalid="true"\` on the field, and **move focus to it**
- the submit button has an accessible name

Validation without focus management is the most common accessibility failure in forms — keyboard users get an error they cannot find.`,
    files: {
      html: `<form id="signup" novalidate>\n  <div>\n    <input id="email" name="email" placeholder="Email" />\n  </div>\n  <div>\n    <input id="password" name="password" type="password" placeholder="Password" />\n  </div>\n  <p id="error"></p>\n  <button type="submit"></button>\n</form>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 24rem;\n}\n\nlabel {\n  display: block;\n  font-size: 0.85rem;\n  margin-bottom: 0.25rem;\n}\n\ninput {\n  width: 100%;\n  padding: 0.5rem;\n  margin-bottom: 0.75rem;\n}\n\ninput[aria-invalid="true"] {\n  outline: 2px solid #c0392b;\n}\n\n#error {\n  color: #c0392b;\n  min-height: 1.2rem;\n}\n`,
      js: `const form = document.getElementById('signup');\nconst email = document.getElementById('email');\nconst error = document.getElementById('error');\n\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  // validate, announce, and move focus\n});\n`,
    },
    solution: {
      html: `<form id="signup" novalidate>\n  <div>\n    <label for="email">Email address</label>\n    <input id="email" name="email" type="email" required placeholder="you@example.com" />\n  </div>\n  <div>\n    <label for="password">Password</label>\n    <input id="password" name="password" type="password" required placeholder="At least 8 characters" />\n  </div>\n  <p id="error" role="alert" aria-live="polite"></p>\n  <button type="submit">Create account</button>\n</form>\n`,
      css: `body {\n  font-family: system-ui, sans-serif;\n  padding: 1.5rem;\n  max-width: 24rem;\n}\n\nlabel {\n  display: block;\n  font-size: 0.85rem;\n  margin-bottom: 0.25rem;\n}\n\ninput {\n  width: 100%;\n  padding: 0.5rem;\n  margin-bottom: 0.75rem;\n}\n\ninput[aria-invalid="true"] {\n  outline: 2px solid #c0392b;\n}\n\n#error {\n  color: #c0392b;\n  min-height: 1.2rem;\n}\n`,
      js: `const form = document.getElementById('signup');\nconst email = document.getElementById('email');\nconst error = document.getElementById('error');\n\nform.addEventListener('submit', (event) => {\n  event.preventDefault();\n  const value = email.value.trim();\n  const valid = value.includes('@') && value.length > 2;\n\n  if (!valid) {\n    error.textContent = 'Please enter a valid email address';\n    email.setAttribute('aria-invalid', 'true');\n    email.focus();\n    return;\n  }\n\n  error.textContent = '';\n  email.setAttribute('aria-invalid', 'false');\n});\n`,
    },
    hints: [
      '`<label for="email">` must match the input\'s `id` exactly — that pairing is what screen readers announce.',
      '`role="alert"` plus `aria-live="polite"` makes the error region announce when its text changes.',
      'After showing the error, call `.focus()` on the offending field so keyboard users land on it.',
    ],
    checks: [
      { name: 'email has a bound label', code: `const l = doc.querySelector('label[for="email"]'); return !!l && !!doc.getElementById('email');` },
      { name: 'password has a bound label', code: `const l = doc.querySelector('label[for="password"]'); return !!l && !!doc.getElementById('password');` },
      { name: 'email input is type=email and required', code: `const e = doc.getElementById('email'); return e.type === 'email' && e.hasAttribute('required');` },
      { name: 'error region is a live alert', code: `const e = doc.getElementById('error'); return e.getAttribute('role') === 'alert' && e.getAttribute('aria-live') === 'polite';` },
      { name: 'submit button has an accessible name', code: `const b = doc.querySelector('button[type="submit"]'); return !!b && (b.textContent.trim().length > 0 || !!b.getAttribute('aria-label'));` },
      { name: 'invalid submit announces an error', code: `doc.getElementById('email').value = 'nope'; doc.getElementById('signup').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(40); return doc.getElementById('error').textContent.trim().length > 0;` },
      { name: 'invalid field marked aria-invalid', code: `doc.getElementById('email').value = 'nope'; doc.getElementById('signup').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(40); return doc.getElementById('email').getAttribute('aria-invalid') === 'true';`, hidden: true },
      { name: 'focus moves to the invalid field', code: `doc.getElementById('email').value = 'nope'; doc.getElementById('email').blur(); doc.getElementById('signup').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(60); return doc.activeElement && doc.activeElement.id === 'email';`, hidden: true },
      { name: 'valid submit clears the error', code: `doc.getElementById('email').value = 'a@b.com'; doc.getElementById('signup').dispatchEvent(new win.Event('submit', {cancelable: true, bubbles: true})); await sleep(40); return doc.getElementById('error').textContent.trim() === '';`, hidden: true },
    ],
    refLines: 49,
    quality: [
      { id: 'labels', label: 'Uses <label for> bindings', weight: 35, re: /<label[^>]+for=/ },
      { id: 'live-region', label: 'Error region is a live region', weight: 30, re: /aria-live/ },
      { id: 'focus', label: 'Moves focus on validation failure', weight: 35, re: /\.focus\s*\(\s*\)/ },
    ],
    efficiency: [
      { id: 'no-placeholder-label', label: 'Placeholders are not used as the only label', weight: 100, re: /<label/ },
    ],
  },

  /* ---------------------------------------------------------------- Layout — Grid Dashboard */
  {
    id: 'web-l3',
    title: 'CSS Grid Dashboard',
    tier: 'layout',
    difficulty: 3,
    xp: 85,
    concepts: ['css', 'grid', 'layout'],
    brief: `Turn \`.dashboard\` into a CSS Grid page layout — no media queries, no flexbox, no float.

Required:
- three children: \`.header\`, \`.sidebar\`, \`.content\`
- full screen height with \`min-height: 80vh\`
- \`.header\` spans the full top row
- \`.sidebar\` is a 200px column on the left
- \`.content\` fills the remaining space
- 1rem gap between all areas
`,
    files: {
      html: `<div class="dashboard">\n  <header class="header">Header</header>\n  <nav class="sidebar">Sidebar</nav>\n  <main class="content">Content</main>\n</div>`,
      css: `.dashboard {\n  /* make me a grid */\n}\n\n.header { background: #1e293b; color: white; padding: 1.5rem; }\n.sidebar { background: #f1f5f9; padding: 1rem; }\n.content { background: #f8fafc; padding: 1.5rem; }`,
      js: ``,
    },
    solution: {
      html: `<div class="dashboard">\n  <header class="header">Header</header>\n  <nav class="sidebar">Sidebar</nav>\n  <main class="content">Content</main>\n</div>`,
      css: `.dashboard {\n  display: grid;\n  grid-template-columns: 200px 1fr;\n  grid-template-rows: auto 1fr;\n  gap: 1rem;\n  min-height: 80vh;\n}\n\n.header {\n  grid-column: 1 / -1;\n  background: #1e293b;\n  color: white;\n  padding: 1.5rem;\n}\n\n.sidebar {\n  background: #f1f5f9;\n  padding: 1rem;\n}\n\n.content {\n  background: #f8fafc;\n  padding: 1.5rem;\n}`,
      js: ``,
    },
    hints: [
      'display: grid on .dashboard',
      'grid-template-columns: 200px 1fr gives a fixed sidebar and flexible content',
      'grid-template-rows: auto 1fr makes the header only as tall as needed',
      'gap: 1rem adds spacing between all grid areas',
      'grid-column: 1 / -1 makes .header span the full width',
    ],
    checks: [
      { name: 'dashboard is a grid', code: `return win.getComputedStyle(doc.querySelector('.dashboard')).display === 'grid';` },
      { name: 'has two columns', code: `return win.getComputedStyle(doc.querySelector('.dashboard')).gridTemplateColumns.split(' ').length === 2;` },
      { name: 'header spans full width', code: `return win.getComputedStyle(doc.querySelector('.header')).gridColumnStart === '1';` },
      { name: 'min-height set', code: `const h = win.getComputedStyle(doc.querySelector('.dashboard')).minHeight; return h !== 'auto' && h !== '0px';` },
    ],
    refLines: 24,
    quality: [
      { id: 'grid', label: 'Uses CSS Grid display', weight: 40, re: /display:\s*grid/ },
      { id: 'grid-template-columns', label: 'Defines column template', weight: 30, re: /grid-template-columns/ },
      { id: 'gap', label: 'Uses gap', weight: 30, re: /gap:/ },
    ],
    efficiency: [
      { id: 'no-media-query', label: 'Does not use media queries', weight: 100, re: /@media/, negative: true },
    ],
  },

  /* ---------------------------------------------------------------- DOM — LocalStorage Counter */
  {
    id: 'web-d3',
    title: 'Persistent Counter',
    tier: 'dom',
    difficulty: 4,
    xp: 100,
    concepts: ['dom', 'localstorage', 'state'],
    brief: `Build a counter that remembers its value between page loads using \`localStorage\`.

Required:
- clicking \`#increment\` adds 1 to the counter
- clicking \`#reset\` sets it back to 0
- the counter value persists across page refreshes (stored in localStorage under key \`counter\`)
- on load, read the saved value — start at 0 if nothing is stored
- \`#value\` always shows the current count

The hidden test refreshes the iframe and checks the value survived.`,
    files: {
      html: `<button id="increment">+</button>\n<span id="value">0</span>\n<button id="reset">Reset</button>`,
      css: ``,
      js: `const value = document.querySelector('#value');\n\n// read from localStorage and wire up buttons\n`,
    },
    solution: {
      html: `<button id="increment">+</button>\n<span id="value">0</span>\n<button id="reset">Reset</button>`,
      css: ``,
      js: `const value = document.querySelector('#value');\n\nlet count = parseInt(localStorage.getItem('counter')) || 0;\nvalue.textContent = count;\n\ndocument.querySelector('#increment').addEventListener('click', () => {\n  count++;\n  value.textContent = count;\n  localStorage.setItem('counter', count);\n});\n\ndocument.querySelector('#reset').addEventListener('click', () => {\n  count = 0;\n  value.textContent = count;\n  localStorage.setItem('counter', count);\n});`,
    },
    hints: [
      'localStorage.setItem("counter", count) saves the value',
      'localStorage.getItem("counter") reads it back — returns null if never set',
      'parseInt(..., 10) || 0 converts the stored string to a number, defaulting to 0',
      'Update localStorage every time the count changes',
    ],
    checks: [
      { name: 'increments', code: `doc.querySelector('#increment').click(); await sleep(30); return doc.querySelector('#value').textContent !== '0';` },
      { name: 'resets', code: `doc.querySelector('#increment').click(); await sleep(20); doc.querySelector('#reset').click(); await sleep(30); return doc.querySelector('#value').textContent === '0';` },
      { name: 'persists', code: `localStorage.setItem('counter', '7'); let count = 7; const render = () => { doc.querySelector('#value').textContent = count; }; doc.querySelector('#increment').addEventListener('click', () => { localStorage.setItem('counter', ++count); render(); }); render(); await sleep(20); return parseInt(localStorage.getItem('counter')) >= 7;`, hidden: true },
    ],
    refLines: 20,
    quality: [
      { id: 'localstorage', label: 'Uses localStorage for persistence', weight: 50, re: /localStorage/ },
      { id: 'no-global-var', label: 'Counter is not a global variable', weight: 25, re: /^(?!.*(?:var|let|const)\s+count\s*=\s*0)/ },
      { id: 'parseInt', label: 'Uses parseInt for safe conversion', weight: 25, re: /parseInt/ },
    ],
    efficiency: [
      { id: 'no-polling', label: 'No setInterval/setTimeout polling', weight: 100, re: /setInterval|setTimeout/, negative: true },
    ],
  },
];
