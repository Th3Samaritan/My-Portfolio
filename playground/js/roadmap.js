/* ============================================================
   roadmap.js — subway-map style progress visualisation.

   Renders all 4 language tracks as horizontal metro lines.
   Each topic is a station; each lesson is a stop on the line.
   Completed = filled, in-progress = outline with glow,
   not started = empty outline. The recommended next step
   pulses gently.
   ============================================================ */

import { TRACKS, lessonsByTopic, getLesson } from '../data/curriculum.js';
import * as store from './store.js';
import { escapeHtml, render } from './ui.js';

/* ============================================================= DIMENSIONS == */

const PADDING = 60;
const LINE_SPACING = 100;
const STATION_RADIUS = 6;
const STROKE_WIDTH = 3;
const TOPIC_GAP = 90;

/* ============================================================== RENDERING == */

export function renderRoadmap(host) {
  const tracks = TRACKS.filter((t) => (t.lessons || []).length > 0);
  if (!tracks.length) {
    render(host, '<div class="empty-state"><h3>No courses loaded</h3></div>');
    return;
  }

  // Compute total width: max station count across tracks
  let maxStations = 0;
  for (const track of tracks) {
    const topics = lessonsByTopic(track);
    const count = topics.reduce((n, g) => n + g.lessons.length, 0);
    if (count > maxStations) maxStations = count;
  }
  const width = Math.max(900, PADDING * 2 + maxStations * TOPIC_GAP);
  const height = PADDING * 2 + tracks.length * LINE_SPACING;

  let svgContent = '';

  tracks.forEach((track, trackIndex) => {
    const y = PADDING + trackIndex * LINE_SPACING;
    const accent = track.accent;
    const topics = lessonsByTopic(track);
    let x = PADDING;

    // Track line
    svgContent += `<line x1="${PADDING - 20}" y1="${y}" x2="${width - PADDING + 20}" y2="${y}" stroke="${accent}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" opacity="0.25"/>`;

    // Track label (left)
    svgContent += `<text x="${PADDING - 30}" y="${y - 18}" text-anchor="end" fill="${accent}" font-family="system-ui,sans-serif" font-size="13" font-weight="700">${escapeHtml(track.name)}</text>`;

    let lessonIndex = 0;

    topics.forEach((group, topicIndex) => {
      const topicX = x;

      // Topic divider (subtle vertical line)
      if (topicIndex > 0) {
        svgContent += `<line x1="${topicX}" y1="${y - 18}" x2="${topicX}" y2="${y + 18}" stroke="${accent}" stroke-width="1" opacity="0.15"/>`;
      }

      // Topic label below
      const labelY = y + 28;
      svgContent += `<text x="${topicX}" y="${labelY}" text-anchor="middle" fill="var(--text-dim)" font-family="system-ui,sans-serif" font-size="10" class="station-label">${escapeHtml(group.topic.name)}</text>`;

      // Difficulty sub-labels
      const diffs = { beginner: 0, intermediate: 0, advanced: 0 };
      group.lessons.forEach((l) => { diffs[l.difficulty] = (diffs[l.difficulty] || 0) + 1; });
      const diffText = Object.entries(diffs).filter(([, c]) => c > 0).map(([d]) => d[0].toUpperCase()).join(' ');
      if (diffText) {
        svgContent += `<text x="${topicX}" y="${labelY + 13}" text-anchor="middle" fill="var(--text-faint)" font-family="system-ui,sans-serif" font-size="8" class="station-sublabel">${diffText}</text>`;
      }

      // Station dots for each lesson in this topic
      group.lessons.forEach((lesson, li) => {
        const sx = topicX + li * (TOPIC_GAP / Math.max(1, group.lessons.length));
        const done = store.isLessonDone(lesson.id);
        const progress = store.lessonProgress(lesson.id);
        const hasProgress = Object.keys(progress.exercises).length > 0 || Object.keys(progress.quizzes).length > 0;

        let fill, strokeColor, strokeWidth, radius = STATION_RADIUS;
        if (done) {
          fill = accent;
          strokeColor = accent;
          strokeWidth = STROKE_WIDTH;
        } else if (hasProgress) {
          fill = accent;
          strokeColor = accent;
          strokeWidth = STROKE_WIDTH;
        } else {
          fill = 'var(--bg-panel)';
          strokeColor = accent;
          strokeWidth = 1.5;
        }

        svgContent += `<circle cx="${sx}" cy="${y}" r="${radius}" fill="${fill}" stroke="${strokeColor}" stroke-width="${strokeWidth}" class="station-dot"/>`;

        // Tooltip
        const lessonTitle = escapeHtml(lesson.title).replace(/"/g, '&quot;');
        const diffCap = (lesson.difficulty || 'beginner')[0].toUpperCase() + (lesson.difficulty || 'beginner').slice(1);
        svgContent += `<title>${escapeHtml(track.name)} · ${escapeHtml(group.topic.name)} · ${diffCap}\n${lessonTitle}\n${done ? 'Completed' : hasProgress ? 'In progress' : 'Not started'}</title>`;

        // Recommended next step: first non-done lesson
        if (!done && store.lessonStats(track).done < store.lessonStats(track).total) {
          const allLessons = track.lessons || [];
          const nextUndone = allLessons.find((l) => !store.isLessonDone(l.id));
          if (nextUndone && nextUndone.id === lesson.id) {
            svgContent += `<circle cx="${sx}" cy="${y}" r="${radius + 4}" fill="none" stroke="${accent}" stroke-width="1.5" opacity="0.5">
              <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>`;
          }
        }

        lessonIndex++;
      });

      x = topicX + group.lessons.length * (TOPIC_GAP / Math.max(1, group.lessons.length)) + 30;
    });

    // Track stats on the right
    const stats = store.lessonStats(track);
    svgContent += `<text x="${width - PADDING + 20}" y="${y - 6}" text-anchor="start" fill="${accent}" font-family="system-ui,sans-serif" font-size="10" font-weight="600">${stats.done}/${stats.total}</text>`;
    svgContent += `<text x="${width - PADDING + 20}" y="${y + 8}" text-anchor="start" fill="var(--text-faint)" font-family="system-ui,sans-serif" font-size="9">${Math.round(stats.completion * 100)}%</text>`;
  });

  // Legend
  const legendY = height - 20;
  svgContent += `<circle cx="${PADDING}" cy="${legendY}" r="${STATION_RADIUS}" fill="var(--bg-panel)" stroke="var(--text-dim)" stroke-width="1.5"/><text x="${PADDING + 14}" y="${legendY + 4}" fill="var(--text-faint)" font-family="system-ui,sans-serif" font-size="10">Not started</text>`;
  svgContent += `<circle cx="${PADDING + 120}" cy="${legendY}" r="${STATION_RADIUS}" fill="${TRACKS[0].accent}" stroke="${TRACKS[0].accent}" stroke-width="1.5"/><text x="${PADDING + 134}" y="${legendY + 4}" fill="var(--text-faint)" font-family="system-ui,sans-serif" font-size="10">In progress</text>`;
  svgContent += `<circle cx="${PADDING + 250}" cy="${legendY}" r="${STATION_RADIUS}" fill="${TRACKS[0].accent}" stroke="${TRACKS[0].accent}" stroke-width="${STROKE_WIDTH}"/><text x="${PADDING + 264}" y="${legendY + 4}" fill="var(--text-faint)" font-family="system-ui,sans-serif" font-size="10">Completed</text>`;
  svgContent += `<circle cx="${PADDING + 370}" cy="${legendY}" r="${STATION_RADIUS + 2}" fill="none" stroke="var(--text-dim)" stroke-width="1.5" opacity="0.5"/><text x="${PADDING + 384}" y="${legendY + 4}" fill="var(--text-faint)" font-family="system-ui,sans-serif" font-size="10">Recommended next</text>`;

  const html = `
    <div class="page-head">
      <div class="eyebrow">Your journey</div>
      <h1>Roadmap</h1>
      <p>Every topic, every difficulty level — at a glance. Filled stations are completed. The pulsing one is your recommended next step. <a href="#/learn" style="color:var(--blue-soft)">Browse courses →</a></p>
    </div>
    <div class="roadmap-wrap">
      <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        ${svgContent}
      </svg>
    </div>`;

  render(host, html);
}
