export function clamp(value, min = 0, max = 1) {
  return Math.min(Math.max(value, min), max);
}

export function smoothstep(start, end, value) {
  if (start === end) return value >= end ? 1 : 0;
  const x = clamp((value - start) / (end - start));
  return x * x * (3 - 2 * x);
}

export function segmentProgress(progress, start, end) {
  return clamp((progress - start) / Math.max(end - start, 0.0001));
}

export function phaseOpacity(progress, start, end, fade = 0.05) {
  const enter = smoothstep(start, start + fade, progress);
  const leave = 1 - smoothstep(end - fade, end, progress);
  return clamp(enter * leave);
}

export function lerp(from, to, progress) {
  return from + (to - from) * progress;
}

