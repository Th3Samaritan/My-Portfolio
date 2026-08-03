import { readFileSync, writeFileSync } from 'fs';

function swapAdjacent(content, idA, idB) {
  // Use a simpler regex that works with CRLF
  const re = new RegExp(
    `(\\r?\\n  \\{[^}]*?id:\\s*'${idA}'[^}]*?(?:\\{[^}]*\\}[^}]*?)*?\\r?\\n  \\},)(\\r?\\n\\r?\\n)(  \\{[^}]*?id:\\s*'${idB}'[^}]*?(?:\\{[^}]*\\}[^}]*?)*?\\r?\\n  \\},)`,
    's'
  );
  
  const match = content.match(re);
  if (!match) {
    console.log(`  No adjacent match for ${idA} -> ${idB} (trying looser pattern)`);
    // Try finding blocks by just scanning for their id
    return content;
  }
  
  console.log(`  Swapping ${idA} with ${idB}`);
  const [fullMatch, block1, separator, block2] = match;
  return content.replace(fullMatch, block2 + separator + block1);
}

// Since regex is failing, let me try a different approach:
// Read the blob, manually extract block ranges

function findBlock(content, id) {
  const idx = content.indexOf(`'${id}'`);
  if (idx === -1) return null;
  
  // Find the opening brace of the challenge block
  let start = content.lastIndexOf('{', idx);
  // Walk backwards to find the start of the challenge definition
  while (start > 0 && content[start - 1] !== '\n') start--;
  
  // Find closing: walk forward counting braces
  let depth = 0;
  let end = start;
  for (let i = start; i < content.length; i++) {
    if (content[i] === '{') depth++;
    if (content[i] === '}') depth--;
    if (depth === 0) {
      end = i;
      break;
    }
  }
  
  return { start, end: end + 1, text: content.slice(start, end + 1) };
}

function swapBlocks(content, idA, idB) {
  const blockA = findBlock(content, idA);
  const blockB = findBlock(content, idB);
  
  if (!blockA || !blockB) {
    console.log(`  Could not find ${idA} or ${idB}`);
    return content;
  }
  
  console.log(`  Swapping ${idA} (${blockA.start}-${blockA.end}) with ${idB} (${blockB.start}-${blockB.end})`);
  
  // Extract parts
  const beforeA = content.slice(0, blockA.start);
  const between = content.slice(blockA.end, blockB.start);
  const afterB = content.slice(blockB.end);
  
  return beforeA + blockB.text + between + blockA.text + afterB;
}

// Python mastery: py-m2 (diff 4) should be before py-m1 (diff 5)
let content = readFileSync('data/track-python.js', 'utf-8');
content = swapBlocks(content, 'py-m1', 'py-m2');
writeFileSync('data/track-python.js', content);

// Java oop: jv-o2 (diff 2) should be before jv-o1 (diff 3)
content = readFileSync('data/track-java.js', 'utf-8');
content = swapBlocks(content, 'jv-o1', 'jv-o2');
writeFileSync('data/track-java.js', content);

// Rust errors: rs-e2 (diff 2) should be before rs-e1 (diff 4)
content = readFileSync('data/track-rust.js', 'utf-8');
content = swapBlocks(content, 'rs-e1', 'rs-e2');
writeFileSync('data/track-rust.js', content);

// Python algorithms: py-a4 (diff 3) should be before py-a2 (diff 4) but after py-a1
// This is a non-adjacent move
content = readFileSync('data/track-python.js', 'utf-8');
// Extract py-a4, delete it, insert before py-a2
const blockA4 = findBlock(content, 'py-a4');
const blockA2 = findBlock(content, 'py-a2');
if (blockA4 && blockA2) {
  console.log(`  Moving py-a4 to before py-a2`);
  // Remove py-a4
  content = content.slice(0, blockA4.start) + content.slice(blockA4.end);
  // Recompute py-a2 position after removal
  // a2 is now at an earlier position since a4 was removed before it
  const newA2 = findBlock(content, 'py-a2');
  if (newA2) {
    content = content.slice(0, newA2.start) + blockA4.text + '\n' + content.slice(newA2.start);
  }
}
writeFileSync('data/track-python.js', content);

console.log('Done.');
