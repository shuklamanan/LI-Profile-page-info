export interface RawDate {
  year?: number;
  month?: number;
  day?: number;
}

export function normalizeDate(dateObj?: RawDate | null): string | undefined {
  if (!dateObj) {
    return undefined;
  }
  const year = dateObj.year;
  const month = dateObj.month;

  if (year && month) {
    const paddedMonth = String(month).padStart(2, '0');
    return `${year}-${paddedMonth}`;
  }
  if (year) {
    return String(year);
  }
  return undefined;
}

export function deduplicateSkills(skills: string[]): string[] {
  const seen = new Set<string>();
  const deduped: string[] = [];

  for (const skill of skills) {
    if (!skill) continue;
    const trimmed = skill.trim();
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower) && lower) {
      seen.add(lower);
      deduped.push(trimmed);
    }
  }
  return deduped;
}
