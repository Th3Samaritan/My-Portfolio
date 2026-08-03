import { readFileSync, writeFileSync } from 'fs';

function extractChallenges(content) {
  const lines = content.split('\n');
  const challenges = [];
  let i = 0;
  
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === '{' && line.length <= 5) {
      let foundId = false;
      for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
        if (lines[j].trim().startsWith("id:")) { foundId = true; break; }
      }
      if (foundId) {
        let block = '';
        let depth = 0;
        const start = i;
        for (; i < lines.length; i++) {
          block += lines[i] + '\n';
          for (const ch of lines[i]) {
            if (ch === '{') depth++;
            if (ch === '}') depth--;
          }
          if (depth === 0 && lines[i].trim() === '},') break;
        }
        const diffMatch = block.match(/difficulty:\s*(\d+)/);
        challenges.push({
          block: block.trimEnd(),
          start,
          end: i,
          difficulty: diffMatch ? parseInt(diffMatch[1]) : 0,
        });
      }
    }
    i++;
  }
  return challenges;
}

function reorderFile(path) {
  console.log(`Processing ${path}...`);
  const content = readFileSync(path, 'utf-8');
  const challenges = extractChallenges(content);

  if (challenges.length === 0) {
    console.log('  No challenges found.');
    return;
  }

  // Group by tier using start position order
  // We detect tier by scanning backwards from each challenge for section comment
  const tiers = [];
  let currentTier = null;
  
  for (const c of challenges) {
    // Find section comment before this challenge
    const before = content.slice(0, c.start);
    const sections = before.split('\n').filter(l => l.includes('/*') && l.includes('*/'));
    const lastSection = sections[sections.length - 1] || '';
    // Extract tier name from comment like /* --- Foundations */
    const tierName = lastSection.replace(/\/\* -+\s*/,'').replace(/\s*-+ \*\//,'').trim().toLowerCase().replace(/\s+/g, '-');
    
    if (tierName !== currentTier) {
      currentTier = tierName;
      tiers.push({ name: currentTier, challenges: [] });
    }
    tiers[tiers.length - 1].challenges.push(c);
  }

  // Check ordering
  let violations = 0;
  for (const tier of tiers) {
    for (let j = 1; j < tier.challenges.length; j++) {
      if (tier.challenges[j].difficulty < tier.challenges[j-1].difficulty) {
        console.log(`  FIX: "${tier.name}": diff ${tier.challenges[j].difficulty} after diff ${tier.challenges[j-1].difficulty}`);
        violations++;
      }
    }
    // Stable sort by difficulty
    tier.challenges.sort((a, b) => a.difficulty - b.difficulty);
  }

  if (violations === 0) {
    console.log('  Already ordered correctly.');
    return;
  }

  // Flatten ordered challenges
  const ordered = tiers.flatMap(t => t.challenges);

  // Replace the entire middle section: from first challenge to after last challenge
  const firstStart = challenges[0].start;
  const lastEnd = challenges[challenges.length - 1].end;

  // Rebuild: we need the exact original lines from firstStart to lastEnd
  // replaced by the reordered blocks
  const lines = content.split('\n');
  const beforeLines = lines.slice(0, firstStart);
  
  // The reordered blocks, each with blank line after
  const reorderedLines = ordered.map(c => c.block).join('\n\n') + '\n';
  
  // The lines after the last challenge
  const afterLines = lines.slice(lastEnd + 1).join('\n');
  
  const result = beforeLines.join('\n') + '\n' + reorderedLines + afterLines;
  
  writeFileSync(path, result);
  console.log(`  Fixed ${violations} ordering violation(s).`);
}

reorderFile('data/track-python.js');
reorderFile('data/track-java.js');
reorderFile('data/track-rust.js');
console.log('Done.');
