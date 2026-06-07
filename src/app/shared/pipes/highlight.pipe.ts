import { Pipe, PipeTransform } from '@angular/core';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wraps occurrences of `term` in `<mark>` tags so they can be highlighted via
 * `[innerHTML]`. Returns plain text when no term is given; Angular's built-in
 * sanitizer keeps `<mark>` and strips anything unsafe on binding.
 */
@Pipe({ name: 'highlight', standalone: true })
export class HighlightPipe implements PipeTransform {
  transform(value: string, term: string | null | undefined): string {
    const search = term?.trim();
    if (!search) {
      return value;
    }
    const pattern = new RegExp(`(${escapeRegExp(search)})`, 'gi');
    return value.replace(pattern, '<mark>$1</mark>');
  }
}
