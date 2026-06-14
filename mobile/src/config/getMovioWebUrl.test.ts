import { describe, expect, it } from 'vitest';
import { getMovioWebUrl, normalizeMovioWebUrl } from './getMovioWebUrl';

describe('normalizeMovioWebUrl', () => {
  it('returns null for empty values', () => {
    expect(normalizeMovioWebUrl(undefined)).toBeNull();
    expect(normalizeMovioWebUrl('')).toBeNull();
    expect(normalizeMovioWebUrl('   ')).toBeNull();
  });

  it('accepts valid http and https URLs', () => {
    expect(normalizeMovioWebUrl('http://192.168.1.20:5173')).toBe(
      'http://192.168.1.20:5173',
    );
    expect(normalizeMovioWebUrl('https://example.com')).toBe('https://example.com');
  });

  it('trims whitespace and removes trailing slash', () => {
    expect(normalizeMovioWebUrl('  http://192.168.1.20:5173/  ')).toBe(
      'http://192.168.1.20:5173',
    );
  });

  it('rejects unsupported protocols and invalid URLs', () => {
    expect(normalizeMovioWebUrl('ftp://example.com')).toBeNull();
    expect(normalizeMovioWebUrl('mailto:hello@example.com')).toBeNull();
    expect(normalizeMovioWebUrl('javascript:alert(1)')).toBeNull();
    expect(normalizeMovioWebUrl('not-a-url')).toBeNull();
    expect(normalizeMovioWebUrl('http://')).toBeNull();
  });

  it('preserves valid URL paths, query strings, and hash fragments', () => {
    expect(normalizeMovioWebUrl('https://example.com/app?mode=mobile#home')).toBe(
      'https://example.com/app?mode=mobile#home',
    );
  });

  it('removes only a single final slash from normalized URLs', () => {
    expect(normalizeMovioWebUrl('https://example.com/app//')).toBe(
      'https://example.com/app/',
    );
  });
});

describe('getMovioWebUrl', () => {
  it('returns null when EXPO_PUBLIC_MOVIO_WEB_URL is not configured', () => {
    const originalUrl = process.env.EXPO_PUBLIC_MOVIO_WEB_URL;

    delete process.env.EXPO_PUBLIC_MOVIO_WEB_URL;

    expect(getMovioWebUrl()).toBeNull();

    process.env.EXPO_PUBLIC_MOVIO_WEB_URL = originalUrl;
  });

  it('reads and normalizes EXPO_PUBLIC_MOVIO_WEB_URL', () => {
    const originalUrl = process.env.EXPO_PUBLIC_MOVIO_WEB_URL;

    process.env.EXPO_PUBLIC_MOVIO_WEB_URL = '  http://192.168.1.20:5173/  ';

    expect(getMovioWebUrl()).toBe('http://192.168.1.20:5173');

    process.env.EXPO_PUBLIC_MOVIO_WEB_URL = originalUrl;
  });
});
