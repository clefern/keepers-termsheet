import { HighlightPipe } from './highlight.pipe';

describe('HighlightPipe', () => {
  const pipe = new HighlightPipe();

  it('wraps the matched term in a mark tag (case-insensitive)', () => {
    expect(pipe.transform('Sunset Apartments', 'sun')).toBe('<mark>Sun</mark>set Apartments');
  });

  it('returns the original text when there is no term', () => {
    expect(pipe.transform('Sunset Apartments', '')).toBe('Sunset Apartments');
    expect(pipe.transform('Sunset Apartments', null)).toBe('Sunset Apartments');
  });

  it('escapes regex special characters in the term', () => {
    expect(pipe.transform('a.b', '.')).toBe('a<mark>.</mark>b');
  });
});
